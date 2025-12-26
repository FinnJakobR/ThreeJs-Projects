
varying uVu;

void main(){

    vec2 uv = uVu;
    gl_FragColor = vec4(uv.xy, 1.0, 1.0);
}