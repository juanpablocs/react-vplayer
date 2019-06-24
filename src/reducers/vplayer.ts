const initialState = {
    currentTime: 0,
    durationTime: 0,
    showCaption: false,
    playing: false,
    castActive: false,
    castPlaying: false,
    toogleVolume: true,
    toogleFullscreen: false,
    videoCoverShow: true, 
    videoAds: false,
    videoBackground: {
        stop: false,
        currentTime: 0,
        durationTime: 0
    }
};

export default (state = initialState, action) => {
    if(action.type === 'CURRENT_TIME') {
        return { ...state, currentTime: action.payload}
    }
    if(action.type === 'DURATION_TIME') {
        return { ...state, durationTime: action.payload}
    }
    if(action.type === 'TOGGLE_CAPTION') {
        return { ...state, showCaption: typeof action.payload === 'boolean' ? action.payload : !state.showCaption}
    }
    if(action.type === 'CAST_ACTIVE') {
        return { ...state, castActive: typeof action.payload === 'boolean' ? action.payload : !state.castActive}
    }
    if(action.type === 'CAST_PLAYING') {
        return { ...state, castPlaying:  typeof action.payload === 'boolean' ? action.payload : !state.castPlaying}
    }
    if(action.type === 'PLAYING') {
        return { ...state, playing: action.payload}
    }
    if(action.type === 'TOOGLE_VOLUME') {
        return { ...state, toogleVolume: !state.toogleVolume}
    }
    if(action.type === 'TOOGLE_FULLSCREEN') {
        return { ...state, toogleFullscreen: !state.toogleFullscreen}
    }
    if(action.type === 'VIDEO_BACKGROUND') {
        return { ...state, videoBackground: action.payload}
    }
    if(action.type === 'VIDEO_COVER_SHOW') {
        return { ...state, videoCoverShow: action.payload}
    }
    if(action.type === 'VIDEO_ADS') {
        return { ...state, videoAds: action.payload}
    }
    if(action.type === 'VIDEO_SOURCE') {
        return { ...state, videoSource: action.payload}
    }
    return state;
};
