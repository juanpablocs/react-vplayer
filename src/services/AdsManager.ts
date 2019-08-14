import { ManagerInterface } from "./ManagerInterface";
import { getScript } from '../utils';

declare global {
    interface Window {
        google: {
            ima: any;
        };
    }
}
interface AdElement { 
    videoContainer: HTMLVideoElement; 
    adContainer: HTMLDivElement;
};

export class AdsManager implements ManagerInterface {

    protected scriptSDK = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';

    protected events = [];
    protected creativeUrl;

    public active:boolean = false;

    protected adTrackingTimer: any;

    private heightControl:number = 50;

    public domElement: AdElement = {
        videoContainer: null,
        adContainer: null
    };
    adsManager: any;
    currentAd: any;
    hideControl: boolean;

    constructor(video:HTMLVideoElement) {
        this.domElement = {
            videoContainer:video, 
            adContainer: video.parentElement.querySelector('.adContainer') as HTMLDivElement
        };
    }

    setCreativeUrl(url) {
        this.creativeUrl = url;
        // this.creativeUrl = 'http://googleads.g.doubleclick.net/pagead/ads?ad_type=skippablevideo&client=ca-video-pub-4968145218643279&videoad_start_delay=0&description_url=http%3A%2F%2Fwww.google.com&hl=en&max_ad_duration=60000&adtest=on';
    }

    async loadScriptSDK() {
        try{
            await getScript(this.scriptSDK);
            this.initializeAds();
        }catch(e) {
            console.log('err', e);
            this.executeEvent('error')
        }
    }

    initializeAds() {
        const adDisplayContainer = new window.google.ima.AdDisplayContainer(
            this.domElement.adContainer,
            this.domElement.videoContainer
        );
        const adsLoader = new window.google.ima.AdsLoader(adDisplayContainer);

        adsLoader.getSettings().setVpaidMode(
            window.google.ima.ImaSdkSettings.VpaidMode.ENABLED
        );
        adsLoader.getSettings().setLocale('es');
        adsLoader.getSettings().setNumRedirects(10);
        // Listen and respond to ads loaded and error events.
        adsLoader.addEventListener(
            window.google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            this.prepareAdsManager.bind(this),
            false);

        adsLoader.addEventListener(
            window.google.ima.AdErrorEvent.Type.AD_ERROR,
            ()=>{
                this.active = false;
                this.executeEvent('error');
            },
            false);
        
        const adsRequest = new window.google.ima.AdsRequest();
        adsRequest.adTagUrl = this.creativeUrl;
        adsRequest.setAdWillAutoPlay(true);

        adsLoader.requestAds(adsRequest);

        adDisplayContainer.initialize();
    }

    executeEvent(k, arg=null) {
        if(typeof this.events[k] === 'function') {
            this.events[k](arg);
        }
    }

    on(type, callback) {
        this.events[type] = callback;
    }

    private prepareAdsManager = (e) => {
        console.log('prepareads');
        const googleIma = window.google.ima;
        const { ALL_ADS_COMPLETED, COMPLETE, LOADED, STARTED, PAUSED, RESUMED, LOG } = googleIma.AdEvent.Type;
        const { AD_ERROR } = googleIma.AdErrorEvent.Type;

        const { eventStart, eventError, eventEnd, eventEndAll, eventPlaying, eventPause, eventLoad } = this.manageEvents();

        const adsRenderingSettings = new googleIma.AdsRenderingSettings();
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        adsRenderingSettings.bitrate = 1000;

        // videoContent should be set to the content video element.
        this.adsManager = e.getAdsManager(this.domElement.videoContainer, adsRenderingSettings);

        this.adsManager.addEventListener(STARTED, eventStart);
        this.adsManager.addEventListener(AD_ERROR, eventError);
        this.adsManager.addEventListener(RESUMED, eventPlaying);
        this.adsManager.addEventListener(PAUSED, eventPause);
        this.adsManager.addEventListener(ALL_ADS_COMPLETED, eventEndAll);
        this.adsManager.addEventListener(COMPLETE, eventEnd);
        this.adsManager.addEventListener(LOG, (l)=>console.log('log', l));
        this.adsManager.addEventListener(LOADED, eventLoad);

        try {
            // Initialize the ads manager. Ad rules playlist will start at this time.
            this.adsManager.init(
                this.domElement.videoContainer.offsetWidth, 
                this.domElement.videoContainer.offsetHeight - this.heightControl, 
                window.google.ima.ViewMode.NORMAL
            );
            // Call play to start showing the ad. Single video and overlay ads will
            // start at this time; the call will be ignored for ad rules.
            this.adsManager.start();
        } catch (adError) {
            // An error may be thrown if there was a problem with the VAST response.
            console.log('adError', adError);
        }
        this.executeEvent('ready');
    }

