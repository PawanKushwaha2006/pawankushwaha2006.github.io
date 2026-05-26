let pyodide;
let pyodideReady = false;

// Pyodide load karo - Python browser me chalane ke liye
async function loadPyodideAndPackages() {
  document.getElementById('output').textContent = 'Loading Python...';
  pyodide = await loadPyodide();
  pyodideReady = true;
  document.getElementById('output').textContent = 'Python Ready! Click Run Code...';
}
loadPyodideAndPackages();

let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeUI();

function toggleDropdown() {
  document.getElementById('dropdown').classList.toggle('active');
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-btn') && !e.target.closest('.dropdown')) {
    document.getElementById('dropdown').classList.remove('active');
  }
});

// 8 Menu Functions
function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', currentTheme);
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeUI();
  toggleDropdown();
}

function updateThemeUI() {
  const icon = document.getElementById('themeIcon');
  const text = document.getElementById('themeText');
  if (currentTheme === 'dark') {
    icon.className = 'fas fa-sun';
    text.textContent = 'Light Mode';
  } else {
    icon.className = 'fas fa-moon';
    text.textContent = 'Dark Mode';
  }
}

function showAbout() {
  alert('CodeNix Python Tutorial v1.0\n\nFree Online Python Editor\nLearn Python with VS Code style compiler!\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 Python Project Ideas:\n\n1. Calculator\n2. Number Guessing Game\n3. To-Do List\n4. Password Generator\n5. Weather App\n6. Quiz Game\n\nClick Try It Yourself to start!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Edit code\n4. Click Run Code\n5. Click Close to return\n\nPress ESC to close compiler');
  toggleDropdown();
}

// Compiler Open/Close with Animation
function openCompiler() {
  const overlay = document.getElementById('compilerOverlay');
  const toggle = document.getElementById('compilerToggle');
  overlay.classList.add('active');
  toggle.classList.add('hide');
  document.body.style.overflow = 'hidden';
}

function closeCompiler() {
  const overlay = document.getElementById('compilerOverlay');
  const toggle = document.getElementById('compilerToggle');
  overlay.classList.remove('active');
  toggle.classList.remove('hide');
  document.body.style.overflow = 'auto';
}

// ⭐ Try It Yourself ka main function
function loadCode(codeId) {
  const codeElement = document.getElementById(codeId);
  const code = codeElement.innerText;
  document.getElementById('codeEditor').value = code;
  runPython();
  openCompiler();
}

// Python code run karo
async function runPython() {
  if (!pyodideReady) {
    document.getElementById('output').textContent = 'Python is still loading...';
    return;
  }
  
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  output.textContent = '';
  
  try {
    pyodide.runPython(`
      import sys
      import io
      sys.stdout = io.StringIO()
    `);
    
    await pyodide.runPythonAsync(code);
    const result = pyodide.runPython("sys.stdout.getvalue()");
    output.textContent = result || 'Code executed successfully!';
  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
});
