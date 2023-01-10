import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
// @ts-ignore
import glsl from 'babel-plugin-glsl/macro'

const WaveShaderMaterial = shaderMaterial(
  {
    uFrequency: 0,
    uAmplitude: 0,
    uDensity: 0,
    uStrength: 0,
    uDeepPurple: 0,
    uOpacity: 0,
  },
  glsl`
    #pragma glslify: pnoise = require(glsl-noise/periodic/3d)
    #pragma glslify: rotateY = require(glsl-rotate/rotateY)

    uniform float uFrequency;
    uniform float uAmplitude;
    uniform float uDensity;
    uniform float uStrength;

    varying float vDistortion;

    void main() {  
      float distortion = pnoise(normal * uDensity, vec3(10.)) * uStrength;

      vec3 pos = position + (normal * distortion);
      float angle = sin(uv.y * uFrequency) * uAmplitude;
      pos = rotateY(pos, angle);    

      vDistortion = distortion;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
    }  
  `,
  glsl`
    uniform float uOpacity;
    uniform float uDeepPurple;

    varying float vDistortion;

    vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
      return a + b * cos(6.28318 * (c * t + d));
    }     

    void main() {
      float distort = vDistortion * 3.;

      vec3 brightness = vec3(.1, .1, .9);
      vec3 contrast = vec3(.3, .3, .3);
      vec3 oscilation = vec3(.5, .5, .9);
      vec3 phase = vec3(.9, .1, .8);

      vec3 color = cosPalette(distort, brightness, contrast, oscilation, phase);

      gl_FragColor = vec4(color, vDistortion);
      gl_FragColor += vec4(min(uDeepPurple, 1.), 0., .5, min(uOpacity, 1.));
    }  
  `,
)

extend({ WaveShaderMaterial })
