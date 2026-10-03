const editorCanvas = document.getElementById('editorCanvas');
const CTX = editorCanvas.getContext('2d');
const penTool = document.getElementById('penTool');
const eraserTool = document.getElementById('eraserTool');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
let isDrawing = false;
let currentTool = 'pen';

penTool.addEventListener('click', () => {
    currentTool = 'pen';
    CTX.globalCompositeOperation = 'source-over';
});

eraserTool.addEventListener('click', () => {
    currentTool = 'eraser';
    CTX.globalCompositeOperation = 'destination-out';
});

colorPicker.addEventListener('change', () => {
    CTX.strokeStyle = colorPicker.value;
});

brushSize.addEventListener('change', () => {
    CTX.lineWidth = brushSize.value;
});

editorCanvas.addEventListener('pointerdown', (e) => {
    isDrawing = true;
    CTX.beginPath();
    CTX.moveTo(e.offsetX, e.offsetY);
});

editorCanvas.addEventListener('pointermove', (e) => {
    if (isDrawing) {
        CTX.lineTo(e.offsetX, e.offsetY);
        CTX.stroke();
    }
});


editorCanvas.addEventListener('pointerup', () => {
    isDrawing = false;
    CTX.closePath();
});