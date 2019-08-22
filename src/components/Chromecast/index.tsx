import * as React from 'react';
import { connect } from 'react-redux';

import './index.scss';
import { toggleCast } from './../../actions/vplayer';
//@ts-ignore
import { ReactComponent as IconCast} from './../../assets/chromecast.svg';

import { PlayerType, VPlayerContext } from '../../VPlayerContext';

interface Props {
    toggleCast: Function
    castActive: boolean
}

class Chromecast extends React.Component<Props>{

    isLocalCastActive:boolean = false;

    static contextType = VPlayerContext;

    componentDidMount() {
        this.isLocalCastActive = this.props.castActive;
    }

    componentDidUpdate(prevProps) {
        if(prevProps.castActive !== this.props.castActive) {
            this.isLocalCastActive = this.props.castActive;
        }
    }

    clickActiveCast = () => {
        this.props.toggleCast();
        this.isLocalCastActive = !this.isLocalCastActive;
        const { videoManager } = this.context as PlayerType;
        videoManager.popupCast((err)=>{
            if(err) {
                this.props.toggleCast();
            }
        });
    }

    render() {
        return (
            <div className='cast-control'>
                <button 
                    className={`button--radius button-cast ${this.props.castActive && 'active'}`} 
                    onClick={this.clickActiveCast}
                >
                    <IconCast />
                </button> 
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    castActive: state.player.castActive
});

const mapDispatchToProps = (dispatch) => ({
    toggleCast: () => {
        dispatch(toggleCast());
        // fire();
    }
});

const ChromecastHoc = connect(mapStateToProps, mapDispatchToProps)(Chromecast);

export { ChromecastHoc as Chromecast };