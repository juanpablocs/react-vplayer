import { VideoManager } from "./VideoManager";
import { AdsManager } from "./AdsManager";

export class PlayerControl {

    protected events = [];

    videoManager: VideoManager;
    adsManager: AdsManager;

    constructor(video:HTMLVideoElement, loadAds:string) {
        this.videoManager = new VideoManager(video);
        if(loadAds) {
            this.adsManager = new AdsManager(video);
            this.adsManager.setCreativeUrl(loadAds);
            
            this.adsManager.loadScriptSDK();
        }
    }

    on(type, callback) {
        if(this.adsManager) {
            this.adsManager.on(type, callback);
            this.adsManager.on('endAds', () => {
                this.videoManager.executeEvent('metadata');
            });
            this.adsManager.on('error', () => {
                this.videoManager.executeEvent('metadata');
            });
        }
        this.videoManager.on(type, callback);
    }

    play() {
        if(this.adsManager && this.adsManager.active) {
            this.adsManager.play();
        }else {
            this.videoManager.play();
        }
    }

    pause(): void {
        if(this.adsManager && this.adsManager.active) {
            this.adsManager.pause();
        }else {
            this.videoManager.pause();
        }
    }

    setSeek(currentTime) {
        this.videoManager.setSeek(currentTime);
    }

    setVolume(vol) {
        this.videoManager.setVolume(vol);
    }

    getDuration() {
        if(this.adsManager && this.adsManager.active) {
            return this.adsManager.getDuration();
        }else{
            return this.videoManager.getDuration();
        }
    }

    getCurrentTime() {
        if(this.adsManager && this.adsManager.active) {
            return this.adsManager.getCurrentTime();
        }else{
            return this.videoManager.getCurrentTime();
        }
    }

    requestFullscreen(): void {
        this.videoManager.requestFullscreen();
    }

    exitFullscreen(): void {
        this.videoManager.exitFullscreen();
    }
}