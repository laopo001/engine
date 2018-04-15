import { PcComponent } from '../pc.component';

export interface ICameraProps {
    // camera: pc.Camera;
    projection: number;
    nearClip: number;
    farClip: number;
    aspectRatio: number;
    horizontalFov: boolean;
    fov: number;
    orthoHeight: number;
    priority: number;
    clearColor: pc.Color;
    clearColorBuffer: boolean;
    clearDepthBuffer: boolean;
    clearStencilBuffer: boolean;
    rect: pc.Vec4;
    scissorRect: pc.Vec4;
    renderTarget: pc.RenderTarget;
    postEffects: pc.PostEffectQueue;
    frustumCulling: boolean;
    calculateTransform: Function;
    calculateProjection: Function;
    cullFaces: boolean;
    flipFaces: boolean;
}
export type CameraProps=Partial<ICameraProps>

export class Camera extends PcComponent<CameraProps> {
    
}