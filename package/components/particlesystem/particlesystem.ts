import { PcComponent } from '../pc.component';

export interface IParticleSystemProps {
    autoPlay: boolean;
    loop: boolean;
    preWarm: boolean;
    lighting: boolean;
    halfLambert: boolean;
    alignToMotion: boolean;
    depthWrite: boolean;
    noFog: boolean;
    numParticles: number;
    rate: number;
    rate2: number;
    startAngle: number;
    startAngle2: number;
    lifetime: number;
    stretch: number;
    intensity: number;
    animLoop: boolean;
    animTilesX: number;
    animTilesY: number;
    animNumFrames: number;
    animSpeed: number;
    depthSoftening: number;
    initialVelocity: number;
    emitterExtents: pc.Vec3;
    emitterRadius: number;
    wrapBounds: pc.Vec3;
    // colorMap: pc.Texture;
    // normalMap: pc.Texture;
    colorMap: Promise<pc.Asset>;
    normalMap: Promise<pc.Asset>;
    emmitterShape: number;
    sort: number;
    mesh: pc.Mesh;
    blend: number;
    localVelocityGraph: pc.CurveSet;
    localVelocityGraph2: pc.CurveSet;
    velocityGraph: pc.CurveSet;
    velocityGraph2: pc.CurveSet;
    colorGraph: pc.CurveSet;
    rotationSpeedGraph: pc.Curve;
    rotationSpeedGraph2: pc.Curve;
    scaleGraph: pc.Curve;
    scaleGraph2: pc.Curve;
    alphaGraph: pc.Curve;
    alphaGraph2: pc.Curve;
}
export type ParticleSystemProps = Partial<IParticleSystemProps>

export class ParticleSystem extends PcComponent<ParticleSystemProps> {

    static addComponent(entity, node) {
        let component = super.addComponent(entity, node, 'colorMap', 'normalMap')
        // props.colorMap && props.colorMap.then((asset) => {
        //     entity.particlesystem.colorMap = asset.resource;
        // })
        super.asyncAssetsSet(entity, node, 'colorMap', 'normalMap')
        return component;
    }
}