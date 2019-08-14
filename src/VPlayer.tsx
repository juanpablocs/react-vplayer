import * as React from 'react';
import * as PropTypes from 'prop-types';
import store from './store';
import { VPlayerProps } from './../vplayer';
import { Provider } from 'react-redux';
import { PlayerVideo } from './components/PlayerVideo';

export default class VPlayer extends React.Component<VPlayerProps> {

    static propTypes = {
        source: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.shape({
                url: PropTypes.string,
                type: PropTypes.string,
                quality: PropTypes.number
            }))
        ]).isRequired,
        qualityDefault: PropTypes.number
    };

    static defaultProps = {
        width: '720px',
        height: '405px',
        qualityDefault: 360
    };

    private createMediaSource(): string {
        if (Array.isArray(this.props.source)) {
            for (let i = 0; i < this.props.source.length; i++) {
                if (this.props.source[i].quality === this.props.qualityDefault) {
                    return this.props.source[i].url;
                }
            }
            return '';
        }
        return this.props.source;
    }

    private createArraySource(): any[] {
        if(Array.isArray(this.props.source)) {
            return this.props.source;
        }
        return [];
    }

    render() {
        return (
            <Provider store={store}>
                <PlayerVideo
                    playUrl={this.createMediaSource()}
                    mediaSource={this.createArraySource()}
                    {...this.props}
                />
            </Provider>
        );
    }
}