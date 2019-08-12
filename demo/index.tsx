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
    ],
    loadSrt: 'https://www.jplayer.net/asset/userdata/223028/caption/mzvk-pmk1oq/28752.srt',
    // loadAds: 'https://v.9stream.tv/vast-30s-ad.xml'
    // loadAds: 'https://www.movcpm.com/watch.xml?key=1ab5f853805ad39477e714e75ac6862b&custom=%7B%27width%27%3A%27720%27%2C%27height%27%3A%27405%27%7D&cb=[CACHE_BUSTERS]&vastref=pelisplus.co'
    loadAds: 'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/ad_rule_samples&ciu_szs=300x250&ad_rule=1&impl=s&gdfp_req=1&env=vp&output=vmap&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ar%3Dpremidpostpod&cmsid=496&vid=short_onecue&correlator='
};

ReactDOM.render(<VPlayer {...props} />, document.getElementById('root'));