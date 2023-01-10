import React from 'react'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Icosahedron } from '@react-three/drei'
import './shaders/WaveShaderMaterial'

const Scene = () => {
  const ref = React.useRef<any>(null)

  React.useEffect(() => {
    const handleMousemove = (event: MouseEvent) => {
      const x = parseFloat((event.clientX / window.innerWidth).toFixed(2)) * 4
      const y = parseFloat((event.clientX / window.innerWidth).toFixed(2)) * 4

      if (ref.current) {
        gsap.to(ref.current.material.uniforms.uFrequency, 1, { value: x })
        gsap.to(ref.current.material.uniforms.uAmplitude, 1, { value: x })
        gsap.to(ref.current.material.uniforms.uDensity, 1, { value: y })
        gsap.to(ref.current.material.uniforms.uStrength, 1, { value: y })
      }
    }

    window.addEventListener('mousemove', handleMousemove)

    return () => {
      window.removeEventListener('mousemove', handleMousemove)
    }
  }, [])

  useFrame(() => {
    ref.current.rotation.y += 0.001
  })

  return (
    <Icosahedron ref={ref} args={[1, 64]}>
      {/* @ts-ignore */}
      <waveShaderMaterial
        wireframe={true}
        blending={THREE.AdditiveBlending}
        transparent={true}
        uDeepPurple={0.2}
        uOpacity={0.2}
      />
    </Icosahedron>
  )
}

const Background = () => {
  return (
    <Canvas>
      <Scene />
    </Canvas>
  )
}

export default Background
