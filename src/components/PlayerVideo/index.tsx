import * as React from 'react';
import { connect } from 'react-redux';

import './index.scss';

import { PlayerType, VPlayerContext } from '../../VPlayerContext';
import { togglePlaying, currentTime, durationTime, videoSource, videoWaiting, toggleCast, toggleCastPlaying, castName, castConnect } from '../../actions/vplayer';
import { PlayPause } from '../PlayPause';
import { ProgressBar } from '../ProgressBar';
import { Timer } from '../Timer';
import { Volume } from '../Volume';
import { Fullscreen } from '../Fullscreen';
import { ButtonSubtitle } from '../Subtitle/ButtonSubtitle';
import { VPlayerProps } from '../../../vplayer';
import { ShowSubtitle } from '../Subtitle/ShowSubtitle';
import { PlayerControl } from '../../services/PlayerControl';
import { Quality } from '../Quality';
import { Loading } from '../Loading';
import { Chromecast } from '../Chromecast';
import { ShowCastDevice } from '../Chromecast/ShowCastDevice';

interface Props extends VPlayerProps {
    setPlaying: Function
    setCurrentTime: Function
    setDurationTime: Function
    setSource: Function
    setWaiting: Function
    setCast: Function
    setCastPlaying: Function
    setCastConnect: Function
    setCastName: Function
    castActive: boolean
    playUrl: string
    showCaption: boolean
    mediaSource: any
}

interface State {
    videoManager: any;
}
class PlayerVideo extends React.Component<Props, State>{

    state = { videoManager: {} };

    _refVideo: any = React.createRef();

    componentDidMount() {
        const playerControl = new PlayerControl(
            this._refVideo.current,
            this.props.loadAds
        );

        playerControl.on('playing', () => this.props.setPlaying(true));
        playerControl.on('pause', () => this.props.setPlaying(false));
        playerControl.on('timeupdate', () => this.props.setCurrentTime(playerControl.getCurrentTime()));
        playerControl.on('waiting', () => this.props.setWaiting());     
        playerControl.on('metadata', () => {
            this.props.setCurrentTime(0);
            this.props.setDurationTime(playerControl.getDuration())
        });
        playerControl.on('ready', () => {
            this.setState({ videoManager: playerControl });
        });
        playerControl.on('error', () => {
            console.log('errror!!!!!');
        });

        playerControl.on('castPlaying', () => {
            this.props.setCastPlaying(true);
        });

        playerControl.on('castConnect', ({connect, name}) => {
            console.log('castConnect', connect);
            this.props.setCast(connect);
            this.props.setCastConnect(connect);
            this.props.setCastName(name);
            if(connect) {
                playerControl.videoManager.pause();
            }else{
                this.props.setCastPlaying(false);
            }
            
        });

        

        let counterActive = 0;
        for(let i=0; i<this.props.mediaSource.length; i++) {
            if(typeof this.props.mediaSource[i].active === 'boolean') {
                counterActive++;
            }
        }
        if(counterActive===0) {
            for(let i=0; i<this.props.mediaSource.length; i++) {
                if(this.props.mediaSource[i].quality === this.props.qualityDefault) {
                    this.props.mediaSource[i].active = true;
                }
            }
        }

        this.props.setSource(this.props.mediaSource);
    }

    render() {

        const provider = {
            videoManager: this.state.videoManager
        } as PlayerType;

        const { width, height } = this.props;

        return (
            <VPlayerContext.Provider value={provider}>
                <div className='vplayer' style={{ maxWidth:width, maxHeight:height }}>
                    <video
                        ref={this._refVideo}
                        src={this.props.playUrl}
                    />

                    <div className='adContainer' />
                    <Loading />
                    <PlayPause full />

                    <div className='controls'>
                        <ProgressBar />
                        <div className='area-control'>
                            <div className='primary-control'>
                                <PlayPause />
                                <Volume />
                                <Timer />
                            </div>
                            <div className="secondary-control">
                                <Chromecast />
                                {this.props.loadSrt && <ButtonSubtitle existSrt={true} />}
                                {this.props.mediaSource.length > 0 && <Quality />}
                                <Fullscreen />
                            </div>
                        </div>
                    </div>

                    <ShowSubtitle 
                        refVideo={this._refVideo}
                        show={this.props.loadSrt && this.props.showCaption} 
                        srt={this.props.loadSrt} 
                    />

                    <ShowCastDevice />
                    
                </div>
            </VPlayerContext.Provider>
        )
    }
}

const mapStateToProps = (state) => ({
    showCaption: state.player.showCaption,
    castActive: state.player.castActive
});

const mapDispatchToProps = (dispatch) => ({
    setPlaying: (t) => {
        dispatch(togglePlaying(t));
    },
    setSource: (data) => {
        dispatch(videoSource(data));
    },
    setCurrentTime: (current) => {
        dispatch(currentTime(current));
    },
    setDurationTime: (duration) => {
        dispatch(durationTime(duration));
    },
    setWaiting: () => {
        dispatch(videoWaiting())
    },
    setCast: (d) => {
        dispatch(toggleCast(d));
    },
    setCastPlaying: (d) => {
        dispatch(toggleCastPlaying(d));
    },
    setCastConnect: (d) => {
        dispatch(castConnect(d));
    },
    setCastName: (d) => {
        dispatch(castName(d));
    }
});

const PlayerVideoHoc = connect(mapStateToProps, mapDispatchToProps)(PlayerVideo);

export { PlayerVideoHoc as PlayerVideo };