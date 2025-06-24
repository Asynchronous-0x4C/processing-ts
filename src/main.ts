import { SketchManager } from "./lib/index";

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
const windowTitleBar = canvasWindow.querySelector('.window-title-bar')!;
const windowResizeHandle = canvasWindow.querySelector('.window-resize-handle')!;

// --- State Management ---
let tabs: { id: number, name: string, code: string }[] = [];
let currentTabId: Number | null = null;
let nextTabId = 0;
let isRunning = false;
let uploadedFiles: { name: string, content: string | ArrayBuffer }[] = [];
let isWindowMode = false;
let windowPos = { x: 100, y: 100 }, windowSize = { w: 500, h: 500 };

// --- Sample Codes ---
const samples = {
  'circle': { name: '円の描画', code: `void setup() {\n  size(400, 400);\n  background(220);\n}\n\nvoid draw() {\n  ellipse(200, 200, 100, 100);\n}` },
  'interactive-lines': { name: 'インタラクティブな線', code: `void setup() {\n  size(400, 400);\n  background(0);\n  stroke(255, 100);\n}\n\nvoid draw() {\n  line(mouseX, mouseY, 200, 200);\n}` },
  'bouncing-ball': { name: '跳ねるボール', code: `float x = 200;\nfloat y = 200;\nfloat xspeed = 3;\nfloat yspeed = 4;\n\nvoid setup() {\n  size(400, 400);\n  background(50);\n}\n\nvoid draw() {\n  background(50, 50);\n  \n  noStroke();\n  fill(255, 100, 100);\n  ellipse(x, y, 30, 30);\n\n  x += xspeed;\n  y += yspeed;\n\n  if (x > width - 15 || x < 15) {\n    xspeed *= -1;\n  }\n  if (y > height - 15 || y < 15) {\n    yspeed *= -1;\n  }\n}` }
};

