// Get canvas element and context
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Variables to track the position and color
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let signatureColor = '#000'; // Default color is black

// Color picker element
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', updateSignatureColor);


// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', drawTouch);
canvas.addEventListener('touchend', stopDrawing);

document.getElementById('clearBtn').addEventListener('click', clearCanvas);
document.getElementById('saveBtn').addEventListener('click', saveSignature);

// Functions
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(e.offsetX, e.offsetY);
    context.strokeStyle = signatureColor;
    context.lineWidth = 2;
    context.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        e.preventDefault();
    }
    const touch = e.touches[0];
    isDrawing = true;
    [lastX, lastY] = [touch.clientX, touch.clientY];
}

function drawTouch(e) {
    if (!isDrawing) return;
    const touch = e.touches[0];
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(touch.clientX, touch.clientY);
    context.strokeStyle = signatureColor;
    context.lineWidth = 2;
    context.stroke();
    [lastX, lastY] = [touch.clientX, touch.clientY];
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function saveSignature() {
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const width = parseInt(widthInput.value) || canvas.width;
    const height = parseInt(heightInput.value) || canvas.height;

    // Create a new canvas with white background and desired resolution
    const newCanvas = document.createElement('canvas');
    newCanvas.width = width;
    newCanvas.height = height;
    const newContext = newCanvas.getContext('2d');
    newContext.fillStyle = '#fff';
    newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);
    newContext.drawImage(canvas, 0, 0, newCanvas.width, newCanvas.height);

    // Convert the new canvas to an image with signature color and white background
    const signatureImage = document.createElement('a');
    signatureImage.href = newCanvas.toDataURL('image/jpeg', 1.0);
    signatureImage.download = 'signature.jpg';
    signatureImage.click();
}

function updateSignatureColor() {
    signatureColor = colorPicker.value;
}
