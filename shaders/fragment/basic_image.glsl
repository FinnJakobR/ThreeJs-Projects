
varying uVu;
uniform sampler2D image;


vec4 Image(){
    vec2 uv = uVu;
    return texture2D(image, uv);
}