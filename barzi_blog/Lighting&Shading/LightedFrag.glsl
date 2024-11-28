// fragmentShader
precision mediump float;

uniform vec3 lightColor;
uniform float lightIntensity;
uniform float lightDecay;
uniform float lightDistance;

varying vec3 fragNormal;
varying vec3 fragLightDir;

void main() {
    // Normalize the light direction and the normal
    vec3 lightDir = normalize(fragLightDir);
    vec3 normal = normalize(fragNormal);

    // Calculate the diffuse lighting (Lambertian)
    float diff = max(dot(normal, lightDir), 0.0);

    // Calculate the distance from the light source
    float distance = length(fragLightDir);
    
    // Apply the lights decay based on distance
    float attenuation = 1.0 / (1.0 + lightDecay * (distance / lightDistance));

    // Calculate the final lighting intensity
    float intensity = lightIntensity * diff * attenuation;

    // Set the final color (we use white light for simplicity)
    vec3 color = lightColor * intensity;

    gl_FragColor = vec4(color, 1.0);
}
