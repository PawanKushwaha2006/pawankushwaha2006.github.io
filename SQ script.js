let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeUI();

let db = null;
let SQL = null;

// Initialize SQL.js
initSqlJs({
  locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
}).then(SQLLib => {
  SQL = SQLLib;
  db = new SQL.Database();
  document.getElementById('output').innerHTML = 'SQLite ready! Click Run to execute queries 🗄️';
}).catch(err => {
  document.getElementById('output').innerHTML = 'Error loading SQLite: ' + err;
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
  alert('CodeNix SQLite Tutorial v1.0\n\nReal SQLite with SQL.js!\nBrowser me database chalega 🗄️\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 SQLite Project Ideas:\n\n1. Todo App Database\n2. Expense Tracker\n3. Contact Manager\n4. Blog CMS\n5. Inventory System\n6. Quiz App\n\nClick Try It Yourself to start!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Edit SQL queries\n4. Click Run to execute\n5. Click Save to download\n6. Click SQLite Online for advanced editor\n\nReal SQLite database browser me!\n\nPress ESC to close compiler');
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
  runSQLite();
  openCompiler();
}

// Real SQLite execution using SQL.js
function runSQLite() {
  if (!db) {
    document.getElementById('output').innerHTML = 'SQLite not ready yet. Please wait...';
    return;
  }
  
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  
  try {
    const results = db.exec(code);
    
    if (results.length === 0) {
      output.innerHTML = 'Query executed successfully. No results to display.';
      return;
    }
    
    let html = '';
    results.forEach(result => {
      html += '<table><thead><tr>';
      result.columns.forEach(col => {
        html += `<th>${col}</th>`;
      });
      html += '</tr></thead><tbody>';
      
      result.values.forEach(row => {
        html += '<tr>';
        row.forEach(cell => {
          html += `<td>${cell === null? 'NULL' : cell}</td>`;
        });
        html += '</tr>';
      });
      html += '</tbody></table><br>';
    });
    
    output.innerHTML = html;
    
  } catch (err) {
    output.innerHTML = `<div style="color: #ff5f56;">SQL Error: ${err.message}</div>`;
  }
}

function openInSQLiteOnline() {
  const code = document.getElementById('codeEditor').value;
  navigator.clipboard.writeText(code);
  window.open('https://sqliteonline.com/', '_blank', 'noopener,noreferrer');
  alert('SQL copy ho gaya!\n\nSQLite Online pe Ctrl+V paste karke Run dabao\nFull SQLite waha milega 🗄️');
}

function downloadCode() {
  const code = document.getElementById('codeEditor').value;
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'query.sql';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
});
