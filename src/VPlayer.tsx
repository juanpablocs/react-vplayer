import * as React from 'react';
import * as PropTypes from 'prop-types';
import { SourceProps } from './VPlayerInterface';

interface Props {
    source: string|SourceProps[]
};

export default class VPlayer extends React.Component<Props> {

    static propTypes = {
        source: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.shape({
                url: PropTypes.string,
                type: PropTypes.string,
                quality: PropTypes.string
            }))
        ]).isRequired
    }

    render() {
        return (
            <div>This is a Vplayer2</div>
        );
    }
}