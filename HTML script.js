const MODALS = {
  about: {
    title: 'About CodeNix',
    body: '<p>CodeNix is an interactive coding learning platform. Learn HTML, CSS, JavaScript, Python, and more through practical lessons and a live compiler.</p><p style="margin-top:8px">Made with ❤️ for learners everywhere.</p>'
  },
  project: {
    title: 'HTML & CSS Project Ideas 💡',
    body: '<ul><li>Personal Portfolio Website</li><li>Restaurant Menu Page</li><li>Responsive Landing Page</li><li>Photo Gallery with CSS Grid</li><li>Animated Login Form</li><li>Calculator UI</li><li>Blog Layout</li><li>Product Card with Hover Effects</li></ul>'
  },
  help: {
    title: 'Help & Tips 🆘',
    body: '<ul><li>Click <b>Try It Yourself</b> to open the live compiler</li><li>Copy code with the Copy button on each snippet</li><li>Switch dark/light mode from the menu</li><li>Scroll down for all 12 lessons</li></ul>'
  }
};

let currentTheme = localStorage.getItem('codenix_theme') || 'light';

function applyTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  const isDark = currentTheme === 'dark';
  document.getElementById('themeIcon').className = isDark? 'fas fa-sun' : 'fas fa-moon';
  document.getElementById('themeLabel').textContent = isDark? 'Light Mode' : 'Dark Mode';
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark'? 'light' : 'dark';
  localStorage.setItem('codenix_theme', currentTheme);
  applyTheme();
}

function toggleDropdown() {
  document.getElementById('dropdown').classList.toggle('open');
}
function closeDropdown() {
  document.getElementById('dropdown').classList.remove('open');
}

function openCompiler() {
  document.getElementById('compilerOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  closeDropdown();
}
function closeCompiler() {
  document.getElementById('compilerOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function showModal(type) {
  document.getElementById('modal-title').textContent = MODALS[type].title;
  document.getElementById('modal-body').innerHTML = MODALS[type].body;
  document.getElementById('modalOverlay').classList.add('open');
  closeDropdown();
}
function closeModalFn() {
  document.getElementById('modalOverlay').classList.remove('open');
}

function copyCode(btn) {
  const code = btn.parentElement.querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = '✓ Copied';
    btn.style.background = '#28c940';
    btn.style.color = '#fff';
    setTimeout(() => { btn.textContent = 'Copy'; btn.style.background = ''; btn.style.color = ''; }, 1800);
  });
  showToast('✓ Code copied!');
}

function downloadPage() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([document.documentElement.outerHTML], { type: 'text/html' }));
  a.download = 'HTML_CSS_Tutorial_CodeNix.html';
  a.click();
  closeDropdown();
  showToast('Page saved!');
}

function sharePage() {
  if (navigator.share) {
    navigator.share({ title: 'HTML & CSS Tutorial - CodeNix', url: location.href });
  } else {
    navigator.clipboard.writeText(location.href);
    showToast('Link copied to clipboard!');
  }
  closeDropdown();
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { el.style.transform = 'translateX(-50%) translateY(80px)'; }, 2500);
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.dropdown') &&!e.target.closest('.menu-btn')) closeDropdown();
  if (e.target === document.getElementById('modalOverlay')) closeModalFn();
  if (e.target === document.getElementById('compilerOverlay')) closeCompiler();
});

window.addEventListener('scroll', function() {
  const st = window.scrollY, dh = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progressBar').style.width = (st / dh * 100) + '%';
  const sb = document.getElementById('scrollTop');
  st > 300? sb.classList.add('visible') : sb.classList.remove('visible');
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeCompiler(); closeModalFn(); closeDropdown(); }
});

applyTheme();
