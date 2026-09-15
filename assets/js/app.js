/* 付昕 portfolio —— 首页：深色动态舞台 + 双方向入口；内页：白底编辑式排版
   路由：#/ 首页 · #contact 联系方式 · #ai #id 方向 · #ai/<slug> 项目 · #about · #download */
(function () {
  const app = document.getElementById('app');
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const dir = id => DIRECTIONS.find(d => d.id === id);
  const proj = (d, slug) => d && d.projects.find(p => p.slug === slug);
  const tags = (arr, cls) => (arr || []).map(t => `<span class="${cls || 'tag'}">${esc(t)}</span>`).join('');

  /* 卡片封面：优先项目主图，其次图集首图，最后退回方向封面（避免 images 为空造成裂图） */
  function coverOf(p, d) {
    if (p && p.hero && p.hero.f) return p.hero.f;
    if (p && p.images && p.images.length) return p.images[0];
    if (d && d.cover) return d.cover;
    return '';
  }

  /* 3D 模型面板（页面里的一块展示，不是整屏背景） */
  let viewers = [];
  function modelPanel(m, opt = {}) {
    if (!m || !m.src) return '';
    if (m.static) return staticPanel(m, opt);   /* 静态替代方案 */
  /* 静态渲染替代：模型块的另一种呈现（图 + 图注），加载更快、零交互依赖 */
  function staticPanel(m, opt = {}) {
    const st = m.static;
    const imgs = (st.images || []).map(it => `
          <figure class="m3di__item">
            <img src="${esc(it.f)}"${vattrs(it.f, '(max-width:1000px) 100vw, 47vw')} alt="${esc(it.alt || '')}" loading="lazy" decoding="async">
            <figcaption>${esc(it.cap || '')}</figcaption>
          </figure>`).join('');
    return `
      <figure class="m3d m3di ${opt.cls || ''}">
        <span class="m3di__chip">${esc(st.chip || '成品渲染')}</span>
        <div class="m3di__grid${(st.images || []).length < 2 ? ' m3di__grid--one' : ''}">${imgs}</div>
        <figcaption>
          <b>${esc(st.title || '成品渲染')}</b>
          <span>${esc(st.note || '')}</span>
        </figcaption>
      </figure>`;
  }

    const light = !!opt.light;
    const cycle = opt.cycle || null;
    const plain = !!opt.plain;          /* 纯展示：不带任何工具按钮（首页用） */
    return `
      <figure class="m3d ${light ? 'm3d--light' : 'm3d--dark'} ${opt.cls || ''}">
        <div class="m3d__cv-wrap"><span class="m3d__vig" aria-hidden="true"></span>
          <canvas class="m3d__cv" data-model="${esc(m.src)}" data-theme="${light ? 'light' : 'dark'}" data-line="${m.line ? '1' : '0'}"${cycle ? ` data-cycle="${esc(cycle.join(','))}"` : ''}></canvas>
          <span class="m3d__chip">3D 模型</span>
          ${(!plain && cycle) ? '<button type="button" class="m3d__next">换一个 →</button>' : ''}
          ${plain ? '' : `<div class="m3d__tabs" role="group" aria-label="显示方式">
            <button type="button" class="m3d__tab on" data-mode="solid">实体</button>
            <button type="button" class="m3d__tab" data-mode="line">线稿</button>
          </div>`}
          <span class="m3d__hint">按住拖动旋转 · 滚轮缩放</span>
          <span class="m3d__load">模型载入中…</span>
        </div>
        <figcaption>
          <b>${esc(m.title || '3D 模型')}</b>
          <span>${esc(m.note || '本人建模文件导出，可自由旋转查看')}</span>
        </figcaption>
      </figure>`;
  }

  /* 模型懒加载：滚到附近才下载 GLB，切页时销毁 */
  /* 草图 ↔ 成品：可拖动对比滑块 */
  function compareBlock(c) {
    if (!c || !c.before || !c.after) return '';
    return `
      <figure class="cmpwrap">
        <div class="cmp" data-cmp>
          <img src="${esc(c.before.f)}"${vattrs(c.before.f, '(max-width:1000px) 100vw, 47vw')} alt="${esc(c.before.label || '过程')}" loading="lazy" decoding="async">
          <div class="cmp__after"><img src="${esc(c.after.f)}"${vattrs(c.after.f, '(max-width:1000px) 100vw, 47vw')} alt="${esc(c.after.label || '成品')}" loading="lazy" decoding="async"></div>
          <span class="cmp__line"></span>
          <span class="cmp__knob">↔</span>
          <span class="cmp__tag cmp__tag--l">${esc(c.before.label || '过程')}</span>
          <span class="cmp__tag cmp__tag--r">${esc(c.after.label || '成品')}</span>
        </div>
        ${c.cap ? `<div class="cmp__cap"><b>拖动对比：</b>${esc(c.cap)}</div>` : ''}
      </figure>`;
  }

  /* 旧的清理函数（切页时调用，避免监听器堆积） */
  /* 把条目开头的关键短语加粗（按 : ： ， 切分，前缀 ≤14 字才加粗），便于扫读 */
  function keyLead(x) {
    const t = String(x);
    const m = t.match(/^([^：:，,。]{2,14})[：:，,]/);
    if (m) return `<b class="kd">${esc(m[1])}</b>${esc(t.slice(m[1].length))}`;
    /* 无冒号的条目：取第一个分句作主题（内容里普遍用"；"分句） */
    const j = t.match(/^([^；;]{4,18})[；;]/);
    if (j) return `<b class="kd">${esc(j[1])}</b>${esc(t.slice(j[1].length))}`;
    return esc(t);
  }

  /* 条目列表：默认最多 3 条，其余折叠在 <details> 里（信息随交互出现，减少阅读负担） */
  /* 关键信息强调：数字+单位 / 结论信号词（每条最多 3 处，避免满屏加粗） */
  const EMPH_RE = /\d+(?:\.\d+)?\s?(?:名|项|周|个|次|张|份|套|台|人|天|小时|分钟|%|万|千|种|类|步|层|页|版|英寸|Bit|bit|KB|MB|GB)/g;
  const EMPH_WORDS = ['可回滚', '已匿名化', '全部跑通', '真实硬件', '语音闭环', '不静默覆盖', '可复用', '可追溯'];
  function emphasize(html, max) {
    const cap = max || 3;
    let n = 0;
    let out = String(html || '').replace(EMPH_RE, m => (n++ < cap ? '<b class="em">' + m + '</b>' : m));
    for (const w of EMPH_WORDS) {
      if (n >= cap) break;
      const i = out.indexOf(w);
      if (i >= 0 && out.slice(Math.max(0, i - 24), i).indexOf('<b class="em">') < 0) {
        out = out.replace(w, '<b class="em">' + w + '</b>');
        n++;
      }
    }
    return out;
  }

  function itemsBlock(items, limit = 2) {
    const list = items || [];
    if (!list.length) return '';
    const head = list.slice(0, limit).map(x => `<li>${emphasize(keyLead(x))}</li>`).join('');
    const rest = list.slice(limit);
    if (!rest.length) return `<ul class="cs__list">${head}</ul>`;
    return `<ul class="cs__list">${head}</ul>
          <details class="cs__more">
            <summary>展开其余 ${rest.length} 条 <i>＋</i></summary>
            <ul class="cs__list">${rest.map(x => `<li>${emphasize(keyLead(x))}</li>`).join('')}</ul>
          </details>`;
  }

  /* 自动取短句（优先在标点处断，避免孤字换行；超过上限才截断） */
  function shortText(t, cap) {
    const str = String(t || '').trim();
    if (str.length <= cap) return str;
    const m = str.slice(0, cap + 6).match(/^[^，。；;]{6,}([，。；;])/);
    if (m) return str.slice(0, m[0].length);        /* 正好在一个短句结束处 */
    return str.slice(0, cap) + '…';
  }


  /* ============================================================
     统一粒子引擎（主页背景 + 内页页头共用）
     稳定性：dt 归一化 · 双频正弦漫游（不用逐帧随机）· 网格近邻连线 · resize 缩放不重建
     ============================================================ */
  function createParticles(cv, opts) {
    if (!cv || !cv.getContext) return null;
    const ctx = cv.getContext('2d');
    if (!ctx) return null;
    const o = Object.assign({
      density: 11000, maxN: 240, minN: 40, dpr: 1.25,
      link: 128, linkAlpha: .40, linkD2: null,
      band: true, bandAmp: .11, bandBase: .55, bandWidth: 70, freeRatio: .28,
      speed: 1, accent: 'rgba(255,158,102,.85)',
      dot: 'rgba(226,236,246,.7)', linkRGB: '255,255,255', glow: '255,158,102', dotScale: 1,
    }, opts || {});
    const linkD2 = o.linkD2 || o.link * o.link;
    let W = 0, H = 0, parts = [], raf = 0, on = false, last = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, o.dpr);
    const mouse = { x: -9999, y: -9999, on: false, r: 150 };
    /* 指针 → 画布坐标
       性能要点：原来每个画布各挂一套 window 监听、事件里再 getBoundingClientRect()，
       一页 20+ 画布 = 每次鼠标移动触发 20+ 次强制布局（这才是交互延迟的元凶）。
       现改为：全局只挂一套监听；矩形带缓存，滚动/缩放统一换代刷新。 */
    const FX = (window.__fxReg = window.__fxReg || { list: [], bound: false, gen: 0 });
    let myRect = null, myGen = -1;
    function rectNow() {
      if (myGen !== FX.gen || !myRect) { myRect = cv.getBoundingClientRect(); myGen = FX.gen; }
      return myRect;
    }
    function onPointerMove(e) {
      const r = rectNow();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      mouse.x = x; mouse.y = y;
      mouse.on = x > -80 && y > -80 && x < r.width + 80 && y < r.height + 80;
    }
    function onPointerLeave() { mouse.on = false; mouse.x = -9999; mouse.y = -9999; }
    FX.list.push({ cv: cv, move: onPointerMove, leave: onPointerLeave });
    if (!FX.bound) {
      FX.bound = true;
      const fire = e => {
        for (let i = 0; i < FX.list.length; i++) {
          const it = FX.list[i];
          if (it.cv.isConnected) it.move(e);
        }
      };
      window.addEventListener('pointermove', fire, { passive: true });
      window.addEventListener('pointerdown', fire, { passive: true });
      document.addEventListener('pointerleave', () => {
        for (let i = 0; i < FX.list.length; i++) { if (FX.list[i].cv.isConnected) FX.list[i].leave(); }
      });
      const dirty = () => { FX.gen++; FX.list = FX.list.filter(it => it.cv.isConnected); };
      window.addEventListener('scroll', dirty, { passive: true });
      window.addEventListener('resize', dirty, { passive: true });
    }

    /* 共享动画循环：原来每个画布各跑一个 requestAnimationFrame（一页十几个循环），
       现在合并为单一循环统一驱动，减少调度开销与帧间抖动。 */
    const FS = (window.__fxLoop = window.__fxLoop || { list: [], raf: 0 });
    function scheduleShared() { if (!FS.raf) FS.raf = requestAnimationFrame(runShared); }
    function runShared(ts) {
      FS.raf = 0;
      const L = FS.list;
      let live = false;
      for (let i = 0; i < L.length; i++) {
        const t = L[i];
        if (!t.on || !t.cv.isConnected) continue;
        live = true;
        t.tick(ts);
      }
      if (live) scheduleShared();
    }

    function build() {
      const n = Math.round(Math.min(o.maxN, Math.max(o.minN, (W * H) / o.density)));
      parts = Array.from({ length: n }, () => {
        const free = Math.random() < o.freeRatio;
        return {
          x: Math.random() * W, y: Math.random() * H,
          vx: (.22 + Math.random() * .32) * o.speed, vy: (Math.random() - .5) * .2 * o.speed,
          r: Math.random() * 1.35 + .6,
          hot: Math.random() < .18,
          free,
          band: (Math.random() - .5) * 2 * (o.bandWidth * (0.32 + Math.random() * 0.68)),
          sp: .7 + Math.random() * .8,
          /* 平滑漫游用的相位与频率（每粒子不同 → 画面不呆板，但绝不抖动） */
          ph: Math.random() * 6.283,
          ph2: Math.random() * 6.283,
          w1: .00045 + Math.random() * .00055,
          w2: .00028 + Math.random() * .00042,
          wa: .55 + Math.random() * .75,
        };
      });
    }

    function size(rebuild) {
      const pw = Math.max(1, cv.clientWidth), phh = Math.max(1, cv.clientHeight);
      const ow = W, oh = H;
      W = pw; H = phh;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (rebuild || !parts.length) build();
      else if (ow > 0 && oh > 0) { const sx = W / ow, sy = H / oh; for (const p of parts) { p.x *= sx; p.y *= sy; } }
    }

    const bandY = (x, ts) => H * o.bandBase + Math.sin(x / W * 2.15 + ts) * H * o.bandAmp + Math.sin(x / W * 4.6 - ts * .7) * H * (o.bandAmp * .32);

    function frame(t) {
      if (!on) return;
      const dt = last ? Math.min(2.4, Math.max(.35, (t - last) / 16.667)) : 1;
      last = t;
      const ts = t * .00016;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        /* 平滑漫游（替代逐帧随机数：速度连续变化 → 不会抖） */
        const wander = Math.sin(t * p.w1 + p.ph) * p.wa + Math.cos(t * p.w2 + p.ph2) * (p.wa * .5);
        if (p.free) {
          p.vx += wander * .0055 * dt; p.vy += Math.cos(t * p.w1 * .85 + p.ph) * .005 * dt;
          /* 轻微的即时扰动：让粒子有"活"的呼吸感（幅度只有最初版的 45%，不会抖） */
          p.vx += (Math.random() - .5) * .0062 * dt;
          p.vy += (Math.random() - .5) * .0062 * dt;
        } else {
          p.vx += ((.95 - Math.abs(p.vy) * .22) * p.sp * o.speed - p.vx) * .02 * dt;
          p.vy += (bandY(p.x, ts) + p.band - p.y) * .0022 * dt;
          p.vy += wander * .009 * dt;
        }
        if (mouse.on) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 4900 && d2 > 1) { const d = Math.sqrt(d2), t = 1 - d / 70; p.vx += dx / d * .25 * t * dt; p.vy += dy / d * .25 * t * dt; }
        }
        p.vx *= 1 - .014 * dt; p.vy *= 1 - .014 * dt;
        const sp = Math.hypot(p.vx, p.vy), mx = (p.free ? .9 : 1.6) * o.speed;
        if (sp > mx) { p.vx = p.vx / sp * mx; p.vy = p.vy / sp * mx; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x > W + 26) { p.x = -26; p.vx = (.22 + Math.random() * .3) * o.speed; p.y = o.band && !p.free ? bandY(p.x, ts) + p.band + (Math.random() - .5) * 30 : Math.random() * H; }
        if (p.x < -46) p.x = W + 26;
        if (p.y < -28) p.y = H + 22; else if (p.y > H + 28) p.y = -22;
      }
      /* 近邻连线：网格分桶，只比较同格与 4 个邻格（消除 O(n²) 掉帧） */
      const cell = o.link;
      const grid = new Map();
      for (const p of parts) {
        const k = ((p.x / cell) | 0) + '|' + ((p.y / cell) | 0);
        let a = grid.get(k); if (!a) { a = []; grid.set(k, a); } a.push(p);
      }
      ctx.lineWidth = 1;
      /* 按透明度分 5 档批量描线：原来每条线一次 stroke（每帧数百次绘制调用）→ 现在最多 5 次 */
      const LB = 5;
      const buckets = [[], [], [], [], []];
      for (const [k, arr] of grid) {
        const [gx, gy] = k.split('|').map(Number);
        for (let ox = 0; ox <= 1; ox++) for (let oy = (ox === 0 ? 0 : -1); oy <= 1; oy++) {
          const nb = grid.get((gx + ox) + '|' + (gy + oy));
          if (!nb) continue;
          const same = ox === 0 && oy === 0;
          for (let i = 0; i < arr.length; i++) {
            const a = arr[i];
            for (let j = same ? i + 1 : 0; j < nb.length; j++) {
              const b = nb[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
              if (d2 < linkD2) {
                const tt = 1 - Math.sqrt(d2) / o.link;
                const bi = tt <= 0 ? 0 : (tt >= 1 ? LB - 1 : (tt * LB) | 0);
                buckets[bi].push(a.x, a.y, b.x, b.y);
              }
            }
          }
        }
      }
      for (let bi = 0; bi < LB; bi++) {
        const seg = buckets[bi];
        if (!seg.length) continue;
        ctx.strokeStyle = 'rgba(' + o.linkRGB + ',' + (((bi + 0.5) / LB) * o.linkAlpha).toFixed(3) + ')';
        ctx.beginPath();
        for (let s = 0; s < seg.length; s += 4) { ctx.moveTo(seg[s], seg[s + 1]); ctx.lineTo(seg[s + 2], seg[s + 3]); }
        ctx.stroke();
      }
      /* 指针交互：连线 + 柔光（让"能交互"一眼可见） */
      if (mouse.on) {
        const mr2 = mouse.r * mouse.r;
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.r);
        g.addColorStop(0, 'rgba(' + o.glow + ',.20)');
        g.addColorStop(1, 'rgba(' + o.glow + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(mouse.x, mouse.y, mouse.r, 0, 6.283); ctx.fill();
        /* 批量：按透明度分 4 档，最多 4 次 stroke（原来每条线一次，最多上百次/帧） */
        const PB = 4, pbk = [[], [], [], []];
        for (const p of parts) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < mr2) {
            const t = 1 - Math.sqrt(d2) / mouse.r;
            pbk[Math.min(PB - 1, Math.max(0, (t * PB) | 0))].push(mouse.x, mouse.y, p.x, p.y);
          }
        }
        ctx.lineWidth = 1;
        for (let bi = 0; bi < PB; bi++) {
          const seg = pbk[bi];
          if (!seg.length) continue;
          ctx.strokeStyle = 'rgba(' + o.glow + ',' + (((bi + 0.5) / PB) * .5).toFixed(3) + ')';
          ctx.beginPath();
          for (let si = 0; si < seg.length; si += 4) { ctx.moveTo(seg[si], seg[si + 1]); ctx.lineTo(seg[si + 2], seg[si + 3]); }
          ctx.stroke();
        }
      }
      for (const p of parts) {
        ctx.beginPath();
        ctx.fillStyle = p.hot ? o.accent : o.dot;
        ctx.arc(p.x, p.y, p.r * o.dotScale, 0, 6.283);
        ctx.fill();
      }
      scheduleShared();
    }

    const task = { tick: frame, cv: cv, on: false };
    FS.list.push(task);
    function start() { if (on) return; on = true; last = 0; size(!parts.length); task.on = true; scheduleShared(); }
    function stop() { on = false; task.on = false; }
    function onResize() { if (on) size(false); }
    window.addEventListener('resize', onResize, { passive: true });
    function dispose() {
      stop();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      parts = [];
    }
    start();
    return { start, stop, dispose, canvas: cv, get count() { return parts.length; } };
  }

  /* 主页背景粒子 */
  const FX = createParticles(document.getElementById('fx'), {
    density: 8200, maxN: 260, band: true, bandAmp: .34, bandBase: .52, bandWidth: 132, freeRatio: .42, link: 130, linkAlpha: .44, speed: 1.95,
  }) || { start() {}, stop() {} };

  /* 内页页头粒子（尺寸小、密度低） */
  let heroFXs = [];
  function mountHeroFX(scope, tries) {
    const n = tries || 0;
    try { return mountHeroFXRun(scope, n); } catch (e) { try { console.warn('[heroFX]', e); } catch (_) {} }
  }
  function mountHeroFXRun(scope, n) {
    heroFXs.forEach(f => f.dispose && f.dispose());
    heroFXs = [];
    const cvs = [...scope.querySelectorAll('canvas.phero__fx')];
    cvs.forEach(cv => {
      try {
        const fx = createParticles(cv, {
          /* 与主页完全同一套观感：同样的带状流动 + 同样的连线密度/透明度 */
          density: 3400, maxN: 130, minN: 58, bandBase: .56, bandAmp: .115, bandWidth: 74,
          freeRatio: .28, link: 130, linkAlpha: .44, speed: 1.95, dpr: 1.25,
        });
        if (fx && fx.canvas && fx.canvas.width > 1) heroFXs.push(fx);
      } catch (e) { /* 忽略：下一帧重试 */ }
    });
    /* 自愈：画布还没挂上 / 上下文临时不可用 / 尺寸为 0 时，接下来几帧重试 */
    if (heroFXs.length < Math.max(1, cvs.length) && n < 8) {
      requestAnimationFrame(() => mountHeroFX(scope, n + 1));
    }
  }

  /* 内页统一深色页头（与首页同一套视觉语言：深底/流动光晕/细网格/大标题） */
  function pageHero(o) {
    /* 事实 chips：按条目取前 3 项 + "等"，不做断词截断 */
    const shortItems = t => {
      const arr = String(t || '').split(/\s*[·\/／,，、]\s*/).filter(Boolean);
      return arr.length <= 3 ? arr.join(' · ') : arr.slice(0, 3).join(' · ') + ' 等';
    };
    const meta = (o.meta || []).filter(x => x && x[1]).slice(0, 3)
      .map(x => `<span class="phero__chip"><b>${esc(x[0])}</b><i>·</i>${esc(shortItems(x[1]))}</span>`).join('');
    return `
    <header class="phero">
      <canvas class="phero__fx" aria-hidden="true"></canvas>
      <div class="wrap">
        ${o.backHref === false ? '' : `<a class="phero__back" href="${o.backHref || '#/'}"><span class="btn__ar">←</span>${esc(o.backText || '返回首页')}</a>`}
        <div class="phero__en">${esc(o.en || '')}</div>
        <h1 class="phero__title rv-em">${esc(o.title || '')}</h1>
        ${o.sub ? `<p class="phero__sub rv-em" style="transition-delay:.10s">${esc(o.sub)}</p>` : ''}
        ${meta ? `<div class="phero__meta rv-em" style="transition-delay:.18s">${meta}</div>` : ''}
        ${o.guide || ''}
      </div>
      <div class="phero__scroll"><i></i><span>SCROLL</span></div>
    </header>
    <div class="phero__fade" aria-hidden="true"></div>`;
  }


  /* 路由转场：深色幕布扫过（消除"换了个网站"的断裂感） */
  function playCurtain() {
    const c = document.getElementById('curtain');
    if (!c) return;
    c.classList.remove('off');
    c.classList.add('on');
    setTimeout(() => c.classList.add('off'), 240);
    setTimeout(() => { c.classList.remove('on'); c.classList.remove('off'); }, 760);
  }

  /* 分级揭示：同一容器内的 .rv 依次延迟出现，形成"信息随交互分级浮现" */
  function staggerReveal(scope) {
    scope.querySelectorAll('.wrap, .cards, .cs__main, .dl, .figs, .phero .wrap').forEach(box => {
      const kids = [...box.children].filter(k => k.classList && (k.classList.contains('rv') || k.classList.contains('rv-em') || k.classList.contains('cs__sec')));
      kids.forEach((k, i) => { if (!k.style.transitionDelay) k.style.transitionDelay = Math.min(i * 90, 500) + 'ms'; });
    });
  }

  /* 细节切换器：点标签换大图 + 说明（纯 DOM 切换，最稳） */
  function tabsBlock(list, opts) {
    if (!list || !list.length) return '';
    const o = Object.assign({ auto: true, sync: '', hint: '' }, opts || {});
    const hint = o.hint || (list.length + ' 项内容 · 自动轮播 · 可点标签切换');
    return `
      <div class="tabs" data-tabs data-auto="${o.auto ? '1' : '0'}"${o.sync ? ` data-sync="${esc(o.sync)}"` : ''}>
        <div class="tabs__head">
          <span class="tabs__hint"><i class="tabs__live"></i>${esc(hint)}</span>
          <span class="tabs__dots" role="tablist">${list.map((x, i) => `<i data-dot="${i}" class="${i === 0 ? 'on' : ''}"></i>`).join('')}</span>
        </div>
        <div class="tabs__chips" role="tablist">
          ${list.map((x, i) => `<button type="button" class="tabs__chip${i === 0 ? ' on' : ''}" data-i="${i}" role="tab" aria-selected="${i === 0}">
            <b class="tabs__no">${String(i + 1).padStart(2, '0')}</b><span>${esc(x.t)}</span><i class="tabs__prog"></i>
          </button>`).join('')}
        </div>
        <div class="tabs__panes">
          ${list.map((x, i) => `
            <div class="tabs__pane${i === 0 ? ' on' : ''}" data-i="${i}" role="tabpanel">
              <figure class="shot"><img src="${esc(x.f)}"${vattrs(x.f, '(max-width:1000px) 100vw, 47vw')} alt="${esc(x.t)}" loading="lazy" decoding="async"></figure>
              <div class="tabs__txt"><b>${esc(x.t)}</b><p>${esc(x.d || '')}</p></div>
            </div>`).join('')}
        </div>
        <div class="tabs__foot">点标签可切换 · 点图可放大</div>
      </div>`;
  }

  let cleanups = [];
  function runCleanups() { cleanups.forEach(f => { try { f(); } catch (e) {} }); cleanups = []; }

  /* 章节轨道：进度 + 点击跳转 */
  function initRail(scope, secs) {
    const wrap = scope.querySelector('.cs');
    if (!wrap || !secs || secs.length < 2) return;
    const items = [...wrap.querySelectorAll('.cs__sec')];
    if (items.length < 2) return;
    const rail = document.createElement('nav');
    rail.className = 'rail rail--steps';
    rail.setAttribute('aria-label', '本页结构');
    rail.innerHTML = '<span class="rail__wrap"></span><i class="rail__bar"></i><span class="rail__prog"></span>' +
      items.map((s, i) => `<button type="button" data-i="${i}"><b>${String(i + 1).padStart(2, '0')}</b><span>${esc(secs[i].h)}</span></button>`).join('');
    /* 吸顶步骤条：插在深色页头之后，随内容滚动吸附在导航下方（替代原来的固定左侧竖轨道） */
    const hero = scope.querySelector('.phero');
    if (hero && hero.parentNode) hero.parentNode.insertBefore(rail, hero.nextSibling);
    else document.body.appendChild(rail);
    const bar = rail.querySelector('.rail__bar');
    const prog = rail.querySelector('.rail__prog');
    const links = [...rail.querySelectorAll('button')];
    links.forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const t = items[+a.dataset.i];
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 128, behavior: 'smooth' });
    }));
    const tops = () => items.map(s => s.getBoundingClientRect().top + window.scrollY);
    const onScroll = () => {
      const t = tops();
      const y = window.scrollY + window.innerHeight * 0.34;
      let act = 0;
      t.forEach((v, i) => { if (v <= y) act = i; });
      links.forEach((a, i) => a.classList.toggle('on', i === act));
      const first = t[0], last = t[t.length - 1] + items[items.length - 1].offsetHeight;
      const p = Math.max(0, Math.min(1, (window.scrollY + 240 - first) / Math.max(1, last - first)));
      if (bar) bar.style.transform = `scaleY(${p})`;      /* 兼容：竖条（已不用） */
      if (prog) prog.style.width = (p * 100).toFixed(1) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => { window.removeEventListener('scroll', onScroll); rail.remove(); });
  }

  /* 项目短名：能放下就用整名；长名按 "·" / 首个英文词 / "：" 自然断点切，避免切到半个词 */
  const shortName = p => {
    const t = String(p.title || p.slug || '').trim();
    let byDot = ((t.split(' · ')[0] || t)).trim();
    byDot = byDot.replace(/[（(][^）)]*[）)]/g, '').trim();   /* 去掉括号补充，如（实习）（可在线玩） */
    if (byDot.length <= 11) return byDot;
    const firstTok = (byDot.split(' ')[0] || '').trim();
    if (/^[A-Za-z]/.test(byDot) && firstTok.length >= 3) return firstTok;
    const byColon = (byDot.split(/[：:]/)[0] || '').trim();
    if (byColon.length >= 4 && byColon.length <= 11) return byColon;
    if (/[\u4e00-\u9fa5]/.test(firstTok) && firstTok.length >= 2) return firstTok;
    return byDot.slice(0, 11);
  };

  /* 方向页：按能力筛选卡片 */
  function initJump(scope) {
    const box = scope.querySelector('[data-filter]');
    if (!box) return;
    box.addEventListener('click', e => {
      const b = e.target.closest('.filter__chip');
      if (!b || !b.dataset.jump) return;
      [...box.querySelectorAll('.filter__chip')].forEach(x => x.classList.toggle('on', x === b));
      const slug = b.dataset.jump;
      if (slug === 'all') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const card = scope.querySelector(`.card[data-slug="${slug}"]`);
      if (!card) return;
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('card--focus');
      setTimeout(() => card.classList.remove('card--focus'), 1700);
    });
  }

  function initFilter(scope) {
    scope.querySelectorAll('[data-filter]').forEach(box => {
      const chips = [...box.querySelectorAll('.filter__chip')];
      const cards = [...scope.querySelectorAll('[data-cards] .card')];
      const countEl = box.querySelector('[data-count]');
      chips.forEach(chip => {
        if (!chip.dataset.tag) return;   /* 项目名按钮（data-jump）走 initJump，不参与标签过滤，避免误隐藏全部卡片 */
        chip.addEventListener('click', () => {
        const t = chip.dataset.tag;
        chips.forEach(c => c.classList.toggle('on', c === chip));
        let shown = 0;
        cards.forEach(card => {
          const match = t === '全部' || (card.dataset.tags || '').split('|').includes(t);
          card.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });
        if (countEl) countEl.textContent = shown + ' 个项目';
        });
      });
    });
  }

  /* 细节切换器交互 */
  function initTabs(scope) {
    scope.querySelectorAll('[data-tabs]').forEach(box => {
      const chips = [...box.querySelectorAll('.tabs__chip')];
      const panes = [...box.querySelectorAll('.tabs__pane')];
      const dots = [...box.querySelectorAll('[data-dot]')];
      const key = box.dataset.sync || '';
      const setI = i => {
        chips.forEach((x, k) => { x.classList.toggle('on', k === i); x.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
        panes.forEach((x, k) => x.classList.toggle('on', k === i));
        dots.forEach((x, k) => x.classList.toggle('on', k === i));
        box.dataset.active = i;
        if (key) {
          document.querySelectorAll('[data-sync-target="' + key + '"] [data-o]').forEach(x => x.classList.toggle('on', +x.dataset.o === i));
        }
      };
      let idx = 0, timer = null, stopped = false, inView = true, preloaded = false;
      const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
      /* 预加载本组所有图：切过去时图已经在缓存里（切换"卡一下"的主因） */
      const preload = () => {
        if (preloaded) return;
        preloaded = true;
        panes.forEach(pn => {
          const im = pn.querySelector('img');
          if (!im) return;
          im.loading = 'eager';
          const src = im.getAttribute('src');
          if (src) { const pre = new Image(); pre.decoding = 'async'; pre.src = src; }
        });
      };
      /* 进度条与倒计时用同一起点：重开时把条也归零，避免"条走完了还没切"的卡顿感 */
      const barRestart = () => {
        const b = chips[idx] && chips[idx].querySelector('.tabs__prog');
        if (!b) return;
        b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
      };
      const play = () => {
        if (stopped || !inView || box.dataset.auto === '0' || chips.length < 2) return;
        stop();
        barRestart();
        timer = setInterval(() => { idx = (idx + 1) % chips.length; setI(idx); barRestart(); }, 3000);
      };
      /* 悬停标签 / 点击标签都走这里 */
      const goTo = i => {
        if (i === idx) return;
        idx = i; setI(idx);
        if (timer) barRestart();
      };
      chips.forEach(c => {
        c.addEventListener('mouseenter', () => goTo(+c.dataset.i));
        c.addEventListener('click', e => {
          e.preventDefault();
          goTo(+c.dataset.i); stopped = true; stop(); box.classList.add('manual');
        });
      });
      box.addEventListener('mouseenter', stop);
      box.addEventListener('mouseleave', () => { if (!stopped) play(); });
      setI(0);
      /* 滚出视野先停、回来再走（避免滚动时白跑动画）；可见时顺便把图预载了 */
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(es => {
          es.forEach(en => {
            inView = en.isIntersecting;
            if (inView) { preload(); if (!stopped) play(); } else { stop(); }
          });
        }, { threshold: 0.02 });
        io.observe(box);
        cleanups.push(() => io.disconnect());
      } else {
        preload(); play();
      }
      cleanups.push(() => { stopped = true; stop(); });
    });
  }

  /* 对比滑块：拖动 / 点击 / 触摸都能用 */
  function initCompare(scope) {
    scope.querySelectorAll('[data-cmp]').forEach(el => {
      const after = el.querySelector('.cmp__after');
      const line = el.querySelector('.cmp__line');
      const knob = el.querySelector('.cmp__knob');
      let dragging = false;
      const set = clientX => {
        const r = el.getBoundingClientRect();
        let p = (clientX - r.left) / Math.max(1, r.width);
        p = Math.max(0.02, Math.min(0.98, p));
        after.style.width = (p * 100) + '%';
        line.style.left = (p * 100) + '%';
        knob.style.left = (p * 100) + '%';
      };
      const down = e => { dragging = true; set(e.clientX); el.setPointerCapture?.(e.pointerId); };
      const move = e => { if (dragging) set(e.clientX); };
      const up = () => { dragging = false; };
      el.addEventListener('pointerdown', down);
      el.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      cleanups.push(() => { window.removeEventListener('pointerup', up); });
    });
  }

  function mountModels(scope) {
    const cvs = scope.querySelectorAll('canvas[data-model]');
    window.__m3dState = { found: cvs.length, imported: false, mounted: 0, err: '' };
    if (!cvs.length) return;
    import('./model3d.js?v=20260916A').then(mod => {
      window.__m3dState.imported = true;
      cvs.forEach(cv => {
        const wrap = cv.parentElement;
        const load = wrap && wrap.querySelector('.m3d__load');
        const io = new IntersectionObserver(ents => {
          ents.forEach(e => {
            if (!e.isIntersecting) return;
            io.unobserve(cv);
            /* 载入提示：加载中显示，成功后隐藏，失败给出可读文案（任何卡片都适用） */
            if (load) { load.hidden = false; load.textContent = '模型载入中…'; }
            const v = new mod.ModelViewer(cv, {
              src: cv.dataset.model, theme: cv.dataset.theme || 'dark',
              autoRotate: true, speed: 0.32, explodeScale: 1.0, explodeZoom: 0, ring: false,
              mode: cv.dataset.line === '1' ? 'line' : 'solid',
              onLoad() { if (load) load.hidden = true; },
              onError() { if (load) { load.hidden = false; load.textContent = '模型加载失败（可刷新重试）'; } },
            });
            viewers.push(v);
            /* 实体 / 线稿 切换 */
            const panel = cv.closest('.m3d');
            const tabs = panel ? panel.querySelectorAll('.m3d__tab') : [];
            tabs.forEach(btn => btn.addEventListener('click', () => {
              v.setMode(btn.dataset.mode);
              tabs.forEach(b => b.classList.toggle('on', b === btn));
            }));
            /* 首屏"换一个模型"：在候选列表里轮换 */
            const cycle = (cv.dataset.cycle || '').split(',').map(s => s.trim()).filter(Boolean);
            if (cycle.length) {
              let k = 0;
              if (cycle[0] !== cv.dataset.model) k = Math.max(0, cycle.indexOf(cv.dataset.model));
              const next = panel ? panel.querySelector('.m3d__next') : null;
              if (next) next.addEventListener('click', () => {
                k = (k + 1) % cycle.length;
                const load = panel ? panel.querySelector('.m3d__load') : null;
                if (load) { load.hidden = false; load.textContent = '模型载入中…'; }
                v.setSrc(cycle[k]);
              });
            }
            window.__m3dState.mounted = viewers.length;
          });
        }, { rootMargin: '300px 0px' });
        io.observe(cv);
      });
    }).catch(err => { window.__m3dState.err = String(err && err.message || err); console.warn('3D 模块加载失败：', err); });
  }
  function disposeModels() {
    try {
      viewers.forEach(v => { try { v.dispose(); } catch (e) {} });
      viewers = [];
      window.__m3d = viewers;
    } catch (e) { /* 清理失败绝不影响后续渲染 */ }
  }

  /* 卡片交互 / 方向卡流光：模块作用域占位
     （render() 需要调用它们，所以用占位变量把引用提到模块作用域，
      避免"块作用域函数在块外不可见"导致整页渲染中断） */
  let initCardFX = () => 0;
  let gateFlowInit = () => {};
  let mountGateFX = () => 0;

  /* 项目卡粒子（档位 A：悬停淡入 + 中心遮罩；浅色底用深灰粒子） */
  const CARD_FX_SAMPLE_ONLY = false;  /* 常驻模式：全部项目卡都挂粒子（如需回到样板，改为 true） */
  let cardFXs = [];
  let cardObs = null;
  function mountCardFX(scope) {
    cardFXs.forEach(f => f.dispose && f.dispose());
    cardFXs = [];
    let cvs = [...scope.querySelectorAll('canvas.card__fx')];
    if (CARD_FX_SAMPLE_ONLY) cvs = cvs.slice(0, 1);
    /* 视口外暂停：14 张卡同时跑会浪费；只让进入视口的卡运行 */
    if (typeof IntersectionObserver === 'function') {
      cardObs = new IntersectionObserver(es => {
        es.forEach(e => {
          const f = fxs.find(x => x.canvas === e.target);
          if (!f) return;
          if (e.isIntersecting) { if (!f.__on) { f.start(); f.__on = true; } }
          else if (f.__on) { f.stop(); f.__on = false; }   /* 视口外暂停（省性能） */
        });
      }, { rootMargin: '140px' });
    }
    /* 封面为实拍/场景照片的卡：元素本身多，同浓度会显脏 → 自动降一档（纯白底渲染图用满档） */
    const strengthFor = cv => {
      try {
        const img = cv.parentNode && cv.parentNode.querySelector('img');
        if (!img || !img.complete || !img.naturalWidth) return .85;
        const c = document.createElement('canvas');
        c.width = c.height = 32;
        const x = c.getContext('2d', { willReadFrequently: true });
        x.drawImage(img, 0, 0, 32, 32);
        const d = x.getImageData(0, 0, 32, 32).data;
        let sat = 0, n = 0;
        for (let i = 0; i < d.length; i += 4) {
          const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]);
          sat += (mx - mn) / 255; n++;
        }
        return (sat / n) > .155 ? .72 : 1;
      } catch (e) { return .9; }
    };
    const fxs = cvs.map(cv => {
      const k = strengthFor(cv);
      return createParticles(cv, {
        density: 1350, maxN: 130, minN: 82, band: false, freeRatio: 1,
        link: 104, linkAlpha: .38 * k, speed: 2.2, dpr: Math.min(window.devicePixelRatio || 1, 2), dotScale: 1.65,
        dot: 'rgba(236,243,250,' + (.70 * k).toFixed(2) + ')', accent: 'rgba(255,158,102,' + (.85 * k).toFixed(2) + ')',
        linkRGB: '214,228,242', glow: '255,158,102',
      });
    }).filter(Boolean);
    cardFXs = fxs;
    fxs.forEach(f => { f.__on = true; });            /* createParticles 内部已 start()（用于定尺寸） */
    if (cardObs) cvs.forEach(cv => cardObs.observe(cv));
    cleanups.push(() => { if (cardObs) cardObs.disconnect(); });
    return cardFXs.length;
  }

  /* ================= 视图 ================= */

  function viewHome() {
    const gates = DIRECTIONS.map((d, i) => `
      <a class="gate rv" href="#${d.id}" data-tilt>
        <div class="gate__bg gate__flow" data-flow="${i}">
          <i class="flow__blob b1"></i><i class="flow__blob b2"></i><i class="flow__blob b3"></i>
          <i class="flow__grid"></i><i class="flow__grain"></i><i class="flow__sheen"></i>
        </div>
        <canvas class="gate__fx" aria-hidden="true"></canvas>
        <div class="gate__body">
          <div class="gate__en">${esc(d.en)}</div>
          <h3>${esc(d.label)}</h3>
          <p>${esc(d.title)} — ${esc(d.lead)}</p>
          <div class="gate__tags">${(d.keywords || []).map(k => `<span>${esc(k)}</span>`).join('')}</div>
          <div class="gate__foot">
            <span class="go">进入方向 <i></i></span>
            <span class="cnt">共 ${d.projects.length} 个项目</span>
          </div>
        </div>
      </a>`).join('');

    /* 精选项目：从两个方向里挑 4 个代表作（内容仍取自数据，不硬编码） */
    const PICKS = ['id/doggie', 'id/navlight', 'ai/robot', 'ai/toolset'];
    const pickCard = (key, idx) => {
      const [dirId, slug] = key.split('/');
      const dir = DIRECTIONS.find(x => x.id === dirId);
      const p = dir && dir.projects.find(x => x.slug === slug);
      if (!p) return '';
      const cover = (p.hero && p.hero.f) || (p.images && p.images[0]) || dir.cover;
      const fact = (p.facts || []).find(f => f && f[1]) || ['类型', dir.label];
      return `
      <a class="pick rv" href="#${dirId}/${slug}">
        <canvas class="card__fx" aria-hidden="true"></canvas>
        <div class="pick__img"><img src="${esc(cover)}"${vattrs(cover, '(max-width:700px) 92vw, (max-width:1100px) 46vw, 33vw')} alt="${esc(p.title)}" loading="${idx < 2 ? 'eager' : 'lazy'}" decoding="async"></div>
        <div class="pick__body">
          <div class="pick__eyebrow">${esc(dir.label)} · ${esc(fact[0])}</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(shortText(p.summary, 42))}</p>
          <span class="pick__go">看完整案例 <i></i></span>
          <div class="pick__tags">${(p.tags || []).slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
      </a>`;
    };
    const picks = PICKS.map((k, i) => pickCard(k, i)).join('');

    const mq = [...MARQUEE, ...MARQUEE].map(x => `<span>${esc(x)}</span>`).join('');

    return `
    <section class="hero" id="heroTop">
      <div class="hero__ghost" aria-hidden="true">FU XIN</div>
      <div class="wrap hero__in">
        <div>
          <span class="hero__kicker"><i></i>${esc(SITE.heroKicker)}</span>
          <p class="hero__role">${esc(SITE.heroRole)}</p>
          <h1>
            <span class="k"><span>${esc(SITE.heroTitle1)}</span></span>
            <span class="k"><span>${SITE.heroTitle2}</span></span>
          </h1>
          <p class="hero__lead">${esc(SITE.heroLead)}</p>
          <div class="hero__cta">
            <a class="btn mag" href="#ai">看 AI 产品方向<span class="btn__ar">→</span></a>
            <a class="btn mag" href="#id">看工业设计方向<span class="btn__ar">→</span></a>
            <a class="btn mag" href="#about">看我的详细经历<span class="btn__ar">→</span></a>
            </div>
        </div>
        <div class="hero__panel fade-in">
          <div class="hero__facts">
            <div><b>01</b><span>进行中的毕业设计：桌面陪伴型机器人（真实硬件 + 语音闭环）</span></div>
            <div><b>02</b><span>自研 AI 工具：Skill Hub / Camera / 模式切换器 / Codex Meter</span></div>
            <div><b>03</b><span>商业改款：航标灯外观改款、落水报警终端与智能锁系列</span></div>
          </div>
          </div>
        </div>
      </div>
      <div class="hero__scroll"><i></i><span>SCROLL ↓</span></div>
    </section>

    <div class="sheet">
      <section class="sec" id="directions">
        <div class="wrap">
          <div class="sec__head">
            <div>
              <div class="en-label"><b>01</b>TWO DIRECTIONS</div>
              <h2>选一个方向开始看</h2>
            </div>
          </div>
          <div class="gates">${gates}</div>
        </div>
      </section>
    </div>

    <div class="sheet">
      <section class="sec" id="picks">
        <div class="wrap">
          <div class="sec__head">
            <div>
              <div class="en-label"><b>02</b>SELECTED WORK</div>
              <h2>四个代表作</h2>
            </div>
          </div>
          <div class="picks">${picks}</div>
        </div>
      </section>
    </div>
    


    <div class="marquee" aria-hidden="true"><div class="marquee__row">${mq}</div></div>


    <div class="sheet">
      <section class="sec" id="aboutTeaser">
        <div class="wrap">
          <div class="about">
            <div class="about__pic rv"><img src="assets/img/about/portrait.webp" alt="${esc(SITE.name)}" loading="lazy"></div>
            <div class="rv">
              <div class="en-label"><b>03</b>ABOUT ME</div>
              <h2 style="margin:10px 0 14px">${esc(SITE.name)} · 产品设计 2027 届</h2>
              <p style="color:var(--ink-2)">${esc(ABOUT.intro)}</p>
              <div class="hero__cta">
                <a class="btn btn--ghost mag" href="#about">看完整经历<span class="btn__ar">→</span></a>
                <a class="btn btn--ghost mag" href="#download">下载作品集 PDF<span class="btn__ar">→</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    ${viewContact()}`;
  }

  function viewContact() {
    return `
    <section class="contact" id="contact">
      <div class="wrap">
        <div class="contact__grid">
          <div class="contact__top">
            <div class="en-label" style="color:rgba(255,255,255,.55)">CONTACT</div>
            <h2>聊聊产品、设计或 AI 工具</h2>
            <p class="contact__lead">2027 届校招，意向城市深圳、广州。工业设计与 AI 产品两个方向都可以聊；需要完整作品集或某个项目的更多过程记录，邮件或微信找我就好。</p>
          </div>
          <div>
            <div class="contact__list">
              <div class="crow">
                <i>✉</i>
                <div><span>邮箱</span><b><a href="mailto:${SITE.email}">${esc(SITE.email)}</a></b></div>
                <button class="cp" data-copy="${esc(SITE.email)}" data-label="邮箱">复制</button>
              </div>
              <div class="crow">
                <i>微</i>
                <div><span>微信</span><b>${esc(SITE.wechat)}</b></div>
                <button class="cp" data-copy="${esc(SITE.wechat)}" data-label="微信号">复制</button>
              </div>
              <div class="crow">
                <i>◎</i>
                <div><span>城市</span><b>${esc(SITE.city)}</b></div>
              </div>
              <div class="crow">
                <i>⬇</i>
                <div><span>作品集</span><b>完整 PDF（两个方向 + 三份简历）</b></div>
                <a class="cp" href="#download">去下载</a>
              </div>
            </div>
          </div>
          <div class="qrbox qrbox--wx">
            <div class="qrbox__slot qrbox__slot--filled" data-wx-slot><img src="assets/img/qr/wechat.jpg" alt="微信二维码：扫码添加付昕为好友" loading="lazy" width="162" height="162"></div>
            <div class="qrbox__txt"><b>微信扫码加我</b><span>微信号 zmdjan · 点这里复制</span></div>
          </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  function viewDirection(d) {
    /* 能力筛选标签（取各项目标签的并集，最多 8 个） */
    const allTags = [];
    d.projects.forEach(p => (p.tags || []).forEach(t => { if (!allTags.includes(t)) allTags.push(t); }));
    /* 筛选器用显式精选词表（按能力维度），不再按出现顺序随机取 8 个 */
    const FILTER_ORDER = ['Rhino 建模', '产品定义', '造型与形态', '结构设计', 'CMF',
      'KeyShot 交付', '硬件与嵌入式', '语音与交互', 'AI 工具设计', '交互原型', '视觉与版式', '品牌与包装'];
    const pick = FILTER_ORDER.filter(t => allTags.includes(t));
    const chips = ['全部', ...(pick.length >= 4 ? pick : allTags.slice(0, 8))];
    const cards = d.projects.map(p => `
      <a class="card rv" data-slug="${p.slug}" href="${p.link || "#" + d.id + "/" + p.slug}" data-tags="${esc((p.tags || []).join('|'))}">
        <canvas class="card__fx" aria-hidden="true"></canvas>
        <div class="card__img"><img src="${coverOf(p, d)}"${vattrs(coverOf(p, d), '(max-width:640px) 92vw, (max-width:1000px) 46vw, 21vw')} alt="${esc(p.title)}" loading="lazy" decoding="async"></div>
        <div class="card__meta">${(p.facts || []).slice(0, 3).map(f => `<i><b>${esc(f[0])}</b>${esc(f[1])}</i>`).join('')}</div>
        <div class="card__body">
          <div class="tags">${tags(p.tags.slice(0, 3))}</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.summary).slice(0, 78)}${p.summary.length > 78 ? '…' : ''}</p>
          <div class="card__foot">
            ${p.badge ? `<span class="badge">${esc(p.badge)}</span>` : '<span class="en-label">PROJECT</span>'}
            <span class="go" style="color:var(--accent-d);font-weight:700;font-size:13px">查看 →</span>
          </div>
        </div>
      </a>`).join('');

    return `
    <section class="sec sec--v2">
      ${pageHero({
        en: d.en,
        title: d.label,
        sub: d.title + ' — ' + d.lead,
        meta: [['方向项目', d.projects.length + ' 个'], ['完整 PDF', '可下载']]
      })}
      <div class="wrap">
      <div class="dir__bar">
        <span class="dir__hint">点项目名可快速定位 · 把鼠标放到卡片上可看关键信息</span>
        <a class="btn btn--ghost" href="${d.pdf}" download>下载完整 PDF</a>
      </div>
      <div class="filter" data-filter>
        <span class="filter__label">快速定位项目</span>
        <button type="button" class="filter__chip on" data-jump="all">全部</button>
        ${d.projects.map(p => `<button type="button" class="filter__chip" data-jump="${esc(p.slug)}">${esc(shortName(p))}</button>`).join('')}
        <span class="filter__count" data-count>${d.projects.length} 个项目</span>
      </div>
      <div class="cards" data-cards>${cards}</div>
      <p class="note">全部 ${d.projects.length} 个项目均来自完整作品集 PDF（本页图片即 PDF 对应页面）。商业项目已按公开边界匿名化处理。</p>
      <div class="pback">
        <a class="pback__btn" href="#/">← 回到首页</a>
      </div>
    </div></section>`;
  }

  function viewProject(d, p) {
    /* 若本页有可切换内容，则段3 的"做出什么"与切换同步（每项对应一件工具的产出） */
    const tabSec = (p.sections || []).find(x => x.tabs && x.tabs.length);
    const syncOutcomes = sec => {
      if (!tabSec || sec.syncTo !== 'tabs') return '';
      return `<div class="cs__outcomes" data-sync-target="${esc(p.slug)}">
        ${tabSec.tabs.map((x, i) => `<div class="cs__outcome${i === 0 ? ' on' : ''}" data-o="${i}">
          <b>${esc(x.t)}</b><p>${esc(x.o || x.d || '')}</p></div>`).join('')}
      </div>`;
    };

    const i = d.projects.indexOf(p);
    const prev = d.projects[i - 1], next = d.projects[i + 1];
    const facts = (p.facts || []).map(f => `<div class="fact"><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join('');
    const links = (p.links || []).map(l => `<a class="btn mag" href="${l.u}"${/^https?:/.test(l.u) ? ' target="_blank" rel="noopener"' : ''}>${esc(l.t)}<span class="btn__ar">→</span></a>`).join('');

    /* 图片块：fig--wide 占两列，fig--plate 占整行 */
    const fig = (f, cls, sizes) => `
      <figure class="fig ${f.wide ? 'fig--wide' : ''} ${cls || ''}">
        <img src="${f.f}"${vattrs(f.f, sizes)} alt="${esc(f.cap || p.title)}" loading="lazy" decoding="async">
        ${f.cap ? `<figcaption>${esc(f.cap)}</figcaption>` : ''}
      </figure>`;
    const figs = list => {
      if (!list || !list.length) return '';
      /* 低清图（宽<600px）自动走"小图组"，按原尺寸显示，避免被拉伸变糊 */
      const smallSet = (SITE.smallImgs || []).map(s => s.split('/').pop());
      const anySmall = list.some(f => smallSet.indexOf((f.f || '').split('/').pop()) >= 0);
      const grid = anySmall ? 'figs--small' : (list.length > 1 ? 'figs--grid' : 'figs--one');

      const gs = anySmall ? '(max-width:1000px) 45vw, 240px'
        : (list.length > 1 ? '(max-width:1000px) 100vw, 47vw' : '(max-width:1000px) 100vw, 66vw');
      const wide = '(max-width:1000px) 100vw, 66vw';
      return `<div class="figs ${grid}">${list.map(f => fig(f, null, f.wide ? wide : gs)).join('')}</div>`;
    };

    /* 章节：有 sections 用新叙事；老项目退回 body 字段，但用同一套版式 */
    const secs = p.sections || (p.body || []).map(b => ({ h: b.h, items: b.items }));
    const secHtml = secs.map((s, k) => `
      <section class="cs__sec rv" data-sec="${String(k + 1).padStart(2, '0')}" data-sech="${esc(s.h)}">
        <div class="cs__side">
          <span class="cs__no">${String(k + 1).padStart(2, '0')}</span>
          ${s.en ? `<span class="cs__en">${esc(s.en)}</span>` : ''}
        </div>
        <div class="cs__main">
          <h2>${esc(s.h)}</h2>
          ${s.lead ? `<p class="cs__lead">${emphasize(esc(shortText(s.lead, 46)), 2)}</p>` : ''}
          ${syncOutcomes(s)}${itemsBlock(s.items)}
          ${s.quote ? `<div class="cs__quote"><b>${esc(s.quote[0])}</b><span>${esc(s.quote[1])}</span></div>` : ''}
          ${figs(s.figures)}
          ${tabsBlock(s.tabs)}
          ${compareBlock(s.compare)}
          ${p.model && p.model.after === k ? modelPanel(p.model, { light: true }) : ''}
          ${p.model2 && p.model2.after === k ? modelPanel(p.model2, { light: true }) : ''}
        </div>
      </section>`).join('');

    const hero = p.hero ? `
      <figure class="heroFig shot">
        <img src="${p.hero.f}"${vattrs(p.hero.f, '(max-width:1000px) 100vw, 66vw')} alt="${esc(p.hero.cap || p.title)}" loading="eager" fetchpriority="high" decoding="async">
        ${p.hero.cap ? `<figcaption>${esc(p.hero.cap)}</figcaption>` : ''}
      </figure>` : '';
    const plates = (p.plates && p.plates.length)
      ? `<div class="plates">${p.plates.map(f => fig(f, 'fig--plate', '(max-width:1000px) 100vw, 66vw')).join('')}</div>` : '';
    /* 老项目：整页图仍作为图集放在最后 */
    const legacy = (!p.sections && p.images && p.images.length)
      ? `<div class="plates" style="margin-top:26px">${p.images.map(f => fig({ f }, 'fig--plate')).join('')}</div>` : '';
    const modelLoose = p.model && p.model.after === undefined ? modelPanel(p.model, { light: true }) : '';
    const model2Loose = p.model2 && p.model2.after === undefined ? modelPanel(p.model2, { light: true }) : '';
    return `
    <section class="pd pd--v2">
      ${pageHero({
        en: esc(d.en) + ' · ' + esc(p.en),
        title: p.title,
        sub: shortText(p.summary, 30),
        meta: p.facts || [],
        tags: p.tags || [],
        backHref: '#' + d.id,
        backText: (/^[A-Za-z]/.test(d.label) ? '返回 ' : '返回') + d.label,
      })}
      <div class="wrap">      ${hero}
      <div class="cs">${secHtml}</div>
      ${modelLoose}
      ${model2Loose}
      ${plates}
      ${legacy}
      ${links ? `<div class="pd__links">${links}</div>` : ''}
      <p class="note">页面图片均取自本人作品集（商业项目已按公开边界匿名化处理），点开可放大；完整过程页见
        <a href="${d.pdf}" download style="border-bottom:1px solid currentColor">${esc(d.label)}作品集 PDF</a>。</p>
      <div class="pd__nav">
        ${prev ? `<a href="#${d.id}/${prev.slug}">← 上一个：${esc(prev.title)}</a>` : '<span></span>'}
        ${next ? `<a href="#${d.id}/${next.slug}">下一个：${esc(next.title)} →</a>` : `<a href="#${d.id}">${/^[A-Za-z]/.test(d.label) ? '回到 ' + esc(d.label) : '回到' + esc(d.label)} →</a>`}
      </div>
      <div class="pback">
        <a class="pback__btn" href="#${d.id}">← ${/^[A-Za-z]/.test(d.label) ? '回到 ' + esc(d.label) : '回到' + esc(d.label)}</a>
        <a class="pback__btn pback__btn--ghost" href="#/">回到首页</a>
      </div>
      </div>
    </section>`;
  }

  function viewAbout() {
    const tl = ABOUT.timeline.map((t, i) => `
      <li class="rv stagger" style="transition-delay:${Math.min(i * 70, 420)}ms"><time>${esc(t.time)}</time><div><b>${esc(t.org)}</b><span>${esc(t.desc)}</span></div></li>`).join('');
    const sk = ABOUT.skills.map((s, i) => `<li class="rv stagger" style="transition-delay:${Math.min(i * 45, 320)}ms"><time>${esc(s.k)}</time><div><b>${esc(s.v)}</b></div></li>`).join('');
    return `
    <section class="sec sec--v2">
      ${pageHero({
        en: 'ABOUT ME',
        title: '关于我',
        sub: SITE.name + ' · ' + SITE.sub + ' · ' + SITE.school,
        meta: [['邮箱', SITE.email], ['微信', SITE.wechat], ['意向城市', SITE.city]]
      })}
      <div class="wrap">
      <div class="about">
        <figure class="about__pic shot rv"><img src="assets/img/about/portrait.webp" alt="${esc(SITE.name)}" loading="lazy"></figure>
        <div>
          <p style="color:var(--ink-2)">${esc(ABOUT.intro)}</p>
          <h4 style="margin:26px 0 4px">实践经历</h4>
          <ul class="timeline">${tl}</ul>
          <h4 style="margin:6px 0 4px">软件与技能</h4>
          <ul class="timeline">${sk}</ul>
          <p class="note">邮箱 <a href="mailto:${SITE.email}" style="border-bottom:1px solid currentColor">${esc(SITE.email)}</a>
             · 微信 <button class="copy-link" data-copy="${esc(SITE.wechat)}" data-label="微信号">${esc(SITE.wechat)}</button>
             · 意向城市 ${esc(SITE.city)}</p>
        </div>
      </div>
    </div></section>`;
  }

  function viewDownload() {
    /* 卡片装饰（流光背景 + 粒子画布）：与首页方向卡共用同一套 class 与引擎 */
    const dlDecor = i => `
        <div class="gate__flow" data-flow="${i % 2}">
          <i class="flow__blob b1"></i><i class="flow__blob b2"></i><i class="flow__blob b3"></i>
          <i class="flow__grid"></i><i class="flow__grain"></i><i class="flow__sheen"></i>
        </div>
        <canvas class="gate__fx" aria-hidden="true" data-fx="dl"></canvas>`;
    const cards = DOWNLOADS.map((f, i) => `
      <a class="dcard rv stagger" style="transition-delay:${Math.min(i * 60, 300)}ms" href="${f.f}" download>${dlDecor(i)}
        <div class="dcard__body">
          <b>${esc(f.t)}</b>
          <span class="dcard__sub">${esc(f.d)}</span>
          <div class="dcard__foot"><span class="go">下载 PDF <i></i></span><span class="chip">${esc(f.s)}</span></div>
        </div>
      </a>`).join('');
    return `
    <section class="sec sec--v2">
      ${pageHero({
        en: 'DOWNLOAD',
        title: '作品集与简历',
        sub: '完整 PDF 版本（页数较多，适合面试前了解全貌）。如需更小体积或指定方向的版本，邮件或微信联系即可。',
        meta: [['文件', DOWNLOADS.length + ' 份'], ['格式', 'PDF'], ['联系方式', SITE.email]]
      })}
      <div class="wrap">
      <div class="dl">${cards}</div>
      <div class="dl" style="margin-top:20px">
        <div class="dcard dcard--site rv">${dlDecor(1)}
          <div class="dcard__body">
            <b>作品集网站（在线）</b>
            <span class="dcard__sub">同一个网址，方便转发给同事或面试官：</span>
            <span class="dcard__url">${esc(SITE.siteUrl)}</span>
            <div class="dcard__foot">
              <button class="dlcopy" data-copy="${esc(SITE.siteUrl)}" data-label="网址">复制网址</button>
            </div>
          </div>
        </div>
      </div>
      <p class="note">PDF 由本人作品集源文件导出，内容与页面一致；商业项目均按公开边界匿名化处理。页面里的模型与原型都可以直接在网页上操作。</p>
    </div></section>`;
  }

  function notFound() {
    return `<section class="sec sec--v2">
      ${pageHero({ en: '404', title: '这个页面不存在', sub: '可能链接已经调整；回到首页或从方向入口重新进入。' })}
      <div class="wrap"><div class="sec__head"><div><div class="en-label">404</div>
      <h2>页面不存在</h2><p>可能是链接写错了。回到首页重新选择方向。</p></div></div>
      <a class="btn" href="#/">回首页</a></div></section>`;
  }

  /* ================= 路由 ================= */

  function render() {
    /* 组件隔离：任一组件初始化失败，其余照常运行
       （历史上曾两次因作用域/初始化问题让整页后半段全废：CARD_SEL 的 TDZ、disposeModels） */
    const safe = (name, fn) => { try { fn(); } catch (e) { try { console.warn('[init]', name, e); } catch (_) {} } };
    const raw = location.hash.replace(/^#\/?/, '');
    const [a, b] = raw.split('/');
    const isHome = !a || a === 'contact';
    let html, title = '付昕 · 工业设计 × AI 产品 / FU XIN Portfolio';

    if (isHome) html = viewHome();
    else if (a === 'about') { html = viewAbout(); title = '关于我 · 付昕'; }
    else if (a === 'download') { html = viewDownload(); title = '作品集与简历下载 · 付昕'; }
    else {
      const d = dir(a);
      if (!d) html = notFound();
      else if (!b) { html = viewDirection(d); title = `${d.label} · 付昕作品集`; }
      else {
        const p = proj(d, b);
        if (!p) html = notFound();
        else { html = viewProject(d, p); title = `${p.title} · 付昕作品集`; }
      }
    }

    app.innerHTML = html;
    document.title = title;
    body.classList.toggle('on-home', isHome);
    runCleanups();
    safe('disposeModels', disposeModels);
    safe('mountModels', () => mountModels(app));
    /* 项目页：章节轨道 + 草图↔成品对比滑块 */
    let domSecs = [];
    safe('sections', () => { domSecs = [...app.querySelectorAll('.cs__sec')].map(s => ({ h: (s.querySelector('h2') || {}).textContent || '' })); });
    if (domSecs.length) safe('rail', () => initRail(app, domSecs));
    safe('compare', () => initCompare(app));
    safe('tabs', () => initTabs(app));
    safe('gateFlow', () => gateFlowInit());
    safe('gateFX', () => mountGateFX(app));
    safe('cardParticles', () => mountCardFX(app));
  /* 移动端左上角返回键：非首页显示，点击回上一页（仅手机显示，见 CSS） */
  (() => {
    let mb = document.getElementById('mback');
    if (!mb) {
      mb = document.createElement('button');
      mb.id = 'mback'; mb.type = 'button'; mb.className = 'mback';
      mb.setAttribute('aria-label', '返回上一页'); mb.textContent = '←';
      mb.addEventListener('click', () => { if (history.length > 1) history.back(); else location.hash = '#/'; });
      document.body.appendChild(mb);
    }
    mb.classList.toggle('on', !!(location.hash || '').replace(/^#\/?/, ''));
  })();
    safe('cardFX', () => initCardFX(app));
    safe('jump', () => initJump(app)); safe('filter', () => initFilter(app));


    /* 导航高亮：标出当前所在方向/页面 */
    const cur = '#' + (a || '');
    document.querySelectorAll('#nav a.nav__link, .nav a').forEach(link => {
      const href = link.getAttribute('href') || '';
      const on = href === cur || (a && href === '#' + a);
      link.classList.toggle('on', !!on);
    });

    app.classList.remove('view-enter');
    void app.offsetWidth;
    if (!reduce) app.classList.add('view-enter');

    if (a === 'contact') {
      requestAnimationFrame(() => {
        const el = document.getElementById('contact');
        if (el) window.scrollTo({ top: el.offsetTop, behavior: reduce ? 'auto' : 'smooth' });
      });
    } else {
      window.scrollTo(0, 0);
    }

    /* 入场动效：不再因为系统"减少动态效果"而被静默关闭（站主要动效），并加兜底 */
    requestAnimationFrame(() => document.querySelector('.hero')?.classList.add('in'));
    setTimeout(() => document.querySelector('.hero')?.classList.add('in'), 800);
    safe('heroFX', () => mountHeroFX(app));
  safe('bgField', () => mountBgField(app));


    revealNow();
    updateNav();
    isHome ? FX.start() : FX.stop();
    updateProgress();
  }

  /* ================= 滚动驱动的内容揭示（逐块滑入） ================= */
  let pendingReveal = [];
  let shownReveal = [];
  const REVEAL_SEL = '.rv,.rv-em,.cs__lead,.cs__list,.cs__more,.fig,.tabs,.cmp,.m3d,.phero__meta,.phero__guide,.phero__title,.phero__sub,.cs__sec';

  function revealNow() {
    pendingReveal = [...app.querySelectorAll(REVEAL_SEL)];
    shownReveal = [];
    const cnt = new Map();
    pendingReveal.forEach(el => {
      const p = el.parentElement || app;
      const i = cnt.get(p) || 0;
      cnt.set(p, i + 1);
      if (!el.style.transitionDelay) el.style.transitionDelay = Math.min(i * 55, 240) + 'ms';
    });
    revealPass();
  }

  function revealPass() {
    if (!pendingReveal.length && !shownReveal.length) return;
    const vh = window.innerHeight;
    /* ① 回收：上边缘只剩不到 100px 时就开始"收"（看得见），或已完全滑到下方（不可见，避免闪烁） */
    const keep = [];
    for (const el of shownReveal) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 100 || r.top > vh) { el.classList.remove('in'); el.style.transition = ''; el.style.opacity = ''; el.style.transform = ''; pendingReveal.push(el); }
      else keep.push(el);
    }
    shownReveal = keep;
    /* ② 出现：顶部已进入画面才揭示（从上方回来的元素要等它真正进来，避免与回收来回打架） */
    const rest = [];
    for (const el of pendingReveal) {
      const r = el.getBoundingClientRect();
      let p;
      if (r.width === 0 && r.height === 0) { el.classList.add('in'); shownReveal.push(el); continue; }
      if (r.top < 0) p = r.bottom / Math.max(1, r.height * 0.5);
      else p = (vh - r.top) / (vh * 0.4);
      p = Math.max(0, Math.min(1, p));
      if (p <= 0) { rest.push(el); continue; }
      if (p >= 1) {
        el.style.transition = ''; el.style.opacity = ''; el.style.transform = '';
        el.classList.add('in'); shownReveal.push(el);
      } else {
        el.classList.remove('in');
        el.style.transition = 'opacity .12s linear, transform .12s linear';
        el.style.opacity = p.toFixed(3);
        el.style.transform = 'translateY(' + ((1 - p) * 68).toFixed(1) + 'px)';
        rest.push(el);
      }
    }
    pendingReveal = rest;
  }

  /* 主图轻微视差（26px，随滑动动，幅度小保证舒适） */
  function parallaxPass() {
    const vh = window.innerHeight;
    document.querySelectorAll('.heroFig img').forEach(img => {
      const r = img.getBoundingClientRect();
      if (r.bottom < -120 || r.top > vh + 120) return;
      const p = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.transform = 'translate3d(0,' + (-p * 26).toFixed(1) + 'px,0) scale(1.045)';
    });
  }

  /* 页头随滚动淡出/上移 + 当前章节吸顶提示 */
  function heroScrollPass() {
    const vh = window.innerHeight;
    const ph = document.querySelector('.phero');
    if (ph) {
      const t = Math.min(1, Math.max(0, window.scrollY / (ph.offsetHeight * 0.9)));
      const inner = ph.querySelector('.wrap');
      if (inner) { inner.style.opacity = (1 - t * 0.70).toFixed(3); inner.style.transform = 'translate3d(0,' + (-t * 26).toFixed(1) + 'px,0)'; }
    }
    /* 吸顶章节标签 */
    const chip = null;   /* 已由吸顶步骤条替代 */
    if (chip) {
      const secs = [...document.querySelectorAll('.cs__sec')];
      let cur = null;
      for (const s2 of secs) { const r = s2.getBoundingClientRect(); if (r.top <= 120 && r.bottom > 160) cur = s2; }
      if (cur) { chip.textContent = cur.dataset.sec + ' · ' + cur.dataset.sech; chip.classList.add('on'); }
      else chip.classList.remove('on');
    }
  }

  let rafFX = false;
  function onScrollFX() {
    if (rafFX) return;
    rafFX = true;
    requestAnimationFrame(() => { rafFX = false; revealPass(); parallaxPass(); heroScrollPass(); });
  }

  /* ================= 导航状态 ================= */

  function updateNav() {
    const onHome = body.classList.contains('on-home');
    const solid = window.scrollY > 40 || !onHome;
    body.classList.toggle('nav-solid', solid);
    body.classList.toggle('nav-dark', onHome && !solid);
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ================= 动态背景（首页） ================= */

  {   /* 粒子层：所有设备都挂载（手机也能看到）*/
    // 方向卡内的粒子层（与主页同一引擎 → 自动获得指针交互）
    let gateFXs = [];

    mountGateFX = scope => {
      gateFXs.forEach(f => f.dispose && f.dispose());
      gateFXs = [...scope.querySelectorAll('canvas.gate__fx')]
        .map(cv => createParticles(cv, cv.dataset.fx === 'dl'
          ? { density: 1900, maxN: 78, minN: 46, band: true, bandBase: .26, bandAmp: .13, bandWidth: 62,

              freeRatio: .30, link: 94, linkAlpha: .44, speed: 1.6, dpr: 1.25 }   /* 下载卡：网更密更亮，且集中在卡上半部 */

          : { density: 2600, maxN: 88, minN: 44, band: true, bandBase: .5, bandAmp: .14, bandWidth: 96,
              freeRatio: .36, link: 108, linkAlpha: .34, speed: 1.5, dpr: 1.25 })).filter(Boolean);
    };

    // ===== 统一卡片交互：倾斜 + 高光跟随（所有卡片共用同一套行为）=====
    initCardFX = function (scope) {
      const els = [...scope.querySelectorAll('.gate,.card,.pick,.dcard')];
      els.forEach(el => {
        let raf = 0, lastEv = null, rect = null, ramp = 0, lastT = 0;
        const RAMP_MS = 420;               // 入场渐入时长（用户要求再缓和一档：240 → 420ms）
        const strong = el.classList.contains('gate') || el.classList.contains('pick');
        const kx = strong ? 13 : 10;      // 旋转幅度（原来 ±3.5°/±2.2° 几乎看不出来，加大一档）
        const ky = strong ? 11 : 8;
        const lift = strong ? 12 : 9;
        const tick = () => { if (!raf) raf = requestAnimationFrame(step); };
        const step = ts => {
          raf = 0;
          const dt = lastT ? Math.min(64, ts - lastT) : 16;
          lastT = ts;
          ramp = Math.min(1, ramp + dt / RAMP_MS);
          const ev = lastEv;
          if (!ev || !rect) return;
          const e = ramp * ramp * (3 - 2 * ramp);          // ease-in-out 渐入
          const r = rect;
          const px = ((ev.clientX - r.left) / r.width - .5) * e;
          const py = ((ev.clientY - r.top) / r.height - .5) * e;
          el.style.setProperty('--mx', (px * 2).toFixed(3));
          el.style.setProperty('--my', (py * 2).toFixed(3));
          el.style.transform = 'perspective(1000px) rotateX(' + (-py * ky).toFixed(2) + 'deg) rotateY(' + (px * kx).toFixed(2) + 'deg) translateY(-' + (lift * e).toFixed(2) + 'px) scale(' + (1 + .012 * e).toFixed(4) + ')';
          if (ramp < 1) tick();                             // 入场期间自驱动，不依赖鼠标是否移动
        };
        const onEnter = e => {
          rect = el.getBoundingClientRect(); ramp = 0; lastT = 0; lastEv = e;
          el.classList.add('is-tilt');
          tick();
        };
        const onMove = e => {
          lastEv = e;                     // 只记最新事件，坐标在下一帧统一计算
          if (!rect) rect = el.getBoundingClientRect();
          tick();
        };
        const onLeave = () => {
          if (raf) { cancelAnimationFrame(raf); raf = 0; }
          rect = null; lastEv = null; ramp = 0; lastT = 0;
          el.classList.remove('is-tilt');
          el.style.transform = '';
          el.style.setProperty('--mx', '0');
          el.style.setProperty('--my', '0');
        };
        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        el.classList.add('fxcard');
        cleanups.push(() => {
          el.removeEventListener('pointerenter', onEnter);
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
          onLeave();
        });
      });
      return els.length;
    }

    // 方向卡的流光背景：指针位置 → CSS 变量（高光跟随）
    gateFlowInit = () => {
      document.querySelectorAll('.gate[data-flow]').forEach(g => {
        let raf = 0;
        const move = e => {
          const r = g.getBoundingClientRect();
          const mx = ((e.clientX - r.left) / r.width - .5) * 2;
          const my = ((e.clientY - r.top) / r.height - .5) * 2;
          if (raf) return;
          raf = requestAnimationFrame(() => {
            g.style.setProperty('--mx', mx.toFixed(3));
            g.style.setProperty('--my', my.toFixed(3));
            raf = 0;
          });
        };
        const leave = () => { g.style.setProperty('--mx', '0'); g.style.setProperty('--my', '0'); };
        g.addEventListener('pointermove', move);
        g.addEventListener('pointerleave', leave);
        cleanups.push(() => { g.removeEventListener('pointermove', move); g.removeEventListener('pointerleave', leave); });
      });
    };

    app.addEventListener('mouseout', e => {
      const g = e.target.closest('.gate');
      if (g && !g.contains(e.relatedTarget)) g.style.transform = '';
    });
    // 磁吸按钮
    document.addEventListener('mousemove', e => {
      const m = e.target.closest('.mag');
      document.querySelectorAll('.mag').forEach(el => { if (el !== m) el.style.transform = ''; });
      if (!m) return;
      const r = m.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      m.style.transform = `translate(${(dx * 7).toFixed(2)}px, ${(dy * 6).toFixed(2)}px)`;
    }, { passive: true });
  }

  /* 详细经历弹层 */
  function initExpModal(scope) {
    const modal = scope.querySelector('#expModal');
    if (!modal) return;
    const opens = [...scope.querySelectorAll('[data-exp]')];
    const panel = modal.querySelector('.exp__panel');
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add('on'));
      document.body.classList.add('exp-open');
      panel && panel.focus && panel.focus();
    };
    const close = () => {
      modal.classList.remove('on');
      document.body.classList.remove('exp-open');
      setTimeout(() => { modal.hidden = true; }, 260);
      lastFocus && lastFocus.focus && lastFocus.focus();
    };
    opens.forEach(b => {
      const h = () => open();
      b.addEventListener('click', h);
      cleanups.push(() => b.removeEventListener('click', h));
    });
    modal.querySelectorAll('[data-exp-close]').forEach(b => {
      const h = () => close();
      b.addEventListener('click', h);
      cleanups.push(() => b.removeEventListener('click', h));
    });
    const onKey = e => { if (e.key === 'Escape' && !modal.hidden) close(); };
    document.addEventListener('keydown', onKey);
    cleanups.push(() => { document.removeEventListener('keydown', onKey); document.body.classList.remove('exp-open'); });
  }

  /* ================= 复制 / toast ================= */
  const toast = document.getElementById('toast');
  let toastTimer = 0;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('on'), 1800);
  }
  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.top = '-1000px'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    ta.remove();
  }
  function copyText(text) {
    /* 先给反馈，再尝试写入剪贴板：避免无用户手势时 promise 挂起导致没有反馈 */
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
        return;
      }
    } catch (e) {}
    fallbackCopy(text);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const text = b.dataset.copy, label = b.dataset.label || '内容';
    copyText(text);
    showToast(`${label}已复制：${text}`);
  });

  /* ================= 灯箱 ================= */
  let shots = [], idx = 0;
  const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lb-img');
  function openLb(list, k) {
    if (typeof lbHint !== 'undefined' && lbHint) lbHint.hidden = false;
    shots = list; idx = k; lbImg.src = shots[idx];
    lb.hidden = false; document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = '';
    if (typeof lbHint !== 'undefined' && lbHint) lbHint.hidden = true; }
  function stepLb(n) { idx = (idx + n + shots.length) % shots.length; lbImg.src = shots[idx]; }

  app.addEventListener('click', e => {
    const shot = e.target.closest('.shot, .fig');
    if (!shot) return;
    const list = [...app.querySelectorAll('.shot img, .fig img')].map(i => i.getAttribute('src'));
    openLb(list, Math.max(0, [...app.querySelectorAll('.shot, .fig')].indexOf(shot)));
  });
  document.getElementById('lb-close').onclick = closeLb;
  document.getElementById('lb-prev').onclick = () => stepLb(-1);
  document.getElementById('lb-next').onclick = () => stepLb(1);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') stepLb(-1);
    if (e.key === 'ArrowRight') stepLb(1);
  });

  /* 站内锚点点击保险：即使有别的层干扰默认行为，也保证会跳转 */
  app.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#' || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (location.hash === href) render(); else location.hash = href;
  });

  /* ================= 阅读进度条 / 回到顶部 ================= */
  const pgbar = document.getElementById('pgbar');
  const totop = document.getElementById('totop');
  function updateProgress() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 40 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    if (pgbar) pgbar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (totop) totop.classList.toggle('on', window.scrollY > 620);
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  window.addEventListener('scroll', onScrollFX, { passive: true });
  window.addEventListener('resize', onScrollFX);
  if (totop) totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  /* 左上角 Logo：其他页点击 → 回主页（原有行为不变）；已经在主页点击 → 平滑滚回最上面 */
  const navBrand = document.querySelector('.nav__brand');
  if (navBrand) navBrand.addEventListener('click', (e) => {
    const rt = (location.hash || '').replace(/^#\/?/, '');
    if (!rt) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  });

  /* 灯箱操作提示（只在灯箱打开时显示） */
  const lbHint = document.createElement('div');
  lbHint.className = 'lb__hint';
  lbHint.textContent = '← → 切换 · Esc 关闭';
  document.body.appendChild(lbHint);
  lbHint.hidden = true;

  window.addEventListener('hashchange', render);
  render();
})();

