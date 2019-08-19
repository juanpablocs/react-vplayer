import * as React from "react";
import { secondsToTime } from "../../utils";
import './index.scss';

interface Props {
    value?: number
    timerDuration?: number
    onProgress?: Function
    onLeave?: Function
    onMove?: Function
    onUp?: Function
}

interface CurrentElement {
    current: HTMLDivElement
}

export default class Progress extends React.Component<Props> {

    refPointer: any = React.createRef();
    refSlider: any = React.createRef();
    refTimer: any = React.createRef();
    isDragging: boolean = false;

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.onMoveDocument);
        document.removeEventListener("mousemove", this.onUpDocument);
    }

    getPercentage(target, pageX) {
        const { width, left } = target.getBoundingClientRect();
        return (100 / width) * (pageX - left);
    }

    setTimerElement(pageX = 0, showTimer = false) {
        const { current: sliderElement }: CurrentElement = this.refSlider;
        const { current: timerElement }: CurrentElement = this.refTimer;
        const { left } = sliderElement.getBoundingClientRect();
        const percentage = this.getPercentage(sliderElement, pageX);
        const timer = this.props.timerDuration * (percentage / 100);;
        const _left = pageX < sliderElement.offsetWidth / 2;
        const _right = pageX > sliderElement.offsetWidth / 2;

        timerElement.innerHTML = secondsToTime(timer);

        if ((pageX > timerElement.offsetWidth * .7 && _left) || ((sliderElement.offsetWidth - pageX) > timerElement.offsetWidth * .3 && _right)) {
            timerElement.style.left = `${(pageX - left - 10)}px`;
        }
        if (showTimer) {
            timerElement.classList.add('hover-timer--active');
        }
    }

    onMoveSlider = e => {
        if (this.isDragging) return;

        if (this.props.timerDuration) {
            this.setTimerElement(e.pageX, true);
        }

    }

    onLeaveSlider = () => {
        if (this.isDragging) return;

        if (this.props.timerDuration) {
            const { current } = this.refTimer;
            const timerElement = current as HTMLDivElement;
            timerElement.classList.remove('hover-timer--active');
        }
    }

    onMoveDocument = e => {
        const { current: slider } = this.refSlider;
        const { current: thumb } = this.refPointer;
        const { width: sliderWidth, left } = (slider as HTMLDivElement).getBoundingClientRect();
        const { width: thumbWidth } = (thumb as HTMLDivElement).getBoundingClientRect();

        const percentage = this.getPercentage(slider, e.pageX);

        this.isDragging = true;
        if (percentage <= 0 || percentage >= 100) {
            return;
        }

        if (this.props.onProgress) {
            this.props.onProgress(Math.round(percentage));
        }

        if (this.props.timerDuration) {
            this.setTimerElement(e.pageX);
        }

        let leftThumb = e.pageX - left - thumbWidth / 2;
        leftThumb = this.sanitizeLeft(leftThumb, sliderWidth, thumbWidth);

        (thumb as HTMLDivElement).style.left = `${leftThumb}px`;

        (slider as any).querySelector(".slider__bar").style.width = `${percentage}%`;
    };

    onUpDocument = e => {
        this.isDragging = false;
        document.removeEventListener("mousemove", this.onMoveDocument);
        document.removeEventListener("mouseup", this.onUpDocument);

        const { current } = this.refSlider;
        const percentage = this.getPercentage(current, e.pageX);

        this.props.onUp(percentage);

        if (this.props.timerDuration) {
            const { current: timerElement } = this.refTimer;
            timerElement.classList.remove('hover-timer--active');
        }
    };

    onPressedSlider = e => {
        e.preventDefault();
        document.addEventListener("mousemove", this.onMoveDocument);
        document.addEventListener("mouseup", this.onUpDocument);
        if (this.props.timerDuration) {
            const { current: timerElement } = this.refTimer;
            timerElement.classList.add('hover-timer--active');
        }
    };

    sanitizeLeft(newLeft, sliderWidth, thumbWidth) {
        // the pointer is out of slider => lock the thumb within the bounaries
        if (newLeft < 0) {
            newLeft = 0;
        }
        let rightEdge = sliderWidth - thumbWidth;
        if (newLeft > rightEdge) {
            newLeft = rightEdge;
        }
        return newLeft;
    }

    render() {
        return (
            <React.Fragment>
                {(this.props.timerDuration > 0) && <div className='hover-timer' ref={this.refTimer}>00:00</div>}
                <div
                    className="slider"
                    onMouseDown={this.onPressedSlider}
                    onDragStart={() => false}
                    onMouseLeave={this.onLeaveSlider}
                    onMouseMove={this.onMoveSlider}
                    ref={this.refSlider}
                >
                    <div className="pointer" ref={this.refPointer} />
                    <div className="slider__bar" style={{ width: `${this.props.value}%` }} />
                </div>
            </React.Fragment>
        );
    }
}
