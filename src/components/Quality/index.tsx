import * as React from 'react';
import { connect } from 'react-redux';

import { videoSource } from '../../actions/vplayer';
import './index.scss';
import { closestNode } from '../../utils';

interface Props {
    qualities: any[]
    setSource: Function
};

class Quality extends React.Component<Props, any> {

    state = {
        o:false
    }
    
    refQuality:any = React.createRef();
    isOutClicked:boolean = true;

    componentDidMount() {
        document.addEventListener('click', (e) => {
            const divOptions = this.refQuality.current as HTMLDivElement;
            const target = e.target as HTMLDivElement;
            if (this.isOutClicked && !closestNode(target, divOptions) && this.state.o) {
                this.setState({o:false});
            }
            this.isOutClicked = true;
         });
    }

    toogleClick = (e) => {
        e.stopPropagation();
        this.isOutClicked = false;
        setTimeout(()=>{
            this.setState({o: !this.state.o});
        }, 100)
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
        setTimeout(()=>this.setState({o:false}), 1000);
    }

    render() {
        return (
            <div className={`quality-control ${this.state.o && 'quality-control--open'} noads`}>
                <div ref={this.refQuality} className='quality-options'>
                    <div>
                        {this.props.qualities.sort((min,max)=>(max.quality - min.quality)).map((quality, k)=>(
                            <div key={k} className={`item-option ${quality.active && 'active'}`} onClick={()=>this.changeQuality(quality.quality)}>
                                {quality.quality}p
                                <span>{this.createAlias(quality.quality)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <button id='vplayer-btn-quality' className='button--radius button-quality' onClick={this.toogleClick}>
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