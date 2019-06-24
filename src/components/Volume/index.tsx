import * as React from 'react';
import { connect } from 'react-redux';

//@ts-ignore
import IconVolumeUp from './../../assets/volume-up.svg';
//@ts-ignore
import IconVolumeDown from './../../assets/volume-down.svg';

import './index.scss';
import { toogleVolume } from '../../actions/vplayer';
import { VPlayerContext, PlayerType } from '../../VPlayerContext';

interface Props {
    volumeOn: boolean
    toogleVolume: Function,
    isCastActive: boolean,
    isAdsActive: boolean
};

class Volume extends React.Component<Props> {

    static contextType = VPlayerContext;
    
    componentDidUpdate(prevProps) {
        if(prevProps.volumeOn !== this.props.volumeOn) {
            const vol = this.props.volumeOn ? 1 : 0;
            const { videoManager } = this.context as PlayerType;
            if(this.props.isAdsActive) {
                // videoAds.setVolume(vol);
            }else {
                videoManager.setVolume(vol);
            }
        }
    }

    render() {
        return (
            <div className='volume-control'>
                <button className='button--radius' onClick={()=>this.props.toogleVolume()}>
                    {this.props.volumeOn ? (
                        <IconVolumeUp />
                    ) : (
                        <IconVolumeDown />
                    )}
                </button>
                <div className='volume-area'>
                    <div 
                        className='volume-drag' 
                        style={{width: this.props.volumeOn ? '30%' : '0%'}}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    volumeOn: state.player.toogleVolume,
    isCastActive: state.player.castActive,
    isAdsActive: state.player.videoAds
})

const mapDispatchToProps = (dispatch) => ({
    toogleVolume: () => {
        dispatch(toogleVolume());
    }
});

const VolumeHoc = connect(mapStateToProps, mapDispatchToProps)(Volume);

export { VolumeHoc as Volume };