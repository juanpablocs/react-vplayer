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
            this.adsManager.on('endAds', (play) => {
                this.videoManager.executeEvent('metadata');
            });
            this.adsManager.on('error', () => {
                this.videoManager.executeEvent('metadata');
            });
            this.adsManager.on('linear', (isLinear: boolean)=>{
                if(!isLinear) {
                    this.videoManager.executeEvent('metadata');
                }
            })
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
        if(this.adsManager && this.adsManager.active) {
            this.adsManager.setVolume(vol);
        }else{
            this.videoManager.setVolume(vol);
        }
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
        if(this.adsManager) {
            this.adsManager.requestFullscreen();
        }
    }

    exitFullscreen(): void {
        this.videoManager.exitFullscreen();
        if(this.adsManager) {
            this.adsManager.exitFullscreen();
        }
    }

    changeSource(url, currentTime): void {
        this.videoManager.changeSource(url, currentTime);
    }
}