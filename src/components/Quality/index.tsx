import * as React from 'react';
import { connect } from 'react-redux';

import { videoSource } from '../../actions/vplayer';
import './index.scss';

interface Props {
    qualities: any[]
    setSource: Function
};

class Quality extends React.Component<Props, any> {

    state = {
        o:false
    }

    componentDidMount() {

    }

    toogleClick = () => {
        this.setState({o: !this.state.o});
    }

    createAlias(label) {
        const n  = Number(label);
        return n < 720 ? 'SD' : 'HD';
    }

    createCurrentAlias() {
        for (let i = 0; i < this.props.qualities.length; i++) {
            if(this.props.qualities[i].active) {
                return this.createAlias(this.props.qualities[i].quality);
            }
        }
    }

    changeQuality = (q) => {
        const qualities = this.props.qualities.map((quality)=>({...quality, active: quality.quality===q}));
        this.props.setSource(qualities);
        setTimeout(()=>this.toogleClick(), 100);
    }

    render() {
        return (
            <div className={`quality-control ${this.state.o && 'quality-control--open'} noads`}>
                <div className='quality-options'>
                    <div>
                        {this.props.qualities.sort((min,max)=>(max.quality - min.quality)).map((quality, k)=>(
                            <div key={k} className={`item-option ${quality.active && 'active'}`} onClick={()=>this.changeQuality(quality.quality)}>
                                {quality.quality}p
                                <span>{this.createAlias(quality.quality)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button className='button--radius button-quality' onClick={this.toogleClick}>
                    <div className='quality-open'>{this.createCurrentAlias()}</div>
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    qualities: state.player.videoSource
})

const mapDispatchToProps = (dispatch) => ({
    setSource: (qualities) => {
        dispatch(videoSource(qualities));
    }
});

const QualityHoc = connect(mapStateToProps, mapDispatchToProps)(Quality);

export { QualityHoc as Quality };