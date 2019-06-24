import * as React from 'react';

export interface PlayerType {
    videoManager: any
};

const playerType:PlayerType = {
    videoManager: {}
};

export const VPlayerContext = React.createContext(playerType);