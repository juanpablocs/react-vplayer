import { ManagerInterface } from "./ManagerInterface";
import { getScript } from '../utils';

declare global {
    interface Window {
        cast: any;
        chrome: any;
      }
}

export class CastManager implements ManagerInterface {

    protected scriptSDK = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';

    protected events = [];

    public active: boolean = false;

    protected isConnect: boolean = false;
    
    protected statePlayerCast;

    Player: any;
    Controller: any;

    protected video:any;

    constructor(video) {
        this.video = video;
        (async ()=>{
            try{
                await getScript(this.scriptSDK);
                setTimeout(()=>{
                    this.initializeCast();
                }, 100);
            }catch(e) {
                console.log('err', e);
                this.executeEvent('error')
            }
        })();
    }

    initializeCast() {
        window['__onGCastApiAvailable'] = (available) => {
            console.log('in __onGCastApiAvailable, loaded:', available);
            if(available) {
                this.initializeCastAvailable();
            }
        };
    }

    initializeCastAvailable() {
        const castContext = window.cast.framework.CastContext.getInstance();

        castContext.setOptions({
            receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            autoJoinPolicy: 'tab_and_origin_scoped'
        });

        castContext.addEventListener('sessionstatechanged', (e) => {
            switch(e.sessionState) {
                case window.cast.framework.SessionState.SESSION_STARTING:
                    console.log('SESSION_STARTING');
                    break
                case window.cast.framework.SessionState.SESSION_ENDED:
                    console.log('SESSION_ENDED');
                    break
                case window.cast.framework.SessionState.SESSION_STARTED:
                    console.log('SESSION_STARTED');
                    break
                case window.cast.framework.SessionState.SESSION_RESUMED:
                    console.log('SESSION_RESUMED');
                    break
                case window.cast.framework.SessionState.SESSION_START_FAILED:
                    console.log('SESSION_START_FAILED');
                    break

            }
        });

        this.Player = new window.cast.framework.RemotePlayer();
        this.Controller = new window.cast.framework.RemotePlayerController(this.Player);

        this.Controller.addEventListener('isConnectedChanged', () => {
            const domPlayer = this.video.parentElement;
            if(this.Player.isConnected) {
                domPlayer.setAttribute('cast', 'active');
            }else{
                domPlayer.removeAttribute('cast');
            }
            this.executeEvent('castConnect', {connect:this.Player.isConnected, name: this.getDeviceName()});
            this.isConnect = this.Player.isConnected;
            this.active = this.isConnect;
        });

        this.Controller.addEventListener('playerStateChanged', (e) => {
            console.log('pls', e);
            if (this.Player.playerState) {
                this.statePlayerCast = this.Player.playerState
            } else {
                this.statePlayerCast = 'DISCONNECTED'
            }
            console.log('PLAYER', this.statePlayerCast);
            switch(this.statePlayerCast) {
                case 'PLAYING':
                    this.executeEvent('playing');
                    this.executeEvent('castPlaying');
                break;
                case 'PAUSED':
                    this.executeEvent('pause');
                break;
            }

            console.log('playerStateCast', this.statePlayerCast);
        });

        this.Controller.addEventListener('currentTimeChanged', () => {
            console.log(this.Player.duration, this.Player.currentTime);
            if(this.Player.isConnected) {
                this.executeEvent('timeupdate');
            }
        });
    }

    on(type, callback) {
        this.events[type] = callback;
    }

    executeEvent(k, arg=null) {
        if(typeof this.events[k] === 'function') {
            this.events[k](arg);
        }
    }

    async play() {
        if(!this.statePlayerCast || this.statePlayerCast === 'DISCONNECTED' || this.statePlayerCast === 'IDLE') {
            this.executeEvent('waiting');
            await this.loadMediaCast(this.video.src);
        }
        console.log('playing');
        if(this.statePlayerCast === 'PAUSED') {
            this.Controller.playOrPause();
        }
    }    
    
    pause(): void {
        this.Controller.playOrPause();
    }

    changeSource(url: string, currentTime: number): void {
        throw new Error("Method not implemented.");
    }

    setSeek(currentTime: string): void {
        this.Player.currentTime = currentTime;
        this.Controller.seek()
    }

    setVolume(vol) {
        //sanitize number / 100 result 0 - 1 (0.2, 0.5, 1);
        this.Player.volumeLevel = Number(vol.toFixed(1));
        this.Controller.setVolumeLevel();
    }

    getDuration():number {
        if(this.Player) {
            return this.Player.duration
        }
        return 0;
    }

    getCurrentTime():number {
        if(this.Player) {
            return this.Player.currentTime;
        }
        return 0;
    }

    async openCastPopUpConnect(cb) {
        try{
            await window.cast.framework.CastContext.getInstance().requestSession();
        }catch(e) {
            cb(e);
        }
    }

    getDeviceName() {
        if(this.Player.isConnected) {
            const session = window.cast.framework.CastContext.getInstance().getCurrentSession();
            return session.getCastDevice().friendlyName;
        }
        return null;
    }

    async loadMediaCast(media) {
        const session = window.cast.framework.CastContext.getInstance().getCurrentSession();
        const mediaInfo = new window.chrome.cast.media.MediaInfo(media);
        var request = new window.chrome.cast.media.LoadRequest(mediaInfo);

        return session.loadMedia(request);
    }
}