/* 移动端下拉刷新：仅在页面顶部、单指下拉超过 90px 时触发（不干扰滚动，桌面端隐藏） */
(() => {
  let y0 = null, ind = null;
  const mk = () => {
    if (ind) return ind;
    ind = document.createElement('div');
    ind.className = 'ptr';
    ind.innerHTML = '<i></i><span>下拉刷新</span>';
    document.body.appendChild(ind);
    return ind;
  };
  addEventListener('touchstart', e => {
    y0 = (window.scrollY <= 2 && e.touches.length === 1) ? e.touches[0].clientY : null;
  }, { passive: true });
  addEventListener('touchmove', e => {
    if (y0 == null) return;
    const dy = e.touches[0].clientY - y0;
    if (dy < 8) return;
    const el = mk(), p = Math.min(dy / 120, 1);
    el.classList.add('on');
    el.style.opacity = p.toFixed(2);
    el.style.transform = 'translate(-50%,' + (Math.min(dy, 96) - 46) + 'px)';
    el.classList.toggle('ready', dy > 90);
    el.querySelector('span').textContent = dy > 90 ? '松手刷新' : '下拉刷新';
  }, { passive: true });
  addEventListener('touchend', () => {
    if (y0 == null) { return; }
    const el = ind;
    if (el && el.classList.contains('ready')) {
      el.querySelector('span').textContent = '刷新中…';
      location.reload();
      return;
    }
    if (el) { el.classList.remove('on', 'ready'); el.style.opacity = ''; el.style.transform = ''; }
    y0 = null;
  });
})();
/* 下拉刷新兜底：部分浏览器手指抬起时以 touchcancel 结束手势，这里同样收尾 */
addEventListener('touchcancel', () => {
  const el = document.querySelector('.ptr');
  if (!el) return;
  const sp = el.querySelector('span');
  if (el.classList.contains('ready')) { if (sp) sp.textContent = '刷新中…'; location.reload(); }
  else { el.classList.remove('on','ready'); el.style.opacity=''; el.style.transform=''; }
});

