import * as React from 'react';
import { connect } from 'react-redux';

import './index.scss';

//@ts-ignore
import IconPlay from './../../assets/play.svg';
//@ts-ignore
import IconPause from './../../assets/pause.svg';

import { PlayerType, VPlayerContext } from '../../VPlayerContext';
import { togglePlaying } from '../../actions/vplayer';
import { VideoManager } from '../../services/VideoManager';

interface Props {
    tooglePlaying: Function
    playing: boolean
    castPlaying: boolean
    castActive: boolean
    isActiveAds: boolean
}

class PlayPause extends React.Component<Props>{

    static contextType = VPlayerContext;
    
    videoMainManager:VideoManager;

    onPlay = () => {
        const { videoManager } = this.context as PlayerType;
        videoManager.play();
    }

    onPause = () => {
        const { videoManager } = this.context as PlayerType;
        videoManager.pause();
    }

    render() {
        return (
            <div>
                <button className="button--radius button--play" onClick={this.props.playing ? this.onPause : this.onPlay}>
                    {this.props.playing ? (
                        <div className="pause"><IconPause /></div>
                        ) : (
                        <div className="play"><IconPlay /></div>
                        )
                    }
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    playing: state.player.playing,
    castPlaying: state.player.castPlaying,
    castActive: state.player.castActive,
    isActiveAds: state.player.videoAds
});

const mapDispatchToProps = (dispatch) => ({
    tooglePlaying: (t) => {
        dispatch(togglePlaying(t));
    }
});

const PlayPauseHoc = connect(mapStateToProps, mapDispatchToProps)(PlayPause);

export { PlayPauseHoc as PlayPause };