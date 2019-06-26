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
        ]).isRequired
    };

    static defaultProps = {
        width: '720px',
        height: '405px'
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

    render() {

        return (
            <Provider store={store}>
                <PlayerVideo 
                    playUrl={this.createMediaSource()} 
                    {...this.props}
                />
            </Provider>
        );
    }
}