/* ===== 图片变体（自动按显示宽度选 sm/md/原图，灯箱仍读原图 src） ===== */
function imgv(p) { return (typeof IMGV !== 'undefined' && IMGV[p]) || null; }
function vsrcset(p) {
  var v = imgv(p); if (!v) return '';
  var out = [];
  if (v[1]) out.push(p.replace(/\.webp$/i, '-sm.webp') + ' ' + v[1] + 'w');
  if (v[2]) out.push(p.replace(/\.webp$/i, '-md.webp') + ' ' + v[2] + 'w');
  out.push(p + ' ' + v[0] + 'w');
  return out.join(', ');
}
function vattrs(p, sizes) {
  var s = vsrcset(p);
  return s ? ' srcset="' + s + '" sizes="' + (sizes || '100vw') + '"' : '';
}

/* ===== B 方案：白底漂浮微粒子（与首屏同一套语汇的反色铺面）=====
   做法：每个白底宿主内挂一张"跟随视口的画布"——画布高 = min(宿主高, 视口高)，
   滚动时贴住可见带（transform 平移）⇒ 案例页 6637px 白底也只占一屏位图，
   无巨型画布、无粒子回收跳变；画布是宿主直接子元素 + z-index:-1 ⇒ 白底之上、内容之下。
   开销：全部宿主都不可见时循环自动停（零开销）；可见时仅 1~2 张画布在画。 */

