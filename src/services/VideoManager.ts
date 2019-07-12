import { ManagerInterface } from "./ManagerInterface";

export class VideoManager implements ManagerInterface {
    
    protected video:HTMLVideoElement;
    protected events = [];

    constructor(video:HTMLVideoElement) {
        if(video) {
            this.video = video;
            this.video.addEventListener('playing', () => this.executeEvent('playing'));
            this.video.addEventListener('pause', () => this.executeEvent('pause'));
            this.video.addEventListener('timeupdate', () => this.executeEvent('timeupdate'));
            this.video.addEventListener('loadedmetadata', () => this.executeEvent('metadata'));
            this.video.addEventListener('loadstart', () => this.executeEvent('ready'));
        }
    }

    executeEvent(k) {
        if(typeof this.events[k] === 'function') {
            this.events[k]();
        }
    }

    on(type, callback) {
        this.events[type] = callback;
    }

    play(): void {
        if(this.video) {
            this.video.play();
        }
    }

    pause(): void {
        if(this.video) {
            this.video.pause();
        }
    }

    changeSource(url, currentTime) {
        if(this.video) {
            this.video.pause();
            this.video.setAttribute('src', url);
            this.video.currentTime = currentTime;
            this.video.load();
            this.video.play();
        }
    }

    setSeek(currentTime) {
        if(this.video) {
            this.video.currentTime = currentTime;
            this.video.play();
        }
    }

    setVolume(vol) {
        if(this.video) {
            this.video.volume = vol;
        }
    }

    getDuration():number {
        if(this.video) {
            return this.video.duration
        }
        return 0;
    }

    getCurrentTime():number {
        if(this.video) {
            return this.video.currentTime;
        }
        return 0;
    }

    requestFullscreen(): void {
        if(this.video) {
            this.video.parentElement.requestFullscreen();
        }
    }

    exitFullscreen(): void {
        document.exitFullscreen();
    }
}