import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Fixed full-viewport Three.js background for the landing page.
 *
 * The "kernel" core (wireframe icosahedron + glowing nucleus) is orbited by
 * seven agent nodes. Data packets stream between agents and the core, and a
 * drifting ember particle field fills the space. Page scroll drives the camera
 * (dolly + orbit) so the scene evolves as the visitor moves through sections.
 */

const AGENT_COLORS = [
  0xe86526, // Orchestrator
  0xf59e0b, // Planner
  0xd9531e, // Coder
  0x22c55e, // Tester
  0x38bdf8, // Reviewer
  0xa78bfa, // Researcher
  0xf43f5e, // Debugger
];

interface KernelSceneProps {
  isDark: boolean;
}

function makeGlowTexture(): THREE.Texture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,200,160,0.65)');
  g.addColorStop(0.6, 'rgba(232,101,38,0.18)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const KernelScene: React.FC<KernelSceneProps> = ({ isDark }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<(dark: boolean) => void>(() => {});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return; // No WebGL: the page still renders with its CSS background.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 14);

    const root = new THREE.Group();
    scene.add(root);

    const glowTex = makeGlowTexture();
    const disposables: { dispose: () => void }[] = [glowTex];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    // ── Kernel core ───────────────────────────────────────────────────────
    const core = new THREE.Group();
    root.add(core);

    const shellGeo = track(new THREE.IcosahedronGeometry(2.2, 1));
    const shellMat = track(
      new THREE.MeshBasicMaterial({ color: 0xe86526, wireframe: true, transparent: true, opacity: 0.55 }),
    );
    const shell = new THREE.Mesh(shellGeo, shellMat);
    core.add(shell);

    const outerGeo = track(new THREE.IcosahedronGeometry(3.1, 0));
    const outerMat = track(
      new THREE.MeshBasicMaterial({ color: 0xa64011, wireframe: true, transparent: true, opacity: 0.25 }),
    );
    const outer = new THREE.Mesh(outerGeo, outerMat);
    core.add(outer);

    const nucleusGeo = track(new THREE.SphereGeometry(0.65, 32, 32));
    const nucleusMat = track(new THREE.MeshBasicMaterial({ color: 0xffb37a, transparent: true, opacity: 0.8 }));
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    core.add(nucleus);

    const coreGlowMat = track(
      new THREE.SpriteMaterial({ map: glowTex, color: 0xe86526, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    const coreGlow = new THREE.Sprite(coreGlowMat);
    coreGlow.scale.setScalar(7.5);
    core.add(coreGlow);

    // Vertex sparks on the shell
    const vertGeo = track(new THREE.BufferGeometry());
    vertGeo.setAttribute('position', shellGeo.getAttribute('position').clone());
    const vertMat = track(
      new THREE.PointsMaterial({ color: 0xffd2b0, size: 0.09, transparent: true, opacity: 0.9, depthWrite: false }),
    );
    core.add(new THREE.Points(vertGeo, vertMat));

    // ── Orbit rings + agents ──────────────────────────────────────────────
    const ringMat = track(new THREE.LineBasicMaterial({ color: 0x752c12, transparent: true, opacity: 0.45 }));
    const agents: {
      group: THREE.Group;
      node: THREE.Mesh;
      radius: number;
      speed: number;
      phase: number;
      tilt: THREE.Euler;
      color: THREE.Color;
    }[] = [];

    const nodeGeo = track(new THREE.OctahedronGeometry(0.28, 0));
    AGENT_COLORS.forEach((hex, i) => {
      const radius = 4.6 + (i % 3) * 0.9;
      const tilt = new THREE.Euler((i * 0.47) % Math.PI, (i * 1.13) % Math.PI, (i * 0.31) % Math.PI);
      const group = new THREE.Group();
      group.rotation.copy(tilt);
      root.add(group);

      const pts: THREE.Vector3[] = [];
      for (let a = 0; a <= 128; a++) {
        const t = (a / 128) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(t) * radius, Math.sin(t) * radius, 0));
      }
      const ringGeo = track(new THREE.BufferGeometry().setFromPoints(pts));
      group.add(new THREE.Line(ringGeo, ringMat));

      const color = new THREE.Color(hex);
      const nodeMat = track(new THREE.MeshBasicMaterial({ color }));
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const glowMat = track(
        new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
      );
      const glow = new THREE.Sprite(glowMat);
      glow.scale.setScalar(1.6);
      node.add(glow);
      group.add(node);

      agents.push({ group, node, radius, speed: 0.12 + i * 0.025, phase: (i / AGENT_COLORS.length) * Math.PI * 2, tilt, color });
    });

    // ── Links from agents to core (updated each frame) ────────────────────
    const linkPositions = new Float32Array(agents.length * 2 * 3);
    const linkGeo = track(new THREE.BufferGeometry());
    linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3));
    const linkMat = track(new THREE.LineBasicMaterial({ color: 0xe86526, transparent: true, opacity: 0.22 }));
    root.add(new THREE.LineSegments(linkGeo, linkMat));

    // ── Data packets travelling along links ───────────────────────────────
    const PACKETS = 28;
    const packetPos = new Float32Array(PACKETS * 3);
    const packetGeo = track(new THREE.BufferGeometry());
    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPos, 3));
    const packetMat = track(
      new THREE.PointsMaterial({ color: 0xffd2b0, size: 0.16, map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    root.add(new THREE.Points(packetGeo, packetMat));
    const packets = Array.from({ length: PACKETS }, (_, i) => ({
      agent: i % agents.length,
      t: Math.random(),
      speed: 0.25 + Math.random() * 0.35,
      inbound: Math.random() > 0.5,
    }));

    // ── Ember particle field ──────────────────────────────────────────────
    const FIELD = isMobile ? 900 : 2200;
    const fieldPos = new Float32Array(FIELD * 3);
    for (let i = 0; i < FIELD; i++) {
      const r = 9 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      fieldPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      fieldPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      fieldPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const fieldGeo = track(new THREE.BufferGeometry());
    fieldGeo.setAttribute('position', new THREE.BufferAttribute(fieldPos, 3));
    const fieldMat = track(
      new THREE.PointsMaterial({ color: 0xd9531e, size: 0.07, transparent: true, opacity: 0.7, depthWrite: false }),
    );
    const field = new THREE.Points(fieldGeo, fieldMat);
    scene.add(field);

    // ── Theme handling ────────────────────────────────────────────────────
    const additive = [coreGlowMat, packetMat, ...agents.map((a) => (a.node.children[0] as THREE.Sprite).material)];
    const applyTheme = (dark: boolean) => {
      const blend = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      additive.forEach((m) => {
        m.blending = blend;
        m.needsUpdate = true;
      });
      coreGlowMat.opacity = dark ? 1 : 0.35;
      nucleusMat.color.set(dark ? 0xffb37a : 0xc94b1a);
      vertMat.color.set(dark ? 0xffd2b0 : 0x9b3a18);
      packetMat.color.set(dark ? 0xffd2b0 : 0xc0491e);
      ringMat.color.set(dark ? 0x752c12 : 0xd9a08a);
      fieldMat.color.set(dark ? 0xd9531e : 0xc0491e);
      fieldMat.opacity = dark ? 0.7 : 0.45;
      shellMat.opacity = dark ? 0.55 : 0.6;
    };
    themeRef.current = applyTheme;
    applyTheme(document.documentElement.classList.contains('dark'));

    // ── Input: pointer parallax + scroll progress ─────────────────────────
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    let scrollTarget = 0;
    let scroll = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = max > 0 ? window.scrollY / max : 0;
    };
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      onScroll();
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();

    // ── Render loop ───────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();
    let raf = 0;
    let running = true;

    const frame = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const motion = reduceMotion ? 0 : 1;

      scroll += (scrollTarget - scroll) * 0.06;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      // Core
      shell.rotation.x += dt * 0.15 * motion;
      shell.rotation.y += dt * 0.22 * motion;
      outer.rotation.y -= dt * 0.08 * motion;
      outer.rotation.z += dt * 0.05 * motion;
      const pulse = 1 + Math.sin(t * 2.2) * 0.06 * motion;
      nucleus.scale.setScalar(pulse);
      coreGlow.scale.setScalar(7.5 * pulse);

      // Agents
      agents.forEach((a, i) => {
        const ang = a.phase + t * a.speed * motion;
        a.node.position.set(Math.cos(ang) * a.radius, Math.sin(ang) * a.radius, 0);
        a.node.rotation.y += dt * 1.2 * motion;
        a.node.getWorldPosition(tmp);
        root.worldToLocal(tmp);
        linkPositions.set([0, 0, 0, tmp.x, tmp.y, tmp.z], i * 6);
      });
      linkGeo.attributes.position.needsUpdate = true;
      linkMat.opacity = 0.16 + Math.sin(t * 1.5) * 0.06;

      // Packets
      packets.forEach((p, i) => {
        p.t += dt * p.speed * motion;
        if (p.t > 1) {
          p.t = 0;
          p.agent = Math.floor(Math.random() * agents.length);
          p.inbound = !p.inbound;
        }
        const k = p.inbound ? 1 - p.t : p.t;
        const o = p.agent * 6;
        packetPos[i * 3] = linkPositions[o + 3] * k;
        packetPos[i * 3 + 1] = linkPositions[o + 4] * k;
        packetPos[i * 3 + 2] = linkPositions[o + 5] * k;
      });
      packetGeo.attributes.position.needsUpdate = true;

      field.rotation.y += dt * 0.012 * motion;
      field.rotation.x = scroll * 0.6;

      // Scroll-driven camera: dolly in, orbit, then pull back near the end.
      const s = scroll;
      const dolly = 14 - Math.sin(Math.min(s * 1.6, 1) * Math.PI * 0.5) * 5 + Math.max(0, s - 0.7) * 22;
      const orbit = s * Math.PI * 1.2;
      camera.position.set(Math.sin(orbit) * dolly * 0.55 + pointer.x * 1.2, -pointer.y * 0.9 + Math.sin(s * Math.PI) * 2, Math.cos(orbit) * dolly);
      camera.lookAt(0, 0, 0);

      // Shift the kernel to the right on wide screens in the hero so text has room.
      const wide = window.innerWidth >= 1024;
      root.position.x = wide ? THREE.MathUtils.lerp(3.6, 0, Math.min(s * 4, 1)) : 0;
      root.position.y = wide ? 0 : THREE.MathUtils.lerp(3.2, 0, Math.min(s * 4, 1));
      root.scale.setScalar(wide ? 1 : 0.72);
      root.rotation.z = s * 0.8;

      // Dim the scene once the visitor leaves the hero so section text stays readable.
      const dim = Math.min(Math.max((window.scrollY - window.innerHeight * 0.3) / (window.innerHeight * 0.7), 0), 1);
      renderer.domElement.style.opacity = String((wide ? 1 : 0.6) - dim * (wide ? 0.62 : 0.25));

      renderer.render(scene, camera);
      if (running) raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        clock.getDelta();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    themeRef.current(isDark);
  }, [isDark]);

  return <div ref={mountRef} aria-hidden className="fixed inset-0 z-0 pointer-events-none" />;
};
