import { VideoManager } from "./VideoManager";
import { AdsManager } from "./AdsManager";
import { CastManager } from "./CastManager";

export class PlayerControl {

    protected events = [];

    videoManager: VideoManager;
    adsManager: AdsManager;
    castManager: CastManager;

    constructor(video:HTMLVideoElement, loadAds:string) {
        this.videoManager = new VideoManager(video);
        if(loadAds) {
            this.adsManager = new AdsManager(video);
            this.adsManager.setCreativeUrl(loadAds);
            
            this.adsManager.loadScriptSDK();
        }
        this.castManager = new CastManager(video);
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
        this.castManager.on(type, callback);
    }

    play() {
        if(this.adsManager && this.adsManager.active) {
            this.adsManager.play();
        }else if(this.castManager && this.castManager.active) {
            this.castManager.play();
        }else {
            this.videoManager.play();
        }
    }

    pause(): void {
        if(this.adsManager && this.adsManager.active) {
            this.adsManager.pause();
        }else if(this.castManager && this.castManager.active) {
            this.castManager.pause();
        }else {
            this.videoManager.pause();
        }
    }

    setSeek(currentTime) {
        if(this.castManager && this.castManager.active) {
            this.castManager.setSeek(currentTime);
        }else{
            this.videoManager.setSeek(currentTime);
        }
    }

    setVolume(vol) {
        if(this.adsManager && this.adsManager.active) {
            this.adsManager.setVolume(vol);
        }else if(this.castManager && this.castManager.active) {
            this.castManager.setVolume(vol);
        }else{
            this.videoManager.setVolume(vol);
        }
    }

    getDuration() {
        if(this.adsManager && this.adsManager.active) {
            return this.adsManager.getDuration();
        }else if(this.castManager && this.castManager.active) {
            return this.castManager.getDuration();
        }else{
            return this.videoManager.getDuration();
        }
    }

    getCurrentTime() {
        if(this.adsManager && this.adsManager.active) {
            return this.adsManager.getCurrentTime();
        }else if(this.castManager && this.castManager.active) {
            return this.castManager.getCurrentTime();
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

    popupCast(cb) {
        if(this.castManager instanceof CastManager) {
            this.castManager.openCastPopUpConnect(cb);
        }
    }
}