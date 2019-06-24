import { ManagerInterface } from "./ManagerInterface";

export class VideoManager implements ManagerInterface {
    
    protected video:HTMLVideoElement;
    protected events = [];

    constructor(video:HTMLVideoElement) {
        if(video) {
            this.video = video;
            this.video.addEventListener('playing', () => {
                this.events['playing']();
            });
            this.video.addEventListener('pause', () => {
                this.events['pause']();
            });
            this.video.addEventListener('timeupdate', () => {
                this.events['timeupdate']();
            });
            this.video.addEventListener('loadedmetadata', () => {
                this.events['metadata']();
            })
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
            return this.video.currentTime
        }
        return 0;
    }
}