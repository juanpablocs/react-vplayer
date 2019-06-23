import { ManagerInterface } from "./ManagerInterface";

export class VideoManager implements ManagerInterface {
    
    protected video:HTMLVideoElement;

    constructor(video:HTMLVideoElement) {
        this.video = video;
    }
    play(): void {
        if(this.video) {
            this.video.play();
        }
    }

    pause(): void {
        if(this.video) {
            this.video.pause();
        }
    }
}