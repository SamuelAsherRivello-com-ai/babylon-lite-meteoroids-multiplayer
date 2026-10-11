async(page)=>{
 const browser=page.context().browser();for(const c of browser.contexts())if(c!==page.context())await c.close();
 const contexts=[];const errors=[];
 const instrument=()=>{
   const Native=window.WebSocket;
   window.__publicProbe={opens:0,frames:0,latest:null,runs:new Set(),waves:new Set(),eliminations:0,resets:0,lastLives:new Map(),started:Date.now()};
   function capture(f){const s=window.__publicProbe;if(!f?.players)return;s.frames++;s.latest=f;s.runs.add(f.runId);s.waves.add(f.wave);for(const p of f.players){const before=s.lastLives.get(p[0]);if(before>0&&p[2]===0)s.eliminations++;if(before===0&&p[2]===3)s.resets++;s.lastLives.set(p[0],p[2]);}}
   window.WebSocket=class extends Native{
     constructor(...args){super(...args);this.addEventListener('open',()=>window.__publicProbe.opens++);}
     send(data){try{const m=JSON.parse(data);if(m.type==='hostSnapshot')capture(m.value);}catch{}return super.send(data);}
     set onmessage(fn){super.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.type==='gameState')capture(m.value);}catch{}fn(e);};}
   };
 };
 const hostCtx=await browser.newContext({viewport:{width:1280,height:720}});contexts.push(hostCtx);await hostCtx.addInitScript(instrument);
 const host=await hostCtx.newPage();host.on('pageerror',e=>errors.push(e.message));
 const url='https://samuelasherrivello.github.io/babylon-lite-asteroids-multiplayer-clone/?mute=true';
 await host.goto(url);await host.getByRole('button',{name:'Host a flight'}).click();await host.waitForFunction(()=>window.__publicProbe.latest);
 const code=await host.locator('.room b').textContent();
 const guestCtx=await browser.newContext({viewport:{width:844,height:390},hasTouch:true});contexts.push(guestCtx);await guestCtx.addInitScript(instrument);
 const guest=await guestCtx.newPage();guest.on('pageerror',e=>errors.push(e.message));await guest.goto(url+'&room='+code);await guest.getByRole('button',{name:'Join →'}).click();await guest.waitForFunction(()=>window.__publicProbe.latest?.players.length===2);
 const version=await host.locator('.corner_bottom_right').textContent();if(version!=='v0.1.2')throw Error('Wrong released version: '+version);
 const hook=await host.evaluate(()=>typeof window.__asteroids);if(hook!=='undefined')throw Error('Development hook exposed in production');
 await host.locator('canvas').click();const original=await host.evaluate(()=>window.__publicProbe.latest.players[0][8]);await host.keyboard.down('ArrowRight');await host.keyboard.down('Space');await host.waitForTimeout(400);await host.keyboard.up('ArrowRight');await host.keyboard.up('Space');
 const moved=await host.evaluate(a=>Math.abs(window.__publicProbe.latest.players[0][8]-a)>.3,original);if(!moved)throw Error('Public keyboard failed');
 await host.getByRole('button',{name:'Settings',exact:true}).click();const tick=await guest.evaluate(()=>window.__publicProbe.latest.tick);await guest.waitForTimeout(400);if(!(await guest.evaluate(t=>window.__publicProbe.latest.tick>t+10,tick)))throw Error('Public host settings paused');await host.getByRole('button',{name:'Close dialog'}).click();
 await host.evaluate(()=>{
   const pressed=new Set(),canvas=document.querySelector('canvas');
   window.__publicBot=setInterval(()=>{
     const f=window.__publicProbe.latest;if(!f)return;const p=f.players.find(p=>p[1]===1);let turn=0,fire=false,thrust=false;
     if(p&&p[2]>0&&!p[9]&&f.phase==='playing'){
       let best,dist=Infinity;for(const a of f.asteroids){const dx=((a[1]-p[4]+960)%640)-320,dy=((a[2]-p[5]+540)%360)-180,d=Math.hypot(dx,dy);if(d<dist){dist=d;best={a,dx,dy};}}
       if(best){const {a,dx,dy}=best,lead=dist/310,aim=Math.atan2(dy+a[4]*lead,dx+a[3]*lead),d=((aim-p[8]+Math.PI*3)%(Math.PI*2))-Math.PI;turn=d<-.06?-1:d>.06?1:0;fire=Math.abs(d)<.15;thrust=dist<60;}
     }
     for(const [code,active] of [['ArrowLeft',turn<0],['ArrowRight',turn>0],['ArrowUp',thrust],['Space',fire]]){
       if(active&&!pressed.has(code)){canvas.dispatchEvent(new KeyboardEvent('keydown',{code,key:code,bubbles:true}));pressed.add(code);}
       if(!active&&pressed.has(code)){canvas.dispatchEvent(new KeyboardEvent('keyup',{code,key:code,bubbles:true}));pressed.delete(code);}
     }
   },16);
 });
 await host.screenshot({path:'docs/screenshots/public-desktop.png'});
 await guest.getByRole('button',{name:'Settings',exact:true}).click();await guest.getByLabel('Show touch controls').check();await guest.getByRole('button',{name:'Close dialog'}).click();await guest.screenshot({path:'docs/screenshots/public-touch.png'});
 const start=Date.now();
 while(Date.now()-start<600000){await host.waitForTimeout(Math.min(30000,600000-(Date.now()-start)));if(await host.locator('.entry').count())throw Error('Host disconnected during continuity');if(await guest.locator('.entry').count())throw Error('Guest disconnected during continuity');}
 const stats=p=>p.evaluate(()=>{const s=window.__publicProbe;return {opens:s.opens,frames:s.frames,runs:[...s.runs],waves:[...s.waves],eliminations:s.eliminations,resets:s.resets,tick:s.latest.tick,run:s.latest.runId,lives:s.latest.players.map(p=>p[2])};});
 const hostStats=await stats(host),guestStats=await stats(guest);
 if(hostStats.opens<3||guestStats.opens<3)throw Error('Two planned renewals per participant not observed');
 if(hostStats.run!==guestStats.run||Math.abs(hostStats.tick-guestStats.tick)>30)throw Error('Final public clients diverged');
 await host.screenshot({path:'docs/screenshots/public-continuity.png'});
 await host.getByRole('button',{name:'End flight'}).click();await guest.getByText('The host left. Create a new room.').waitFor();
 for(const c of contexts)await c.close();
 return {version,seconds:600,keyboard:moved,productionHookAbsent:true,hostSettingsContinue:true,host:hostStats,guest:guestStats,hostLossTerminal:true,pageErrors:errors};
}

