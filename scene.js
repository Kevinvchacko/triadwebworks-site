/* Triad Webworks — the live particle field.
   One point cloud, six forms. app.js sets window.TRIAD.target as sections enter;
   every particle eases toward its place in the new form at its own speed. */
import * as THREE from './vendor/three.module.min.js';

(function () {
  var T = window.TRIAD || (window.TRIAD = { target: { shape: 0, x: 0, y: 0, s: 1, o: 1, rx: 0, ry: 0, spin: 0 }, vel: 0, go: false });
  var canvas = document.getElementById('gl');
  if (!canvas) return;
  var mm = function (q) { return window.matchMedia ? window.matchMedia(q).matches : false; };
  var reduce = mm('(prefers-reduced-motion: reduce)');
  var coarse = mm('(pointer: coarse)') || mm('(max-width: 820px)');

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    document.documentElement.classList.add('no-gl');
    return;
  }
  var DPR = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
  renderer.setPixelRatio(DPR);
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7.2);

  var N = coarse ? 11000 : 26000;
  var rnd = Math.random;
  var TAU = Math.PI * 2;
  function g3() { return (rnd() + rnd() + rnd() - 1.5) / 1.5; }
  var COL = [[0.56, 0.42, 1.0], [0.90, 0.30, 0.86], [1.0, 0.55, 0.30]];
  var WHITE = [0.97, 0.95, 1.0];
  function mixc(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function dim(c, k) { return [c[0] * k, c[1] * k, c[2] * k]; }
  function make() { return { pos: new Float32Array(N * 3), col: new Float32Array(N * 3) }; }
  function put(S, i, x, y, z, c) {
    var j = i * 3;
    S.pos[j] = x; S.pos[j + 1] = y; S.pos[j + 2] = z;
    S.col[j] = c[0]; S.col[j + 1] = c[1]; S.col[j + 2] = c[2];
  }
  function rotate(S, rx, ry) {
    var cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), p = S.pos;
    for (var i = 0; i < N * 3; i += 3) {
      var x = p[i], y = p[i + 1], z = p[i + 2];
      var y1 = y * cx - z * sx, z1 = y * sx + z * cx;
      p[i] = x * cy + z1 * sy; p[i + 1] = y1; p[i + 2] = -x * sy + z1 * cy;
    }
    return S;
  }
  function sparkle(c) { return rnd() < 0.035 ? WHITE : c; }

  /* 0 — the triad: three nodes and the lines between them */
  var V = [[0, 1.72, 0], [1.49, -0.86, 0], [-1.49, -0.86, 0]];
  function shapeTriad() {
    var S = make();
    for (var i = 0; i < N; i++) {
      var g = i % 3, u = rnd(), x, y, z, c = COL[g];
      if (u < 0.62) {
        var th = rnd() * TAU, ph = Math.acos(2 * rnd() - 1), shell = rnd() < 0.72;
        var r = 0.6 * (shell ? 0.93 + 0.07 * rnd() : Math.cbrt(rnd()));
        x = V[g][0] + r * Math.sin(ph) * Math.cos(th);
        y = V[g][1] + r * Math.sin(ph) * Math.sin(th);
        z = r * Math.cos(ph);
        if (!shell) c = mixc(c, WHITE, 0.4);
      } else if (u < 0.9) {
        var h = (g + 1) % 3, t = rnd();
        x = V[g][0] + (V[h][0] - V[g][0]) * t + g3() * 0.03;
        y = V[g][1] + (V[h][1] - V[g][1]) * t + g3() * 0.03;
        z = g3() * 0.03;
        c = mixc(COL[g], COL[h], t);
      } else {
        var a = rnd() * TAU, rr = 2.65 + g3() * 0.12;
        x = Math.cos(a) * rr; y = Math.sin(a) * rr; z = g3() * 0.25;
        c = dim(mixc(COL[g], WHITE, 0.5), 0.6);
      }
      put(S, i, x, y, z, sparkle(c));
    }
    return S;
  }

  /* 1 — build: a website pulled apart into its layers */
  function shapeBuild() {
    var S = make(), W = 3.3, H = 2.05;
    var blocks = [
      null,
      [[-1.55, 0.76, 1.55, 0.96], [-1.55, -0.1, 0.15, 0.6], [0.3, -0.1, 1.55, 0.6], [-1.55, -0.96, 1.55, -0.78]],
      [[-1.45, 0.44, 0.1, 0.52], [-1.45, 0.29, -0.2, 0.35], [-1.45, 0.14, -0.5, 0.2], [-1.45, -0.1, -0.85, 0.02],
       [-1.45, -0.7, -0.6, -0.28], [-0.42, -0.7, 0.42, -0.28], [0.6, -0.7, 1.45, -0.28]],
      [[-1.5, 0.8, -1.15, 0.92], [0.95, 0.8, 1.5, 0.92], [0.45, 0.05, 1.4, 0.5]]
    ];
    var areas = blocks.map(function (bl) {
      if (!bl) return null;
      var acc = 0;
      return bl.map(function (b) { acc += (b[2] - b[0]) * (b[3] - b[1]); return acc; });
    });
    for (var i = 0; i < N; i++) {
      var L = i % 4, z = (L - 1.5) * 0.62, x, y, c = L === 3 ? mixc(COL[2], WHITE, 0.25) : COL[L % 3];
      if (L === 3 && rnd() < 0.5) c = COL[2];
      var u = rnd();
      if (u < 0.28) {
        var p = rnd() * 2 * (W + H);
        if (p < W) { x = -W / 2 + p; y = H / 2; }
        else if (p < W + H) { x = W / 2; y = H / 2 - (p - W); }
        else if (p < 2 * W + H) { x = W / 2 - (p - W - H); y = -H / 2; }
        else { x = -W / 2; y = -H / 2 + (p - 2 * W - H); }
        x += g3() * 0.012; y += g3() * 0.012;
      } else if (L === 0) {
        x = -W / 2 + Math.round(rnd() * 22) / 22 * W;
        y = -H / 2 + Math.round(rnd() * 14) / 14 * H;
        c = dim(c, 0.75);
      } else {
        var ar = areas[L], pick = rnd() * ar[ar.length - 1], k = 0;
        while (ar[k] < pick) k++;
        var b = blocks[L][k];
        x = b[0] + rnd() * (b[2] - b[0]);
        y = b[1] + rnd() * (b[3] - b[1]);
      }
      put(S, i, x, y, z + g3() * 0.01, sparkle(c));
    }
    return rotate(S, -0.42, 0.62);
  }

  /* 2 — secure: the shield, its mesh, and the check */
  function shapeSecure() {
    var S = make();
    function hw(y) { if (y > 0.25) return 1.3; var t = (y + 1.75) / 2.0; return 1.3 * Math.pow(Math.max(t, 0), 0.62); }
    function top(x) { return 1.5 - 0.38 * Math.abs(x) / 1.3; }
    function zc(x) { return 0.42 * (1 - (x / 1.3) * (x / 1.3)) - 0.2; }
    var chk = [[-0.58, 0.02], [-0.13, -0.45], [0.66, 0.52]];
    for (var i = 0; i < N; i++) {
      var u = rnd(), x, y, z, c;
      if (u < 0.42) {
        do { x = (rnd() * 2 - 1) * 1.3; y = -1.75 + rnd() * 3.25; } while (!(Math.abs(x) < hw(y) && y < top(x)));
        x = Math.round(x / 0.085) * 0.085; y = Math.round(y / 0.085) * 0.085;
        if (!(Math.abs(x) < hw(y) && y < top(x))) { x *= 0.95; y *= 0.95; }
        z = zc(x) + g3() * 0.01;
        c = dim(mixc(COL[0], COL[1], (1.5 - y) / 3.25), 0.7);
      } else if (u < 0.74) {
        if (rnd() < 0.3) { x = (rnd() * 2 - 1) * 1.3; y = top(x); }
        else { y = -1.75 + rnd() * 2.88; x = (rnd() < 0.5 ? -1 : 1) * hw(y); }
        x += g3() * 0.03; y += g3() * 0.03; z = zc(Math.max(-1.3, Math.min(1.3, x))) + 0.02;
        c = mixc(mixc(COL[0], COL[1], 0.5), COL[2], Math.max(0, Math.min(1, (1.2 - y) / 2.9)));
      } else if (u < 0.93) {
        var seg = rnd() < 0.36 ? 0 : 1, t = rnd(), a = chk[seg], b = chk[seg + 1];
        x = a[0] + (b[0] - a[0]) * t + g3() * 0.05;
        y = a[1] + (b[1] - a[1]) * t + g3() * 0.05;
        z = 0.42 + g3() * 0.05;
        c = rnd() < 0.5 ? WHITE : COL[2];
      } else {
        var an = rnd() * TAU;
        x = Math.cos(an) * 2.15; y = Math.sin(an) * 0.5 - 0.1; z = Math.sin(an) * 1.2;
        c = dim(COL[1], 0.8);
      }
      put(S, i, x, y, z, sparkle(c));
    }
    return S;
  }

  /* 3 — maintain: a gyroscope that keeps turning */
  function shapeMaintain() {
    var S = make();
    var rings = [{ r: 1.65, rx: 0, ry: 0 }, { r: 1.38, rx: 1.15, ry: 0.2 }, { r: 1.1, rx: 0.55, ry: 1.1 }];
    for (var i = 0; i < N; i++) {
      var g = i % 3, u = rnd(), x, y, z, c = COL[g];
      if (u < 0.76) {
        var R = rings[g], a = rnd() * TAU, tube = 0.05;
        var lx = Math.cos(a) * (R.r + g3() * tube), ly = Math.sin(a) * (R.r + g3() * tube), lz = g3() * tube;
        var cx = Math.cos(R.rx), sx = Math.sin(R.rx), cy = Math.cos(R.ry), sy = Math.sin(R.ry);
        var y1 = ly * cx - lz * sx, z1 = ly * sx + lz * cx;
        x = lx * cy + z1 * sy; y = y1; z = -lx * sy + z1 * cy;
      } else if (u < 0.92) {
        var th = rnd() * TAU, ph = Math.acos(2 * rnd() - 1), r = 0.38 * Math.cbrt(rnd());
        x = r * Math.sin(ph) * Math.cos(th); y = r * Math.sin(ph) * Math.sin(th); z = r * Math.cos(ph);
        c = mixc(COL[g], WHITE, 0.55);
      } else {
        var R2 = rings[g], a2 = g * 2.1 + 0.6, sr = 0.13;
        var px = Math.cos(a2) * R2.r + g3() * sr, py = Math.sin(a2) * R2.r + g3() * sr, pz = g3() * sr;
        var cx2 = Math.cos(R2.rx), sx2 = Math.sin(R2.rx), cy2 = Math.cos(R2.ry), sy2 = Math.sin(R2.ry);
        var y2 = py * cx2 - pz * sx2, z2 = py * sx2 + pz * cx2;
        x = px * cy2 + z2 * sy2; y = y2; z = -px * sy2 + z2 * cy2;
        c = WHITE;
      }
      put(S, i, x, y, z, sparkle(c));
    }
    return S;
  }

  /* 4 — process: a field that rolls like a long road */
  function shapeWave() {
    var S = make(), cols = 230, rows = Math.ceil(N / cols);
    for (var i = 0; i < N; i++) {
      var ix = i % cols, iz = Math.floor(i / cols);
      var x = -5.2 + (ix / (cols - 1)) * 10.4, z = -2.6 + (iz / Math.max(1, rows - 1)) * 5.2;
      var t = ix / (cols - 1);
      var c = t < 0.5 ? mixc(COL[0], COL[1], t * 2) : mixc(COL[1], COL[2], (t - 0.5) * 2);
      put(S, i, x, 0, z, sparkle(dim(c, 0.9 + 0.5 * (iz / rows))));
    }
    return S;
  }

  /* 5 — the globe, lit at Chennai */
  function ll(lat, lon, r) {
    var la = lat * Math.PI / 180, lo = lon * Math.PI / 180;
    return [r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo)];
  }
  function shapeGlobe() {
    var S = make(), R = 1.75, home = [13.08, 80.27];
    var dest = [[51.5, -0.1], [40.7, -74], [25.2, 55.3], [1.35, 103.8], [-33.9, 151.2], [35.7, 139.7], [19.07, 72.88], [12.97, 77.59]];
    var hv = ll(home[0], home[1], 1);
    for (var i = 0; i < N; i++) {
      var u = rnd(), p, c;
      if (u < 0.4) {
        if (rnd() < 0.5) { var lat = -60 + Math.floor(rnd() * 7) * 20; p = ll(lat, rnd() * 360, R); }
        else { var lon = Math.floor(rnd() * 18) * 20; p = ll(-85 + rnd() * 170, lon, R); }
        c = dim(COL[0], 0.85);
      } else if (u < 0.74) {
        p = ll(Math.asin(2 * rnd() - 1) * 180 / Math.PI, rnd() * 360, R * (0.985 + rnd() * 0.02));
        c = dim(COL[1], 0.45);
      } else if (u < 0.84) {
        p = ll(home[0] + g3() * 2.4, home[1] + g3() * 2.4, R * 1.01);
        c = rnd() < 0.4 ? WHITE : COL[2];
      } else {
        var d = dest[i % dest.length], dv = ll(d[0], d[1], 1), t = rnd();
        var dot = hv[0] * dv[0] + hv[1] * dv[1] + hv[2] * dv[2], om = Math.acos(Math.max(-1, Math.min(1, dot)));
        var s0 = Math.sin((1 - t) * om) / Math.sin(om), s1 = Math.sin(t * om) / Math.sin(om);
        var lift = R * (1 + Math.sin(Math.PI * t) * 0.18 * om);
        p = [(hv[0] * s0 + dv[0] * s1) * lift, (hv[1] * s0 + dv[1] * s1) * lift, (hv[2] * s0 + dv[2] * s1) * lift];
        c = mixc(COL[2], COL[1], t);
      }
      put(S, i, p[0], p[1], p[2], sparkle(c));
    }
    return S;
  }

  var SHAPES = [shapeTriad(), shapeBuild(), shapeSecure(), shapeMaintain(), shapeWave(), shapeGlobe()];

  /* current state starts as a wide scatter, so the triad assembles on load */
  var cur = new Float32Array(N * 3), curC = new Float32Array(N * 3), speed = new Float32Array(N), aR = new Float32Array(N * 4);
  for (var i = 0; i < N; i++) {
    var th = rnd() * TAU, ph = Math.acos(2 * rnd() - 1), r = 6 + rnd() * 10;
    cur[i * 3] = r * Math.sin(ph) * Math.cos(th);
    cur[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    cur[i * 3 + 2] = r * Math.cos(ph) - 4;
    curC[i * 3] = 0.3; curC[i * 3 + 1] = 0.25; curC[i * 3 + 2] = 0.5;
    var s = rnd();
    speed[i] = 0.028 + s * s * 0.07;
    aR[i * 4] = rnd(); aR[i * 4 + 1] = rnd(); aR[i * 4 + 2] = rnd(); aR[i * 4 + 3] = rnd();
  }

  var geo = new THREE.BufferGeometry();
  var posAttr = new THREE.BufferAttribute(cur, 3).setUsage(THREE.DynamicDrawUsage);
  var colAttr = new THREE.BufferAttribute(curC, 3).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  geo.setAttribute('color', colAttr);
  geo.setAttribute('aR', new THREE.BufferAttribute(aR, 4));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);

  var uniforms = {
    uTime: { value: 0 }, uPix: { value: DPR }, uSize: { value: coarse ? 15 : 14 },
    uAgit: { value: 1 }, uWave: { value: 0 }, uOpacity: { value: 0 },
    uMouse: { value: new THREE.Vector2(99, 99) }, uMouseOn: { value: 0 }
  };
  var mat = new THREE.ShaderMaterial({
    uniforms: uniforms, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending,
    vertexShader: [
      'uniform float uTime,uPix,uSize,uAgit,uWave,uOpacity,uMouseOn;uniform vec2 uMouse;',
      'attribute vec3 color;attribute vec4 aR;varying vec3 vCol;varying float vA;',
      'void main(){',
      ' vec3 p=position;',
      ' p.y+=uWave*(sin(p.x*1.2+uTime*1.1)*cos(p.z*1.35+uTime*0.85)*0.34+sin(p.x*0.45-uTime*0.6)*0.22);',
      ' float ph=aR.w*6.2831;',
      ' p+=vec3(sin(uTime*0.9+ph),cos(uTime*0.7+ph*1.3),sin(uTime*0.8+ph*0.7))*(0.01+aR.x*0.018);',
      ' if(uAgit>0.002){vec3 q=p*1.5+uTime*0.6;p+=vec3(sin(q.y+ph),sin(q.z+ph*1.7),sin(q.x+ph*2.3))*uAgit*(0.2+aR.x*0.7);}',
      ' vec4 wp=modelMatrix*vec4(p,1.0);',
      ' vec2 d=wp.xy-uMouse;float dist=length(d);float push=uMouseOn*exp(-dist*dist*1.8);',
      ' wp.xy+=normalize(d+1e-4)*push*0.5;wp.z+=push*0.7;',
      ' vec4 mv=viewMatrix*wp;gl_Position=projectionMatrix*mv;',
      ' gl_PointSize=uSize*(0.5+aR.y*0.9)*uPix*(1.0+push*1.4+uAgit*0.5)/-mv.z;',
      ' vCol=color*(1.0+push*0.6);vA=uOpacity*(0.5+aR.z*0.5);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'varying vec3 vCol;varying float vA;',
      'void main(){vec2 c=gl_PointCoord-0.5;float d=length(c);if(d>0.5)discard;',
      ' float a=smoothstep(0.5,0.04,d);float core=smoothstep(0.18,0.0,d);',
      ' gl_FragColor=vec4(vCol*a+core*0.28,a*vA);}'
    ].join('\n')
  });
  var points = new THREE.Points(geo, mat);
  var group = new THREE.Group();
  group.add(points);
  scene.add(group);

  /* soft light behind each node of the triad, and one behind every other form */
  function glowTex() {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }
  var gtex = glowTex();
  var GLOW_HEX = [0x7a55ff, 0xd23fe0, 0xff7a3d];
  var glows = V.map(function (v, k) {
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: gtex, color: GLOW_HEX[k], transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false }));
    sp.position.set(v[0], v[1], v[2]); sp.scale.setScalar(2.6);
    group.add(sp);
    return sp;
  });
  var core = new THREE.Sprite(new THREE.SpriteMaterial({ map: gtex, color: 0x6b43ff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false }));
  core.scale.setScalar(6);
  group.add(core);
  var triW = 0, coreW = 0;

  /* far dust for depth */
  var SN = coarse ? 600 : 1400, sp = new Float32Array(SN * 3);
  for (var k = 0; k < SN; k++) {
    sp[k * 3] = (rnd() - 0.5) * 40; sp[k * 3 + 1] = (rnd() - 0.5) * 26; sp[k * 3 + 2] = -6 - rnd() * 20;
  }
  var sgeo = new THREE.BufferGeometry();
  sgeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  var stars = new THREE.Points(sgeo, new THREE.PointsMaterial({ color: 0x9a8fd6, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false }));
  scene.add(stars);

  /* sizing */
  function resize() {
    var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 0.8 ? 9.4 : 7.2;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* pointer, projected onto the z=0 plane */
  var mouse = { x: 0, y: 0, nx: 0, ny: 0, on: 0 };
  var ray = new THREE.Vector3();
  if (!coarse && !reduce) {
    window.addEventListener('pointermove', function (e) {
      mouse.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.on = 1;
    }, { passive: true });
    document.addEventListener('pointerleave', function () { mouse.on = 0; });
  }

  /* labels that ride on the three nodes in the hero */
  var labels = [].slice.call(document.querySelectorAll('[data-node]'));
  var tmp = new THREE.Vector3();

  var st = { x: 0, y: 0, s: 1, o: 0, rx: 0, ry: 0, spin: 0 };
  var shapeNow = -1, settle = 0;
  var clock = new THREE.Clock();

  function frame() {
    var dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime, f = dt * 60;
    var tg = T.target;
    var want = T.go ? tg.shape : -1;
    if (want !== shapeNow && want >= 0) {
      shapeNow = want; settle = 0;
      uniforms.uAgit.value = Math.min(1.1, uniforms.uAgit.value + (reduce ? 0 : 0.75));
    }
    var S = shapeNow >= 0 ? SHAPES[shapeNow] : null;
    if (S && settle < 6) {
      settle += dt;
      var P = S.pos, C = S.col, mult = reduce ? 6 : 1;
      for (var i = 0, j = 0; i < N; i++, j += 3) {
        var kk = Math.min(1, speed[i] * f * mult);
        cur[j] += (P[j] - cur[j]) * kk; cur[j + 1] += (P[j + 1] - cur[j + 1]) * kk; cur[j + 2] += (P[j + 2] - cur[j + 2]) * kk;
        curC[j] += (C[j] - curC[j]) * kk; curC[j + 1] += (C[j + 1] - curC[j + 1]) * kk; curC[j + 2] += (C[j + 2] - curC[j + 2]) * kk;
      }
      posAttr.needsUpdate = true; colAttr.needsUpdate = true;
    }

    var e = 1 - Math.pow(0.05, dt);
    st.x += (tg.x - st.x) * e; st.y += (tg.y - st.y) * e; st.s += (tg.s - st.s) * e;
    st.o += ((T.go ? tg.o : 0) - st.o) * e;
    st.rx += ((tg.rx || 0) - st.rx) * e;
    st.spin += ((tg.spin || 0) + Math.max(-1.2, Math.min(1.2, T.vel * 0.0003))) * dt;
    var ryT = (tg.ry || 0) + st.spin;
    st.ry += (ryT - st.ry) * e;
    mouse.x += (mouse.nx - mouse.x) * e; mouse.y += (mouse.ny - mouse.y) * e;

    group.position.set(st.x, st.y, 0);
    group.scale.setScalar(st.s);
    group.rotation.set(st.rx - mouse.y * 0.18 + Math.sin(t * 0.3) * 0.04, st.ry + mouse.x * 0.32 + Math.sin(t * 0.2) * 0.08, 0);

    uniforms.uTime.value = t;
    uniforms.uOpacity.value = st.o;
    uniforms.uAgit.value = uniforms.uAgit.value * Math.pow(0.2, dt) + (reduce ? 0 : Math.min(Math.abs(T.vel) * 0.00006, 0.12));
    uniforms.uWave.value += ((shapeNow === 4 ? 1 : 0) - uniforms.uWave.value) * e;
    triW += ((shapeNow === 0 ? 1 : 0) - triW) * e * 0.6;
    coreW += ((shapeNow > 0 && shapeNow !== 4 ? 1 : 0) - coreW) * e * 0.6;
    for (var gi = 0; gi < 3; gi++) {
      glows[gi].material.opacity = st.o * triW * (0.42 + Math.sin(t * 1.4 + gi * 2.1) * 0.08);
      glows[gi].scale.setScalar(2.5 + Math.sin(t * 1.1 + gi) * 0.15);
    }
    core.material.opacity = st.o * coreW * 0.22;

    if (mouse.on) {
      ray.set(mouse.x, mouse.y, 0.5).unproject(camera).sub(camera.position).normalize();
      var dist = -camera.position.z / ray.z;
      uniforms.uMouse.value.set(camera.position.x + ray.x * dist, camera.position.y + ray.y * dist);
    }
    uniforms.uMouseOn.value += (mouse.on - uniforms.uMouseOn.value) * e;

    stars.rotation.y = t * 0.01 + mouse.x * 0.05;
    stars.position.y = (window.scrollY || 0) * 0.0012;

    if (labels.length) {
      var show = shapeNow === 0 && T.heroOn && st.o > 0.6 ? 1 : 0;
      group.updateMatrixWorld();
      var w = window.innerWidth, h = window.innerHeight;
      for (var n = 0; n < labels.length; n++) {
        var v = V[+labels[n].getAttribute('data-node')];
        tmp.set(v[0], v[1], v[2]).applyMatrix4(group.matrixWorld).project(camera);
        labels[n].style.transform = 'translate3d(' + ((tmp.x + 1) / 2 * w).toFixed(1) + 'px,' + ((1 - tmp.y) / 2 * h).toFixed(1) + 'px,0)';
        labels[n].style.opacity = show;
      }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  document.documentElement.classList.add('gl-on');
  requestAnimationFrame(frame);
})();
