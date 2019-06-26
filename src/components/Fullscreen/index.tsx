import * as React from 'react';
import { connect } from 'react-redux';

//@ts-ignore
import {ReactComponent as IconFullscreen} from './../../assets/fullscreen.svg';
//@ts-ignore
import {ReactComponent as IconDownscreen} from './../../assets/downscreen.svg';

import './index.scss';
import { toogleFullscreen } from './../../actions/vplayer';
import { VPlayerContext, PlayerType } from './../../VPlayerContext';

interface Props {
    isFullscreen: boolean
    toogleFullscreen: Function
};

class Fullscreen extends React.Component<Props> {

    static contextType = VPlayerContext;

    onClickFullscreen = () => {
        const { videoManager } = this.context as PlayerType;
        videoManager.requestFullscreen();
    }

    onClickExitscreen = () => {
        const { videoManager } = this.context as PlayerType;
        videoManager.exitFullscreen();
    }

    componentDidMount() {
        document.addEventListener('fullscreenchange', ()=>{
            console.log('change fullscreen');
            this.props.toogleFullscreen();
        })
    }

    render() {
        return (
            <div className='fullscreen-control'>
                <button className='button--radius' onClick={this.props.isFullscreen ? this.onClickExitscreen : this.onClickFullscreen}>
                    {this.props.isFullscreen ? (
                        <IconDownscreen />
                    ) : (
                        <IconFullscreen />
                    )}
                </button>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isFullscreen: state.player.toogleFullscreen
})

const mapDispatchToProps = (dispatch) => ({
    toogleFullscreen: () => {
        dispatch(toogleFullscreen());
    }
});

const FullscreenHoc = connect(mapStateToProps, mapDispatchToProps)(Fullscreen);

export { FullscreenHoc as Fullscreen };