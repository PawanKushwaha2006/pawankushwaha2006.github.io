// ══════════════════════════════════════════
// CodeHub — script.js - FIXED VERSION
// ══════════════════════════════════════════

// ── LANGUAGE FILE NAME MAP ──────────────────────────────────
const langFileName = {
  'HTML': 'HTML',
  'Python': 'Python',
  'JavaScript': 'JavaScript',
  'Java': 'Java',
  'MySQL': 'MySQL',
  'C': 'C',
  'C++': 'CPlusPlus',
  'PHP': 'PHP',
  'C#': 'CSharp',
  'Lua': 'Lua',
  'PL/SQL': 'PLSQL',
  'NodeJS': 'NodeJS',
  'MongoDB': 'MongoDB',
  'Groovy': 'Groovy',
  'React': 'React',
  'PostgreSQL': 'PostgreSQL',
  'Ruby': 'Ruby',
  'TypeScript': 'TypeScript',
  'Go': 'Go',
  'Rust': 'Rust',
  'Kotlin': 'Kotlin',
  'Swift': 'Swift',
  'Dart': 'Dart',
  'Scala': 'Scala',
  'Haskell': 'Haskell',
  'Perl': 'Perl',
  'Julia': 'Julia',
  'R': 'R',
  'Elixir': 'Elixir',
  'Erlang': 'Erlang',
  'Bash': 'Bash',
  'Fortran': 'Fortran',
  'Cobol': 'Cobol',
  'Pascal': 'Pascal',
  'Nim': 'Nim',
  'Zig': 'Zig',
  'Clojure': 'Clojure',
  'Crystal': 'Crystal',
  'OCaml': 'OCaml',
  'Deno': 'Deno',
  'Bun': 'Bun',
  'Vue': 'Vue',
  'Angular': 'Angular',
  'Bootstrap': 'Bootstrap',
  'Tailwind CSS':'TailwindCSS',
  'HTMX': 'HTMX',
  'Alpine.js': 'AlpineJS',
  'Chart.js': 'ChartJS',
  'D3.js': 'D3JS',
  'JQuery': 'JQuery',
  'Materialize': 'Materialize',
  'Bulma': 'Bulma',
  'Foundation': 'Foundation',
  'Uikit': 'Uikit',
  'Semantic UI': 'SemanticUI',
  'Skeleton': 'Skeleton',
  'PaperCSS': 'PaperCSS',
  'BackboneJS': 'BackboneJS',
  'Oracle': 'Oracle',
  'SQLite': 'SQLite',
  'Redis': 'Redis',
  'MariaDB': 'MariaDB',
  'SQL Server': 'SQLServer',
  'Cassandra': 'Cassandra',
  'QuestDB': 'QuestDB',
  'DuckDB': 'DuckDB',
  'SurrealDB': 'SurrealDB',
  'Firebird': 'Firebird',
  'ClickHouse': 'ClickHouse',
};

function getFileName(langName) {
  return (langFileName[langName] || langName.replace(/[^a-zA-Z0-9]/g, '')) + '.html';
}

// ── SMOOTH PAGE TRANSITION ──────────────────────────────────
function navigateTo(url) {
  const overlay = document.getElementById('page-transition');
  if (overlay) overlay.classList.add('going');
  setTimeout(() => {
    window.location.href = url;
  }, 370);
}

// ── RIPPLE EFFECT HATA DIYA - AB KHALI FUNCTION HAI ────────────
function addRipple(card, e) {
  // Ripple disabled to prevent box growing on click
  return;
}

