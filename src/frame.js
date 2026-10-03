const editorCanvas = document.querySelector('canvas');
const prevFrame = document.getElementById('prevFrame');
const nextFrame = document.getElementById('nextFrame');
const addFrame = document.getElementById('addFrame');
const deleteFrame = document.getElementById('deleteFrame');
const clearFrame = document.getElementById('clearFrame');
const saveFrame = document.getElementById('saveFrame');
const frameCount = document.getElementById('frameCount');
const exportFrames = document.getElementById('exportFrames');
const imageOutputType = document.getElementById('imageOutputType');
const CTX = editorCanvas.getContext('2d');
export let currentFrame = 0
export let frames = [null]
frameCount.textContent = `${currentFrame + 1} / ${frames.length}`;

prevFrame.addEventListener('click', () => {
    currentFrame--;
    if (currentFrame < 0) {
        currentFrame = frames.length - 1;
    }
    frameCount.textContent = `${currentFrame + 1} / ${frames.length}`;

    let loadframe = frames[currentFrame];

    CTX.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
    if (loadframe) {
        CTX.putImageData(loadframe, 0, 0);
    }
});

nextFrame.addEventListener('click', () => {
    currentFrame++;
    if (currentFrame >= frames.length) {
        currentFrame = 0;
    }
    frameCount.textContent = `${currentFrame + 1} / ${frames.length}`;

    let loadframe = frames[currentFrame];

    CTX.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
    if (loadframe) {
        CTX.putImageData(loadframe, 0, 0);
    }
});

addFrame.addEventListener('click', () => {
    frames.push(null);
    frameCount.textContent = `${currentFrame + 1} / ${frames.length}`;
});

deleteFrame.addEventListener('click', () => {
    if (frames.length > 1) {
        frames.splice(currentFrame, 1);
        if (currentFrame >= frames.length) {
            currentFrame = frames.length - 1;
        }
        frameCount.textContent = `${currentFrame + 1} / ${frames.length}`;
    }
});

saveFrame.addEventListener('click', () => {
    frames[currentFrame] = CTX.getImageData(0, 0, editorCanvas.width, editorCanvas.height);
    frameCount.textContent = `${currentFrame + 1} / ${frames.length}`;
});

clearFrame.addEventListener('click', () => {
    CTX.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
    frames[currentFrame] = null;
});

export function nextFrameAsync() {
    currentFrame++;
    if (currentFrame >= frames.length) {
        currentFrame = 0;
    }
    CTX.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
    if (frames[currentFrame]) {
        CTX.putImageData(frames[currentFrame], 0, 0);
    }
}

export function resetCurrentFrame() {
    currentFrame = 0;
    CTX.clearRect(0, 0, editorCanvas.width, editorCanvas.height);
    if (frames[currentFrame]) {
        CTX.putImageData(frames[currentFrame], 0, 0);
    }
}

exportFrames.addEventListener('click', () => {
    let url;
    switch (imageOutputType.value) {
        case 'png':
            url = editorCanvas.toDataURL('image/png');
            break;
        case 'jpeg':
            url = editorCanvas.toDataURL('image/jpeg');
            break;
        case 'webp':
            url = editorCanvas.toDataURL('image/webp');
            break;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = `frame-${currentFrame + 1}.${imageOutputType.value}`;
    a.click();
});