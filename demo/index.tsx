import * as React from 'react';
import * as ReactDOM from 'react-dom';
import VPlayer from './../src/VPlayer';

const props = {
    source: [
        {
            url: 'https://raw.githubusercontent.com/juanpablocs/react-vplayer/master/demo/video/1080p.mp4', 
            type: 'video/mp4', 
            quality: 1080
        },
        {
            url: 'https://raw.githubusercontent.com/juanpablocs/react-vplayer/master/demo/video/720p.mp4', 
            type: 'video/mp4', 
            quality: 720
        },
        {
            url: 'https://raw.githubusercontent.com/juanpablocs/react-vplayer/master/demo/video/480p.mp4', 
            type: 'video/mp4', 
            quality: 480
        },
        {
            url: 'https://raw.githubusercontent.com/juanpablocs/react-vplayer/master/demo/video/360p.mp4', 
            type: 'video/mp4', 
            quality: 360
        },
    ]
};

ReactDOM.render(<VPlayer {...props} />, document.getElementById('root'));