let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeUI();

let isRunning = false;
let currentBlobUrl = null;

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
  alert('CodeNix Tailwind CSS Tutorial v1.0\n\nTailwind browser me 100% real-time chalega!\nCDN se load hota hai 💨\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 Tailwind Project Ideas:\n\n1. Landing Page\n2. Dashboard UI\n3. E-commerce Card\n4. Login Form\n5. Pricing Table\n6. Portfolio Site\n\nCopy code and customize!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Edit HTML with Tailwind classes\n4. Click Run to see live preview\n5. Click "Tailwind Play" for external editor\n6. Click Close to return\n\nTailwind CDN se instant load hota hai!\n\nPress ESC to close compiler');
  toggleDropdown();
}

function openCompiler() {
  const overlay = document.getElementById('compilerOverlay');
  const toggle = document.getElementById('compilerToggle');
  overlay.classList.add('active');
  toggle.classList.add('hide');
  document.body.style.overflow = 'hidden';
  setTimeout(() => runTailwind(), 300);
}

function closeCompiler() {
  const overlay = document.getElementById('compilerOverlay');
  const toggle = document.getElementById('compilerToggle');
  overlay.classList.remove('active');
  toggle.classList.remove('hide');
  document.body.style.overflow = 'auto';
  if (currentBlobUrl) {
    URL.revokeObjectURL(currentBlobUrl);
    currentBlobUrl = null;
  }
  document.getElementById('tailwindFrame').src = 'about:blank';
}

function loadCode(codeId) {
  document.getElementById('codeEditor').value = document.getElementById(codeId).innerText;
  openCompiler();
}

async function runTailwind() {
  if (isRunning) return;
  isRunning = true;
  
  const code = document.getElementById('codeEditor').value;
  const iframe = document.getElementById('tailwindFrame');
  const statusLog = document.getElementById('statusLog');
  const runBtn = document.getElementById('runBtn');
  
  runBtn.disabled = true;
  statusLog.innerHTML = '<span class="loading">⏳ Rendering Tailwind...</span>';
  
  try {
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
    }
    
    const blob = new Blob([code], { type: 'text/html' });
    currentBlobUrl = URL.createObjectURL(blob);
    iframe.src = currentBlobUrl;
    
    iframe.onload = () => {
      statusLog.innerHTML = '<span class="success">✓ Tailwind rendered successfully!</span>';
      runBtn.disabled = false;
      isRunning = false;
    };
    
    setTimeout(() => {
      if (isRunning) {
        statusLog.innerHTML = '<span class="success">✓ Tailwind loaded!</span>';
        runBtn.disabled = false;
        isRunning = false;
      }
    }, 2000);
    
  } catch (err) {
    statusLog.innerHTML = `<span class="error">❌ Error: ${err.message}</span>`;
    runBtn.disabled = false;
    isRunning = false;
    console.error('Tailwind Error:', err);
  }
}

function openInTailwindPlay() {
  const code = document.getElementById('codeEditor').value;
  navigator.clipboard.writeText(code).then(() => {
    window.open('https://play.tailwindcss.com/', '_blank', 'noopener,noreferrer');
    alert('✅ Code copied!\n\nTailwind Play pe paste karke dekh 💨');
  }).catch(() => {
    window.open('https://play.tailwindcss.com/', '_blank', 'noopener,noreferrer');
    alert('Tailwind Play khul gaya! Code manually paste karo 💨');
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') runTailwind();
});
