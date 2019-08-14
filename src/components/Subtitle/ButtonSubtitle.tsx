import * as React from 'react';
import { connect } from 'react-redux';
import { toggleCaption } from '../../actions/vplayer';

//@ts-ignore
import {ReactComponent as IconSubtitle} from './../../assets/subtitle.svg';

import './index.scss';

interface Props {
    toggleCaption: Function;
    showCaption: boolean;
    existSrt: boolean
};

class ButtonSubtitle extends React.Component<Props> {
    
    componentDidMount() {
        if(this.props.existSrt) {
            this.props.toggleCaption(true);
        }
    }

    render() {
        return (
            <div 
                title='Subtitulos'
                className={`button-caption ${this.props.showCaption && 'enabled'} noads`} 
            >
                <button className='button--radius' onClick={()=>this.props.toggleCaption()}>
                    <IconSubtitle />
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    showCaption: state.player.showCaption
})

const mapDispatchToProps = (dispatch) => ({
    toggleCaption: (bool) => {
        dispatch(toggleCaption(bool))
    }
});

const ButtonSubtitleHoc = connect(mapStateToProps, mapDispatchToProps)(ButtonSubtitle);

export { ButtonSubtitleHoc as ButtonSubtitle };