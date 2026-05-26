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
  alert('CodeNix Go Tutorial v1.0\n\nGo browser me nahi chalta.\nSimulation + Go Playground diya hai 🐹\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 Go Project Ideas:\n\n1. Web Server with net/http\n2. REST API\n3. CLI Tool\n4. Web Scraper\n5. Chat Server\n6. Microservice\n\nUse Go Playground to test!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Click Simulate for mock output\n4. Click "Go Playground" for real Go\n5. Click Save to download\n\nGo code sirf Playground pe real chalega!\n\nPress ESC to close compiler');
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
  runGo();
  openCompiler();
}

// Simulate Go - mock responses
function runGo() {
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  
  let result = 'Program output:\n\n';
  
  if (code.includes('fmt.Println("Hello, World!")')) {
    result += 'Hello, World!\nWelcome to CodeNix!\n';
  }
  if (code.includes('Name: %s, Age: %d')) {
    result += 'Name: Pawan, Age: 20\nHeight: 5.9, Student: true\n';
  }
  if (code.includes('for i, score := range scores')) {
    result += 'Index 0: 85\nIndex 1: 90\nIndex 2: 78\nIndex 3: 92\nIndex 4: 88\nName: Pawan\nName: Rahul\nName: Priya\n';
  }
  if (code.includes('user.Greet()')) {
    result += "Hi, I'm Pawan, 20 years old\nNew age: 21\n";
  }
  if (code.includes('go say("Goroutine")')) {
    result += 'Main 0\nGoroutine 0\nMain 1\nGoroutine 1\nMain 2\nGoroutine 2\nDone\n';
  }
  if (code.includes('fmt.Println("Hello Go!")')) {
    result += 'Hello Go!\n';
  }
  if (!result.includes('Hello') && !result.includes('Name') && !result.includes('Index')) {
    result += 'Program executed.\n\n⚠️ Note: Ye sirf simulation hai.\nReal Go ke liye "Go Playground" button dabao.';
  }
  
  output.textContent = result;
}

function openInGoPlayground() {
  const code = document.getElementById('codeEditor').value;
  navigator.clipboard.writeText(code);
  window.open('https://go.dev/play/', '_blank', 'noopener,noreferrer');
  alert('Code copy ho gaya!\n\nGo Playground pe Ctrl+V paste karke Run dabao\nReal Go waha chalega 🐹');
}

function downloadCode() {
  const code = document.getElementById('codeEditor').value;
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'main.go';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
});
