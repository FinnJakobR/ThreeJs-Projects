


import OrthoScene from "./scene.js";
import * as THREE from "three";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import {Text} from "../util/text_sdf/src/Text.js";
import { createDerivedMaterial } from "../util/text_sdf/utils/DerivedMaterial.js";
import { readFile } from "../util/util.js";



class LandingScene extends OrthoScene {


    constructor({text, id, w, h, backgroundColor, parent}){

        super({id: id, w: w, h: h, backgroundColor: backgroundColor, parent: parent})
        this.text = text;
        this.postProcessingComposer = new EffectComposer(this.renderer);
        this.isScalling = true;
        this.init();
    }


    async init(){

        const fragmentShader = await readFile("shaders/fragment/glitch.glsl");
        const vertexShader = await readFile("shaders/vertex/basic.glsl");

        const glitchShader = {
        uniforms: {
            "scene": { value: null },
            glitchGridProgress: {value: 0.0},
            time: {value: 0.0},
            resolution: {value: new THREE.Vector2(0,0)}
        },


        vertexShader: `
            varying vec2 vUv;

        

            void main() {
            vUv = uv;
            vec4 pos = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

            gl_Position = pos;

            }
        `,
        fragmentShader: fragmentShader
        };


        console.log(vertexShader)

        this.renderPass = new RenderPass(this.scene, this.camera);
        this.outputPass = new OutputPass();
        this.effectBloom = new BloomPass( 0.9 );

    
        this.glitchPass  = new ShaderPass(glitchShader, "scene");
        this.postProcessingComposer.addPass(this.renderPass);
        this.postProcessingComposer.addPass(this.glitchPass);
        //this.postProcessingComposer.addPass(this.outputPass);



        this.animate();
        this.createObjs();

    }

    async createObjs(){

        const t = new Text();
        t.text = this.text;
        t.font = "./util/fonts/SplineSansMono-Medium.ttf";
        t.fontSize = Math.floor(window.innerWidth / (this.text.length * 0.9));
        t.color = "#ffffff";
        t.anchorX = "center";
        t.anchorY =  "middle";
        t.glyphGeometryDetail = 1000;
        t.outlineColor = "#ffffff"
        t.outlineOffsetX = 10;

        this.t = t;


        this.scene.add(t);

                


        console.log(-(window.innerHeight / 2) - 1);


        

        this.customMaterial = createDerivedMaterial(
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
        {
            timeUniform: 'time',
                uniforms: {
            // Total width of the text, assigned on synccomplete
            scaleProgress: { value: 0 },
            glitchGridProgress: {value: 0},
            scaleEnd: {value: 0}
            },
            vertexDefs: `
            uniform float scaleProgress;
            uniform float glitchGridProgress;
            uniform float scaleEnd;

            float random(vec2 c){
					return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
			}

                        float hash(vec2 p){
                return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123);
            }

            float noise(vec2 p){
                vec2 i = floor(p);
                vec2 f = fract(p);

                float a = hash(i);
                float b = hash(i + vec2(1.0, 0.0));
                float c = hash(i + vec2(0.0, 1.0));
                float d = hash(i + vec2(1.0, 1.0));

                vec2 u = f * f * (3.0 - 2.0 * f);

                return mix(a, b, u.x) +
                    (c - a) * u.y * (1.0 - u.x) +
                    (d - b) * u.x * u.y;
            }
            `,
            vertexTransform: `

            float grid = random(vec2(floor(time / 150.0), 0.0)) * 40.0;

            vec2 tileUV = floor(uv * grid);


   


            float waveAmplitude = 1.0;
            float waveX = uv.x * PI * 10.0 - mod(time / 100.0, PI2);
            float waveZ = sin(waveX) * waveAmplitude;


            float p = step(0.5, glitchGridProgress);

            float r = random(uv * p) + random(tileUV);

            
            // if(glitchGridProgress > 0.85) {
            //     r =  random(uv);
            // }

            // if(glitchGridProgress < 1.0 && glitchGridProgress > 0.4) {
            //     position.x += r * 40.0;                                            
            // }


            if(scaleProgress < scaleEnd * 0.9) {
                position.y *= scaleProgress * waveZ;
            } else {
                position.y *= scaleProgress;     
            }

            
            `,
            fragmentDefs: `
              uniform float glitchGridProgress;
            `,
            fragmentColorTransform: `
            float a = (sin(vTroikaGlyphUV.x+ time/100.0)*0.5 + 0.3);

            //gl_FragColor = vec4(a,a,a,1.0);
            `
        }
        );

        t.material = this.customMaterial;

        this.animateFont();

    }

    async animateFont(){

       const ScaleObj = { v: 0.09 };
       const GridObj = {value: 0};

       const fontSize = (window.innerWidth / (this.text.length * 0.9)) 
       this.end = window.innerHeight / (fontSize * 0.85);

       this.customMaterial.uniforms.scaleEnd.value = this.end;

       console.log(this.end);

        gsap.to(ScaleObj, {
            v: this.end,
            duration: 2.0,
            ease: "expo.none",
            onUpdate: () => {
                this.customMaterial.uniforms.scaleProgress.value = ScaleObj.v;
                },

            onComplete: () => {
                this.isScalling = false;
                console.log("scaling Complete!");
            }

            });

        gsap.to(GridObj, {
            v: 1.0,
            duration: 1.7,
            ease: "none",  
            onUpdate: () => {
                this.customMaterial.uniforms.glitchGridProgress.value = GridObj.v;
                this.glitchPass.material.uniforms.glitchGridProgress.value = GridObj.v;
            }
        }
        
        )

    }

    async animate(){

        this.time = this.clock.getElapsedTime();
        this.glitchPass.material.uniforms.time.value = this.time;
        this.glitchPass.material.uniforms.resolution.value = this.resolution;

        if(!this.isScalling) {
            const fontSize = Math.floor(window.innerWidth / (this.text.length * 0.9)) 
            this.t.fontSize = fontSize;
            
            this.t.sync(() => {});

            const newEnd = window.innerHeight / (fontSize * 0.85);
            this.customMaterial.uniforms.scaleProgress.value = newEnd;
            this.customMaterial.uniforms.scaleEnd.value = newEnd;
           
        }

        if(this.rendering) this.postProcessingComposer.render();

         requestAnimationFrame(this.animate.bind(this));

    }
}


class Landing {

    constructor(text) {
        this.text = text;
        this.scene = new LandingScene(
            {
                text: text,
                id: "background", 
                w: window.innerWidth,
                h: window.innerHeight,
                parent: document.getElementById("main"),
                backgroundColor: new THREE.Color(0x0000 )//0xff0000 
            }
        ); 
    }

}




const render = () => {
    
void (new Landing("MOV"));
}


export default render;