export const currentTime = (payload) => ({
    type: 'CURRENT_TIME',
    payload
});

export const durationTime = (payload) => ({
    type: 'DURATION_TIME',
    payload
});

export const toggleCaption = (payload=null) => ({
    type: 'TOGGLE_CAPTION',
    payload
});

export const togglePlaying = (payload) => ({
    type: 'PLAYING',
    payload
});

export const toggleCast = (payload=null) => ({
    type: 'CAST_ACTIVE',
    payload 
});

export const toggleCastPlaying = (payload=null) => ({
    type: 'CAST_PLAYING',
    payload
});

export const castName = (payload=null) => ({
    type: 'CAST_NAME',
    payload
});

export const castConnect = (payload=null) => ({
    type: 'CAST_CONNECT',
    payload
});

export const setVolume = (payload=0) => ({
    type: 'SET_VOLUME',
    payload
});

export const toogleFullscreen = () => ({
    type: 'TOOGLE_FULLSCREEN',
});

export const stop = (payload={}) => ({
    type: 'VIDEO_BACKGROUND',
    payload
});

export const videoCoverShow = (payload=false) => ({
    type: 'VIDEO_COVER_SHOW',
    payload
});

export const videoAds= (payload=false) => ({
    type: 'VIDEO_ADS',
    payload
});

export const videoSource= (payload={}) => ({
    type: 'VIDEO_SOURCE',
    payload
});

export const videoWaiting = () => ({
    type: 'VIDEO_WAITING'
});
