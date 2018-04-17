import { PcComponent } from '../pc.component';

export interface ISoundProps {
    volume?: number;
    pitch?: number;
    loop?: boolean;
    startTime?: number;
    duration?: number;
    overlap?: boolean;
    autoPlay?: boolean;
    asset?: Promise<pc.Asset> | pc.Asset;
}
export type SoundProps = Partial<ISoundProps>

export class Sound extends PcComponent<SoundProps> {
    static addComponent(entity: pc.Entity, node) {
        let component = super.addComponent(entity, node)
        // entity.addComponent('sound');

        // add footsteps slot
        if (node.props.asset) {
            if (node.props.asset instanceof Promise) {
                node.props.asset.then((asset) => {
                    entity.sound.addSlot('footsteps', {
                        asset: asset.resource,
                        pitch: 1.7,
                        loop: true,
                        autoPlay: true
                    });
                })
            } else {
                entity.sound.addSlot('footsteps', {
                    asset: node.props.asset.resource,
                    pitch: 1.7,
                    loop: true,
                    autoPlay: true
                });
            }
        }
        return component

    }

}