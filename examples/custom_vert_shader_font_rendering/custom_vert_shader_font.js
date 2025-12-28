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

        this.scene.add(t);
        

        const customMaterial = createDerivedMaterial(
      new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
      {
        // uniforms: {
        //   // Total width of the text, assigned on synccomplete
        //   textLength: { value: 0 }
        // },
        // vertexDefs: `
        //   uniform float textLength;
        // `,
        // vertexTransform: `
        //   float scale = 1.0 / textLength * PI * 1.98;
        //   float theta = -position.x * scale;
        //   float r = 100.0;
        //   float r2 = r + position.y * scale * r;
        //   position.x = cos(theta) * r2;
        //   position.y = sin(theta) * r2;
        // `

        // vertexTransform: `
        //     float waveAmplitude = 1.0;
        //     float waveX = uv.x * PI * 10.0 - mod(time / 100.0, PI2);
        //     float waveZ = sin(waveX) * waveAmplitude;
            
        //     position.y += waveZ;

        //     `,
        timeUniform: 'time',
        vertexTransform: `
          float frequency1 = 0.035;
          float amplitude1 = 10.0;
          float frequency2 = 0.1;
          float amplitude2 = 20.0;

          // Oscillate vertices up/down
          position.y += (sin(position.x * frequency1 + time / 500.0) * 0.5 + 0.5) * amplitude1;

          // Oscillate vertices inside/outside
          position.z += (sin(position.x * frequency2 + time / 500.0) * 0.5 + 0.5) * amplitude2;
        `
    
      }
    );

        t.material = customMaterial;

        t.addEventListener("synccomplete", () => {
            const bounds = t.textRenderInfo.blockBounds;
            customMaterial.uniforms.textLength.value = bounds[2] - bounds[0];
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