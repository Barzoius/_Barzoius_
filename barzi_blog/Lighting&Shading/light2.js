const canvas = document.getElementById('customCanvas');

// Define custom canvas size
const canvasWidth = 400;  // Set your desired width
const canvasHeight = 400; // Set your desired height

// Set canvas size
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ canvas });

// Enable shadow map in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: PCFSoftShadowMap for softer shadows

camera.position.z = 5;
camera.position.y = 2;

const objLoader = new THREE.OBJLoader();
const textureLoader = new THREE.TextureLoader();

let loadedObject = null;

// Load normal map texture
const normalMap = textureLoader.load('Models/David/material0_normal.jpg', () => {
    console.log('Normal map loaded');
});

const pointLightParams = {
    intensity: 1,
    distance: 50,  // Distance at which the light stops affecting the scene
    decay: 20,     // How quickly the light intensity diminishes with distance
    color: 0xffffff, // Color of the light
    position: new THREE.Vector3(12, 20, 17.5), // Light position
    ambient: 0.1   // Ambient light intensity
};

const pointLight = new THREE.PointLight(
    pointLightParams.color,
    pointLightParams.intensity,
    pointLightParams.distance,
    pointLightParams.decay
);

pointLight.position.set(pointLightParams.position.x, pointLightParams.position.y, pointLightParams.position.z);
// Enable shadow casting for the light
pointLight.castShadow = true;
// Set shadow properties for better quality
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 50;

scene.add(pointLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040, pointLightParams.ambient); // Low intensity to simulate soft ambient light
scene.add(ambientLight);

// Add a plane to the scene
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 }); // Use ShadowMaterial for receiving shadows
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate plane to be horizontal
plane.position.y = 1; // Position plane under the model
//plane.receiveShadow = true; // Enable shadow receiving
scene.add(plane);

// const geometry = new THREE.ConeGeometry( 0.5, 2, 10 ); 
// const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
// const cone = new THREE.Mesh(geometry, material ); 
// cone.position.y = 3
// cone.position.x = 2
// cone.castShadow= true;
// scene.add( cone );

objLoader.load(
    'Models/David/rapid.obj', 
    (object) => {             
        object.traverse((child) => {
            if (child.isMesh) {
                const diffuseColor = new THREE.Color(0x808080); 
                const diffuseIntensity = 0.1;  

                child.material = new THREE.MeshPhongMaterial({
                    color: diffuseColor,  // Set the diffuse color
                    normalMap: normalMap,  // Apply the normal map
                    shininess: 0,         // Shininess factor for specular highlights
                    specular: new THREE.Color(0.5, 0.5, 0.5), // Specular reflection color
                    emissive: diffuseColor.clone().multiplyScalar(diffuseIntensity)  // Simulate diffuse intensity by modifying the emissive property
                });

                child.castShadow = true; // Enable shadow casting for the model
            }
        });

        loadedObject = object;  
        loadedObject.scale.set(0.02, 0.02, 0.02);
        loadedObject.rotation.x += 5;  
        loadedObject.rotation.y += 0;
        loadedObject.rotation.z += 1;  

        scene.add(object);  
    },
    undefined, 
    (error) => { 
        console.error('Error loading model', error);
    }
);

// Update the light parameters dynamically
function updateLightParameters() {
    pointLight.intensity = pointLightParams.intensity;
    pointLight.distance = pointLightParams.distance;
    pointLight.decay = pointLightParams.decay;
    ambientLight.intensity = pointLightParams.ambient;

    const lightPosXSlider = document.getElementById('lightPosX');
    const lightPosYSlider = document.getElementById('lightPosY');
    const lightPosZSlider = document.getElementById('lightPosZ');

    // Update light position
    pointLight.position.x = parseFloat(lightPosXSlider.value);
    pointLight.position.y = parseFloat(lightPosYSlider.value);
    pointLight.position.z = parseFloat(lightPosZSlider.value);

    // Update displayed values
    document.getElementById('lightPosXValue').textContent = lightPosXSlider.value;
    document.getElementById('lightPosYValue').textContent = lightPosYSlider.value;
    document.getElementById('lightPosZValue').textContent = lightPosZSlider.value;
}

function adjustLighting() {
    pointLightParams.intensity = 2;  // Increase intensity
    pointLightParams.distance = 100; // Increase distance
    pointLightParams.decay = 1;      // Reduce decay

    updateLightParameters();
}

function animate() {
    requestAnimationFrame(animate);

    adjustLighting();

    if (loadedObject) {
        //loadedObject.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

animate();
