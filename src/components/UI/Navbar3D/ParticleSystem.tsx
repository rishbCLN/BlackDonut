import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial, Vector2 } from "three";
import { navbarStore } from "./hooks/useNavbarStore";
import { particleFragmentShader, particleVertexShader } from "./shaders/particleShader";

type ParticleUniforms = {
  uTime: { value: number };
  uScrollProgress: { value: number };
  uScrollVelocity: { value: number };
  uMouse: { value: Vector2 };
};

const COLOR_CYAN: [number, number, number] = [0.0, 1.0, 1.0];
const COLOR_VIOLET: [number, number, number] = [0.545, 0.361, 0.965];

function randSpread(range: number) {
  return (Math.random() - 0.5) * range;
}

function randRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function dampFactor(basePerFrame: number, dtFrames: number) {
  return Math.pow(basePerFrame, dtFrames);
}

const NAV_POLES: Array<[number, number]> = [
  [-2.6, 1.0],
  [-0.9, 1.0],
  [0.9, 1.0],
  [2.6, 1.0],
];

interface ParticleSystemProps {
  count?: number;
}

export default function ParticleSystem({ count = 600 }: ParticleSystemProps) {
  const pointsRef = useRef<Points>(null);
  const spawnCarryRef = useRef(0);
  const nextSpawnIndexRef = useRef(0);

  const system = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const ages = new Float32Array(count);
    const lifes = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = randSpread(7.5);
      positions[i3 + 1] = randSpread(3.0);
      positions[i3 + 2] = randSpread(6.5) - 2.0;

      seeds[i] = Math.random();
      ages[i] = randRange(0, 1.5);
      lifes[i] = randRange(2.0, 3.0);
      sizes[i] = randRange(1.6, 2.6);

      const mixT = Math.random();
      colors[i3] = COLOR_CYAN[0] + (COLOR_VIOLET[0] - COLOR_CYAN[0]) * mixT;
      colors[i3 + 1] = COLOR_CYAN[1] + (COLOR_VIOLET[1] - COLOR_CYAN[1]) * mixT;
      colors[i3 + 2] = COLOR_CYAN[2] + (COLOR_VIOLET[2] - COLOR_CYAN[2]) * mixT;

      velocities[i3] = randSpread(0.04);
      velocities[i3 + 1] = randRange(0.02, 0.12);
      velocities[i3 + 2] = randSpread(0.04);
    }

    const g = new BufferGeometry();
    const positionAttr = new BufferAttribute(positions, 3);
    const seedAttr = new BufferAttribute(seeds, 1);
    const ageAttr = new BufferAttribute(ages, 1);
    const lifeAttr = new BufferAttribute(lifes, 1);
    const sizeAttr = new BufferAttribute(sizes, 1);
    const colorAttr = new BufferAttribute(colors, 3);

    g.setAttribute("position", positionAttr);
    g.setAttribute("aSeed", seedAttr);
    g.setAttribute("aAge", ageAttr);
    g.setAttribute("aLife", lifeAttr);
    g.setAttribute("aSize", sizeAttr);
    g.setAttribute("aColor", colorAttr);

    const s = navbarStore.getState();
    const u: ParticleUniforms = {
      uTime: { value: 0 },
      uScrollProgress: { value: s.scrollProgress },
      uScrollVelocity: { value: s.scrollVelocity },
      uMouse: { value: new Vector2(s.mouseX, s.mouseY) },
    };

    return {
      geometry: g,
      uniforms: u,
      attrs: { positionAttr, seedAttr, ageAttr, lifeAttr, sizeAttr, colorAttr },
      data: { positions, velocities, seeds, ages, lifes, sizes, colors },
    };
  }, [count]);

  const material = useMemo(() => {
    const m = new ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: system.uniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });

    return m;
  }, [system.uniforms]);

  const mouseLocal = useRef({ x: 0, y: 0 });

  const spawnParticle = (index: number) => {
    const i3 = index * 3;

    system.data.positions[i3] = randSpread(6.2);
    system.data.positions[i3 + 1] = randSpread(2.2);
    system.data.positions[i3 + 2] = randSpread(5.2) - 1.6;

    system.data.velocities[i3] = randSpread(0.06);
    system.data.velocities[i3 + 1] = randRange(0.08, 0.22);
    system.data.velocities[i3 + 2] = randSpread(0.06);

    system.data.seeds[index] = Math.random();
    system.data.ages[index] = 0;
    system.data.lifes[index] = randRange(2.0, 3.0);
    system.data.sizes[index] = randRange(1.6, 2.6);

    const mixT = Math.random();
    system.data.colors[i3] = COLOR_CYAN[0] + (COLOR_VIOLET[0] - COLOR_CYAN[0]) * mixT;
    system.data.colors[i3 + 1] = COLOR_CYAN[1] + (COLOR_VIOLET[1] - COLOR_CYAN[1]) * mixT;
    system.data.colors[i3 + 2] = COLOR_CYAN[2] + (COLOR_VIOLET[2] - COLOR_CYAN[2]) * mixT;
  };

  useFrame(({ clock }, delta) => {
    const s = navbarStore.getState();

    system.uniforms.uTime.value = clock.getElapsedTime();
    system.uniforms.uScrollProgress.value = s.scrollProgress;
    system.uniforms.uScrollVelocity.value = s.scrollVelocity;
    system.uniforms.uMouse.value.set(s.mouseX, s.mouseY);

    const points = pointsRef.current;
    if (!points) return;

    const dtFrames = Math.max(0.25, Math.min(4.5, delta * 60));

    mouseLocal.current.x = (s.mouseX - 0.5) * 8.0;
    mouseLocal.current.y = (0.5 - s.mouseY) * 3.0;

    // Plan spec reads as "particles/frame". To keep behavior stable under variable FPS,
    // we emit in "per-60fps frame" units and scale by dtFrames.
    let emissionRate = Math.min(40, 12 + s.scrollVelocity * 0.8);
    if (s.scrollProgress > 0.6) emissionRate *= 0.4;
    if (s.scrollProgress > 0.85) emissionRate *= 0.05;

    spawnCarryRef.current += emissionRate * dtFrames;
    const spawnCount = Math.floor(spawnCarryRef.current);
    spawnCarryRef.current -= spawnCount;

    for (let k = 0; k < spawnCount; k += 1) {
      let index = nextSpawnIndexRef.current;
      spawnParticle(index);
      nextSpawnIndexRef.current = (index + 1) % count;
    }

    const gravityPerFrame = -0.01;
    const damping = dampFactor(0.98, dtFrames);
    const hovered = s.hoveredNavIndex;
    const pole = hovered >= 0 ? (NAV_POLES[hovered] ?? null) : null;

    for (let i = 0; i < count; i += 1) {
      const age = system.data.ages[i];
      const life = system.data.lifes[i];
      if (age >= life) continue;

      const i3 = i * 3;

      let px = system.data.positions[i3];
      let py = system.data.positions[i3 + 1];
      let pz = system.data.positions[i3 + 2];

      let vx = system.data.velocities[i3];
      let vy = system.data.velocities[i3 + 1];
      let vz = system.data.velocities[i3 + 2];

      const dxm = mouseLocal.current.x - px;
      const dym = mouseLocal.current.y - py;
      const distMouseSq = dxm * dxm + dym * dym;
      if (distMouseSq < 2.25) {
        vx += dxm * 0.12 * (dtFrames / 60);
        vy += dym * 0.12 * (dtFrames / 60);
      }

      if (pole) {
        const dxp = px - pole[0];
        const dyp = py - pole[1];
        const distPole = Math.sqrt(dxp * dxp + dyp * dyp);
        const radius = 1.35;
        if (distPole > 0.001 && distPole < radius) {
          const strength = (1 - distPole / radius) * 0.22;
          vx += (dxp / distPole) * strength * (dtFrames / 60);
          vy += (dyp / distPole) * strength * (dtFrames / 60);
        }
      }

      vy += gravityPerFrame * (dtFrames / 1.0);
      vx *= damping;
      vy *= damping;
      vz *= damping;

      px += vx * dtFrames;
      py += vy * dtFrames;
      pz += vz * dtFrames;

      system.data.positions[i3] = px;
      system.data.positions[i3 + 1] = py;
      system.data.positions[i3 + 2] = pz;

      system.data.velocities[i3] = vx;
      system.data.velocities[i3 + 1] = vy;
      system.data.velocities[i3 + 2] = vz;

      system.data.ages[i] = age + delta;

      if (Math.abs(px) > 10 || Math.abs(py) > 6.5 || pz > 4.5 || pz < -8) {
        system.data.ages[i] = system.data.lifes[i];
      }
    }

    system.attrs.positionAttr.needsUpdate = true;
    system.attrs.ageAttr.needsUpdate = true;
    if (spawnCount > 0) {
      system.attrs.seedAttr.needsUpdate = true;
      system.attrs.lifeAttr.needsUpdate = true;
      system.attrs.sizeAttr.needsUpdate = true;
      system.attrs.colorAttr.needsUpdate = true;
    }
  });

  return <points ref={pointsRef} geometry={system.geometry} material={material} />;
}
