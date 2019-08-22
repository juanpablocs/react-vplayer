import * as React from 'react';
import { connect } from 'react-redux';

import './index.scss';

//@ts-ignore
import { ReactComponent as IconCast} from './../../assets/chromecast.svg';

interface Props {
    castPlaying: boolean
    castName: string
    castConnect: boolean
}

class ShowCastDevice extends React.Component<Props>{

    render() {
        return this.props.castConnect ? (
        <div className='cast-device'>
            <IconCast /> {this.props.castPlaying ? 'Reproduciendo en' : 'Conectado a'} {this.props.castName}
        </div>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    castPlaying: state.player.castPlaying,
    castName: state.player.castName,
    castConnect: state.player.castConnect
});

const ShowCastDeviceHoc = connect(mapStateToProps)(ShowCastDevice);

export { ShowCastDeviceHoc as ShowCastDevice };