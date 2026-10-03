import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const ffmpeg = new FFmpeg();

async function loadFFmpeg() {
    if (ffmpeg.loaded) return;

    const baseURL =
        "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.10/dist/esm";

    await ffmpeg.load({
        coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            "text/javascript"
        ),
        wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            "application/wasm"
        ),
    });
}

async function createMP4(imageDataArray, fps, audioBlob = null) {
    await loadFFmpeg();

    // フレームを書き込むためのCanvas
    const canvas = document.createElement("canvas");

    canvas.width = imageDataArray[0].width;
    canvas.height = imageDataArray[0].height;

    const ctx = canvas.getContext("2d");

    // ImageData → PNG
    for (let i = 0; i < imageDataArray.length; i++) {
        ctx.putImageData(imageDataArray[i], 0, 0);

        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, "image/png");
        });

        const data = new Uint8Array(
            await blob.arrayBuffer()
        );

        const filename =
            `frame${String(i).padStart(6, "0")}.png`;

        await ffmpeg.writeFile(filename, data);
    }

    // 音声がある場合
    if (audioBlob) {
        const audioData = new Uint8Array(
            await audioBlob.arrayBuffer()
        );

        await ffmpeg.writeFile(
            "audio.webm",
            audioData
        );
    }

    const args = [
        "-framerate",
        String(fps),
        "-i",
        "frame%06d.png",
    ];

    if (audioBlob) {
        args.push(
            "-i",
            "audio.webm",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-shortest",
        );
    } else {
        args.push(
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
        );
    }

    args.push("output.mp4");

    await ffmpeg.exec(args);

    const output = await ffmpeg.readFile("output.mp4");

    return new Blob(
        [output.buffer],
        { type: "video/mp4" }
    );
}

async function createWebM(imageDataArray, fps, audioBlob = null) {
    await loadFFmpeg();

    const canvas = document.createElement("canvas");

    canvas.width = imageDataArray[0].width;
    canvas.height = imageDataArray[0].height;

    const ctx = canvas.getContext("2d");

    // ImageData → PNG → FFmpeg
    for (let i = 0; i < imageDataArray.length; i++) {
        ctx.putImageData(imageDataArray[i], 0, 0);

        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, "image/png");
        });

        const data = new Uint8Array(
            await blob.arrayBuffer()
        );

        const filename =
            `frame${String(i).padStart(6, "0")}.png`;

        await ffmpeg.writeFile(filename, data);
    }

    // 音声がある場合
    if (audioBlob) {
        const audioData = new Uint8Array(
            await audioBlob.arrayBuffer()
        );

        await ffmpeg.writeFile(
            "audio.webm",
            audioData
        );
    }

    const args = [
        "-framerate",
        String(fps),
        "-i",
        "frame%06d.png",
    ];

    if (audioBlob) {
        args.push(
            "-i",
            "audio.webm",
            "-c:v",
            "libvpx-vp9",
            "-c:a",
            "libopus",
            "-shortest",
        );
    } else {
        args.push(
            "-c:v",
            "libvpx-vp9",
        );
    }

    args.push("output.webm");

    await ffmpeg.exec(args);

    const output = await ffmpeg.readFile("output.webm");

    return new Blob(
        [output.buffer],
        { type: "video/webm" }
    );
}

async function createGIF(imageDataArray, fps) {
    await loadFFmpeg();

    const canvas = document.createElement("canvas");

    canvas.width = imageDataArray[0].width;
    canvas.height = imageDataArray[0].height;

    const ctx = canvas.getContext("2d");

    // ImageData → PNG
    for (let i = 0; i < imageDataArray.length; i++) {
        ctx.putImageData(imageDataArray[i], 0, 0);

        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, "image/png");
        });

        const data = new Uint8Array(
            await blob.arrayBuffer()
        );

        const filename =
            `frame${String(i).padStart(6, "0")}.png`;

        await ffmpeg.writeFile(filename, data);
    }

    // FPS → GIFのフレーム遅延
    const delay = 100 / fps;

    await ffmpeg.exec([
        "-framerate",
        String(fps),

        "-i",
        "frame%06d.png",

        "-vf",
        "split[s0][s1];" +
        "[s0]palettegen=max_colors=256[p];" +
        "[s1][p]paletteuse",

        "-loop",
        "0",

        "output.gif"
    ]);

    const output = await ffmpeg.readFile("output.gif");

    return new Blob(
        [output.buffer],
        { type: "image/gif" }
    );
}

import { frames } from "./frame.js";

document.getElementById("generateVideo").addEventListener("click", async () => {
  const outputType = document.getElementById('outputType');
  const type = outputType.value;
  const fps = parseInt(document.getElementById("framelate").value);
  const audioFileInput = document.getElementById("audioFile");
  const audioBlob = audioFileInput.files[0] || null;
  const imageDataArray = frames; // ここでImageDataの配列を取得する関数を呼び出す
  switch (type) {
    case "mp4":
      createMP4(imageDataArray, fps, audioBlob).then((videoBlob) => {
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.mp4";
        a.click();
        URL.revokeObjectURL(url);
      });
      break;
    case "webm":
      createWebM(imageDataArray, fps, audioBlob).then((videoBlob) => {
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.webm";
        a.click();
        URL.revokeObjectURL(url);
      });
      break;
    case "gif":
      createGIF(imageDataArray, fps).then((gifBlob) => {
        const url = URL.createObjectURL(gifBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "output.gif";
        a.click();
        URL.revokeObjectURL(url);
      });
      break;
    default:
      alert("無効な出力形式です。");
  }
  
});