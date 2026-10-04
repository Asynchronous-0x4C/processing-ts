import { SketchManager } from "./export";
import { applySyntaxHighlighting } from "./highlight";
import sample_data from "./scripts/samples.json";

const manager: SketchManager = new SketchManager({
  keep_aspect_ratio: true
});
manager.mountPApplet(document.getElementById("sketch-canvas")! as HTMLCanvasElement);
// await manager.runSketch(await manager.loadSketch("./sketch/"));

// --- DOM Elements ---
const sampleSelect = document.getElementById('sample-select')! as HTMLSelectElement;
const codeEditor = document.getElementById('code-editor')! as HTMLTextAreaElement;
const highlighting = document.getElementById('highlighting')!;
const highlightingCode = highlighting.querySelector('code')!;
const runButton = document.getElementById('run-button')! as HTMLButtonElement;
const stopButton = document.getElementById('stop-button')! as HTMLButtonElement;
const sketchCanvas = document.getElementById('sketch-canvas')! as HTMLCanvasElement;
const tabsContainer = document.getElementById('tabs-container')!;
const uploadBox = document.getElementById('upload-box')!;
const addTabButton = document.getElementById('add-tab-button')! as HTMLButtonElement;
const showUploadUiButton = document.getElementById('show-upload-ui-button')! as HTMLButtonElement;
const uploadUi = document.getElementById('upload-ui')!;
const fileInput = document.getElementById('file-input')! as HTMLInputElement;
const fileList = document.getElementById('file-list')!;
const mainSketchSelect = document.getElementById('main-sketch-select')! as HTMLSelectElement;
const uploadButton = document.getElementById('upload-button')! as HTMLButtonElement;
const windowModeButton = document.getElementById('window-mode-button')!;
const boxModeButton = document.getElementById('box-mode-button')!;
const canvasWindow = document.getElementById('canvas-window')!;
const windowTitleBar = canvasWindow.querySelector('.window-title-bar')!as HTMLElement;
const windowResizeHandle = canvasWindow.querySelector('.window-resize-handle')!as HTMLElement;
const clearConsoleButton = document.getElementById('clear-console-button')!;

// --- State Management ---
let tabs: { id: number, name: string, code: string }[] = [];
let currentTabId: Number | null = null;
let nextTabId = 0;
let isRunning = false;
let uploadedFiles: { name: string, content: string | ArrayBuffer }[] = [];
let isWindowMode = false;
let windowPos = { x: 100, y: 100 }, windowSize = { w: 500, h: 500 };

function getLast<T>(array:ArrayLike<T>):T{
  return array[array.length-1];
}

function updateEditorContent(content: string) {
  codeEditor.value = content;
  applySyntaxHighlighting(content,highlightingCode);
}

// --- Tab Management ---
function renderTabs() {
  // Clear existing tabs
  while (tabsContainer.firstChild && tabsContainer.firstChild !== addTabButton) {
    tabsContainer.removeChild(tabsContainer.firstChild);
  }

  // Render new tabs
  tabs.forEach(tab => {
    const tabEl = document.createElement('div');
    tabEl.className = `tab ${tab.id === currentTabId ? 'active' : ''}`;
    tabEl.dataset.tabId = String(tab.id);

    const nameEl = document.createElement('span');
    nameEl.className = 'tab-name';
    nameEl.textContent = tab.name;
    nameEl.setAttribute('contenteditable', 'true');
    nameEl.setAttribute('spellcheck', 'false');

    // nameEl.addEventListener('dblclick', () => {
    //   nameEl.setAttribute('contenteditable', 'true');
    //   nameEl.focus();
    // });
    // nameEl.addEventListener('blur', () => {
    //   nameEl.setAttribute('contenteditable', 'false');
    //   tab.name = nameEl.textContent!;
    // });
    nameEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        nameEl.blur();
      }
    });


    const closeEl = document.createElement('button');
    closeEl.className = 'close-tab';
    closeEl.innerHTML = '&times;';
    closeEl.title = "タブを閉じる";

    tabEl.appendChild(nameEl);
    tabEl.appendChild(closeEl);
    tabsContainer.insertBefore(tabEl, addTabButton);
  });
}

function switchTab(id: number) {
  if (id === currentTabId) return;
  const tabToActivate = tabs.find(t => t.id === id);
  if (tabToActivate) {
    currentTabId = id;
    updateEditorContent(tabToActivate.code);
    renderTabs();
  }
}

function addTab(name = `Untitled_${tabs.length + 1}`, code: string="") {
  const newTab = { id: nextTabId++, name, code };
  tabs.push(newTab);
  switchTab(newTab.id);
}

