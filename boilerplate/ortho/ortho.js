import * as THREE from "three";


export default class OrthoScene {

    constructor({id, w, h, backgroundColor, parent}) {
        

        this.w = w ? w : window.innerWidth;
        this.h = h ? h : window.innerHeight;

        this.backgroundColor = backgroundColor;
        this.parent = parent;

        this.isScreenX = w == window.innerWidth;
        this.isScreenY = h == window.innerHeight;

        this.id = id;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.rendering = true;
        this.id = id;
        this.mouse = new THREE.Vector2();
        this.mouseVelocity = new THREE.Vector2();

        
        this.setup();
    }

    stopRendering(){
        this.rendering = false;
    }

    startRendering(){
        this.rendering = true;
    }

    async createObjs(){}

    async animate() {}

    async responsiv() {

        window.addEventListener("resize", ()=>{

            if(this.isScreenX) this.w = window.innerWidth;
            if(this.isScreenY) this.h = window.innerHeight;

            this.camera.left = this.w / 2;
            this.camera.right = this.w / 2;
            this.camera.top = this.h / 2;
            this.camera.bottom = -this.h / 2;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.w, this.h);

            if(this.rendering) this.renderer.render(this.scene, this.camera);
        });
    }

    async setup() {
        this.camera = new THREE.OrthographicCamera(
            - this.w / 2, 
            this.w / 2, 
            this.h / 2, 
            -this.h / 2, 
            -10, 
            10
        );
        
        this.camera.position.z = 2;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(this.w, this.h);
        this.renderer.domElement.id = this.id;
        this.renderer.setAnimationLoop(this.animate.bind(this));

        this.parent.appendChild(this.renderer);
        
        if(this.rendering) this.renderer.render(this.scene, this.camera);



        this.responsiv();
    }

    

}