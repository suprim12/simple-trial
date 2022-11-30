uniform float time;
uniform float progress;
uniform vec2 resolution;
varying vec2 vUv;
varying vec4 vPosition;
uniform sampler2D texture1;
const float pi = 3.1415925;




void main() {
  vUv = uv;
  vec3 pos = position;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0 );
}


