import * as React from 'react';
import { connect } from 'react-redux';

import './index.scss';

import { PlayerType, VPlayerContext } from '../../VPlayerContext';
import { togglePlaying, currentTime, durationTime } from '../../actions/vplayer';
import { VideoManager } from '../../services/VideoManager';
import { PlayPause } from '../PlayPause';
import { ProgressBar } from '../ProgressBar';
import { Timer } from '../Timer';
import { Volume } from '../Volume';
import { Fullscreen } from '../Fullscreen';
import { ButtonSubtitle } from '../Subtitle/ButtonSubtitle';
import { VPlayerProps } from '../../../vplayer';
import { ShowSubtitle } from '../Subtitle/ShowSubtitle';
import { PlayerControl } from '../../services/PlayerControl';

interface Props extends VPlayerProps {
    setPlaying: Function
    setCurrentTime: Function
    setDurationTime: Function
    playUrl: string
    showCaption: boolean
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

    }

    render() {

        const provider = {
            videoManager: this.state.videoManager
        } as PlayerType;

        const { width, height } = this.props;

        return (
            <VPlayerContext.Provider value={provider}>
                <div className='player' style={{ width, height }}>
                    <video
                        ref={this._refVideo}
                        src={this.props.playUrl}
                        width={this.props.width}
                        height={this.props.height}
                    />

                    <div className='adContainer' />
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
                                {this.props.loadSrt && <ButtonSubtitle existSrt={true} />}
                                <Fullscreen />
                            </div>
                        </div>
                    </div>

                    {(this.props.loadSrt && this.props.showCaption) && <ShowSubtitle srt={this.props.loadSrt} />}
                </div>
            </VPlayerContext.Provider>
        )
    }
}

const mapStateToProps = (state) => ({
    showCaption: state.player.showCaption
});

const mapDispatchToProps = (dispatch) => ({
    setPlaying: (t) => {
        dispatch(togglePlaying(t));
    },
    setCurrentTime: (current) => {
        dispatch(currentTime(current));
    },
    setDurationTime: (duration) => {
        dispatch(durationTime(duration));
    },
});

const PlayerVideoHoc = connect(mapStateToProps, mapDispatchToProps)(PlayerVideo);

export { PlayerVideoHoc as PlayerVideo };