    manageEvents() {
        return {
            eventError: () => {
                this.active = false;
                this.executeEvent('error');
            },
            eventPlaying: () => {
                this.executeEvent('playing');
                if(!this.adTrackingTimer) {
                    this.adTrackingTimer = setInterval(()=>this.executeEvent('timeupdate'), 500);
                }
            },
            eventPause: () => {
                this.executeEvent('pause');
                clearInterval(this.adTrackingTimer);
                this.adTrackingTimer = null;
            },
            eventStart: (e) => {
                console.log('start', e);
                if(!this.hideControl) {                  
                    if(this.currentAd.isLinear()) {
                        this.domElement.videoContainer.pause();
                        this.executeEvent('playing');
                        this.executeEvent('metadata');
                        this.adTrackingTimer = setInterval(()=>this.executeEvent('timeupdate'), 500);
                    }
                    this.executeEvent('linear', this.currentAd.isLinear());
                }
            },
            eventLoad: (e) => {
                this.currentAd = e.getAd();
                let clickThroughUrl: string;
                for(let prop in this.currentAd) {
                    clickThroughUrl = this.currentAd[prop].clickThroughUrl;
                    if (clickThroughUrl !== undefined && clickThroughUrl !== null) {
                        break;
                    }
                }
                this.hideControl = clickThroughUrl.length === 0;
                if (this.hideControl) {
                    this.domElement.adContainer.parentElement.setAttribute('hidecontrol', '1');
                    this.adsManager.resize(
                        this.domElement.videoContainer.offsetWidth,
                        this.domElement.videoContainer.offsetHeight,
                        window.google.ima.ViewMode.NORMAL
                    );
                }
                if(this.currentAd.isLinear()) {
                    this.active = true;
                    this.domElement.adContainer.parentElement.setAttribute('ads', 'linear');
                }else {
                    this.domElement.adContainer.parentElement.setAttribute('ads', 'nolinear');
                }
            },
            eventEnd: () => {
                console.log('ended');
                this.active = false;
                this.domElement.adContainer.parentElement.removeAttribute('ads');
                this.domElement.adContainer.parentElement.removeAttribute('hidecontrol');
                clearInterval(this.adTrackingTimer);
                this.adTrackingTimer = null;
                const ta = this.currentAd.getAdPodInfo().getTotalAds();
                
                this.executeEvent('endAds', ta===1);
                this.domElement.videoContainer.play();
            },
            eventEndAll: () => {
                console.log('endall');
                this.active = false;
                clearInterval(this.adTrackingTimer);
                this.adTrackingTimer = null;
                setTimeout(() => {
                    this.executeEvent('endAds');
                    this.domElement.videoContainer.play();
                    this.domElement.adContainer.parentElement.removeAttribute('ads');
                    this.domElement.adContainer.parentElement.removeAttribute('hidecontrol');
                }, 500);
            }
        }
    }

    setVolume(vol) {
        //sanitize number / 100 result 0 - 1 (0.2, 0.5, 1);
        if(this.adsManager) {
            this.adsManager.setVolume(Number(vol.toFixed(1)));
        }
    }

    play(): void {
        if(this.adsManager) {
            this.adsManager.resume();
        }
    }    

    pause(): void {
        if(this.adsManager) {
            this.adsManager.pause();
        }
    }

    changeSource(url: string, currentTime: number): void {
        throw new Error("Method not implemented.");
    }

    setSeek(currentTime: string): void {
        throw new Error("Method not implemented.");
    }

    getDuration():number {
        if(this.currentAd) {
            return this.currentAd.getDuration();
        }
        return 0;
    }

    getCurrentTime():number {
        if(this.currentAd) {
            const remainingTime = this.adsManager.getRemainingTime();
            const duration = this.currentAd.getDuration();
            return duration - remainingTime;
        }
        return 0;
    }

    requestFullscreen(): void {
        this.adsManager.resize(
            document.body.offsetWidth, 
            window.screen.height - this.heightControl,
            window.google.ima.ViewMode.FULLSCREEN
        );
    }

    exitFullscreen(): void {
        setTimeout(()=>{
            this.adsManager.resize(
                this.domElement.videoContainer.offsetWidth, 
                this.domElement.videoContainer.offsetHeight - this.heightControl,
                window.google.ima.ViewMode.NORMAL
            );
        }, 100);
    }
}