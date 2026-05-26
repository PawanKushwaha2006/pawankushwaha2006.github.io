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
  alert('CodeNix React Tutorial v1.0\n\nReal React with Babel!\nBrowser me JSX compile hoke chalega ⚛️\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 React Project Ideas:\n\n1. Todo App\n2. Weather Dashboard\n3. E-commerce Cart\n4. Chat UI\n5. Portfolio Site\n6. Movie Search App\n\nClick Try It Yourself to start!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Edit JSX code\n4. Click Run to see output\n5. Click Save to download\n6. Click Sandbox for full React setup\n\nJSX real-time compile hota hai Babel se!\n\nPress ESC to close compiler');
  toggleDropdown();
}

function openCompiler() {
  const overlay = document.getElementById('compilerOverlay');
  const toggle = document.getElementById('compilerToggle');
  overlay.classList.add('active');
  toggle.classList.add('hide');
  document.body.style.overflow = 'hidden';
  runReact();
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
  runReact();
  openCompiler();
}

// Real React execution using Babel
function runReact() {
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  
  // Clear previous render
  output.innerHTML = '<div id="root"></div>';
  
  try {
    // Transform JSX with Babel
    const compiled = Babel.transform(code, {
      presets: ['react']
    }).code;
    
    // Execute compiled code
    eval(compiled);
    
  } catch (err) {
    output.innerHTML = `<div style="color: red; padding: 16px;">
      <b>React Error:</b><br>${err.message}<br><br>
      <b>Tip:</b> Check syntax. Use CodeSandbox for complex projects.
    </div>`;
  }
}

function openInCodeSandbox() {
  const code = document.getElementById('codeEditor').value;
  navigator.clipboard.writeText(code);
  window.open('https://codesandbox.io/s/react', '_blank', 'noopener,noreferrer');
  alert('Code copy ho gaya!\n\nCodeSandbox pe Ctrl+V paste karke dekho\nFull React setup waha milega ⚛️');
}

function downloadCode() {
  const code = document.getElementById('codeEditor').value;
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'App.jsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
});

// Initial render
window.addEventListener('load', () => {
  runReact();
});
