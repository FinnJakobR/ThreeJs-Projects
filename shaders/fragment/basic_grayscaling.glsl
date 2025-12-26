
vec4 basic_grayscaling(vec4 c) {
    vec3 color = c.rgb;
    float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(color, vec3(luma), grayscale);
    return vec4(color.rgb, 1.0);
}