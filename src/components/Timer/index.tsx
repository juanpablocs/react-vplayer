import * as React from 'react';
import { connect } from 'react-redux';
import './index.scss';
import { secondsToTime } from '../../utils';

interface Props {
    currentTime: number
    durationTime: number
}

class Timer extends React.Component<Props> {

    render() {
        const { durationTime, currentTime } = this.props;
        const duration = durationTime ? secondsToTime(durationTime) : '00:00';
        const current = currentTime ? secondsToTime(Math.round(currentTime)) : '00:00';
        return (
            <div className='timer-control'>{current} / {duration}</div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentTime: state.player.currentTime,
    durationTime: state.player.durationTime
});

const mapDispatchToProps = (dispatch) => ({
});

const TimerHoc = connect(mapStateToProps, mapDispatchToProps)(Timer);

export { TimerHoc as Timer };