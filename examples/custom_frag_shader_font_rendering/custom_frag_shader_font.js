import OrthoScene from "../../boilerplate/ortho/ortho.js";
import * as THREE from "three";

import {Text} from "../../util/text_sdf/src/Text.js";
import { createDerivedMaterial } from "../../util/text_sdf/utils/DerivedMaterial.js";


class BasicSdfFontScene extends OrthoScene {


    constructor({text, id, w, h, backgroundColor, parent}){

        super({id: id, w: w, h: h, backgroundColor: backgroundColor, parent: parent})
        this.text = text;
        this.animate();
        this.createObjs();
        
    }

    async createObjs(){

        const t = new Text();
        t.text = this.text;
        t.font = "../../util/fonts/iosevka-regular.ttf";
        t.fontSize = 100;
        t.color = "#fccc2f";
        t.anchorX = "center";
        t.anchorY =  "bottom";
        t.glyphGeometryDetail = 1000;

        this.scene.add(t);
        

        const customMaterial = createDerivedMaterial(
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
        {
            timeUniform: 'time',
            vertexTransform: `
            uv.x *= 10.0;
            float waveAmplitude = 1.0;
            float waveX = uv.x * PI * 10.0 - mod(time / 100.0, PI2);
            float waveZ = sin(waveX) * waveAmplitude;
            
            position.x += waveZ;
            position.y +=  -waveZ;

            
            `,
            fragmentColorTransform: `
            float a = (sin(vTroikaGlyphUV.x+ time/100.0)*0.5 + 0.3);
            //gl_FragColor = vec4(a,a,a,1.0);
            `
        }
        );

        t.material = customMaterial;

        t.addEventListener("synccomplete", () => {
            const bounds = t.textRenderInfo.blockBounds;
        });
    }

    async animate(){



        if(this.rendering) this.renderer.render(this.scene, this.camera);

         requestAnimationFrame(this.animate.bind(this));

    }
}


export default class BasicSdfFont {

    constructor(text) {
        this.text = text;
        this.scene = new BasicSdfFontScene(
            {
                text: text,
                id: "background", 
                w: window.innerWidth,
                h: window.innerHeight,
                parent: document.body
            }
        )
    }
}


const main = () => {

    console.log("MAIN");
    void (new BasicSdfFont("Finns super coole Website"));
}


main();