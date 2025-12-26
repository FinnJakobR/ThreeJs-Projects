varying uVu;
uniform float time;
uniform vec2 resolution;

import "./shaders/fragment/random.glsl";

vec2 shake(float strength) {

	return vec2(strength) * vec2(
			random(vec2(time)) * 2.0 - 1.0,
			random(vec2(time * 2.0)) * 2.0 - 1.0
 			) / resolution;
}
