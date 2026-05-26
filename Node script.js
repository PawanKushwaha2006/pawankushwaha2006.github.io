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
  alert('CodeNix Node.js Tutorial v1.0\n\nNode.js browser me nahi chalta.\nSimulation + Replit integration diya hai 🟢\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 Node.js Project Ideas:\n\n1. REST API\n2. Chat App with Socket.io\n3. File Upload Server\n4. CLI Tool\n5. Web Scraper\n6. Discord Bot\n\nUse Replit to run these!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Click Simulate for basic console.log output\n4. Click "Run on Replit" for real Node.js\n5. Click Save to download\n\nNode.js server features sirf Replit pe chalenge!\n\nPress ESC to close compiler');
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
  runNode();
  openCompiler();
}

// Simulate Node.js - only console.log works
function runNode() {
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  output.textContent = '';
  
  // Check for server/fs/require - these won't work
  if (code.includes('require(') || code.includes('http.createServer') || code.includes('fs.')) {
    output.textContent = '⚠️ Warning: This code needs real Node.js\n\n';
    output.textContent += 'require(), http, fs modules browser me nahi chalte.\n\n';
    output.textContent += '✅ Solution: "Run on Replit" button dabao\n';
    output.textContent += 'Code copy ho jayega, waha paste karke real Node.js chalao\n\n';
    output.textContent += '--- Simulated Output ---\n';
  }
  
  try {
    let logs = [];
    const originalLog = console.log;
    console.log = function(...args) {
      logs.push(args.join(' '));
    };
    
    // Only eval simple JS parts
    const safeCode = code.replace(/require\(.*?\)/g, '/* require removed */');
    eval(safeCode);
    
    console.log = originalLog;
    output.textContent += logs.join('\n') || 'Code executed. No console.log output.';
    
  } catch (err) {
    output.textContent += "Error: " + err.message + "\n\nUse 'Run on Replit' for full Node.js support";
  }
}

function openInReplit() {
  const code = document.getElementById('codeEditor').value;
  navigator.clipboard.writeText(code);
  window.open('https://replit.com/languages/nodejs', '_blank', 'noopener,noreferrer');
  alert('Code copy ho gaya!\n\nReplit pe Ctrl+V paste karke Run dabao\nReal Node.js server waha chalega 🟢');
}

function downloadCode() {
  const code = document.getElementById('codeEditor').value;
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'app.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
});
