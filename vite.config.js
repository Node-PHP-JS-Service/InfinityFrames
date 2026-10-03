import { defineConfig } from "vite";

export default defineConfig({
    optimizeDeps: {
        exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/core"],
    },
    base: "/InfinityFrames/"
});