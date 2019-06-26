import * as React from 'react';
import { SourceProps } from './src/VPlayerInterface';

declare module '*.scss';
declare module '*.svg';


interface ReactVPlayerProps {
    source: string|SourceProps[]
}
export default class ReactPlayer extends React.Component<ReactVPlayerProps> {

}