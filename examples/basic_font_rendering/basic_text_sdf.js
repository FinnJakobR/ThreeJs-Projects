import OrthoScene from "../../boilerplate/ortho/ortho.js";
import * as THREE from "three";

import {Text} from "../../util/text_sdf/src/Text.js";


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
        t.font = "../../util/fonts/EuropeanTeletext.ttf";
        t.fontSize = 20;
        t.color = "#ffffff";
        
        this.scene.add(t);
        
        this.scene.add(new THREE.AxesHelper(200));
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
    void (new BasicSdfFont("Hello World"));
}


main();