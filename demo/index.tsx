/**
 * @author dadigua
 */
import hpc, { Application, Entity } from '../package/index';

var canvas = document.getElementById("root");
hpc.render(<Application ref={(x) => { console.log(x); }}>
    <Entity>
        <camera clearColor={new pc.Color(0.12, 0.12, 0.12)} />
    </Entity>
</Application>, canvas, { debugger: true });