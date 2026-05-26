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
  alert('CodeNix MongoDB Tutorial v1.0\n\nMongoDB browser me nahi chalta.\nSimulation + Playground diya hai 🍃\n\nWhere Code Rises Again 🔥');
  toggleDropdown();
}

function refreshPage() {
  location.reload();
}

function showProjectIdeas() {
  alert('💡 MongoDB Project Ideas:\n\n1. Blog API\n2. E-commerce Backend\n3. User Auth System\n4. Chat App Database\n5. Analytics Dashboard\n6. IoT Data Logger\n\nUse Playground to test queries!');
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
  alert('❓ How to use:\n\n1. Read lessons\n2. Click Try It Yourself\n3. Click Simulate for mock output\n4. Click "Playground" for real MongoDB\n5. Click Save to download\n\nMongoDB queries sirf Playground pe real chalenge!\n\nPress ESC to close compiler');
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
  runMongo();
  openCompiler();
}

// Simulate MongoDB - mock responses
function runMongo() {
  const code = document.getElementById('codeEditor').value;
  const output = document.getElementById('output');
  
  let result = 'MongoDB Simulated Output:\n\n';
  
  if (code.includes('insertOne')) {
    result += '{\n "acknowledged": true,\n "insertedId": ObjectId("6507f1f77b84db44c4e12345")\n}';
  } else if (code.includes('find()') && !code.includes('{')) {
    result += '[\n {\n "_id": ObjectId("6507f1f77b84db44c4e12345"),\n "name": "Pawan",\n "age": 20,\n "city": "Delhi",\n "skills": ["JavaScript", "Python"]\n },\n {\n "_id": ObjectId("6507f1f77b84db44c4e67890"),\n "name": "Rahul",\n "age": 22,\n "city": "Mumbai"\n }\n]';
  } else if (code.includes('find({')) {
    result += '[\n {\n "_id": ObjectId("6507f1f77b84db44c4e12345"),\n "name": "Pawan",\n "age": 20,\n "city": "Delhi"\n }\n]';
  } else if (code.includes('updateOne')) {
    result += '{\n "acknowledged": true,\n "matchedCount": 1,\n "modifiedCount": 1\n}';
  } else if (code.includes('deleteOne') || code.includes('deleteMany')) {
    result += '{\n "acknowledged": true,\n "deletedCount": 1\n}';
  } else if (code.includes('aggregate')) {
    result += '[\n {\n "_id": "Delhi",\n "totalUsers": 5,\n "avgAge": 21.4\n },\n {\n "_id": "Mumbai",\n "totalUsers": 3,\n "avgAge": 23.6\n }\n]';
  } else {
    result += 'Query executed successfully.\n\n⚠️ Note: Ye sirf simulation hai.\nReal MongoDB ke liye "Playground" button dabao.';
  }
  
  output.textContent = result;
}

function openInPlayground() {
  const code = document.getElementById('codeEditor').value;
  navigator.clipboard.writeText(code);
  window.open('https://mongoplayground.net/', '_blank', 'noopener,noreferrer');
  alert('Query copy ho gaya!\n\nMongoDB Playground pe Ctrl+V paste karke Run dabao\nReal MongoDB waha chalega 🍃');
}

function downloadCode() {
  const code = document.getElementById('codeEditor').value;
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'query.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCompiler();
});