async function loadTabs(path:string){
  const props=await fetch(new URL(path+"sketch.properties",document.baseURI)).then(r=>r.text());
  const main_file=props.match(/\n*(?<!#\s*)main\s*=\s*(.+\.pde)/)![1].replace(".pde","").trim();
  let m;
  const files=(m=props.match(/\n*(?<!#\s*)sketches\s*=((\s*\w+.pde)+)/))!=null?m[1].split(/[\s,]+/).map(s=>s.trim()).filter(s=>s!==""):[main_file+".pde"];

  const contents=await Promise.all(files.map(async(name)=>{
    return {name:name.replace(".pde","").trim(),content:await fetch(new URL(path+name,document.baseURI)).then(r=>r.text())}
  }));

  tabs=[{id:nextTabId++,name:main_file,code:contents.filter(c=>c.name==main_file)[0].content}];
  const sub=contents.filter(c=>c.name!==main_file);
  sub.forEach(c=>{
    tabs.push({id:nextTabId++,name:c.name,code:c.content});
  });
  switchTab(tabs[0].id);
}

function closeTab(id: number) {
  const tabIndex = tabs.findIndex(t => t.id === id);
  if (tabIndex > -1) {
    tabs.splice(tabIndex, 1);

    if (tabs.length === 0) {
      addTab("sketch",`// New sketch\n\nvoid setup() {\n  size(400, 400);\n}\n\nvoid draw() {\n  background(220);\n}`);
    } else if (currentTabId === id) {
      const newActiveIndex = Math.max(0, tabIndex - 1);
      switchTab(tabs[newActiveIndex].id);
    }
    renderTabs();
  }
}

function clearTab() {
  tabs.forEach(t => {
    closeTab(t.id);
  });
}

function getActiveTab() {
  return tabs.find(t => t.id === currentTabId);
}

function updateControlState() {
  runButton.disabled = isRunning;
  stopButton.disabled = !isRunning;
  sketchCanvas.classList.toggle('running', isRunning);
}

function initializeSampleSelector() {
  Object.entries(sample_data).forEach((entry) => {
    const group = document.createElement('optgroup');
    group.label = entry[0];
    entry[1].forEach(e=>{
      const option = document.createElement('option');
      option.value = `./samples/${entry[0]}/${e}/`;
      option.textContent = e.replace(/_(\w)/g,(match,p1)=>p1.toUpperCase());
      option.textContent = option.textContent.charAt(0).toUpperCase() + option.textContent.slice(1);
      if(e==="sketch")option.selected=true;
      group.appendChild(option);
    });
    sampleSelect.appendChild(group);
  });
}

function handleFileSelect(event: Event) {
  const files = (event.target! as HTMLInputElement).files as FileList;
  if (files.length === 0) return;
  uploadedFiles = [];
  mainSketchSelect.innerHTML = '<option>メインのスケッチを選択...</option>';

  const filePromises = Array.from(files).map(file => {
    return new Promise<{ name: string, content: string | ArrayBuffer }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve({ name: file.name, content: e.target!.result! });
      reader.onerror = e => reject(e);
      reader.readAsText(file);
    });
  });

  Promise.all(filePromises).then(results => {
    uploadedFiles = results;
    fileList.textContent = `${results.length}個のファイルを選択中: ${results.map(f => f.name).join(', ')}`;
    results.forEach(file => {
      const option = document.createElement('option');
      option.value = file.name;
      option.textContent = file.name;
      mainSketchSelect.appendChild(option);
    });
    mainSketchSelect.disabled = false;
  }).catch(error => {
    console.error("Error reading files:", error);
    fileList.textContent = "ファイルの読み込みに失敗しました。";
  });
}

function resetUploadUI() {
  uploadUi.classList.add('hidden');
  showUploadUiButton.classList.remove('hidden');
  fileInput.value = '';
  fileList.textContent = '';
  mainSketchSelect.innerHTML = '<option>メインのスケッチを選択...</option>';
  mainSketchSelect.disabled = true;
  uploadButton.disabled = true;
  uploadedFiles = [];
}

function setWindowMode(enabled:boolean) {
  isWindowMode = enabled;
  const canvasBox = document.getElementById('canvas-box')!;
  const canvasWindow = document.getElementById('canvas-window')!;
  const sketchCanvas = document.getElementById('sketch-canvas')! as HTMLCanvasElement;
  const windowContent = canvasWindow.querySelector('.window-content')!;
  const boxContent = canvasBox.querySelector('.canvas-container')!;

  if (enabled) {
    canvasBox.classList.add('hidden');
    canvasWindow.classList.remove('hidden');
    windowContent.appendChild(sketchCanvas);
    canvasWindow.style.left = `${windowPos.x}px`;
    canvasWindow.style.top = `${windowPos.y}px`;
    canvasWindow.style.width = `${windowSize.w}px`;
    canvasWindow.style.height = `${windowSize.h}px`;
  } else {
    canvasBox.classList.remove('hidden');
    canvasWindow.classList.add('hidden');
    boxContent.appendChild(sketchCanvas);
    sketchCanvas.style.width = '100%';
    sketchCanvas.style.height = '100%';
  }
  // Notify the sketch that it needs to resize
  setTimeout(() => dispatchCanvasResize(sketchCanvas), 0);
}

function dispatchCanvasResize(canvas: HTMLCanvasElement) {
  // This properly resizes the canvas drawing buffer and lets the library know.
  if (isWindowMode) {
    const rect = canvas.parentElement!.getBoundingClientRect();
    const style = window.getComputedStyle(canvas.parentElement!);
    const paddingTop = parseInt(style.getPropertyValue('padding-top'));
    const paddingRight = parseInt(style.getPropertyValue('padding-right'));
    const paddingBottom = parseInt(style.getPropertyValue('padding-bottom'));
    const paddingLeft = parseInt(style.getPropertyValue('padding-left'));
    canvas.style.width = `${rect.width - paddingLeft - paddingRight}px`;
    canvas.style.height = `${rect.height - paddingTop - paddingBottom}px`;
  }
  canvas.dispatchEvent(new Event('resize'));
  console.log(`Canvas resized to ${canvas.width}x${canvas.height}`);
  manager.resize();
}

function makeDraggable(windowEl:HTMLElement, titleBar:HTMLElement) {
  let offsetX:number, offsetY:number;
  const move = (e:PointerEvent) => {
    if(!e.buttons)return;
    titleBar.setPointerCapture(e.pointerId);
    titleBar.draggable=false;
    windowPos.x = e.clientX - offsetX;
    windowPos.y = e.clientY - offsetY;
    windowEl.style.left = `${windowPos.x}px`;
    windowEl.style.top = `${windowPos.y}px`;
    e.preventDefault();
  };
  titleBar.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    offsetX = e.clientX - windowEl.offsetLeft;
    offsetY = e.clientY - windowEl.offsetTop;
  });
  titleBar.addEventListener('pointermove', move);
}

function makeResizable(windowEl:HTMLElement, resizeHandle:HTMLElement) {
  let startX:number, startY:number, startWidth:number, startHeight:number;
  const resize = (e:PointerEvent) => {
    if(!e.buttons)return;
    resizeHandle.setPointerCapture(e.pointerId);
    resizeHandle.draggable=false;
    const aspect = manager.getAspectRatio();
    windowSize.w = startWidth + e.clientX - startX;
    windowSize.h = aspect!==0?windowSize.w/aspect+windowTitleBar.getBoundingClientRect().height:startHeight + e.clientY - startY;
    windowEl.style.width = `${windowSize.w}px`;
    windowEl.style.height = `${windowSize.h}px`;
    e.preventDefault();
  };
  const stopResize = () => {
    dispatchCanvasResize(windowEl.querySelector('canvas')!);
  };
  resizeHandle.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView!.getComputedStyle(windowEl).width, 10);
    startHeight = parseInt(document.defaultView!.getComputedStyle(windowEl).height, 10);
  });
  resizeHandle.addEventListener('pointermove', resize);
  resizeHandle.addEventListener('pointerup', stopResize);
}

