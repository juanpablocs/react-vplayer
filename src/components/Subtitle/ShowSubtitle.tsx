import * as React from 'react';
import * as Subtitle from 'subtitle';
import { connect } from 'react-redux';
import './index.scss';

interface Props {
    srt: string
    currentTime: number
    show: boolean
    refVideo: any
};

class ShowSubtitle extends React.Component<Props> {

    dictionarySrt: { start: number, end: number, text: string }[] = [];
    _refSubtitle: any = React.createRef();

    async componentDidMount() {
        if (this.props.srt) {
            const parse = await this.parseSrt();
            this.dictionarySrt = parse;
        }

        this.calculeHeightVidForSubtitle();

        window.addEventListener('resize', () => {
            this.calculeHeightVidForSubtitle();
        });
    }

    async parseSrt() {
        const request = await fetch(this.props.srt);
        const data = await request.text();
        const parse = Subtitle.parse(data);
        return parse;
    }

    private calculeHeightVidForSubtitle() {
        const vid = this.props.refVideo.current as HTMLVideoElement;
        const parentHeight = vid.parentElement.offsetHeight;
        const vidHeight = vid.offsetWidth / 16 * 9;
        const centerTop = ((parentHeight - vidHeight) / 2) + vidHeight * .88;
        const sub = this._refSubtitle.current;
        sub.style.top = `${centerTop}px`;
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
            <div className='subtitle-float' ref={this._refSubtitle}>
                {(this.props.show && text) && <div className="subtitle-text">{text}</div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentTime: state.player.currentTime
});

const ShowSubtitleHoc = connect(mapStateToProps)(ShowSubtitle);

export { ShowSubtitleHoc as ShowSubtitle };