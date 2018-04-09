/**
 * @author dadigua
 */
import hpc, { Application, Entity, Camera } from '../package/index';

var canvas = document.getElementById("root");

hpc.render(<Application>
    <Entity name='123'  >
        <camera clearColor={new pc.Color(0.12, 0.12, 0.12)}></camera>
    </Entity>
    <Entity >
        <model type='123' />
    </Entity>
</Application>, canvas, { debugger: true });


