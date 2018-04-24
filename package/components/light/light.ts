import { PcComponent } from '../pc.component';

export interface ILightProps {
    type: 'directional' | 'point' | 'spot';  //default directional
    color: pc.Color;
    intensity: number;
    castShadows: boolean;
    shadowDistance: number;
    shadowResolution: number;
    shadowBias: number;
    normalOffsetBias: number;
    range: number;
    innerConeAngle: number;
    outerConeAngle: number;
    falloffMode: number;
    mask: number;
    affectDynamic: boolean;
    affectLightmapped: boolean;
    bake: boolean;
    bakeDir: boolean;
    shadowUpdateMode: number;
    shadowType: number;
    vsmBlurMode: number;
    vsmBlurSize: number;
    cookieAsset: number;
    cookie: pc.Texture;
    cookieIntensity: number;
    cookieFalloff: boolean;
    cookieChannel: string;
    cookieAngle: number;
    cookieScale: pc.Vec2;
    cookieOffset: pc.Vec2;
    isStatic: boolean;
}
export type LightProps = Partial<ILightProps>

export class Light extends PcComponent<LightProps> {

}