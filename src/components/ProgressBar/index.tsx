import * as React from 'react';
import { connect } from 'react-redux';

import { stop, currentTime } from '../../actions/vplayer';
import { secondsToTime } from '../../utils';
import { PlayerType, VPlayerContext } from '../../VPlayerContext';
import Slider from './../Slider';

import './index.scss';

interface Props {
    currentTime: number
    durationTime: number
    videoBackground: {stop:boolean, currentTime:number, durationTime:number}
    setVideoBackground: Function
    playing: boolean
    castActive: boolean
    isActiveAds: boolean
    videoSource: any
    setCurrentTime: Function
}

interface State {
    buffered: number;
}

class ProgressBar extends React.Component<Props, State> {
    
    static contextType = VPlayerContext;

    state = {
        buffered: 0
    };

    bufferInterval;
    buffered = 0;
    counterBuffering = 0;
    
    percentage:number = 0;

    

    componentDidUpdate(prevProps) {
        if ((prevProps.playing !== this.props.playing) && (this.props.playing===true && this.props.videoBackground.stop===false)) {
            console.log('playing only video. initialize buffer');
            if(!this.props.isActiveAds) {
                // this.bufferInterval = setInterval(this.bufferProgress, 500);
            }
            
        }else if(prevProps.videoBackground.stop ===false && this.props.videoBackground.stop===true) {
            console.log('entraaa');
            this.props.setVideoBackground({stop:true, currentTime: this.props.currentTime, durationTime:this.props.durationTime});
            // setTimeout(()=>clearInterval(this.bufferInterval), 500);
        
        }else if ((prevProps.playing !== this.props.playing) && (this.props.playing===false)) {
            this.counterBuffering = 0;
        }
        if((prevProps.castActive !== this.props.castActive) && this.props.castActive === true){
            this.counterBuffering = 0;
            this.setState({buffered: 0});
        }

        if(JSON.stringify(prevProps.videoSource) !== JSON.stringify(this.props.videoSource)){
            const { videoManager } = this.context as PlayerType;
            
            this.props.videoSource.forEach(v => {
                if(videoManager.changeSource && v.active) {
                    console.log('active q', videoManager);
                    videoManager.changeSource(v.url, this.props.currentTime);
                    return;
                }
            });
        }
    }

    bufferProgress = () => {
        // const { video, durationTime: duration } = this.props;
        // let buffered = 0;
        // for (var i = 0; i < video.buffered.length; i++) {
        //     if (video.buffered.start(video.buffered.length - 1 - i) < video.currentTime) {
        //         buffered = video.buffered.end(video.buffered.length - 1 - i);
        //         this.buffered = buffered;
        //         // Stop checking for buffering if the video is fully buffered
        //         if ((video.buffered.end(video.buffered.length - 1 - i) / duration) == 1) {
        //             clearInterval(this.bufferInterval);
        //         }

        //         break;
        //     }
        // }

        // if(buffered > 0) {
        //     this.setState({buffered});
        // }
        // this.counterBuffering++;

        // if(this.props.playing === false && this.counterBuffering>=20) {
        //     clearInterval(this.bufferInterval);
        //     this.counterBuffering = 0;
        // }
        // console.log('buffer',buffered);
    }

    clickProgress = (percentage) => {
        console.log(percentage);
        const timer = this.props.durationTime * (percentage / 100);
        this.props.setCurrentTime(timer);

        const { videoManager } = this.context as PlayerType;

        if (this.props.castActive) {
            // videoCast.Controller.playOrPause();
        } else {
            videoManager.setSeek(timer);
        }
    }


    onProgress = (percentage:number) => {
        this.percentage = percentage;
        const { videoManager } = this.context as PlayerType;
        videoManager.pause();
    }

    render() {
        const { durationTime, currentTime } = this.props;
        const progress = (currentTime / durationTime) * 100;
        const buffer = `${(this.state.buffered / durationTime) * 100}%`;
        return (
            <div className="control-progress">
                <div className="control-slider">
                    <Slider
                        timerDuration={this.props.durationTime}
                        value={progress}
                        onProgress={this.onProgress}
                        onUp={this.clickProgress}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentTime: state.player.currentTime,
    durationTime: state.player.durationTime,
    videoBackground: state.player.videoBackground,
    playing: state.player.playing,
    castActive: state.player.castActive,
    isActiveAds: state.player.videoAds,
    videoSource: state.player.videoSource
});

const mapDispatchToProps = (dispatch) => ({
    setVideoBackground: (obj) => {
        dispatch(stop(obj));
    },
    setCurrentTime: (current) => {
        dispatch(currentTime(current));
    },
});

const ProgressBarHoc = connect(mapStateToProps, mapDispatchToProps)(ProgressBar);

export { ProgressBarHoc as ProgressBar };