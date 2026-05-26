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
  alert('CodeNix Java Tutorial v1.0\n\nLearn Java Programming\nJava compiler browser me nahi chalta, ye demo hai!\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 Java Project Ideas:\n\n1. Calculator\n2. Student Management\n3. Bank System\n4. Library System\n5. Tic Tac Toe\n6. ATM Machine\n\nClick Try It Yourself to start!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Edit code\n4. Click Run to execute\n5. Click Save to download\n6. Click Close to return\n\nNote: Java code browser me compile nahi hota. Real compiler ke liye JDK use karo.\n\nPress ESC to close compiler');
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
  runJava();
  openCompiler();
}

// Java code simulate karna - browser me real Java compile nahi hota
function runJava() {
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  
  // Simple simulation - System.out.println statements extract karo
  let simulatedOutput = "⚠️ Note: Java code browser me directly compile nahi hota.\n";
  simulatedOutput += "Ye simulated output hai. Real compiler ke liye JDK use karo.\n\n";
  simulatedOutput += "=== Simulated Output ===\n";
  
  // System.out.println wale lines dhundo
  const printRegex = /System\.out\.println\s*\(\s*"([^"]*)"[^)]*\)/g;
  let match;
  let found = false;
  while ((match = printRegex.exec(code)) !== null) {
    found = true;
    let text = match[1];
    simulatedOutput += text + "\n";
  }
  
  if (!found) {
    simulatedOutput += "No System.out.println statements found.\nCode compiled successfully!";
  }
  
  output.textContent = simulatedOutput;
}

function downloadCode() {
  const code = document.getElementById('codeEditor').value;
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Main.java';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
});
