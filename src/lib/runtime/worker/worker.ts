// import { Cursor } from "../awt/Cursor";
// import { ArrayList } from "../util/ArrayList";
// import { PVector } from "../util/PVector";
// import { KeyEvent } from "../event/KeyEvent";
// import { MouseEvent } from "../event/MouseEvent";
// import { Event } from "../event/Event";
// import { PApplet } from "../PApplet";
// import { set_base_uri, draw_queue } from "./worker_data";
// import { Runnable, Consumer, Supplier, Function, FunctionalInterface } from "../util/function";

// let event_queue:Array<{name:string, event:Event}> = [];//queue events to be processed in the next frame

// let content_display=true;

// let applet: PApplet | null = null;

// self.addEventListener('message',async (e)=>{
//   const type=e.data.type;
//   const data=e.data.data;
//   if(type==='init'){
//     const arg_classes=[PApplet,PVector,ArrayList,Cursor,Runnable,Consumer,Supplier,Function,FunctionalInterface];
//     applet=new globalThis.Function(...arg_classes.map(c=>c.name),data.sketch)(...arg_classes) as PApplet;
//     applet.width=data.width;
//     applet.height=data.height;
//     applet.__preload_buffer__=data.resources.map((r:{path:string,content:ArrayBuffer})=>({path:r.path,content:new Uint8Array(r.content)}));
//     set_base_uri(data.base);
//     await applet.settings();
//     await applet.setup();
//     loop();
//     postMessage({type:'info',data:"Init worker success"});
//   }else if(type==='update'){
//   }else if(type==='event'){
//     if(data.type==='mouse'){
//       event_queue.push({name:data.name,event:new MouseEvent(data.x,data.y,data.button,data.delta)});
//     }else if(data.type==='key'){
//       event_queue.push({name:data.name,event:new KeyEvent(data.key,data.keyCode,data.modifiers)});
//     }else if(data.type==="focus"){
//       content_display=true;
//     }else if(data.type==="blur"){
//       content_display=false;
//     }
//   }
// });

// let last_time=0;
// let loop_count=0;

// function loop() {
//   const ID=setInterval(async function() {
//     const now = performance.now();
//     const deltaTime = now - last_time;
//     last_time = now;
//     applet!.frameRate=1000/deltaTime;
//     applet?.__begin__();
//     await applet!.draw();
//     const code=applet?.__end__();
//     if(code!=0){
//       clearInterval(ID);
//       postMessage({type:'error',message:"Sketch finished with exit code "+code});
//       console.log(`Sketch finished with exit code ${code}.`);
//     }
//     applet!.frameCount++;
//     postMessage({type:'draw',data:draw_queue,loop_count:loop_count});
//     draw_queue.splice(0);
//     loop_count++;
//     while(event_queue.length>0){
//       const event=event_queue.shift()!;
//       switch(event.name){
//         case "_mousePressed":
//           applet!.mousePressed=true;
//           applet!.mouseX=(event.event as MouseEvent).x;
//           applet!.mouseY=(event.event as MouseEvent).y;
//           applet!.mouseButton=(event.event as MouseEvent).button;
//           applet!._mousePressed(event.event as MouseEvent);
//           break;
//         case "_mouseReleased":
//           applet!.mousePressed=false;
//           applet!.mouseX=(event.event as MouseEvent).x;
//           applet!.mouseY=(event.event as MouseEvent).y;
//           applet!.mouseButton=(event.event as MouseEvent).button;
//           applet!._mouseReleased(event.event as MouseEvent);
//           break;
//         case "_mouseMoved":
//           applet!.mouseX=(event.event as MouseEvent).x;
//           applet!.mouseY=(event.event as MouseEvent).y;
//           applet!._mouseMoved(event.event as MouseEvent);
//           break;
//         case "_keyPressed":
//           applet!.keyPressed=true;
//           applet!.key=(event.event as KeyEvent).key;
//           applet!.keyCode=(event.event as KeyEvent).keyCode;
//           applet!._keyPressed(event.event as KeyEvent);
//           break;
//         case "_keyReleased":
//           applet!.keyPressed=false;
//           applet!._keyReleased(event.event as KeyEvent);
//           break;
//         case "_mouseWheel":
//           applet!._mouseWheel(event.event as MouseEvent);
//           break;
//         default:
//           console.error("Unknown event name: "+event.name);
//       }
//     }
//   },content_display?1000/applet!.__frameRate__:1000);
// }