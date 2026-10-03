const previewPlay = document.getElementById('previewPlay');
const previewPause = document.getElementById('previewPause');
const editorCanvas = document.getElementById('editorCanvas');
const CTX = editorCanvas.getContext('2d');
const framelate = document.getElementById('framelate');
const previewAudio = document.getElementById('previewAudio');
const audioFileInput = document.getElementById('audioFile');
import { currentFrame, frames, nextFrameAsync, resetCurrentFrame } from './frame.js';
const frameCount = document.getElementById('frameCount');
let currentinterval = null;

previewPlay.addEventListener('click', () => {
    if (frames && frames.length > 0) {
        resetCurrentFrame();
        frameCount.textContent = `${currentFrame + 1} / ${frames.length}`;
        currentinterval = setInterval(() => {
            if (currentFrame >= frames.length) {
                clearInterval(currentinterval);
                return;
            }
            nextFrameAsync();
        }, 1000 / framelate.value);
    }
});

previewPause.addEventListener('click', () => {
    if (currentinterval) {
        clearInterval(currentinterval);
        currentinterval = null;
    }
});

audioFileInput.addEventListener('change', () => {
    const file = audioFileInput.files[0];
    if (file) {
        const audioURL = URL.createObjectURL(file);
        previewAudio.src = audioURL;
    }
});