var BGFX = {                    /* ← 全部旋钮集中在这里 */
  density: 8000,                /* 每多少 px² 一颗（越小越密） */
  nMin: 44, nMax: 190,          /* 一屏粒子上/下限 */
  dotRGB: '17,18,20',           /* 点色（反色：深灰） */
  linkRGB: '232,89,12',         /* 连线色（品牌橙：细细的橙色线） */
  dotA: [0.20, 0.40],           /* 静态透明度：淡而可见 →「若隐若现」 */
  dotR: [0.85, 1.8],            /* 点半径区间 px */
  hot: 0.12, hotRGB: '196,88,26', hotA: 0.24,   /* 少量暖色点缀比例/色/透明度 */
  link: 120, linkA: 0.14,       /* 近邻连线：距离 / 最亮透明度（橙色细线） */
  pr: 200, prA: 0.30,           /* 光标柔光/提亮半径 、 与光标连线的透明度 */
  prLink: 130, prLinks: 4,      /* 光标当作"网里的一个点"：只连最近的 4 颗、限 130px 内 */
  glowRGB: '232,89,12', glowA: 0,               /* 光标柔光：默认关（它被卡片切断时会露馅）；想开就设 .05 */
  pushR: 85, pushF: 0.30,       /* 光标推开半径 / 力度 */
  boost: 0.62, grow: 0.70,      /* 光标附近：透明度/半径放大 →「靠近就有反应」 */
  drift: [5, 15],               /* 水平漂浮速度 px/s（整体缓慢左移） */
  amp: [9, 22],                 /* 纵向漫游幅度 px */
  period: [7, 15],              /* 纵向漫游周期 s */
  dpr: 1.25
};

