// vertexShader
attribute vec3 position;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 lightPosition; // Position of the light

varying vec3 fragNormal;
varying vec3 fragLightDir;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    fragNormal = normalize(normalMatrix * normal); // Transform normal to view space
    fragLightDir = lightPosition - mvPosition.xyz; // Direction to light from vertex

    gl_Position = projectionMatrix * mvPosition;
}
