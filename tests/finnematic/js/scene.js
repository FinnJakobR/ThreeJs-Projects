import * as THREE from "three";


export default class OrthoScene {

    constructor({id, w, h, backgroundColor, parent}) {
        

        this.w = w ? w : window.innerWidth;
        this.h = h ? h : window.innerHeight;

        this.backgroundColor = backgroundColor ?? 0x000000;

        this.parent = parent;

        this.isScreenX = w == window.innerWidth;
        this.isScreenY = h == window.innerHeight;

        this.id = id;
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.rendering = true;
        this.id = id;
        this.mouse = new THREE.Vector2(0,0); // in NDC
        this.mouseVelocity = new THREE.Vector2(0,0); // in NDC
        this.resolution = new THREE.Vector2(this.w, this.h);
        this.time = 0;

        
        this.setup();
    }

    stopRendering(){
        this.rendering = false;
    }

    startRendering(){
        this.rendering = true;
    }


    async mousemove() {

        this.renderer.domElement.addEventListener("mousemove", (e) => {
            //void e.clientX;  0 ... x
            //void e.clientY;  0 ... y

            // -1 ... 1
            const ndcX = (e.clientX / this.w) * 2 - 1;
            const ndcY = -(e.clientY / this.h) * 2 - 1;

            this.mouseVelocity.x = ndcX - this.mouse.x;
            this.mouseVelocity.y = ndcY - this.mouse.y; 

            this.mouse.x = ndcX;
            this.mouse.y = ndcY; 

        });

    }

    async responsiv() {

        window.addEventListener("resize", () => {

            if(this.isScreenX) {
                this.w = window.innerWidth; 
                this.resolution.x = this.w;
            } 

            if(this.isScreenY) {
                this.h = window.innerHeight
                this.resolution.y = this.h;
            }



            this.camera.left = -this.w / 2;
            this.camera.right = this.w / 2;
            this.camera.top = this.h / 2;
            this.camera.bottom = -this.h / 2;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.w, this.h);

            if(this.rendering) this.renderer.render(this.scene, this.camera);
        });
    }

    async setup() {

        console.log("setup");
        this.camera = new THREE.OrthographicCamera(
            - this.w / 2, 
            this.w / 2, 
            this.h / 2, 
            -this.h / 2, 
            0.0001, 
            200
        );
        
        this.camera.position.z = 20;
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(this.w, this.h);
        this.renderer.domElement.id = this.id;

        this.scene.background = this.backgroundColor;

        this.parent.appendChild(this.renderer.domElement);
        if(this.rendering) this.renderer.render(this.scene, this.camera);


        this.mousemove();
        this.responsiv();
    }

    

}