function bgState() {
  var s = window.__bgFx;
  if (!s) s = window.__bgFx = { list: [], raf: 0, px: -9999, py: -9999, live: false, vis: false, last: 0 };
  return s;
}
function bgRand(a, b) { return a + Math.random() * (b - a); }

function bgBuild(reg) {
  var W = Math.max(1, reg.cv.clientWidth), H = Math.max(1, reg.cv.clientHeight);
  var n = Math.round(W * H / BGFX.density);
  n = Math.max(BGFX.nMin, Math.min(BGFX.nMax, n));
  var a = [];
  for (var i = 0; i < n; i++) {
    a.push({
      x: Math.random() * (W + 60) - 30, y: Math.random() * H,
      by: 0, vy: 0, vx: -bgRand(BGFX.drift[0], BGFX.drift[1]) / 60,
      r: bgRand(BGFX.dotR[0], BGFX.dotR[1]),
      a0: bgRand(BGFX.dotA[0], BGFX.dotA[1]),
      hot: Math.random() < BGFX.hot,
      ph: Math.random() * 6.283, ph2: Math.random() * 6.283,
      w: 6.283 / (bgRand(BGFX.period[0], BGFX.period[1]) * 1000),
      am: bgRand(BGFX.amp[0], BGFX.amp[1])
    });
  }
  for (var k = 0; k < a.length; k++) a[k].by = a[k].y;
  reg.parts = a; reg.n = n;
  return a;
}

