import * as THREE from "three";
import { useEffect, useRef } from "react";
// import { GLTFLoader, RGBELoader } from "three/examples/jsm/Addons.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fanRefs = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.CylinderGeometry(100,100,150, 8, 1, false, 0, Math.PI);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const capsule = new THREE.Mesh(geometry, material);
    scene.add(capsule);

    // const pmremGen = new THREE.PMREMGenerator(renderer);
    // pmremGen.compileEquirectangularShader();

    // RGBE Loader
    // new RGBELoader().load(
    //   "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr",
    //   (texture) => {
    //     texture.flipY = false;
    //     const envMap = pmremGen.fromEquirectangular(texture).texture;
    //     scene.environment = envMap;
    //     texture.dispose();
    //     pmremGen.dispose();

    //     const loader = new GLTFLoader();

    //     loader.load(
    //       "/text/computer-_pc_futuristic.glb",
    //       (gltf) => {
    //         scene.add(gltf.scene);
    //       },
    //       undefined,
    //       (error) => {
    //         console.error("An error occured ", error);
    //       }
    //     );
    //   }
    // );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    let isInteracting = false;

    // Detect interaction with OrbitControls
    controls.addEventListener("start", () => {
      isInteracting = true;
    });
    controls.addEventListener("end", () => {
      isInteracting = false;
    });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      // capsule.rotation.x +=0.01
      // capsule.rotation.y +=0.01
      // capsule.rotation.z +=0.01

      // Rotate fans when interacting
      if (isInteracting) {
        fanRefs.current.forEach((fan) => {
          fan.rotation.y += 0.1; // Adjust speed as needed
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="w-full">
      <div className="w-full h-screen overflow-hidden">
        {/* <img className="absolute top-1/2 left-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 mix-blend-screen filter saturate-150 contrast-125" src="https://preview.redd.it/3d-rendered-the-cyberpunk-logo-using-blender-v0-khopj82wqee91.png?width=640&crop=smart&auto=webp&s=8c31445d1ee6f6993331b7d7d11bad170086631c" alt="" /> */}
        <canvas
          ref={canvasRef}
          className=""
          id="screen"
          style={{ display: "block" }}
        />
      </div>
      <div className="w-full h-screen bg-zinc-800"></div>
    </div>
  );
};

export default App;
