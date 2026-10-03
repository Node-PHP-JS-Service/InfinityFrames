const xSize = document.getElementById('xSize');
const ySize = document.getElementById('ySize');
const editorCanvas = document.getElementById('editorCanvas');

xSize.addEventListener('change', () => {
    const newXSize = parseInt(xSize.value);
    if (!isNaN(newXSize) && newXSize > 0) {
        if(!confirm("キャンバスサイズ変更は、現在のキャンバス内容を消去します。続行しますか？")) {
            return;
        }
        editorCanvas.width = newXSize;
    }
});

ySize.addEventListener('change', () => {
    const newYSize = parseInt(ySize.value);
    if (!isNaN(newYSize) && newYSize > 0) {
        if(!confirm("キャンバスサイズ変更は、現在のキャンバス内容を消去します。続行しますか？")) {
            return;
        }
        editorCanvas.height = newYSize;
    }
});