// --- Syntax Highlighting ---
function applySyntaxHighlighting(code: string) {
  const keywords = `\\b(function|let|const|var|if|else|for|while|return|new|true|false)\\b`;
  const p5functions = `\\b(setup|draw|size|background|fill|noFill|stroke|noStroke|ellipse|rect|line|point|text|mouseX|mouseY|width|height)\\b`;
  const numbers = `\\b-?\\d+(\\.\\d+)?\\b`;
  const strings = `("|').*?("|')`;
  const comments = `\\/\\/.*`;

  let highlightedCode = escapeHtml(code);

  highlightedCode = highlightedCode.replace(new RegExp(comments, 'g'), match => `<span class="token-comment">${match}</span>`);
  highlightedCode = highlightedCode.replace(new RegExp(keywords, 'g'), match => `<span class="token-keyword">${match}</span>`);
  highlightedCode = highlightedCode.replace(new RegExp(p5functions, 'g'), match => `<span class="token-function">${match}</span>`);
  highlightedCode = highlightedCode.replace(new RegExp(strings, 'g'), match => `<span class="token-string">${match}</span>`);
  highlightedCode = highlightedCode.replace(new RegExp(numbers, 'g'), match => `<span class="token-number">${match}</span>`);

  highlightingCode.innerHTML = highlightedCode;
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function updateEditorContent(content: string) {
  codeEditor.value = content;
  applySyntaxHighlighting(content);
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
    nameEl.setAttribute('contenteditable', 'false');

    nameEl.addEventListener('dblclick', () => {
      nameEl.setAttribute('contenteditable', 'true');
      nameEl.focus();
    });
    nameEl.addEventListener('blur', () => {
      nameEl.setAttribute('contenteditable', 'false');
      tab.name = nameEl.textContent!;
    });
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

function addTab(name = `Untitled-${tabs.length + 1}`, code: string = `// New sketch\n\nvoid setup() {\n  size(400, 400);\n}\n\nvoid draw() {\n  background(220);\n}`) {
  const newTab = { id: nextTabId++, name, code };
  tabs.push(newTab);
  switchTab(newTab.id);
}

function closeTab(id: number) {
  const tabIndex = tabs.findIndex(t => t.id === id);
  if (tabIndex > -1) {
    tabs.splice(tabIndex, 1);

    if (tabs.length === 0) {
      addTab();
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
  Object.keys(samples).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = samples[key as keyof typeof samples].name;
    sampleSelect.appendChild(option);
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

function setWindowMode(enabled) {
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
  if(isWindowMode){
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

function makeDraggable(windowEl, titleBar) {
  let offsetX, offsetY;
  const move = (e) => {
    e.preventDefault();
    windowPos.x = e.clientX - offsetX;
    windowPos.y = e.clientY - offsetY;
    windowEl.style.left = `${windowPos.x}px`;
    windowEl.style.top = `${windowPos.y}px`;
  };
  const stopMove = () => {
    document.body.classList.remove('dragging');
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', stopMove);
  };
  titleBar.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    offsetX = e.clientX - windowEl.offsetLeft;
    offsetY = e.clientY - windowEl.offsetTop;
    document.body.classList.add('dragging');
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', stopMove);
  });
}

function makeResizable(windowEl, resizeHandle) {
  let startX, startY, startWidth, startHeight;
  const resize = (e) => {
    e.preventDefault();
    windowSize.w = startWidth + e.clientX - startX;
    windowSize.h = startHeight + e.clientY - startY;
    windowEl.style.width = `${windowSize.w}px`;
    windowEl.style.height = `${windowSize.h}px`;
  };
  const stopResize = () => {
    document.body.classList.remove('dragging');
    document.removeEventListener('pointermove', resize);
    document.removeEventListener('pointerup', stopResize);
    dispatchCanvasResize(windowEl.querySelector('canvas'));
  };
  resizeHandle.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView!.getComputedStyle(windowEl).width, 10);
    startHeight = parseInt(document.defaultView!.getComputedStyle(windowEl).height, 10);
    document.body.classList.add('dragging');
    document.addEventListener('pointermove', resize);
    document.addEventListener('pointerup', stopResize);
  });
}

// --- Event Listeners ---
codeEditor.addEventListener('input', () => {
  const activeTab = getActiveTab();
  if (activeTab) {
    activeTab.code = codeEditor.value;
    applySyntaxHighlighting(activeTab.code);
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

addTabButton.addEventListener('pointerdown', () => addTab());

sampleSelect.addEventListener('change', () => {
  const selectedKey = sampleSelect.value;
  const sample = samples[selectedKey as keyof typeof samples];
  clearTab();
  const activeTab = getActiveTab();
  if (sample && activeTab) {
    activeTab.code = sample.code;
    activeTab.name = sample.name;
    updateEditorContent(activeTab.code);
    renderTabs();
  }
});

runButton.addEventListener('pointerdown', () => {
  if (isRunning) return;
  const activeTab = getActiveTab();
  if (!activeTab) return;
  console.log("実行ボタンが押されました。");
  isRunning = true;
  updateControlState();
  manager.runSketch(manager.loadSketchString(tabs.map(t => t.code).join("\n"), tabs[0].name));
});

stopButton.addEventListener('pointerdown', () => {
  if (!isRunning) return;
  console.log("停止ボタンが押されました。");
  isRunning = false;
  updateControlState();
  manager.stopSketch();
  const ctx = sketchCanvas.getContext('2d');
  ctx?.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
});

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
    let main_file;
    uploadedFiles = uploadedFiles.filter(f => { if (f.name === mainSketchSelect.value) { main_file = f; return false; } return true; });
    uploadedFiles.unshift(main_file);
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

makeDraggable(canvasWindow, windowTitleBar);
makeResizable(canvasWindow, windowResizeHandle);

initializeSampleSelector();
addTab('円の描画', samples['circle'].code);
updateControlState();
setWindowMode(false);