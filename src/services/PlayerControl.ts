import { VideoManager } from "./VideoManager";

export class PlayerControl {

    protected events = [];
    videoManager: VideoManager;

    constructor(video:HTMLVideoElement) {
        this.videoManager = new VideoManager(video);
    }

    on(type, callback) {
        this.videoManager.on(type, callback);
    }

    play() {
        this.videoManager.play();
    }

    pause(): void {
        this.videoManager.pause();
    }

    setSeek(currentTime) {
        this.videoManager.setSeek(currentTime);
    }

    setVolume(vol) {
        this.videoManager.setVolume(vol);
    }

    getDuration() {
        return this.videoManager.getDuration();
    }

    getCurrentTime() {
        return this.videoManager.getCurrentTime();
    }

    requestFullscreen(): void {
        this.videoManager.requestFullscreen();
    }

    exitFullscreen(): void {
        this.videoManager.exitFullscreen();
    }
}