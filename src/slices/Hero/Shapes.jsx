"use client"

import * as THREE from "three"
import {Canvas} from "@react-three/fiber"
import { ContactShadows , Float , Environment} from "@react-three/drei"
import { Suspense , useEffect , useRef , useState} from "react"
import {gsap} from "gsap"


export default function Shapes(){
    return  (
        <div className="row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0">
            <Canvas className="z-0" shadows gl={{antialias: false}} dpr={[1,1.5]} camera={{position:[0,0,25], fov:30, near:1 , far:40}}>
                <Suspense fallback={null}>
                    <Geometries />
                    <ContactShadows
                    position={[0,-5.5,0]}
                    opacity={0.65}
                    scale={40}
                    blur={1}
                    far={9} />
                    <Environment preset="sunset" />
                </Suspense>

            </Canvas>

        </div>
    )
}

function Geometries() {
    const geometries = [
        // {
        //     position: [-0.8, -0.75, 0.2],
        //     r:0.3,
        //     geometry: new THREE.IcosahedronGeometry(3) //hexagonal dice
        // },
        // {
        //     position: [1, -0.75, 4],
        //     r: 0.4,
        //     geometry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16), // Pill
        // },
        // {
        //     position: [-1.4, 2, -4],
        //     r: 0.6,
        //     geometry: new THREE.DodecahedronGeometry(1.5), // Soccer ball
        // },
        {
            position:[0,0,0],
            r: 0.5,
            geometry:  new THREE.TorusKnotGeometry( 4.322, 0.8, 680, 8, 6 ,4 ) , // knot DEV ki

        },
        // {
        //     position:[0,0,0],
        //     r: 0.5,
        //     geometry:  new THREE.TorusKnotGeometry( 2.622, 0.6, 580, 8, 8 ,5 ) , // knot
        // },
        // {
        //     position: [1.6, 1.6, -4],
        //     r: 0.7,
        //     geometry: new THREE.OctahedronGeometry(1.5), // Diamond
        // },
    ];

    const soundEffects = [
        new Audio("/sounds/hit2.ogg"),
        new Audio("/sounds/hit3.ogg"),
        new Audio("/sounds/hit4.ogg"),
    ];

    const materials = [
        // new THREE.MeshNormalMaterial(),
        // new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0 }),
        // new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.4 }),
        // new THREE.MeshStandardMaterial({ color: 0xe74c3c, roughness: 0.1 }),
        // new THREE.MeshStandardMaterial({ color: 0x8e44ad, roughness: 0.1 }),
        // new THREE.MeshStandardMaterial({ color: 0x1abc9c, roughness: 0.1 }),
        new THREE.MeshStandardMaterial({
        roughness: 0,
        metalness: 0.5,
        color: 0x2980b9,
        }),
        new THREE.MeshStandardMaterial({
        color: 0x2c3e50,
        roughness: 0.1,
        metalness: 0.5,
        }),
        new THREE.MeshStandardMaterial({
            color: 0x006D5B,
            roughness: 0.1,
            metalness: 0.5,
            }),
    ]; 



    
    


    return geometries.map(({position, r ,geometry})=>(
        <Geometry
        key={JSON.stringify(position)}
        position={position.map((p)=> p*2)}
        geometry={geometry}
        soundEffects={soundEffects}
        materials={materials} 
        r={r}
        />
    ));


}

function Geometry({r,position,geometry,soundEffects,materials}){
    const meshRef = useRef()
    const [visible , setVisible] = useState(true)
    const startingMaterial = getRandomMaterial()
    function getRandomMaterial(){
        return gsap.utils.random(materials)
    }
    function handleClick(e){
        const mesh = e.object;
        gsap.utils.random(soundEffects).play();
        gsap.to(mesh.rotation,{
            // x:`+=${gsap.utils.random(0,2)}`,
            // y:`+=${gsap.utils.random(0,2)}`,
            z:`-=3`,
            duration: 2,
            ease: "elastic.out(1,0.3)",
            yoyo:true,
        });
        mesh.material= getRandomMaterial();
        }

        const handlePointerOver = () => {
            document.body.style.cursor = "pointer";
        }

        const handlePointerOut = () => {
            document.body.style.cursor = "default";
        }

        useEffect(() => {
            let ctx = gsap.context(() => {
            setVisible(true);
            gsap.from(meshRef.current.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: gsap.utils.random(0.8, 1.2),
                ease: "elastic.out(1,0.3)",
                delay: gsap.utils.random(0, 0.5),
            });
            });

            // Rotate on the z-axis
        gsap.to(meshRef.current.rotation, {
            z: "+=360", // Adjust the rotation amount as needed
            duration: gsap.utils.random(180, 192),
            repeat: -1, // Repeat indefinitely
            ease: "linear",
            onRepeat: () => {
                // Restart the rotation when it completes
                gsap.set(meshRef.current.rotation, { z: 0 });
              },
        });

            return () => ctx.revert();
        }, []);




        return (
            <group position={position } ref={meshRef}>
                <Float speed={10 * r} rotationIntesity={12 * r} floatIntensity={5 * r}> 
                    <mesh 
                    geometry={geometry}
                    onClick={handleClick}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}
                    visible={visible}
                    material={startingMaterial}
                    ></mesh>
                </Float>
            </group>
        );
}