/* 宿主顶部若有不透明的深色页头（如 .phero），粒子层要从它下面开始——
   否则粒子/连线被那块深色盖住，看起来像"断掉的线"（站主问过"这断开的是啥"）。
   返回：相对宿主顶部的起始偏移 px（顶部没有深色块时返回 0）。 */
function bgInset(host) {
  var ins = 0, hr = host.getBoundingClientRect(), kids = host.children;
  for (var i = 0; i < kids.length; i++) {
    var k = kids[i];
    if (k.classList && k.classList.contains('bgfx')) continue;
    var bg = window.getComputedStyle(k).backgroundColor || '';
    var m = /rgba?\(([^)]+)\)/.exec(bg);
    if (!m) break;
    var v = m[1].split(',').map(function (x) { return parseFloat(x); });
    var a = v.length > 3 ? v[3] : 1;
    var lum = v[0] * .299 + v[1] * .587 + v[2] * .114;
    if (a < .85 || lum > 150) break;              /* 透明/浅色 → 白底内容区开始 */
    ins = k.getBoundingClientRect().bottom - hr.top;
  }
  if (ins > 0) ins += 70;                         /* 页头下方那条渐隐带也一起让开 */
  return Math.max(0, Math.min(ins, host.clientHeight - 90));
}

/* ===== 遮挡网格：宿主里"不透明内容块"（卡片/图片/深色块）占的格子 =====
   粒子层在内容之下是对的，但线穿过去会被切断，看着像"断线/交界很生硬"。
   所以把不透明块标成格子，画线时采样几个点，一旦碰到就整条不画（宁可少一条线，不要半截线）。 */
