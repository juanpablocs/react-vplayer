import * as React from 'react';
import * as Subtitle from 'subtitle';
import { connect } from 'react-redux';
import './index.scss';

interface Props {
    srt: string
    currentTime: number
};

class ShowSubtitle extends React.Component<Props> {

    dictionarySrt: { start: number, end: number, text: string }[] = [];

    async componentDidMount() {
        if (this.props.srt) {
            const parse = await this.parseSrt();
            this.dictionarySrt = parse;
        }
    }

    async parseSrt() {
        const request = await fetch(this.props.srt);
        const data = await request.text();
        const parse = Subtitle.parse(data);
        return parse;
    }

    showSubtitleText(): string {
        for (let i = 0; i < this.dictionarySrt.length; i++) {
            const o = this.dictionarySrt[i];
            const t = Math.round(this.props.currentTime * 1000);

            if (o.start <= t && o.end >= t) {
                return o.text;
            }
            break;
        }

        return '';
    }

    render() {
        const text = this.showSubtitleText();
        return (
            <div className='subtitle-float'>
                {text && <div className="subtitle-text">{text}</div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentTime: state.player.currentTime
});

const ShowSubtitleHoc = connect(mapStateToProps)(ShowSubtitle);

export { ShowSubtitleHoc as ShowSubtitle };