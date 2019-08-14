import * as React from 'react';
import { connect } from 'react-redux';

//@ts-ignore
import { ReactComponent as IconVolumeUp } from './../../assets/volume-up.svg';
//@ts-ignore
import { ReactComponent as IconVolumeDown } from './../../assets/volume-down.svg';

import './index.scss';
import { setVolume } from '../../actions/vplayer';
import { VPlayerContext, PlayerType } from '../../VPlayerContext';
import Slider from './../Slider';

interface Props {
    volume: number
    setVolume: Function
};

class Volume extends React.Component<Props> {

    static contextType = VPlayerContext;

    volumeActive: boolean = true;
    volumeLocal: number = 0;

    private sanitizeVol(vol, max) {
        vol = vol > max ? max : vol;
        vol = vol < 0 ? 0 : vol;
        return vol;
    }

    private setVolumePlayer(progress):void {
        const { videoManager } = this.context as PlayerType;
        videoManager.setVolume(this.sanitizeVol(progress / 100, 1));
    }

    componentDidMount() {
        this.volumeLocal = this.props.volume;
    }

    onProgress = (progress) => {
        this.setVolumePlayer(progress);
    }

    clickProgress = (progress) => {

        this.setVolumePlayer(progress);
        this.props.setVolume(this.sanitizeVol(progress, 100));
        
        if (progress < 1) {
            this.volumeActive = false;
        } else {
            this.volumeActive = true;
            this.volumeLocal = progress;
        }
    }

    volumeActiveClick = () => {
        this.volumeActive = !this.volumeActive;
        const vol = this.volumeActive === false ? 0 : this.volumeLocal;
        this.props.setVolume(vol);
        this.setVolumePlayer(vol);
    }

    render() {
        return (
            <div className='volume-control'>
                <button className='button--radius' onClick={this.volumeActiveClick}>
                    {this.props.volume > 0 ? (
                        <IconVolumeUp />
                    ) : (
                            <IconVolumeDown />
                        )}
                </button>
                <div className='volume-area'>
                    <Slider
                        value={this.props.volume}
                        onProgress={this.onProgress}
                        onUp={this.clickProgress}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    volume: state.player.volume
})

const mapDispatchToProps = (dispatch) => ({
    setVolume: (vol) => {
        dispatch(setVolume(vol));
    }
});

const VolumeHoc = connect(mapStateToProps, mapDispatchToProps)(Volume);

export { VolumeHoc as Volume };