function bgBuildGrid(reg) {
  var host = reg.host, W = Math.max(1, host.clientWidth), H = Math.max(1, host.clientHeight);
  var cell = 24, gw = Math.ceil(W / cell), gh = Math.ceil(H / cell);
  var data = new Uint8Array(gw * gh);
  var hr = host.getBoundingClientRect();
  var all = host.querySelectorAll('*'), n = 0;
  for (var i = 0; i < all.length && n < 220; i++) {
    var el = all[i];
    if (el.classList && el.classList.contains('bgfx')) continue;
    var r = el.getBoundingClientRect();
    if (r.width * r.height < 6000) continue;                 /* 小块（行内元素等）忽略 */
    var tag = el.tagName, isMedia = (tag === 'IMG' || tag === 'VIDEO');
    if (!isMedia) {
      var bg = window.getComputedStyle(el).backgroundColor || '';
      var m = /rgba?\(([^)]+)\)/.exec(bg);
      if (!m) continue;
      var v = m[1].split(',').map(function (x) { return parseFloat(x); });
      if ((v.length > 3 ? v[3] : 1) < .55) continue;          /* 半透明的不算遮挡 */
      var lum = v[0] * .299 + v[1] * .587 + v[2] * .114;
      if (lum > 238) continue;                                /* 白/近白容器＝与页面底同色，不算遮挡 */
      if (r.width * r.height > W * H * .92) continue;         /* 铺满整个宿主的容器也是页面底 */
    }
    n++;
    var x0 = Math.max(0, r.left - hr.left), y0 = Math.max(0, r.top - hr.top);
    var x1 = Math.min(W, r.right - hr.left), y1 = Math.min(H, r.bottom - hr.top);
    var cx0 = Math.floor(x0 / cell), cx1 = Math.floor(x1 / cell);
    var cy0 = Math.floor(y0 / cell), cy1 = Math.floor(y1 / cell);
    for (var cy = cy0; cy <= cy1 && cy < gh; cy++)
      for (var cx = cx0; cx <= cx1 && cx < gw; cx++) data[cy * gw + cx] = 1;
  }
  reg.grid = { cell: cell, gw: gw, gh: gh, data: data, n: n };
  return reg.grid;
}
function bgBlockedAt(reg, x, y) {                             /* 画布坐标 → 查遮挡 */
  var g = reg.grid;
  if (!g) return false;
  var hx = x, hy = y + reg.top;
  var cx = (hx / g.cell) | 0, cy = (hy / g.cell) | 0;
  if (cx < 0 || cy < 0 || cx >= g.gw || cy >= g.gh) return false;
  return g.data[cy * g.gw + cx] === 1;
}
function bgSegFree(reg, x1, y1, x2, y2) {                     /* 线段是否整段都没碰到内容块 */
  if (!reg.grid) return true;
  var dx = x2 - x1, dy = y2 - y1;
  var len = Math.sqrt(dx * dx + dy * dy);
  var steps = Math.max(1, Math.ceil(len / 10));
  for (var i = 0; i <= steps; i++) {
    var t = i / steps;
    if (bgBlockedAt(reg, x1 + dx * t, y1 + dy * t)) return false;
  }
  return true;
}

