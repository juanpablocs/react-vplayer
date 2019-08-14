import * as React from 'react';
import { connect } from 'react-redux';

//@ts-ignore
import { ReactComponent as IconLoading } from './../../assets/loading-circle.svg';
import './index.scss';

interface Props {
    waiting: boolean
}
const Loading = (props:Props) =>(
    <React.Fragment>
        {props.waiting && <div className="vplayer-loading">
            <IconLoading />
        </div>}
    </React.Fragment>
);

const mapStateToProps = (state)=>({
    waiting: state.player.videoWaiting
});

const LoadingHoc = connect(mapStateToProps)(Loading);
export { LoadingHoc as Loading };