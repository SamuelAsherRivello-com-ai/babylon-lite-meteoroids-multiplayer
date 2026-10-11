async(page)=>{
 await page.goto('http://127.0.0.1:5400/babylon-lite-asteroids-multiplayer-clone/?mute=true');await page.getByRole('button',{name:'Host a flight'}).click();await page.waitForFunction(()=>window.__asteroids?.frame);
 const code=await page.evaluate(()=>window.__asteroids.state.code),ctx=await page.context().browser().newContext(),g=await ctx.newPage();
 await g.goto('http://127.0.0.1:5400/babylon-lite-asteroids-multiplayer-clone/?mute=true&room='+code);await g.getByRole('button',{name:'Join →'}).click();await g.waitForFunction(()=>window.__asteroids?.frame?.players.length===2);
 await page.evaluate(()=>{window.__asteroids.world.players[0].score=100;window.__asteroids.world.players[1].score=50;});
 await g.getByText(/150 team pts/).waitFor();
 const rejection=await g.evaluate(()=>{const s=window.__asteroids,f=s.frame;s.receive({...f,runId:0,tick:f.tick+999,players:[],asteroids:[],bullets:[]});return {run:s.frame.runId,players:s.frame.players.length};});if(rejection.run<1||rejection.players!==2)throw Error('Stale run restored');
 await page.getByRole('button',{name:'End flight'}).click();await g.getByText('The host left. Create a new room.').waitFor();await ctx.close();return {teamTotal:150,staleFrameRejected:rejection,hostLossTerminal:true};
}
