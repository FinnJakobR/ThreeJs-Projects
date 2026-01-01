

import OrthoScene from "../../boilerplate/ortho/ortho.js";
import * as THREE from "three";

import {Text} from "../../util/text_sdf/src/Text.js";
import { createDerivedMaterial } from "../../util/text_sdf/utils/DerivedMaterial.js";



class LandingScene extends OrthoScene {


    constructor({text, id, w, h, backgroundColor, parent}){

        super({id: id, w: w, h: h, backgroundColor: backgroundColor, parent: parent})
        this.text = text;
        this.animate();
        this.createObjs();

        
    }

    async createObjs(){

        const t = new Text();
        t.text = this.text;
        t.font = "../../util/fonts/SplineSansMono-Medium.ttf";
        t.fontSize = Math.floor(window.innerWidth / (this.text.length * 0.7));
        t.color = "#000000";
        t.anchorX = "center";
        t.anchorY =  "middle";
        t.glyphGeometryDetail = 1000;
        t.outlineColor = "#ffffffff"
        t.outlineOffsetX = 10;

        this.scene.add(t);

                


        console.log(-(window.innerHeight / 2) - 1);


        

        this.customMaterial = createDerivedMaterial(
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
        {
            timeUniform: 'time',
                uniforms: {
            // Total width of the text, assigned on synccomplete
            progress: { value: 0 }
            },
            vertexDefs: `
            uniform float progress;
            `,
            vertexTransform: `
            uv.x *= 10.0;
            float waveAmplitude = 1.0;
            float waveX = uv.x * PI * 10.0 - mod(time / 100.0, PI2);
            float waveZ = sin(waveX) * waveAmplitude;
            
            position.y *= progress;
            
            `,
            fragmentColorTransform: `
            float a = (sin(vTroikaGlyphUV.x+ time/100.0)*0.5 + 0.3);
            //gl_FragColor = vec4(a,a,a,1.0);
            `
        }
        );

        t.material = this.customMaterial;

        t.addEventListener("synccomplete", () => {
            const bounds = t.textRenderInfo.blockBounds;
        });
    }

    async animate(){


        if(this.rendering) this.renderer.render(this.scene, this.camera);

         requestAnimationFrame(this.animate.bind(this));

    }
}


export default class Landing {

    constructor(text) {
        this.text = text;
        this.scene = new LandingScene(
            {
                text: text,
                id: "background", 
                w: window.innerWidth,
                h: window.innerHeight,
                parent: document.body,
                backgroundColor: new THREE.Color( 0xff0000 )
            }
        );

        

        this.start();
    }

    start(){
       const obj = { v: 0.3 };

       const fontSize = (window.innerWidth / (this.text.length * 0.7)) 
       const end = window.innerHeight / (fontSize * 0.85);

       console.log(end);
        gsap.to(obj, {
        v: end,
        duration: 3,
        ease: "power3.out",
        onUpdate: () => {
           
            //console.log(obj.v, this.scene.customMaterial);
             this.scene.customMaterial.uniforms.progress.value = obj.v;
        }
        });

    }
}


const main = () => {

    console.log("MAIN");
void (new Landing("ZNK"));
}


main();