function bgSize(reg) {
  var W = Math.max(1, reg.host.clientWidth), H = Math.max(1, reg.bandH);
  if (reg.W === W && reg.H === H) return false;
  reg.W = W; reg.H = H;
  reg.cv.style.height = H + 'px';
  reg.cv.width = Math.round(W * BGFX.dpr);
  reg.cv.height = Math.round(H * BGFX.dpr);
  reg.ctx.setTransform(BGFX.dpr, 0, 0, BGFX.dpr, 0, 0);
  bgBuild(reg);
  return true;
}

function bgDraw(reg, ts, dt) {
  var ctx = reg.ctx, W = reg.W, H = reg.H, parts = reg.parts, st = bgState();
  var mx = st.px - reg.vx, my = st.py - reg.vy;
  var mon = st.live && mx > -260 && my > -260 && mx < W + 260 && my < H + 260;
  reg.mon = mon;                 /* 诊断用：验收脚本读它判断"指针是否落在本画布内" */
  ctx.clearRect(0, 0, W, H);

  /* ---- 运动：水平缓慢漂浮（出屏外换边，肉眼看不到跳变）+ 纵向正弦漫游 ---- */
  var pr2 = BGFX.pr * BGFX.pr, prL2 = BGFX.prLink * BGFX.prLink;
  var pushR = BGFX.pushR, pushF = BGFX.pushF, pushR2 = pushR * pushR;
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    p.x += p.vx * dt;
    if (p.x < -32) { p.x = W + 30; p.y = p.by = Math.random() * H; }
    p.y = p.by + Math.sin(ts * p.w + p.ph) * p.am + Math.sin(ts * p.w * 1.7 + p.ph2) * (p.am * .35);
    if (mon) {
      var dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
      if (d2 < pushR2 && d2 > 1) {                    /* 光标推开 */
        var d = Math.sqrt(d2), f = 1 - d / pushR;
        p.x += dx / d * pushF * f * dt * 2.2;
        p.by += dy / d * pushF * f * dt * 2.2;
        p.vy += dy / d * pushF * f * dt;
      }
      p.av = d2 < pr2 ? (1 - Math.sqrt(d2) / BGFX.pr) : 0;   /* 光标附近提亮 */
    } else { p.av = 0; }
    p.by += p.vy * dt; p.vy *= 1 - .045 * dt;
    if (p.by < 0) { p.by = 0; p.vy = 0; }
    if (p.by > H) { p.by = H; p.vy = 0; }
  }

  /* ---- 近邻连线（分 5 档批量描线，避免每线一次 stroke）---- */
  if (BGFX.link > 0) {
    var LB = 5, bk = [[], [], [], [], []], L2 = BGFX.link * BGFX.link, cell = BGFX.link, grid = {};
    for (var j = 0; j < parts.length; j++) {
      var q = parts[j], kk = ((q.x / cell) | 0) + '_' + ((q.y / cell) | 0);
      (grid[kk] || (grid[kk] = [])).push(q);
    }
    for (var kk2 in grid) {
      var g2 = kk2.split('_'), gx = +g2[0], gy = +g2[1], arr = grid[kk2];
      for (var ox = 0; ox <= 1; ox++) for (var oy = (ox === 0 ? 0 : -1); oy <= 1; oy++) {
        var nb = grid[(gx + ox) + '_' + (gy + oy)];
        if (!nb) continue;
        var same = ox === 0 && oy === 0;
        for (var a1 = 0; a1 < arr.length; a1++) {
          for (var b1 = same ? a1 + 1 : 0; b1 < nb.length; b1++) {
            var A = arr[a1], B = nb[b1], ddx = A.x - B.x, ddy = A.y - B.y, dd = ddx * ddx + ddy * ddy;
            /* 端点跑到画布外、或者整段要穿过不透明内容块 → 都不画（否则会出现"半截线"） */
            if (dd < L2 && A.x >= 0 && A.x <= W && B.x >= 0 && B.x <= W &&
                A.y >= 12 && A.y <= H - 12 && B.y >= 12 && B.y <= H - 12 &&
                bgSegFree(reg, A.x, A.y, B.x, B.y)) {
              var tt = 1 - Math.sqrt(dd) / BGFX.link, bi = (tt * LB) | 0;
              bk[bi < 0 ? 0 : (bi > LB - 1 ? LB - 1 : bi)].push(A.x, A.y, B.x, B.y);
            }
          }
        }
      }
    }
    ctx.lineWidth = 1;
    for (var m = 0; m < LB; m++) {
      if (!bk[m].length) continue;
      ctx.strokeStyle = 'rgba(' + BGFX.linkRGB + ',' + (((m + .5) / LB) * BGFX.linkA).toFixed(3) + ')';
      ctx.beginPath();
      for (var s2 = 0; s2 < bk[m].length; s2 += 4) { ctx.moveTo(bk[m][s2], bk[m][s2 + 1]); ctx.lineTo(bk[m][s2 + 2], bk[m][s2 + 3]); }
      ctx.stroke();
    }
  }

  /* ---- 光标：柔光 + 到粒子的连线（暖色，一眼看出能交互）---- */
  if (mon) {
    if (BGFX.glowA > .004) {                          /* 柔光默认关闭，避免被卡片切成硬边 */
      var g = ctx.createRadialGradient(mx, my, 0, mx, my, BGFX.pr);
      g.addColorStop(0, 'rgba(' + BGFX.glowRGB + ',' + BGFX.glowA + ')');
      g.addColorStop(1, 'rgba(' + BGFX.glowRGB + ',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(mx, my, BGFX.pr, 0, 6.283); ctx.fill();
    }
    /* 光标作为"网里的一个点"：只连最近的 prLinks 颗、且不超过 prLink 距离。
       用和网点一样的颜色（不是暖色），看起来就是这层网多接了一个节点 ✓ */
    var cand = [];
    for (var n2 = 0; n2 < parts.length; n2++) {
      var pp = parts[n2], ex = pp.x - mx, ey = pp.y - my, e2 = ex * ex + ey * ey;
      if (e2 < prL2 && pp.y > 12 && pp.y < H - 12 && !bgBlockedAt(reg, pp.x, pp.y) &&
          bgSegFree(reg, mx, my, pp.x, pp.y)) cand.push([e2, n2]);
    }
    cand.sort(function (u1, u2) { return u1[0] - u2[0]; });
    var M = Math.min(cand.length, BGFX.prLinks || 4);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(' + BGFX.linkRGB + ',' + BGFX.prA.toFixed(3) + ')';
    ctx.beginPath();
    for (var si = 0; si < M; si++) {
      var v = parts[cand[si][1]];
      ctx.moveTo(mx, my); ctx.lineTo(v.x, v.y);
    }
    ctx.stroke();
  }

  /* ---- 画点：逐点透明度；光标附近按 boost/grow 放大→「一放上去就显现」---- */
  ctx.lineWidth = 1;
  for (var r2 = 0; r2 < parts.length; r2++) {
    var z = parts[r2], av = z.av || 0, rr = z.r * (1 + av * BGFX.grow);
    var ev = Math.min(1, Math.min(z.y, H - z.y) / 24);      /* 贴近上下边界淡出：不出现"突然消失"的点 */
    if (ev <= .02 || bgBlockedAt(reg, z.x, z.y)) continue;   /* 落在内容块里的点直接不画 */
    ctx.fillStyle = z.hot
      ? 'rgba(' + BGFX.hotRGB + ',' + ((BGFX.hotA + av * BGFX.boost) * ev).toFixed(3) + ')'
      : 'rgba(' + BGFX.dotRGB + ',' + ((z.a0 + av * BGFX.boost) * ev).toFixed(3) + ')';
    ctx.beginPath();
    ctx.arc(z.x, z.y, z.hot ? rr * 1.15 : rr, 0, 6.283);
    ctx.fill();
  }
}

function bgTick(ts) {
  var st = bgState(); st.raf = 0;
  st.ticks = (st.ticks || 0) + 1;
  var dt = st.last ? Math.min(2.5, Math.max(.4, (ts - st.last) / 16.667)) : 1;
  st.last = ts;
  var vh = window.innerHeight, any = false;
  var L = st.list, i;
  /* 先批量读布局（避免读-写-读抖动），再写样式 */
  var rects = [];
  for (i = 0; i < L.length; i++) {
    var r = L[i];
    r.host.isConnected ? rects.push(r.host.getBoundingClientRect()) : rects.push(null);
  }
  for (i = 0; i < L.length; i++) {
    var reg = L[i], hr = rects[i];
    if (!hr || hr.height < 120 || hr.bottom < -40 || hr.top > vh + 40 || hr.width < 80) continue;
    if (reg.insetH !== hr.height || reg.inset === undefined) {
      reg.inset = bgInset(reg.host);
      reg.insetH = hr.height;
      bgBuildGrid(reg);
    }
    var ins = reg.inset || 0;
    reg.bandH = Math.min(hr.height - ins, vh);
    var top = Math.max(ins, Math.min(hr.height - reg.bandH, -hr.top));
    if (reg.top !== top) { reg.cv.style.transform = 'translate3d(0,' + top + 'px,0)'; reg.top = top; }
    if (!reg.on) { reg.on = true; reg.cv.classList.add('on'); }
    bgSize(reg);
    reg.vx = hr.left; reg.vy = hr.top + top;
    try { bgDraw(reg, ts, dt); } catch (err) { st.err = '' + (err && err.stack ? err.stack.split('\n')[0] + ' @' + (err.stack.split('\n')[1] || '') : err); }
    any = true;
  }
  st.vis = any;
  if (any) bgArm();
}
function bgArm() {
  var st = bgState();
  if (!st.raf) st.raf = requestAnimationFrame(bgTick);
}
function bgMount(host) {
  var cv = document.createElement('canvas');
  cv.className = 'bgfx';
  cv.setAttribute('aria-hidden', 'true');
  host.insertBefore(cv, host.firstChild);
  var reg = { host: host, cv: cv, ctx: cv.getContext('2d'), parts: [], W: 0, H: 0, top: -1, bandH: 0 };
  if (!reg.ctx) return;
  bgState().list.push(reg);
  return reg;
}
function mountBgField(scope) {
  var st = bgState();
  st.list = st.list.filter(function (r) { return r.host.isConnected; });
  var hosts = document.querySelectorAll('#app > .pd, #app > .sec, .sheet, .foot');
  for (var i = 0; i < hosts.length; i++) {
    var h = hosts[i], has = false;
    for (var j = 0; j < st.list.length; j++) if (st.list[j].host === h) { has = true; break; }
    if (has) continue;
    if (h.querySelector(':scope > .bgfx')) continue;
    bgMount(h);
  }
  if (!st.bound) {
    st.bound = true;
    window.addEventListener('scroll', bgArm, { passive: true });
    window.addEventListener('resize', bgArm, { passive: true });
    window.addEventListener('pointermove', function (e) {
      var s = bgState(); s.px = e.clientX; s.py = e.clientY; s.live = true;
      if (s.vis) bgArm();
    }, { passive: true });
    window.addEventListener('pointerdown', function (e) {
      var s = bgState(); s.px = e.clientX; s.py = e.clientY; s.live = true; bgArm();
    }, { passive: true });
    document.addEventListener('pointerleave', function () { bgState().live = false; bgArm(); });
    document.addEventListener('pointerup', function (e) {
      if (e.pointerType === 'touch') { bgState().live = false; bgArm(); }
    }, { passive: true });
  }
  bgArm();
}
