/* 3D 模型查看器 v2（本地 three.js r160，无 CDN 依赖）
   特性：
   - 可旋转：拖动旋转 / 滚轮缩放 / 松手自动慢转 / 阻尼
   - 结构分解：setExplode(0~1) 每个零件沿"离模型中心方向"推出去
   - 环境光照：RoomEnvironment 生成的 PMREM 环境贴图 + 三点光（关键/补/轮廓）
   - 接触阴影 + 椭圆定位环，解决"悬空感"
   - 法线兜底：GLB 缺法线时自动 computeVertexNormals（否则 three.js 全黑）
   用法：Model3D.mount(canvasEl, {src, theme, explode, autoRotate}) -> ModelViewer */
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MOVABLE = ['part', 'node', 'mesh', 'solid', 'body', 'shell'];
const PALETTE = [
  0xe6eaef, 0xcdd5de, 0xb6c1cc, 0x9fabb8, 0x8e9aa8, 0xacb7c3,
  0xe8590c, 0xff9a52, 0x76828f, 0xd8dfe7, 0x828f9d, 0xf2f5f8,
];
const PALETTE_LIGHT = [
  0xdfe3e8, 0xc6cdd5, 0xadb6c0, 0x949eaa, 0x838e9b, 0xb9c2cc,
  0xe8590c, 0xff8a3d, 0x6d7885, 0xd2d9e0, 0x79848f, 0xeceff3,
];

