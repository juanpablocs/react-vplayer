import * as React from 'react';

declare module '*.scss';
declare module '*.svg';

export interface SourceProps {
    url: string;
    type: string;
    quality: number;
}

export interface VPlayerProps {
    source: string|SourceProps[]
    width?: string
    height?: string
    loadAds?: string
    loadSrt?: string
    qualityDefault?: number
}

export default class VPlayer extends React.Component<VPlayerProps> {

}