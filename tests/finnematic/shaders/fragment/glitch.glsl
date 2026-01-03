uniform float glitchGridProgress;
uniform sampler2D scene;
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

float generateGrain(){
    float baseAmount = 0.2;

    // gleiche Grain-Größe
    vec2 n = floor(vUv * 800.0) / 800.0;

    // gleiche Grain-Intensität
    float scale = 800.0 / length(resolution);
    float amount = baseAmount * scale;

    float randomIntensity = fract(
        sin(dot(n + time, vec2(12.9898,78.233)))
        * 43758.5453398398
    );

    return (randomIntensity * 2.0 - 1.0) * amount;
}

float random(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 shake(float strength) {

	return vec2(strength) * vec2(
			random(vec2(time)) * 2.0 - 1.0,
			random(vec2(time * 2.0)) * 2.0 - 1.0
 			) / resolution;
}



void main() {

    vec2 uv = vUv;

    

    vec2 s = shake(0.9);

    vec4 color;

    // ========================
    // BLOCKIGER SPIEGEL-RAND
    // ========================

    float borderSize = 0.06;   // Rahmenbreite
    float blockSize  = 10.0;   // Größe der Pixelblöcke

    bool isBorder =
        uv.x < borderSize ||
        uv.x > 1.0 - borderSize ||
        uv.y < borderSize ||
        uv.y > 1.0 - borderSize;

    if(isBorder){

        vec2 mirrorUV = uv;


        if (uv.x < borderSize) mirrorUV.x = 4.0 * borderSize - uv.x;
        if (uv.x > 1.0 - borderSize) mirrorUV.x = 0.3;


        if(uv.y < borderSize) mirrorUV.y = borderSize + (borderSize - uv.y);
        if(uv.y > 1.0 - borderSize) mirrorUV.y = 1.0 - borderSize - (uv.y - (1.0 - borderSize));

        mirrorUV = floor((mirrorUV * blockSize) ) / blockSize;
        

        color = texture2D(scene, mirrorUV);

    } else {
        color = texture2D(scene, uv + s);
    }

    float g = generateGrain();

    // ========================
    // GLITCH INVERT
    // ========================

    if(glitchGridProgress > 0.5 && glitchGridProgress < 0.8) {
        gl_FragColor = vec4(1.0 - color.rgb, 1.0);
        return;
    }

    // ========================
    // GRAIN
    // ========================

    gl_FragColor = vec4(color.rgb + g, 1.0);
}