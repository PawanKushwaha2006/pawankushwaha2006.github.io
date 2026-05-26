let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeUI();

let dbReady = false;

// Wait for TypeScript to load
window.addEventListener('load', () => {
  if (typeof ts !== 'undefined') {
    dbReady = true;
    document.getElementById('output').innerHTML = '✓ TypeScript ready! Click Run 📘';
  } else {
    document.getElementById('output').innerHTML = '<span class="error">Error: TypeScript not loaded. Check internet.</span>';
  }
});

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
  alert('CodeNix TypeScript Tutorial v1.0\n\nReal TS Compiler with typescript.js!\nTypeScript ab browser me sach me chalega 📘\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 TypeScript Project Ideas:\n\n1. Todo App with Types\n2. Calculator\n3. Form Validator\n4. API Client\n5. Game with Types\n6. Portfolio\n\nClick Try It Yourself to start!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Edit code\n4. Click Run to compile & execute\n5. Click Save to download\n6. Click TS Playground for external\n7. Click Close to return\n\nTypeScript → JavaScript me convert hoke chalta hai!\n\nPress ESC to close compiler');
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
  runTypeScript();
  openCompiler();
}

function runTypeScript() {
  if (!dbReady) {
    document.getElementById('output').innerHTML = '<span class="error">TypeScript loading... Refresh karo</span>';
    return;
  }
  
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  
  try {
    const result = ts.transpileModule(code, {
      compilerOptions: { target: ts.ScriptTarget.ES2015, strict: true }
    });
    
    if (result.diagnostics && result.diagnostics.length > 0) {
      let errors = '';
      result.diagnostics.forEach(d => {
        errors += `<span class="error">Error: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}</span>\n`;
      });
      output.innerHTML = errors;
      return;
    }
    
    const jsCode = result.outputText;
    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.join(' '));
    
    new Function(jsCode)();
    
    console.log = originalLog;
    output.innerHTML = `<span class="success">✓ Compiled</span>\n\n${logs.join('\n') || 'No output'}`;
    
  } catch (err) {
    output.innerHTML = `<span class="error">Error: ${err.message}</span>`;
  }
}

function openInTSPlayground() {
  const code = document.getElementById('codeEditor').value;
  const encoded = btoa(unescape(encodeURIComponent(code)));
  window.open(`https://www.typescriptlang.org/play?#code/${encoded}`, '_blank');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runTypeScript();
});
