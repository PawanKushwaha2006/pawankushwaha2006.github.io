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
  alert('CodeNix C Tutorial v1.0\n\nLearn C Programming\nC compiler browser me nahi chalta, ye demo hai!\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 C Project Ideas:\n\n1. Calculator\n2. Number Guessing Game\n3. Student Management\n4. Bank System\n5. Tic Tac Toe\n6. File Handler\n\nClick Try It Yourself to start!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Edit code\n4. Click Run to execute\n5. Click Save to download\n6. Click Close to return\n\nNote: C code browser me compile nahi hota. Real compiler ke liye GCC use karo.\n\nPress ESC to close compiler');
  toggleDropdown();
}

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

function loadCode(codeId) {
  const codeElement = document.getElementById(codeId);
  const code = codeElement.innerText;
  document.getElementById('codeEditor').value = code;
  runC();
  openCompiler();
}

// C code simulate karna - browser me real C compile nahi hota
function runC() {
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  
  // Simple simulation - printf statements extract karo
  let simulatedOutput = "⚠️ Note: C code browser me directly compile nahi hota.\n";
  simulatedOutput += "Ye simulated output hai. Real compiler ke liye GCC use karo.\n\n";
  simulatedOutput += "=== Simulated Output ===\n";
  
  // printf wale lines dhundo
  const printfRegex = /printf\s*\(\s*"([^"]*)"[^)]*\)/g;
  let match;
  let found = false;
  while ((match = printfRegex.exec(code)) !== null) {
    found = true;
    let text = match[1].replace(/\\n/g, '\n');
    simulatedOutput += text;
  }
  
  if (!found) {
    simulatedOutput += "No printf statements found.\nCode compiled successfully!";
  }
  
  output.textContent = simulatedOutput;
}

function downloadCode() {
  const code = document.getElementById('codeEditor').value;
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'main.c';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
});
