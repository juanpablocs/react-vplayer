import * as React from 'react';
import * as PropTypes from 'prop-types';
import { SourceProps } from './VPlayerInterface';
import { VideoManager } from './services/VideoManager';

interface Props {
    source: string|SourceProps[]
    width: string
    height: string
};

export default class VPlayer extends React.Component<Props> {

    protected _refVideo:any = React.createRef();
    protected videoManager:VideoManager;

    static propTypes = {
        source: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.shape({
                url: PropTypes.string,
                type: PropTypes.string,
                quality: PropTypes.number
            }))
        ]).isRequired
    };

    static defaultProps = {
        width: '720px',
        height: '385px'
    };

    private createMediaSource():string {
        if(Array.isArray(this.props.source)) {
            for (let i = 0; i < this.props.source.length; i++) {
                if(this.props.source[i].quality===360){
                    return this.props.source[i].url;
                }
            }
            return '';
        }
        return this.props.source;
    }

    componentDidMount() {
        this.videoManager = new VideoManager(this._refVideo.current);
    }

    clickPlay = () => {
        this.videoManager.play();
    }

    clickPause = () => {
        this.videoManager.pause();
    }

    render() {
        return (
            <div>
                <video 
                    ref={this._refVideo} 
                    src={this.createMediaSource()}
                    width={this.props.width}
                    height={this.props.height}
                />
                <button onClick={this.clickPlay}>Play</button>
                <button onClick={this.clickPause}>Pause</button>
            </div>
        );
    }
}