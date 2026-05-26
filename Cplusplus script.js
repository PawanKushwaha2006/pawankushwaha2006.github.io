let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeUI();
updatePrismTheme();

function toggleDropdown() {
  document.getElementById('dropdown').classList.toggle('active');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-btn') && !e.target.closest('.dropdown')) {
    document.getElementById('dropdown').classList.remove('active');
  }
});

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeUI();
  updatePrismTheme();
}

function updateThemeUI() {
  const icon = document.getElementById('themeIcon');
  const text = document.getElementById('themeText');
  if (currentTheme === 'dark') {
    icon.className = 'fas fa-sun';
    text.textContent = 'Light';
  } else {
    icon.className = 'fas fa-moon';
    text.textContent = 'Dark';
  }
}

function updatePrismTheme() {
  const link = document.getElementById('prismTheme');
  if (currentTheme === 'dark') {
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css';
  } else {
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
  }
  updateHighlighting();
}

function showAbout() {
  alert('CodeNix C++ Tutorial v1.0\n\nFree Online C++ Editor\nLearn C++ with VS Code style compiler!\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 C++ Project Ideas:\n\n1. Calculator\n2. Bank Management System\n3. Student Record System\n4. Tic Tac Toe Game\n5. File Encryption\n6. Library Management\n\nClick Try It Yourself to start!');
  toggleDropdown();
}

function downloadPage() {
  alert('Download feature coming soon! Use browser save option.');
  toggleDropdown();
}

function sharePage() {
  navigator.clipboard.writeText(window.location.href);
  alert('Page URL copied to clipboard!');
  toggleDropdown();
}

function showHelp() {
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Code auto loads with colors\n4. Brackets auto-close: {} () [] ""\n5. Click Save to download.cpp file\n6. Run on your PC: g++ main.cpp -o main &&./main\n7. Click Close to return\n\nPress ESC to close compiler');
  toggleDropdown();
}

function openCompiler() {
  const overlay = document.getElementById('compilerOverlay');
  const toggle = document.getElementById('compilerToggle');
  overlay.classList.add('active');
  toggle.classList.add('hide');
  document.body.style.overflow = 'hidden';
  updateHighlighting();
}

function closeCompiler() {
  const overlay = document.getElementById('compilerOverlay');
  const toggle = document.getElementById('compilerToggle');
  overlay.classList.remove('active');
  toggle.classList.remove('hide');
  document.body.style.overflow = 'auto';
}

function loadCode(codeId) {
  const codeElement = document.getElementById(codeId);
  const code = codeElement.innerText;
  document.getElementById('codeEditor').value = code;
  document.getElementById('output').textContent = 'Code loaded! Click Save to download or Run for instructions.';
  openCompiler();
  updateHighlighting();
}

// ⭐ SYNTAX HIGHLIGHTING
function updateHighlighting() {
  const editor = document.getElementById('codeEditor');
  const highlighting = document.querySelector('#highlighting code');
  highlighting.textContent = editor.value;
  Prism.highlightElement(highlighting);
}

function syncScroll() {
  const editor = document.getElementById('codeEditor');
  const highlighting = document.getElementById('highlighting');
  highlighting.scrollTop = editor.scrollTop;
  highlighting.scrollLeft = editor.scrollLeft;
}

// ⭐ AUTO-CLOSE BRACKETS + AUTO-INDENT
function handleKeyDown(e) {
  const editor = document.getElementById('codeEditor');
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const value = editor.value;
  
  // Auto-close brackets
  const pairs = {
    '{': '}',
    '(': ')',
    '[': ']',
    '"': '"',
    "'": "'"
  };
  
  if (pairs[e.key]) {
    e.preventDefault();
    editor.value = value.substring(0, start) + e.key + pairs[e.key] + value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 1;
    updateHighlighting();
    return;
  }
  
  // Auto-indent on Enter
  if (e.key === 'Enter') {
    e.preventDefault();
    const lines = value.substring(0, start).split('\n');
    const currentLine = lines[lines.length - 1];
    const indent = currentLine.match(/^\s*/)[0];
    const extraIndent = currentLine.trim().endsWith('{') ? ' ' : '';
    editor.value = value.substring(0, start) + '\n' + indent + extraIndent + value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 1 + indent.length + extraIndent.length;
    updateHighlighting();
    return;
  }
  
  // Tab = 4 spaces
  if (e.key === 'Tab') {
    e.preventDefault();
    editor.value = value.substring(0, start) + ' ' + value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 4;
    updateHighlighting();
    return;
  }
}

function runCpp() {
  const output = document.getElementById('output');
  output.textContent = `⚠️ C++ cannot run directly in browser!

📥 Steps to run this code:

1. Click "Save" button to download main.cpp
2. Open terminal/command prompt
3. Run: g++ main.cpp -o main
4. Run:./main (Linux/Mac) or main.exe (Windows)

💡 Install g++ first:
- Windows: Install MinGW or CodeBlocks
- Linux: sudo apt install g++
- Mac: xcode-select --install

Or use online compilers:
- replit.com
- onlinegdb.com
- programiz.com/cpp-programming/online-compiler/`;
}

function downloadCode() {
  const code = document.getElementById('codeEditor').value;
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'main.cpp';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
});

// Initial highlighting
updateHighlighting();
