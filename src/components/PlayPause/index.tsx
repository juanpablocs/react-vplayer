import * as React from 'react';
import { connect } from 'react-redux';

import './index.scss';

//@ts-ignore
import { ReactComponent as IconPlay } from './../../assets/play.svg';
//@ts-ignore
import { ReactComponent as IconPause } from './../../assets/pause.svg';

import { PlayerType, VPlayerContext } from '../../VPlayerContext';
import { togglePlaying } from '../../actions/vplayer';
import { VideoManager } from '../../services/VideoManager';

interface Props {
    tooglePlaying: Function
    playing: boolean
    castPlaying: boolean
    castActive: boolean
    isActiveAds: boolean
    full?: boolean
}
interface State {
    buttonFullHide: boolean;
}
class PlayPause extends React.Component<Props, State>{

    static contextType = VPlayerContext;

    state = {
        buttonFullHide: true
    }

    videoMainManager: VideoManager;

    onPlay = () => {
        const { videoManager } = this.context as PlayerType;
        videoManager.play();
    }

    onPause = () => {
        const { videoManager } = this.context as PlayerType;
        videoManager.pause();
    }

    onAnimationEnd = () => {
        this.setState({ buttonFullHide: true });
    }

    onClickManager = () => {
        if (this.props.playing) {
            this.onPause();
        } else {
            this.onPlay();
        }
        setTimeout(() => {
            this.setState({ buttonFullHide: false });
        }, 100);
    }

    render() {
        const ButtonPlayPause = () => this.props.playing ? (
                <div className="pause"><IconPause /></div>
            ) : (
                <div className="play"><IconPlay /></div>
        );

        return (
            <div className={this.props.full ? 'full-play-pause' : ''} onClick={this.onClickManager}>
                {this.props.full ? (
                    <div
                        className={`button-status ${this.state.buttonFullHide ? 'hide' : ''}`}
                        onAnimationEnd={this.onAnimationEnd}
                    >
                        <ButtonPlayPause />
                    </div>
                ) : (
                        <button className="button--radius button--play">
                            <ButtonPlayPause />
                        </button>
                    )}

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