function clearConsole() {
  const consoleOutput = document.getElementById('console-output');
  if (consoleOutput) consoleOutput.innerHTML = '';
}

function logToConsole(type:"info"|"log"|"error",...args:any[]) {
  const consoleOutput = document.getElementById('console-output');
  if (!consoleOutput) return;
  const last_output=getLast(consoleOutput.childNodes)as HTMLElement;
  const message = args.map(arg => {
    if (typeof arg === 'object' && arg !== null) {
      try { return JSON.stringify(arg, null, 0); } catch (e) { return '[Unserializable Object]'; }
    }
    return String(arg);
  }).join(' ');
  if(last_output&&last_output.classList.item(0)==type&&getLast(last_output.getElementsByClassName("message")).textContent==message){
    const counter=getLast(last_output.querySelectorAll("span"));
    if(counter.innerText==""){
      counter.style.display="inline";
      counter.innerText="2";
    }else{
      counter.innerText=`${Number(counter.innerText)+1}`;
    }
  }else{
    const container=document.createElement('div');
    container.classList.add(type);
    const counter=document.createElement('span');
    counter.style.display="none";
    const entry = document.createElement('div');
    entry.classList.add("message");
    entry.textContent = message;
    container.appendChild(counter);
    container.appendChild(entry);
    consoleOutput.appendChild(container);
  }
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// --- Event Listeners ---
codeEditor.addEventListener('input', () => {
  const activeTab = getActiveTab();
  if (activeTab) {
    activeTab.code = codeEditor.value;
    applySyntaxHighlighting(activeTab.code,highlightingCode);
  }
});

// Sync scrolling
codeEditor.addEventListener('scroll', () => {
  highlighting.scrollTop = codeEditor.scrollTop;
  highlighting.scrollLeft = codeEditor.scrollLeft;
});

tabsContainer.addEventListener('pointerdown', (e) => {
  const tabEl = (e.target! as Element).closest('.tab');
  if (tabEl) {
    switchTab(Number((tabEl as HTMLElement).dataset.tabId));
  }
  if ((e.target! as Element).closest('.close-tab')) {
    const tabToClose = (e.target! as Element).closest('.tab');
    closeTab(Number((tabToClose as HTMLElement).dataset.tabId));
  }
});

tabsContainer.addEventListener('wheel',e=>{
  if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
  const maxScrollLeft = tabsContainer.scrollWidth - tabsContainer.clientWidth;
  if (maxScrollLeft<=0)return;
  e.preventDefault();
  tabsContainer.scrollLeft += e.deltaY;
});

addTabButton.addEventListener('pointerdown', () => addTab());

sampleSelect.addEventListener('change',async () => {
  loadTabs(sampleSelect.value);
});

runButton.addEventListener('pointerdown', () => {
  if (isRunning) return;
  const activeTab = getActiveTab();
  if (!activeTab) return;
  console.log("実行ボタンが押されました。");
  isRunning = true;
  updateControlState();
  // One entry per tab, so that compile errors point at the right tab and line.
  const sketch = manager.loadSketchString(tabs[0].code, `${tabs[0].name}.pde`, undefined);
  sketch.content = tabs.map(t => ({ name: `${t.name}.pde`, content: t.code }));
  manager.runSketch(sketch);
});

stopButton.addEventListener('pointerdown', () => {
  if (!isRunning) return;
  console.log("停止ボタンが押されました。");
  isRunning = false;
  updateControlState();
  manager.stopSketch();
});

clearConsoleButton.addEventListener('pointerdown', clearConsole);

showUploadUiButton.addEventListener('pointerdown', () => {
  showUploadUiButton.classList.add('hidden');
  uploadUi.classList.remove('hidden');
});

fileInput.addEventListener('change', handleFileSelect);

mainSketchSelect.addEventListener('change', () => {
  if (mainSketchSelect.selectedIndex > 0) {
    uploadButton.disabled = false;
  } else {
    uploadButton.disabled = true;
  }
});

uploadButton.addEventListener('pointerdown', () => {
  if (uploadedFiles.length > 0) {
    clearTab();
    let main_file:{name:string;content:string|ArrayBuffer;};
    uploadedFiles = uploadedFiles.filter(f => { if (f.name === mainSketchSelect.value) { main_file = f; return false; } return true; });
    uploadedFiles.unshift(main_file!);
    uploadedFiles.forEach(file => {
      addTab(file.name.replace(".pde", ""), file.content as string);
    });
    closeTab(tabs[0].id);
    resetUploadUI();
  }
});
windowModeButton.addEventListener('click', () => setWindowMode(true));
boxModeButton.addEventListener('click', () => setWindowMode(false));

document.addEventListener('pointerdown', (event) => {
  if (!uploadUi.classList.contains('hidden') && !uploadBox.contains((event.target! as HTMLElement))) {
    resetUploadUI();
  }
});

manager.addEventListener("log",(args:any[])=>{logToConsole("log",args)});
manager.addEventListener("error",(args:any[])=>{logToConsole("error",args)});

makeDraggable(canvasWindow, windowTitleBar);
makeResizable(canvasWindow, windowResizeHandle);

initializeSampleSelector();
addTab("sketch",`// New sketch\n\nvoid setup() {\n  size(400, 400);\n}\n\nvoid draw() {\n  background(220);\n}`);
updateControlState();
setWindowMode(false);