export class ModelViewer {
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.opts = Object.assign({
      src: '', theme: 'dark', autoRotate: true, speed: 0.3,
      explode: 0, explodeScale: 1.25, wire: false, mono: false,
      env: 0.65, bg: null, onLoad: null, onProgress: null, onError: null,
      backdrop: false,            // true: 当页面背景用（压暗 + 雾化融入 + 单色灰）
      explodeZoom: 0.55,          // 分解时相机后退量（0=不退）
      ring: true,                 // 地面定位环（页面卡片里建议关掉）
      line: false,                // true: 线框（技术图纸）模式——网格精度不够时用线条更干净
      lineColor: null,            // 自定义线条颜色
      lineAngle: null,            // 线框阈值角度（默认 14°，越小细节线越多）
    }, opts);
    this.parts = [];
    this.explode = this.opts.explode;
    this.az = 0.62; this.pol = 1.12; this.dist = 0; this.tAz = 0.62; this.tPol = 1.12; this.tDist = 0;
    this.center = new THREE.Vector3(0, 0, 0);
    this.baseCenter = new THREE.Vector3(0, 0, 0);
    this.pose = { scale: 1, yaw: 0, pitch: 0, offsetX: 0, offsetY: 0, fade: 1 };
    this.ready = false;
    this._init();
  }

  get dark() { return this.opts.theme !== 'light'; }

  _init() {
    const r = this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas, antialias: true, alpha: !this.opts.bg, powerPreference: 'high-performance',
    });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.outputColorSpace = THREE.SRGBColorSpace;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = (this.dark ? 1.05 : 1.0) * (this.opts.backdrop ? 0.9 : 1);
    if (this.opts.bg) r.setClearColor(this.opts.bg, 1);

    this.scene = new THREE.Scene();
    if (!this.dark) this.scene.background = new THREE.Color(0xf3f5f7);

    // 环境贴图（室内影棚光）——金属材质靠它才有反射
    const pmrem = new THREE.PMREMGenerator(r);
    this._envRT = pmrem.fromScene(new RoomEnvironment(r), 0.035);
    this.scene.environment = this._envRT.texture;

    const hemi = new THREE.HemisphereLight(0xffffff, this.dark ? 0x28313c : 0xdfe4ea, this.dark ? 0.85 : 1.15);
    this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, this.dark ? 2.0 : 2.3);
    key.position.set(3.4, 5.2, 4.2); this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xa8c8ff, 0.85);
    fill.position.set(-4.2, 1.4, 2.4); this.scene.add(fill);
    const rim = new THREE.DirectionalLight(this.dark ? 0xffb178 : 0xffd0ab, this.dark ? 1.5 : 1.0);
    rim.position.set(-1.8, 2.6, -5.0); this.scene.add(rim);
    /* 影棚三点光：每帧跟随相机方位重排，转动时轮廓光不会丢 */
    this.rig = { key, fill, rim };

    this._loop = this._loop.bind(this);
    this._bind();
    this._resize();
    if (this.opts.src) this.load(this.opts.src);
  }

  /* 生成软阴影贴图（径向渐变） */
  _shadowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const rg = g.createRadialGradient(128, 128, 6, 128, 128, 126);
    rg.addColorStop(0, 'rgba(0,0,0,0.72)');
    rg.addColorStop(0.45, 'rgba(0,0,0,0.30)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  load(src) {
    new GLTFLoader().load(src, gltf => {
      const root = gltf.scene;
      this.model = root;
      this.scene.add(root);
      const pal = this.dark ? PALETTE : PALETTE_LIGHT;
      let i = 0;
      root.traverse(o => {
        if (!o.isMesh) return;
        if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();  // 兜底
        const nm = (o.name || '').toLowerCase();
        const isPart = MOVABLE.some(k => nm.includes(k)) || root.children.length > 1;
        const mat = new THREE.MeshStandardMaterial({
          color: (this.opts.mono || this.opts.backdrop) ? pal[i % 6] : pal[i % pal.length],
          metalness: this.opts.backdrop ? 0.26 : 0.34, roughness: 0.46,
          envMapIntensity: this.opts.env, side: THREE.DoubleSide,
          wireframe: this.opts.wire, flatShading: false,
        });
        o.material = mat;
        const wc = new THREE.Vector3();
        o.getWorldPosition(wc);
        if (isPart) this.parts.push({ obj: o, base: o.position.clone(), world0: wc.clone(), idx: i });
        i++;
      });
      if (this.opts.line) this._toLine();
      const fit = this._fit();
      this.center.copy(fit.center);
      this.baseCenter.copy(fit.center);
      this.modelSize = fit.maxDim;
      this._ground(fit.box);
      if (this.opts.backdrop) {
        const bgc = this.opts.bg || (this.dark ? 0x0b0d10 : 0xf3f5f7);
        this.scene.fog = new THREE.FogExp2(bgc, 0.0019);
        if (this.rig) {
          this.rig.key.intensity *= 0.78;
          this.rig.fill.intensity *= 0.75;
          this.rig.rim.intensity *= 1.0;
        }
      }
      this._computeDirs();
      this.tDist = this.dist = fit.dist;
      this.dist0 = fit.dist;
      this.ready = true;
      this.setExplode(this.explode);
      this.renderer.setAnimationLoop(this._loop);
      if (this.opts.onLoad) this.opts.onLoad(this);
    }, ev => { if (this.opts.onProgress && ev.total) this.opts.onProgress(ev.loaded / ev.total); },
      err => { console.error('GLB 加载失败', src, err); if (this.opts.onError) this.opts.onError(err); });
  }

  _fit() {
    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    if (!this.camera) this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 6000);
    /* 按包围球取景：模型自转会改变外形在画面里的占比，用包围球才能保证任何角度都不出框 */
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const radius = size.length() / 2 || 1;
    const cw = this.canvas.clientWidth || 760, ch = this.canvas.clientHeight || 430;
    const vFov = this.camera.fov * Math.PI / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * (cw / Math.max(1, ch)));
    const dist = (radius / Math.sin(Math.min(vFov, hFov) / 2)) * 1.05;
    this.camera.position.set(center.x + dist * 0.58, center.y + dist * 0.40, center.z + dist * 0.78);
    this.camera.near = Math.max(dist / 240, 0.05);
    this.camera.far = dist * 45;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(center);
    return { center, maxDim, dist, size, box };
  }

  _ground(box) {
    if (this._gt) { this.scene.remove(this._gt); this._gt.traverse(o => { o.geometry?.dispose?.(); o.material?.dispose?.(); }); this._gt = null; }
    const g = new THREE.Group();
    const size = box.getSize(new THREE.Vector3());
    const cx = box.getCenter(new THREE.Vector3());
    const span = Math.max(size.x, size.z) * 1.85;
    const spanX = Math.max(size.x, size.z) * 1.12;
    const sh = new THREE.Mesh(
      new THREE.PlaneGeometry(spanX, spanX),
      new THREE.MeshBasicMaterial({ map: this._shadowTexture(), transparent: true, opacity: this.dark ? 0.9 : 0.34, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2;
    sh.position.set(cx.x, box.min.y - Math.max(size.y * 0.012, 0.2), cx.z);
    g.add(sh);
    if (this.opts.ring) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(spanX * 0.5, spanX * 0.503, 128),
        new THREE.MeshBasicMaterial({ color: this.dark ? 0xff8a3d : 0xe8590c, transparent: true, opacity: this.dark ? 0.13 : 0.12, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(sh.position);
      g.add(ring);
    }
    this.scene.add(g);
    this._gt = g;
  }

  _computeDirs() {
    const box = new THREE.Box3().setFromObject(this.model);
    const c = box.getCenter(new THREE.Vector3());
    for (const p of this.parts) {
      /* 关键：GLB 里零件的节点位置往往都在原点（几何是绝对坐标），
         所以必须用「几何包围盒中心」当零件位置，否则所有零件方向相同、分解变成整体平移 */
      const pb = new THREE.Box3().setFromObject(p.obj);
      const pc = pb.getCenter(new THREE.Vector3());
      p.center0 = pc.clone();
      const d = pc.clone().sub(c);
      if (d.length() < this.modelSize * 0.045) d.set(0, 0.55, 0.4);
      p.dir = d.normalize();
    }
  }

  /* 线框模式：把实体网格换成"特征边"线，
     好处是模型网格精度不够时不会显得粗糙，反而像技术图纸/结构草图 */
  _toLine() {
    const light = !this.dark;
    const col = this.opts.lineColor || (light ? 0x1c232b : 0xdde7f1);
    const colSoft = light ? 0x9aa6b3 : 0x5d6b7a;
    const thr = this.opts.lineAngle != null ? this.opts.lineAngle : 14;   // 阈值越小线越多越细
    let n = 0;
    this.model.traverse(o => {
      if (!o.isMesh || o.userData.__lined) return;
      const g = o.geometry;
      let eg = null;
      try {
        eg = new THREE.EdgesGeometry(g, thr);
      } catch (e) { eg = null; }
      if (!eg || !eg.attributes.position || eg.attributes.position.count < 2) return;
      const lm = new THREE.LineBasicMaterial({ color: n % 5 === 4 ? colSoft : col, transparent: true, opacity: light ? 0.92 : 0.85 });
      const ls = new THREE.LineSegments(eg, lm);
      o.add(ls);                                    // 挂在网格下，随零件一起被移动/旋转
      /* 极淡的面：给线稿一点体量感，同时不破坏图纸感 */
      o.material = new THREE.MeshBasicMaterial({
        color: light ? 0x1b2228 : 0x33506b, transparent: true,
        opacity: light ? 0.075 : 0.14, depthWrite: false, side: THREE.DoubleSide,
      });
      o.userData.__lined = true;
      n++;
    });
    this.lineCount = n;
  }

  setExplode(v) {
    this.explode = Math.max(0, Math.min(1, v));
    if (!this.ready) return;
    const amt = this.explode * this.modelSize * this.opts.explodeScale;
    for (const p of this.parts) p.obj.position.copy(p.base).addScaledVector(p.dir, amt);
    if (this._gt) this._gt.visible = this.explode < 0.55;
  }

  /* 页面级姿态：scale<1 变小后退；yaw/pitch 额外旋转；offset* 在画面里平移；fade 透明度 */
  setPose(o) {
    Object.assign(this.pose, o || {});
    if (this.canvas) this.canvas.style.opacity = String(this.pose.fade);
  }

  setAutoRotate(on) { this.opts.autoRotate = !!on; }
  setWire(on) { this.scene.traverse(o => { if (o.isMesh && o.material && 'wireframe' in o.material) o.material.wireframe = !!on; }); }

  reset() {
    this.tAz = 0.62; this.tPol = 1.12; this.tDist = this.dist0 || this.tDist;
    this.setExplode(0);
  }

  _bind() {
    const c = this.canvas;
    let drag = false, lx = 0, ly = 0;
    c.addEventListener('pointerdown', e => { drag = true; this._drag = true; lx = e.clientX; ly = e.clientY; c.setPointerCapture?.(e.pointerId); c.style.cursor = 'grabbing'; });
    c.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      this.tAz -= dx * 0.0078;
      this.tPol = Math.max(0.30, Math.min(Math.PI - 0.30, this.tPol - dy * 0.0064));
    });
    const up = e => { drag = false; this._drag = false; c.style.cursor = 'grab'; try { c.releasePointerCapture?.(e.pointerId); } catch (_) {} };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('wheel', e => {
      e.preventDefault();
      const s = Math.exp(e.deltaY * 0.0011);
      this.tDist = Math.max((this.modelSize || 100) * 1.1, Math.min((this.modelSize || 100) * 8, this.tDist * s));
    }, { passive: false });
    c.style.cursor = 'grab';
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(c);
  }

  _resize() {
    const c = this.canvas;
    const w = c.clientWidth || 640, h = c.clientHeight || 420;
    this.renderer.setSize(w, h, false);
    if (this.camera) { this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); }
  }

  _loop() {
    if (!this.ready) return;
    if (this.opts.autoRotate && !this._drag) this.tAz += 0.0016 * (0.4 + this.opts.speed * 2);
    this.az += (this.tAz - this.az) * 0.085;
    this.pol += (this.tPol - this.pol) * 0.085;
    this.dist += (this.tDist - this.dist) * 0.085;
    const ps = this.pose || { scale: 1, yaw: 0, pitch: 0, offsetX: 0, offsetY: 0 };
    const d = (this.dist / Math.max(0.2, ps.scale)) * (1 + this.opts.explodeZoom * (this.explode || 0));
    const az = this.az + (ps.yaw || 0);
    const pol = Math.max(0.22, Math.min(Math.PI - 0.22, this.pol + (ps.pitch || 0)));
    const ms = this.modelSize || 100;
    this.center.set(
      this.baseCenter.x + (ps.offsetX || 0) * ms,
      this.baseCenter.y + (ps.offsetY || 0) * ms,
      this.baseCenter.z);
    this.camera.position.set(
      this.center.x + d * Math.sin(pol) * Math.sin(az),
      this.center.y + d * Math.cos(pol),
      this.center.z + d * Math.sin(pol) * Math.cos(az));
    this.camera.lookAt(this.center);
    this._lights(d);
    this.renderer.render(this.scene, this.camera);
  }

  /* 三点光跟随相机：主光在相机左前上、补光正前偏右、轮廓光在相机对面偏上 */
  _lights(d) {
    if (!this.rig) return;
    const toCam = new THREE.Vector3().subVectors(this.camera.position, this.center);
    const up = new THREE.Vector3(0, 1, 0);
    const place = (light, yaw, elev, mult) => {
      const v = toCam.clone().applyAxisAngle(up, yaw);
      v.y += d * elev;
      light.position.copy(this.center).add(v.setLength(d * mult));
    };
    place(this.rig.key, 0.62, 0.62, 1.35);
    place(this.rig.fill, -0.30, 0.16, 1.5);
    place(this.rig.rim, Math.PI * 0.94, 0.5, 1.45);
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this._ro?.disconnect();
    this.scene.traverse(o => { if (o.isMesh) { o.geometry?.dispose?.(); o.material?.dispose?.(); } });
    this._envRT?.dispose?.();
    this.renderer.dispose();
  }
}

export function mount(canvas, opts) { return new ModelViewer(canvas, opts); }
export const version = 'three-r160-local-v2';