// ── TRANSLATIONS - SAB ENGLISH ME KAR DIYA ───────────────────
const englishText = {
  heroTitle: 'Code online with <span>CodeHub.</span>',
  heroSub: 'CodeHub helps over 12.8 million users worldwide write code online.',
  searchPlaceholder: 'Search by Language / DB / Template...',
  uploadLabel: 'Upload your code file',
  uploadSub: 'Supports.html.py.js.java.c.cpp.cs.php.rb.go.rs.sql and more',
  navUpload: 'Upload File', navSignIn: 'Sign In',
  tabPopular: 'Popular', tabProg: 'Programming', tabWeb: 'Web', tabDB: 'Databases',
  sbLangTitle: 'Language', sbLangLabel: 'Select Language',
  sbCatTitle: 'Categories', sbPopular: 'Popular', sbProgramming: 'Programming',
  sbWeb: 'Web / Frameworks', sbDatabases: 'Databases',
  sbAccTitle: 'Account', sbLogin: 'Login / Register',
  sbInfoTitle: 'Info', sbAbout: 'About', sbContact: 'Contact',
  sbPrivacy: 'Privacy Policy', sbTerms: 'Terms of Service',
  loginTitle: 'Sign in to CodeHub', loginSub: 'Choose your preferred login method',
  lmEmail: 'Continue with Email', lmGmail: 'Continue with Gmail / Google',
  lmZoho: 'Continue with Zoho', lmMs: 'Continue with Microsoft',
  lmApple: 'Continue with Apple / iOS',
  cancel: 'Cancel', close: 'Close',
  noResult: 'No results found for',
  modalAboutTitle: 'About CodeHub',
  modalAboutBody: 'CodeHub is a free online compiler supporting 60+ languages. Our mission: make coding accessible to everyone without any setup.',
  modalContactTitle: 'Contact Us',
  modalContactBody: '📧 Email: support@codehub.io\n🌐 Website: www.codehub.io\n📱 Twitter: @CodeHubIO',
  modalPrivacyTitle: 'Privacy Policy',
  modalPrivacyBody: 'We collect minimal data. Your code is processed temporarily. We do not sell your data. Login info is encrypted.',
  modalTermsTitle: 'Terms of Service',
  modalTermsBody: 'By using CodeHub, you agree not to misuse the platform. Content you create remains yours. We may update these terms anytime.',
  loginRedirect: 'Redirecting to',
};

const T = {
  en: englishText,
  hi: englishText,
  hg: englishText,
  bn: englishText,
  od: englishText,
  ta: englishText,
  te: englishText,
  mr: englishText,
  gu: englishText,
  kn: englishText,
  ml: englishText,
  pa: englishText,
};

let currentLang = 'en';
let currentTab = 'popular';

function t(key) {
  return T[currentLang][key] || T['en'][key] || '';
}

// ── APPLY LANGUAGE TO DOM ────────────────────────────────────
function applyLang() {
  document.getElementById('hero-title').innerHTML = t('heroTitle');
  document.getElementById('hero-sub').textContent = t('heroSub');
  document.getElementById('searchInput').placeholder = t('searchPlaceholder');
  document.getElementById('upload-label').textContent = t('uploadLabel');
  document.getElementById('upload-sub').textContent = t('uploadSub');
  document.getElementById('nav-upload-text').textContent = t('navUpload');
  document.getElementById('nav-signin').innerHTML = t('navSignIn');
  document.getElementById('tab-popular').textContent = t('tabPopular');
  document.getElementById('tab-programming').textContent = t('tabProg');
  document.getElementById('tab-web').textContent = t('tabWeb');
  document.getElementById('tab-databases').textContent = t('tabDB');
  document.getElementById('sb-lang-title').textContent = t('sbLangTitle');
  document.getElementById('sb-lang-label').textContent = t('sbLangLabel');
  document.getElementById('sb-cat-title').textContent = t('sbCatTitle');
  document.getElementById('sb-popular').textContent = t('sbPopular');
  document.getElementById('sb-programming').textContent = t('sbProgramming');
  document.getElementById('sb-web').textContent = t('sbWeb');
  document.getElementById('sb-databases').textContent = t('sbDatabases');
  document.getElementById('sb-acc-title').textContent = t('sbAccTitle');
  document.getElementById('sb-login').textContent = t('sbLogin');
  document.getElementById('sb-info-title').textContent = t('sbInfoTitle');
  document.getElementById('sb-about').textContent = t('sbAbout');
  document.getElementById('sb-contact').textContent = t('sbContact');
  document.getElementById('sb-privacy').textContent = t('sbPrivacy');
  document.getElementById('sb-terms').textContent = t('sbTerms');
  document.getElementById('login-modal-title').textContent = t('loginTitle');
  document.getElementById('login-modal-sub').textContent = t('loginSub');
  document.getElementById('lm-email').textContent = t('lmEmail');
  document.getElementById('lm-gmail').textContent = t('lmGmail');
  document.getElementById('lm-zoho').textContent = t('lmZoho');
  document.getElementById('lm-ms').textContent = t('lmMs');
  document.getElementById('lm-apple').textContent = t('lmApple');
  document.getElementById('lm-cancel').textContent = t('cancel');
  document.getElementById('modal-close-text').textContent = t('close');
  renderCards(currentTab);
}

