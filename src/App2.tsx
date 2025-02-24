import * as THREE from "three";
import { useEffect, useRef } from "react";
import { GLTFLoader, RenderPass } from "three/examples/jsm/Addons.js";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { EffectComposer } from "three/examples/jsm/Addons.js";
import { RGBShiftShader } from "three/examples/jsm/Addons.js";
import { ShaderPass } from "three/examples/jsm/Addons.js";

const App2: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 3.5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const pmremGen = new THREE.PMREMGenerator(renderer);
    pmremGen.compileEquirectangularShader();

    // RGBE Loader
    new RGBELoader().load(
      "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr",
      (texture) => {
        texture.flipY = false;
        const envMap = pmremGen.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        texture.dispose();
        pmremGen.dispose();


        const loader = new GLTFLoader();

        loader.load(
          "/DamagedHelmet.gltf",
          (gltf) => {
            modelRef.current = gltf.scene;
            scene.add(gltf.scene);
          },
          undefined,
          (error) => {
            console.error("An error occured ", error);
          }
        );
      }
    );

    const handleMouseMove = (e: MouseEvent) => {
      if (modelRef.current) {
        const rotateX = (e.clientX / window.innerWidth - 0.5) * (Math.PI * 0.1);
        const rotateY =
          (e.clientY / window.innerHeight - 0.5) * (Math.PI * 0.1);
        modelRef.current.rotation.x = rotateY;
        modelRef.current.rotation.y = rotateX;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Postprocessing setup
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms["amount"].value = 0.0015;
    composer.addPass(rgbShiftPass);

    // Animation loop
    const animate = () => {
      window.requestAnimationFrame(animate);
      composer.render();
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      if (composer) {
        composer.reset();
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="w-full">
      <div className="w-full h-screen overflow-hidden">
        <img className="absolute top-1/2 left-1/2 w-2/3 -translate-x-1/2 -translate-y-1/2 mix-blend-screen filter saturate-150 contrast-125" src="https://preview.redd.it/3d-rendered-the-cyberpunk-logo-using-blender-v0-khopj82wqee91.png?width=640&crop=smart&auto=webp&s=8c31445d1ee6f6993331b7d7d11bad170086631c" alt="" />
        <canvas
          ref={canvasRef}
          className=""
          id="screen"
          style={{ display: "block" }}
        />
      </div>
      {/* <div className="w-full h-screen bg-zinc-800"></div> */}
    </div>
  );
};

export default App2;