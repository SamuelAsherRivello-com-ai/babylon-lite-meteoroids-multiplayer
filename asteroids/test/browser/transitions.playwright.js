async (page)=>{
 const url='http://127.0.0.1:5400/babylon-lite-asteroids-multiplayer-clone/?mute=true';
 await page.goto(url);await page.getByRole('button',{name:'Host a flight'}).click();await page.waitForFunction(()=>window.__asteroids?.frame);
 const code=await page.evaluate(()=>window.__asteroids.state.code);
 const ctx=await page.context().browser().newContext({viewport:{width:844,height:390},hasTouch:true});
 await ctx.addInitScript(()=>{
   const Native=window.WebSocket;window.WebSocket=class extends Native{
     send(value){setTimeout(()=>{if(this.readyState===1)super.send(value);},50+Math.random()*50);}
     set onmessage(fn){super.onmessage=event=>setTimeout(()=>fn(event),50+Math.random()*50);}
   };
 });
 const guest=await ctx.newPage();await guest.goto(url+'&room='+code);await guest.getByRole('button',{name:'Join →'}).click();await guest.waitForFunction(()=>window.__asteroids?.frame?.players.length===2);
 await guest.getByRole('button',{name:'Settings',exact:true}).click();await guest.getByLabel('Show touch controls').check();await guest.getByRole('button',{name:'Close dialog'}).click();
 const cdp=await ctx.newCDPSession(guest);
 const points=[];for(const action of ['right','thrust','fire']){const b=await guest.locator(`[data-action=${action}]`).boundingBox();points.push({id:points.length+1,x:b.x+b.width/2,y:b.y+b.height/2});}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points});await guest.waitForTimeout(650);
 const held=await guest.evaluate(()=>({input:window.__asteroids.controls.read(),history:window.__asteroids.history.length}));
 if(held.input.turn!==1||!held.input.thrust||!held.input.fire)throw Error('Concurrent touch failed');
 await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});
 const released=await guest.evaluate(()=>window.__asteroids.controls.read());if(released.turn||released.thrust||released.fire)throw Error('Touch cancel failed');
 await guest.screenshot({path:'staging/touch-game.png'});
 // Natural gameplay: pilot steers and shoots through normal controls, without altering world state.
 await page.evaluate(()=>{
   const s=window.__asteroids;window.__bot=setInterval(()=>{
     const w=s.world,p=w.players.find(p=>p.id===s.state.id);if(!p||p.lives===0)return;
     let best=null,dist=Infinity;for(const a of w.asteroids){const dx=((a.x-p.x+960)%640)-320,dy=((a.y-p.y+540)%360)-180,d=Math.hypot(dx,dy);if(d<dist){dist=d;best={a,dx,dy};}}
     if(!best)return;
     const {a,dx,dy}=best,lead=dist/310,desired=Math.atan2(dy+a.vy*lead,dx+a.vx*lead),angle=((desired-p.angle+Math.PI*3)%(Math.PI*2))-Math.PI;
     s.controls.set('bot-left','left',angle<-.06);s.controls.set('bot-right','right',angle>.06);s.controls.set('bot-fire','fire',Math.abs(angle)<.15);s.controls.set('bot-thrust','thrust',dist<60);
   },16);
 });
 await page.waitForFunction(()=>window.__asteroids.world.wave>=2,{timeout:45000});
 const wave=await page.evaluate(()=>{clearInterval(window.__bot);window.__asteroids.controls.clear();return {wave:window.__asteroids.world.wave,score:window.__asteroids.world.players[0].score,lives:window.__asteroids.world.players[0].lives};});
 await guest.waitForFunction(()=>window.__asteroids.frame.wave>=2);
 // Transition fixture: three collisions use real loss/respawn rules; state setup is explicit.
 for(let death=1;death<=3;death++){
   await page.evaluate(()=>{const w=window.__asteroids.world,p=w.players.find(p=>p.id===window.__asteroids.state.id);p.protectedUntil=0;p.respawn=0;const a=w.asteroids[0];p.x=a.x;p.y=a.y;p.vx=p.vy=0;});
   await page.waitForFunction(n=>window.__asteroids.world.players.find(p=>p.id===window.__asteroids.state.id).lives===3-n,death);
 }
 await guest.waitForFunction(()=>window.__asteroids.frame.players.some(p=>p.lives===0));
 const hostTick=await page.evaluate(()=>window.__asteroids.world.tick);await page.waitForTimeout(350);
 if(!(await page.evaluate(n=>window.__asteroids.world.tick>n+10,hostTick)))throw Error('Eliminated host stopped simulating');
 await page.screenshot({path:'staging/spectator-game.png'});
 await page.evaluate(()=>{const w=window.__asteroids.world;for(const p of w.players){p.lives=0;p.respawn=0;}});
 await page.waitForFunction(()=>window.__asteroids.world.phase==='defeat');const run=await page.evaluate(()=>window.__asteroids.world.runId);
 await guest.waitForFunction(()=>window.__asteroids.frame.phase==='defeat');
 await page.waitForFunction(n=>window.__asteroids.world.runId===n+1,run,{timeout:10000});
 await guest.waitForFunction(n=>window.__asteroids.frame.runId===n+1,run);
 const reset=await guest.evaluate(()=>({wave:window.__asteroids.frame.wave,lives:window.__asteroids.frame.players.map(p=>p.lives),score:window.__asteroids.frame.players.map(p=>p.score)}));
 if(reset.wave!==1||reset.lives.some(n=>n!==3)||reset.score.some(n=>n!==0))throw Error('Collective restart failed');
 await page.getByRole('button',{name:'End flight'}).click();await guest.waitForFunction(()=>!window.__asteroids.state.connected);
 const ended=await guest.locator('.status').textContent();
 await ctx.close();
 return {latency:'150ms RTT ±50ms jitter, application WebSocket delay',touchHeld:held,touchCancel:released,naturalWaveProgression:wave,hostSpectatorSimulates:true,fixtureReset:reset,hostLoss:ended};
}
