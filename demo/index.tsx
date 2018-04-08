/**
 * @author dadigua
 */
import hpc, { Application, Entity } from '../package/index';

var canvas = document.getElementById("root");

hpc.render(<Application tag='123' n ref={(x) => { console.log(x); }}>
    <Entity posi>
        <camera clearColor={new pc.Color(0.12, 0.12, 0.12)} />
    </Entity>
    <Entity>
        <model type='box' />
    </Entity>
</Application>, canvas, { debugger: true });

