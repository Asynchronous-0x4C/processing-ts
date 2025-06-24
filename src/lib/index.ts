export * from "./SketchManager"

// export let target_element:HTMLDivElement|null=null;

// let worker:Worker|null=null;

// export type SketchOptions={canvas_width:number,canvas_height:number,use_scaling:boolean,use_fetch:boolean};

// let sketch_options:SketchOptions={
//   canvas_width:0,
//   canvas_height:0,
//   use_scaling:false,
//   use_fetch:false
// };

// export function mountPApplet(target:HTMLDivElement,options?:SketchOptions){
//   target_element=target;
//   if (options) {
//     sketch_options = options;
//   }
//   window.addEventListener('focus',()=>{
//     if(worker==null)return;
//     worker.postMessage({type:"event",data:{type:"focus"}});
//   });
//   window.addEventListener('blur',()=>{
//     if(worker==null)return;
//     worker.postMessage({type:"event",data:{type:"blur"}});
//   });
// }

// let sketch_resources_promise:Promise<{path:string, content:ArrayBuffer}[]> | null = null;
// let base_uri:string="";

// export async function loadSketch(sketch_path:string):Promise<SketchData> {
//   base_uri=new URL(sketch_path,document.baseURI).href;
//   const sketch_property=await (await fetch(new URL(sketch_path+"sketch.properties",document.baseURI))).text();
//   const main_sketch=sketch_property.match(/\n*(?<!#\s*)main\s*=\s*(.+\.pde)/)![1];
//   const sketch_names=sketch_property.match(/\n*(?<!#\s*)sketches\s*=\s*((?:[^\s]+\.pde[\s,]+)+)/)![1].split(/[\s,]+/).slice(0,-1);
//   const sketch_resources=sketch_property.match(/\n*(?<!#\s*)resources\s*=\s*([^\s]+(?:[\s,]+[^\s]+)+)/)![1].split(/[\s,]+/).slice(0,-1);
  
//   sketch_resources_promise = Promise.all(sketch_resources.map(async(resource) => {
//     return {path:resource,content:await fetch(new URL(sketch_path + resource, document.baseURI)).then(res => res.arrayBuffer())};
//   }));

//   const sketch_content=await Promise.all(sketch_names.map(async(name)=>{
//       return {name:name,content:await fetch(new URL(sketch_path + name, document.baseURI)).then(res=>res.text())};
//   }));
//   return {main:main_sketch,content:sketch_content};
// }

// export function initEvent(target_element:HTMLCanvasElement){
//   target_element.addEventListener("pointermove", (event) => {
//     if(worker==null)return;
//     worker.postMessage({type:"event",data:{type:"mouse",name:"_mouseMoved",x:event.offsetX,y:event.offsetY,button:convert_button(event.button),delta:0}});
//   });
//   target_element.addEventListener("pointerdown", (event) => {
//     if(worker==null)return;
//     worker.postMessage({type:"event",data:{type:"mouse",name:"_mousePressed",x:event.offsetX,y:event.offsetY,button:convert_button(event.button),delta:0}});
//   });
//   target_element.addEventListener("pointerup", (event) => {
//     if(worker==null)return;
//     worker.postMessage({type:"event",data:{type:"mouse",name:"_mouseReleased",x:event.offsetX,y:event.offsetY,button:convert_button(event.button),delta:0}});
//   });
//   window.addEventListener("keydown", (event) => {
//     if(worker==null)return;
//     //TODO: keyCode to getCode(code) mapping
//     const modifiers = event.getModifierState("Shift") ? 1 : 0;
//     worker.postMessage({type:"event",data:{type:"key",name:"_keyPressed",key:event.key,keyCode:event.keyCode,modifiers}});
//   });
//   window.addEventListener("keyup", (event) => {
//     if(worker==null)return;
//     const modifiers = event.getModifierState("Shift") ? 1 : 0;
//     worker.postMessage({type:"event",data:{type:"key",name:"_keyReleased",key:event.key,keyCode:event.keyCode,modifiers}});
//   });
//   target_element.addEventListener("wheel", (event) => {
//     if(worker==null)return;
//     worker.postMessage({type:"event",data:{type:"mouse",name:"_mouseWheel",x:event.offsetX,y:event.offsetY,button:convert_button(event.button),delta:event.deltaY}});
//   },{passive:true});
//   target_element.addEventListener("contextmenu", (event) => {
//     event.preventDefault();
//     if(worker==null)return;
//     // worker.postMessage({type:"event",data:{type:"mouse",name:"_mousePressed",x:event.offsetX,y:event.offsetY,button:convert_button(2),delta:0}});
//   });
// }

// function convert_button(button:number){
//   switch(button){
//     case 0:button=37;break;
//     case 1:button=3;break;
//     case 2:button=39;break;
//   }
//   return button
// }

// const drawer=new Drawer();

// export async function runSketch(sketch_data:SketchData) {
//   if(target_element==null){
//     console.error("target_element is not set. Please call mountPApplet() before runSketch()");
//     return;
//   }
//   const sketch=transpile(sketch_data.content.map(s=>s.content).join("\n"),sketch_data.main.replace(".pde",""));
//   console.log(sketch);console.log(crossOriginIsolated)
//   //Atomics.wait(new Int32Array(new SharedArrayBuffer(1)), 0, 0,100);
//   await init_worker(sketch);
// }

// let pre_count=-1;
// let initiated=false;

// async function init_worker(sketch: string) {
//   if (worker) {
//     console.warn("Worker already initialized");
//     return;
//   }

//   worker = new Worker(new URL("./worker/worker.ts", import.meta.url), { type: "module" });
//   console.log("Worker initialized", worker);

//   // Ensure onmessage is only registered once
//   worker.onmessage = async (event) => {
//     if (event.data.type === "error") {
//       console.error(event.data.message);
//     } else if (event.data.type === "result") {
//       console.log(event.data.result);
//     } else if (event.data.type === "info") {
//       console.log(event.data.data);
//     } else if (event.data.type === "draw") {
//       if(!initiated){
//         if(event.data.loop_count==0){
//           pre_count=event.data.loop_count;
//           initiated=true;
//         }else{
//           return;
//         }
//       }else{
//         if(event.data.loop_count>pre_count){
//           pre_count=event.data.loop_count;
//         }else{
//           return;
//         }
//       }
//       requestAnimationFrame(() => draw(event.data.data));
//     }else if(event.data.type==="fetch"){

//     }
//   };

//   const sketch_resources=await sketch_resources_promise;

//   worker.postMessage({
//     type: "init",
//     data: {
//       sketch: sketch,
//       resources: sketch_resources,
//       base: base_uri,
//       width: target_element!.clientWidth,
//       height: target_element!.clientHeight
//     },
//   },
//   [...sketch_resources!.map(r=>r.content)]);
// }

// async function draw(draw_queue:Array<{code:number,args:any[]}>) {
//   drawer.__begin__();
//   while(draw_queue.length > 0){
//     const item=draw_queue.shift()!;
//     const {code, args} = item;
//     await drawer.invoke(function_mapping_reverse[code],...args);
//   }
//   drawer.__end__();
// }