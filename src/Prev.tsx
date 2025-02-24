// import "./App.css";
// import * as THREE from "three";
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );

// const amibent = new THREE.AmbientLight(0xffffff , 1);
// scene.add(amibent)

// const directionLight = new THREE.DirectionalLight(0xffffff,3)
// directionLight.position.set(2,2,1);
// scene.add(directionLight);

// const directionLightHelper = new THREE.DirectionalLightHelper(directionLight,5);
// scene.add(directionLightHelper)

// const pointLight = new THREE.PointLight(0xffffff,1,10,2);
// pointLight.position.set(0,-1.3,0);
// scene.add(pointLight)

// const pointLightHelper = new THREE.PointLightHelper(pointLight,0.2);
// scene.add(pointLightHelper)


// const loader = new THREE.TextureLoader()
// const color = loader.load("/text/color.jpg");
// const roughness = loader.load("/text/roughness.jpg")
// const normal = loader.load("/text/normal.png")



// const geometry = new THREE.BoxGeometry(3, 1.8, 2);
// const material = new THREE.MeshStandardMaterial({ map: color, roughnessMap: roughness, normalMap : normal  });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.z = 5;

// const canvas = document.querySelector("#screen")

// const renderer = new THREE.WebGLRenderer({canvas});
// const controls = new OrbitControls(camera , renderer.domElement)
// controls.enableDamping= true;
// controls.enableZoom = true;
// controls.dampingFactor=0.25;
// renderer.setSize(window.innerWidth, window.innerHeight);

// window.addEventListener("resize",()=>{
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth/ window.innerHeight;
//   camera.updateProjectionMatrix();
// })

// // const clock = new THREE.Clock();

// function animate() {
//   window.requestAnimationFrame(animate);
//   // cube.rotation.x = clock.getElapsedTime();
//   // cube.rotation.y = clock.getElapsedTime();
//   controls.update();
//   renderer.render(scene, camera);

// }
// animate();

// function App() {
//   return (
//     <>
//     </>
//   );
// }

// export default App;

// import * as THREE from "three";
// import { useEffect, useRef } from "react";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
// import { GLTFLoader } from "three/examples/jsm/Addons.js";
// // import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// const App: React.FC = () => {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   useEffect(() => {
//     // Scene setup
//     const scene = new THREE.Scene();

//     const ambientLight = new THREE.AmbientLight(0x404040, 10);
//     scene.add(ambientLight);

//     const camera = new THREE.PerspectiveCamera(
//       70,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 2, 10);

//     // Renderer setup
//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current!,
//       antialias: true,
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1;
//     renderer.outputColorSpace = THREE.SRGBColorSpace;

//     const textureLoader = new THREE.TextureLoader();
//     const colorTexture = textureLoader.load("text/maletest/Plastic_color.jpg");
//     const roughnessTexture = textureLoader.load("text/maletest/Plastic_roughness.jpg");
//     const normalTexture = textureLoader.load("text/maletest/Plastic_normal.jpg");

//     // Load 3D model
//     const loader = new GLTFLoader();
//     loader.load(
//       "/text/male_shoulder_sculpture.glb",
//       (gltf) => {
//         gltf.scene.traverse((child) => {
//           if ((child as THREE.Mesh).isMesh) {
//             const mesh = child as THREE.Mesh;
//             if (
//               mesh.material &&
//               (mesh.material as THREE.MeshStandardMaterial)
//             ) {
//               const material = mesh.material as THREE.MeshStandardMaterial;
//               material.map = colorTexture;
//               material.roughnessMap = roughnessTexture;
//               material.normalMap = normalTexture;
//               material.needsUpdate = true; // Update material
//             }
//           }
//         });
//         scene.add(gltf.scene);
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading GLTF model:", error);
//       }
//     );

//     // Environment map (optional, uncomment if needed)
//     // const rgbeLoader = new RGBELoader();
//     // rgbeLoader.load(
//     //   "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/rogland_moonlit_night_1k.hdr",
//     //   (texture) => {
//     //     texture.mapping = THREE.EquirectangularReflectionMapping;
//     //     scene.environment = texture;
//     //   }
//     // );

//     // Orbit Controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.25;
//     controls.enableZoom = true;

//     // Handle window resize
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener("resize", handleResize);

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Cleanup on unmount
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       controls.dispose();
//       renderer.dispose();
//     };
//   }, []);

//   return <canvas ref={canvasRef} id="screen" style={{ display: "block" }} />;
// };

// export default App;

