import { Component } from '../../component';

export interface CameraProps {
    clearColor: any
    children?: never;
}

export class Camera extends Component<CameraProps> {
    isBaseComponent() {
        return true;
    }
    basename = 'camera'
}