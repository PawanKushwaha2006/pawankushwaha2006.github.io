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

/* Load */
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
function openGame() {
    window.location.href = "game.html"; 
}
<script>
function openCalculator() {
    window.location.href = "calculator.html";
}
</script>




