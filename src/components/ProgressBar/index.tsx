import * as React from 'react';
import { connect } from 'react-redux';

import { stop } from '../../actions/vplayer';
import { secondsToTime } from '../../utils';
import { PlayerType, VPlayerContext } from '../../VPlayerContext';

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
                if(v.active) {
                    videoManager.changeSource(v.url, this.props.currentTime);
                    return;
                }
            });
        }
    }

    bufferProgress = () => {
        const { video, durationTime: duration } = this.props;
        let buffered = 0;
        for (var i = 0; i < video.buffered.length; i++) {
            if (video.buffered.start(video.buffered.length - 1 - i) < video.currentTime) {
                buffered = video.buffered.end(video.buffered.length - 1 - i);
                this.buffered = buffered;
                // Stop checking for buffering if the video is fully buffered
                if ((video.buffered.end(video.buffered.length - 1 - i) / duration) == 1) {
                    clearInterval(this.bufferInterval);
                }

                break;
            }
        }

        if(buffered > 0) {
            this.setState({buffered});
        }
        this.counterBuffering++;

        if(this.props.playing === false && this.counterBuffering>=20) {
            clearInterval(this.bufferInterval);
            this.counterBuffering = 0;
        }
        console.log('buffer',buffered);
    }

    clickProgress = (e:React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const { width, left } = target.getBoundingClientRect();
        const percentage = (100 / width) * (e.pageX - left);
        const timer = this.props.durationTime * (percentage / 100);
        console.log(timer);
        const { videoManager } = this.context as PlayerType;

        if (this.props.castActive) {
            // videoCast.Controller.playOrPause();
        } else {
            videoManager.setSeek(timer);
        }
    }

    moveProgress = (e:React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const { width, left } = target.getBoundingClientRect();
        const percentage = (100 / width) * (e.pageX - left);
        if(width){
            const timer = this.props.durationTime * (percentage / 100);
            const timerElement = target.previousElementSibling as HTMLDivElement;
            timerElement.innerHTML = secondsToTime(timer);
            timerElement.style.left = `${(e.pageX - left - 10)}px`;
        }
    }
    enterHoverProgress = (e:React.MouseEvent<HTMLDivElement>) => {
        const timerElement = e.currentTarget.previousElementSibling as HTMLDivElement;
        timerElement.classList.add('hover-timer--active');
    }

    exitHoverProgress = (e:React.MouseEvent<HTMLDivElement>) => {
        const timerElement = e.currentTarget.previousElementSibling as HTMLDivElement;
        timerElement.classList.remove('hover-timer--active');
    }

    render() {
        const { durationTime, currentTime } = this.props;
        const progress = `${(currentTime / durationTime) * 100}%`;
        const buffer = `${(this.state.buffered / durationTime) * 100}%`;
        return (
            <div className="control-progress">
                <div className='hover-timer'>00:00</div>
                <div 
                    className="progress"
                    onMouseUp={this.clickProgress}
                    onMouseEnter={this.enterHoverProgress} 
                    onMouseMove={this.moveProgress} 
                    onMouseLeave={this.exitHoverProgress}
                >
                    <div
                        className="progress__bar"
                        style={{ width: progress }}
                    />
                    <div 
                        className="progress__buffer"
                        style={{ width: buffer }}
                    />
                    <div className="progress__pointer" />
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
    }
});

const ProgressBarHoc = connect(mapStateToProps, mapDispatchToProps)(ProgressBar);

export { ProgressBarHoc as ProgressBar };