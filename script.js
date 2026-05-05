const textarea = document.getElementById("htmlCode");
const output = document.getElementById("output");

/* Default Code */
const defaultCode = `<!DOCTYPE html>
<html>
<body>
<h1>Hello 👋</h1>
<p>Write your code here</p>
</body>
</html>`;

// Load default
textarea.value = defaultCode;
output.srcdoc = defaultCode;

/* Functions */
function runCode() {
  output.srcdoc = textarea.value;
}

function clearCode() {
  textarea.value = "";
  output.srcdoc = "";
}

function addStructure() {
  textarea.value = defaultCode;
}

function comingSoon() {
  alert("🚧 Coming Soon!");
}

function openEditor() {
  window.open("HTML.html", "_blank");
}

function openGame() {
  window.location.href = "game.html";
}

function openCalculator() {
  window.location.href = "calculator.html";
}

function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
  document.getElementById("fabBtn").classList.toggle("active");
}

function toggleSub(id) {
  document.getElementById(id).classList.toggle("open");
}

// Double tap zoom block
let lastTouch = 0;
document.addEventListener("touchend", function(e) {
  let now = new Date().getTime();
  if (now - lastTouch <= 300) {
    e.preventDefault();
  }
  lastTouch = now;
}, { passive: false });

// Pinch zoom block
document.addEventListener("gesturestart", function(e) {
  e.preventDefault();
});
// === BUTTON KE NEECHE PAGE LOAD KARO ===
function loadPageBelow(file, containerId, btn) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const isOpen = container.classList.contains('show');

  // Agar already open hai to close kar do
  if (isOpen) {
    container.classList.remove('show');
    container.innerHTML = '';
    btn.classList.remove('active');
    return;
  }

  // Sab containers close karo
  document.querySelectorAll('.content-box').forEach(b => {
    b.classList.remove('show');
    b.innerHTML = '';
  });
  document.querySelectorAll('.menu-item button').forEach(b => b.classList.remove('active'));

  // Loading dikhao
  container.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8;">Loading...</div>';
  container.classList.add('show');
  btn.classList.add('active');

  // iframe se page load karo
  container.innerHTML = `<iframe src="${file}" style="width:100%; height:600px; border:none; border-radius:0 0 8px 8px; background:white;"></iframe>`;

  // Scroll to button
  setTimeout(() => {
    btn.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}