function setUILang(code) {
  currentLang = code;
  document.querySelectorAll('.lang-option').forEach(b => b.classList.remove('selected'));
  if (event && event.target) event.target.classList.add('selected');
  applyLang();
  closeSidebar();
  showToast('✓ Language changed!');
}

// ── LANGUAGE DATA ────────────────────────────────────────────
const languages = {
  popular: [
    { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', ext: 'html' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', ext: 'py' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', ext: 'js' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', ext: 'java' },
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', ext: 'sql' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', ext: 'cpp' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', ext: 'jsx' },
  ],
  programming: [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', ext: 'py' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', ext: 'java' },
    { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg', ext: 'c' },
    { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', ext: 'cpp' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', ext: 'ts' },
    { name: 'Go', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg', ext: 'go' },
  ],
  web: [
    { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', ext: 'html' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', ext: 'jsx' },
    { name: 'NodeJS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', ext: 'js' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', ext: 'js' },
    { name: 'Tailwind CSS',icon: '', ext: 'html' },
    /*{ name: 'Chart.js', icon: '', ext: 'html' },
    { name: 'D3.js', icon: '', ext: 'html' },
    { name: 'JQuery', icon: '', ext: 'js' },
    { name: 'Materialize', icon: '', ext: 'html' },
    { name: 'Bulma', icon: '', ext: 'html' },*/
  ],
  databases: [
    { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', ext: 'sql' },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', ext: 'sql' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', ext: 'js' },
    { name: 'SQLite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg', ext: 'sql' },
  ],
};

// ── RENDER CARDS ─────────────────────────────────────────────
function renderCards(tab, query = '') {
  currentTab = tab;
  const grid = document.getElementById('langGrid');
  let items = languages[tab] || [];
  if (query) items = items.filter(l => l.name.toLowerCase().includes(query.toLowerCase()));
  grid.innerHTML = '';
  items.forEach((lang, i) => {
    const card = document.createElement('a');
    card.className = 'lang-card';
    card.href = '#';
    card.style.animationDelay = (i * 0.04) + 's';
    card.addEventListener('click', (e) => {
      e.preventDefault();
      // addRipple hata diya - yahi box bada kar raha tha
      navigateTo(getFileName(lang.name));
    });
    const iconHTML = lang.icon
     ? `<img class="lang-icon" src="${lang.icon}" alt="${lang.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="lang-icon-fallback" style="display:none">&lt;/&gt;</div>`
      : `<div class="lang-icon-fallback">&lt;/&gt;</div>`;
    card.innerHTML = `<span class="lang-name">${lang.name}</span>${iconHTML}`;
    grid.appendChild(card);
  });
}

function setTab(tab, btn) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  else document.querySelectorAll('.tab-btn').forEach(b => { if (b.id === 'tab-' + tab) b.classList.add('active'); });
  document.getElementById('searchInput').value = '';
  renderCards(tab);
}

function filterCards() {
  const q = document.getElementById('searchInput').value.trim();
  if (!q) { renderCards(currentTab); return; }
  const seen = new Set();
  const all = [];
  ['popular', 'programming', 'web', 'databases'].forEach(tab => {
    languages[tab].forEach(lang => {
      if (!seen.has(lang.name) && lang.name.toLowerCase().includes(q.toLowerCase())) {
        seen.add(lang.name);
        all.push(lang);
      }
    });
  });
  const grid = document.getElementById('langGrid');
  grid.innerHTML = '';
  if (!all.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">${t('noResult')} "<strong>${q}</strong>"</div>`;
    return;
  }
  all.forEach((lang, i) => {
    const card = document.createElement('a');
    card.className = 'lang-card';
    card.href = '#';
    card.style.animationDelay = (i * 0.04) + 's';
    card.addEventListener('click', (e) => {
      e.preventDefault();
      // addRipple hata diya
      navigateTo(getFileName(lang.name));
    });
    const iconHTML = lang.icon
     ? `<img class="lang-icon" src="${lang.icon}" alt="${lang.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="lang-icon-fallback" style="display:none">&lt;/&gt;</div>`
      : `<div class="lang-icon-fallback">&lt;/&gt;</div>`;
    card.innerHTML = `<span class="lang-name">${lang.name}</span>${iconHTML}`;
    grid.appendChild(card);
  });
}

// ── FILE UPLOAD ──────────────────────────────────────────────
const extToLang = {
  html: 'HTML', htm: 'HTML', py: 'Python', js: 'JavaScript', ts: 'TypeScript',
  java: 'Java', c: 'C', cpp: 'C++', cxx: 'C++', cc: 'C++', cs: 'C#', php: 'PHP',
  rb: 'Ruby', go: 'Go', rs: 'Rust', kt: 'Kotlin', kts: 'Kotlin', swift: 'Swift',
  dart: 'Dart', scala: 'Scala', lua: 'Lua', pl: 'Perl', r: 'R', jl: 'Julia',
  ex: 'Elixir', exs: 'Elixir', erl: 'Erlang', hs: 'Haskell', ml: 'OCaml',
  sh: 'Bash', bash: 'Bash', sql: 'MySQL', jsx: 'React', tsx: 'React', vue: 'Vue',
  groovy: 'Groovy', f90: 'Fortran', f: 'Fortran', cob: 'Cobol', pas: 'Pascal',
  nim: 'Nim', zig: 'Zig', clj: 'Clojure', cr: 'Crystal', asm: 'Assembly',
  s: 'Assembly', surql: 'SurrealDB', cql: 'Cassandra',
};

function handleFileUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  const langName = extToLang[ext];
  if (langName) {
    navigateTo(getFileName(langName));
  } else {
    showToast('Unsupported file type:.' + ext);
  }
  input.value = '';
}

// ── SIDEBAR ──────────────────────────────────────────────────
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

function toggleLangSub() {
  const s = document.getElementById('lang-sub');
  const a = document.getElementById('lang-arrow');
  s.classList.toggle('open');
  a.textContent = s.classList.contains('open')? '▲' : '▼';
}

function toggleLoginSub() {
  const s = document.getElementById('login-sub');
  const a = document.getElementById('login-arrow');
  s.classList.toggle('open');
  a.textContent = s.classList.contains('open')? '▲' : '▼';
}

// ── MODALS ───────────────────────────────────────────────────
const modalContent = {
  about: (L) => ({ title: L.modalAboutTitle, body: L.modalAboutBody }),
  contact: (L) => ({ title: L.modalContactTitle, body: L.modalContactBody }),
  privacy: (L) => ({ title: L.modalPrivacyTitle, body: L.modalPrivacyBody }),
  terms: (L) => ({ title: L.modalTermsTitle, body: L.modalTermsBody }),
};

function openModal(type) {
  if (type === 'login') {
    document.getElementById('loginModal').classList.add('open');
    return;
  }
  const fn = modalContent[type];
  if (!fn) return;
  const L = T[currentLang] || T['en'];
  const d = fn(L);
  document.getElementById('modalTitle').textContent = d.title;
  document.getElementById('modalBody').innerHTML = d.body.replace(/\n/g, '<br>');
  document.getElementById('infoModal').classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

document.getElementById('infoModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal('infoModal');
});

document.getElementById('loginModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal('loginModal');
});

function showLoginMsg(provider) {
  closeModal('loginModal');
  closeSidebar();
  showToast((T[currentLang] || T['en']).loginRedirect + ' ' + provider + '...');
}

// ── TOAST ────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(80px)';
  }, 2800);
}

// ── THEME TOGGLE ─────────────────────────────────────────────
let dark = false;

function toggleTheme() {
  dark =!dark;
  document.querySelector('.nav-icon-btn[title="Theme"]').textContent = dark? '🌙' : '☀️';
  const d = dark
   ? { bg: '#0f1117', surface: '#1a1d2e', border: '#2a2d3e', text: '#e4e8f0', muted: '#a0aec0', hover: '#22253a' }
    : { bg: '#f8f9ff', surface: '#ffffff', border: '#e8eaf0', text: '#1a1d2e', muted: '#6b7280', hover: '#f0f3ff' };
  Object.entries(d).forEach(([k, v]) => document.documentElement.style.setProperty('--' + k, v));
}

// ── INIT ─────────────────────────────────────────────────────
renderCards('popular');
applyLang();
