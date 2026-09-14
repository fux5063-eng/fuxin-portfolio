/* 付昕 portfolio —— 首页：深色动态舞台 + 双方向入口；内页：白底编辑式排版
   路由：#/ 首页 · #contact 联系方式 · #ai #id 方向 · #ai/<slug> 项目 · #about · #download */
(function () {
  const app = document.getElementById('app');
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer:fine)').matches;

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
    const light = !!opt.light;
    const cycle = opt.cycle || null;
    const plain = !!opt.plain;          /* 纯展示：不带任何工具按钮（首页用） */
    return `
      <figure class="m3d ${light ? 'm3d--light' : 'm3d--dark'} ${opt.cls || ''}">
        <div class="m3d__cv-wrap">
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
          <img src="${esc(c.before.f)}" alt="${esc(c.before.label || '过程')}">
          <div class="cmp__after"><img src="${esc(c.after.f)}" alt="${esc(c.after.label || '成品')}"></div>
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
    const m = String(x).match(/^([^：:，,。]{2,14})[：:，,]/);
    if (!m) return esc(x);
    return `<b>${esc(m[1])}</b>${esc(String(x).slice(m[1].length))}`;
  }

  /* 条目列表：默认最多 3 条，其余折叠在 <details> 里（信息随交互出现，减少阅读负担） */
  function itemsBlock(items, limit = 2) {
    const list = items || [];
    if (!list.length) return '';
    const head = list.slice(0, limit).map(x => `<li>${keyLead(x)}</li>`).join('');
    const rest = list.slice(limit);
    if (!rest.length) return `<ul class="cs__list">${head}</ul>`;
    return `<ul class="cs__list">${head}</ul>
          <details class="cs__more">
            <summary>展开其余 ${rest.length} 条 <i>＋</i></summary>
            <ul class="cs__list">${rest.map(x => `<li>${keyLead(x)}</li>`).join('')}</ul>
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
    }, opts || {});
    const linkD2 = o.linkD2 || o.link * o.link;
    let W = 0, H = 0, parts = [], raf = 0, on = false, last = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, o.dpr);
    const mouse = { x: 0, y: 0, on: false };

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
        } else {
          p.vx += ((.95 - Math.abs(p.vy) * .22) * p.sp * o.speed - p.vx) * .02 * dt;
          p.vy += (bandY(p.x, ts) + p.band - p.y) * .0022 * dt;
          p.vy += wander * .009 * dt;
        }
        if (mouse.on) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 31000 && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / 176) * .5; p.vx += dx / d * f * dt; p.vy += dy / d * f * dt; }
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
                ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - Math.sqrt(d2) / o.link) * o.linkAlpha).toFixed(3) + ')';
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
              }
            }
          }
        }
      }
      for (const p of parts) {
        ctx.beginPath();
        ctx.fillStyle = p.hot ? o.accent : 'rgba(226,236,246,.7)';
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() { if (on) return; on = true; last = 0; size(!parts.length); if (!raf) raf = requestAnimationFrame(frame); }
    function stop() { on = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    function onResize() { if (on) size(false); }
    window.addEventListener('resize', onResize, { passive: true });
    function dispose() { stop(); window.removeEventListener('resize', onResize); parts = []; }
    start();
    return { start, stop, dispose, canvas: cv, get count() { return parts.length; } };
  }

  /* 主页背景粒子 */
  const FX = createParticles(document.getElementById('fx'), {
    density: 10500, maxN: 240, bandAmp: .115, bandWidth: 74, freeRatio: .28, link: 130, linkAlpha: .44, speed: 1.95,
  }) || { start() {}, stop() {} };

  /* 内页页头粒子（尺寸小、密度低） */
  let heroFXs = [];
  function mountHeroFX(scope) {
    heroFXs.forEach(f => f.dispose && f.dispose());
    heroFXs = [...scope.querySelectorAll('canvas.phero__fx')]
      .map(cv => createParticles(cv, {
        density: 9200, maxN: 130, minN: 40, bandBase: .58, bandAmp: .10, bandWidth: 42,
        freeRatio: .16, link: 126, linkAlpha: .38, speed: 1.9,
      })).filter(Boolean);
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
        ${o.backHref === false ? '' : `<a class="phero__back" href="${o.backHref || '#/'}">← ${esc(o.backText || '返回首页')}</a>`}
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
  function tabsBlock(list) {
    if (!list || !list.length) return '';
    return `
      <div class="tabs" data-tabs>
        <div class="tabs__chips" role="tablist">
          ${list.map((x, i) => `<button type="button" class="tabs__chip${i === 0 ? ' on' : ''}" data-i="${i}" role="tab">${esc(x.t)}</button>`).join('')}
        </div>
        <div class="tabs__panes">
          ${list.map((x, i) => `
            <div class="tabs__pane${i === 0 ? ' on' : ''}" data-i="${i}" role="tabpanel">
              <figure class="shot"><img src="${esc(x.f)}" alt="${esc(x.t)}"></figure>
              <div class="tabs__txt"><b>${esc(x.t)}</b><p>${esc(x.d || '')}</p></div>
            </div>`).join('')}
        </div>
        <div class="tabs__foot">点上面的标签切换细节 · 点图可放大</div>
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
    rail.className = 'rail';
    rail.innerHTML = '<span class="rail__wrap"></span><i class="rail__bar"></i>' +
      items.map((s, i) => `<a href="#" data-i="${i}"><b>${String(i + 1).padStart(2, '0')}</b><span>${esc(secs[i].h)}</span></a>`).join('');
    document.body.appendChild(rail);
    const bar = rail.querySelector('.rail__bar');
    const links = [...rail.querySelectorAll('a')];
    links.forEach(a => a.addEventListener('click', e => {
      e.preventDefault();
      const t = items[+a.dataset.i];
      if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
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
      bar.style.transform = `scaleY(${p})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => { window.removeEventListener('scroll', onScroll); rail.remove(); });
  }

  /* 方向页：按能力筛选卡片 */
  function initFilter(scope) {
    scope.querySelectorAll('[data-filter]').forEach(box => {
      const chips = [...box.querySelectorAll('.filter__chip')];
      const cards = [...scope.querySelectorAll('[data-cards] .card')];
      const countEl = box.querySelector('[data-count]');
      chips.forEach(chip => chip.addEventListener('click', () => {
        const t = chip.dataset.tag;
        chips.forEach(c => c.classList.toggle('on', c === chip));
        let shown = 0;
        cards.forEach(card => {
          const match = t === '全部' || (card.dataset.tags || '').split('|').includes(t);
          card.classList.toggle('is-hidden', !match);
          if (match) shown++;
        });
        if (countEl) countEl.textContent = shown + ' 个项目';
      }));
    });
  }

  /* 细节切换器交互 */
  function initTabs(scope) {
    scope.querySelectorAll('[data-tabs]').forEach(box => {
      const chips = [...box.querySelectorAll('.tabs__chip')];
      const panes = [...box.querySelectorAll('.tabs__pane')];
      chips.forEach(c => c.addEventListener('click', () => {
        const i = +c.dataset.i;
        chips.forEach((x, k) => x.classList.toggle('on', k === i));
        panes.forEach((x, k) => x.classList.toggle('on', k === i));
      }));
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
    import('./model3d.js?v=20260914W').then(mod => {
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
  function disposeModels() { viewers.forEach(v => { try { v.dispose(); } catch (e) {} }); viewers = []; window.__m3d = viewers; }

  /* ================= 视图 ================= */

  function viewHome() {
    const gates = DIRECTIONS.map((d, i) => `
      <a class="gate rv" href="#${d.id}" data-tilt>
        <div class="gate__bg"><img src="${d.cover}" alt="${esc(d.label)}" loading="${i ? 'lazy' : 'eager'}"></div>
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
        <div class="pick__img"><img src="${esc(cover)}" alt="${esc(p.title)}" loading="${idx < 2 ? 'eager' : 'lazy'}"></div>
        <div class="pick__body">
          <div class="pick__eyebrow">${esc(dir.label)} · ${esc(fact[0])}</div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(shortText(p.summary, 42))}</p>
          <span class="pick__go">看完整案例 <i></i></span>
        </div>
        <div class="pick__tags">${(p.tags || []).slice(0, 3).map(t => `<span>${esc(t)}</span>`).join('')}</div>
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
      <section class="sec" id="modelBand">
        <div class="wrap">
          <div class="sec__head">
            <div>
              <div class="en-label"><b>03</b>REAL MODEL · 3D</div>
              <h2>不是渲染图，是可以自己转的模型</h2>
              <p>下面这块放的是建模文件本身。按住拖动就能从任意角度看体量、分件和曲面关系——比一张静态渲染图更能说明设计。</p>
            </div>
          </div>
          <div class="modelband">
            <div class="rv">
              <ul class="m3d-list">
                <li><b>直接看模型</b><span>不用点开下载文件，页面上就能转</span></li>
                <li><b>体量与比例</b><span>真实建模尺寸关系，不是摆拍角度</span></li>
                <li><b>多个项目都有</b><span>牵引绳 / 航标灯 / 落水报警终端 / 灯具，各自的页面里都能转</span></li>
              </ul>
              <div class="hero__cta" style="margin-top:18px">
                <a class="btn btn--ghost mag" href="#id/doggie">看 DOGGIE 项目<span class="btn__ar">→</span></a>
                <a class="btn btn--ghost mag" href="#id">工业设计方向<span class="btn__ar">→</span></a>
              </div>
            </div>
            <div class="rv">${modelPanel(HOME_MODEL, { light: true, plain: true })}</div>
          </div>
        </div>
      </section>
    </div>

    <div class="sheet">
      <section class="sec" id="aboutTeaser">
        <div class="wrap">
          <div class="about">
            <div class="about__pic rv"><img src="assets/img/about/portrait.jpg" alt="${esc(SITE.name)}" loading="lazy"></div>
            <div class="rv">
              <div class="en-label"><b>04</b>ABOUT ME</div>
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
          <div>
            <div class="en-label" style="color:rgba(255,255,255,.55)">CONTACT</div>
            <h2>聊聊产品、设计或 AI 工具</h2>
            <p class="contact__lead">2027 届校招，意向城市深圳、广州。工业设计与 AI 产品两个方向都可以聊；需要完整作品集或某个项目的更多过程记录，邮件或微信找我就好。</p>
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
          <div class="qrbox">
            <img class="qrbox__img" src="${SITE.qrSite}" alt="作品集网站二维码">
            <div class="qrbox__txt"><b>扫码看作品集网站</b><span>${esc(SITE.siteUrl.replace('https://', ''))}</span></div>
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
    const chips = ['全部', ...allTags.slice(0, 8)];
    const cards = d.projects.map(p => `
      <a class="card rv" href="#${d.id}/${p.slug}" data-tags="${esc((p.tags || []).join('|'))}">
        <div class="card__img"><img src="${coverOf(p, d)}" alt="${esc(p.title)}" loading="lazy"></div>
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
        <span class="dir__hint">点标签按能力筛选 · 把鼠标放到卡片上可看关键信息</span>
        <a class="btn btn--ghost" href="${d.pdf}" download>下载完整 PDF</a>
      </div>
      <div class="filter" data-filter>
        <span class="filter__label">按能力筛选</span>
        ${chips.map((t, i) => `<button type="button" class="filter__chip${i === 0 ? ' on' : ''}" data-tag="${esc(t)}">${esc(t)}</button>`).join('')}
        <span class="filter__count" data-count>${d.projects.length} 个项目</span>
      </div>
      <div class="cards" data-cards>${cards}</div>
      <p class="note">全部 ${d.projects.length} 个项目均来自完整作品集 PDF（本页图片即 PDF 对应页面）。商业项目已按公开边界匿名化处理。</p>
    </div></section>`;
  }

  function viewProject(d, p) {
    const i = d.projects.indexOf(p);
    const prev = d.projects[i - 1], next = d.projects[i + 1];
    const facts = (p.facts || []).map(f => `<div class="fact"><dt>${esc(f[0])}</dt><dd>${esc(f[1])}</dd></div>`).join('');
    const links = (p.links || []).map(l => `<a class="btn mag" href="${l.u}"${/^https?:/.test(l.u) ? ' target="_blank" rel="noopener"' : ''}>${esc(l.t)}<span class="btn__ar">→</span></a>`).join('');

    /* 图片块：fig--wide 占两列，fig--plate 占整行 */
    const fig = (f, cls) => `
      <figure class="fig ${f.wide ? 'fig--wide' : ''} ${cls || ''}">
        <img src="${f.f}" alt="${esc(f.cap || p.title)}" loading="lazy">
        ${f.cap ? `<figcaption>${esc(f.cap)}</figcaption>` : ''}
      </figure>`;
    const figs = list => (list && list.length) ? `<div class="figs">${list.map(f => fig(f)).join('')}</div>` : '';

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
          ${s.lead ? `<p class="cs__lead">${esc(shortText(s.lead, 46))}</p>` : ''}
          ${itemsBlock(s.items)}
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
        <img src="${p.hero.f}" alt="${esc(p.hero.cap || p.title)}" loading="lazy">
        ${p.hero.cap ? `<figcaption>${esc(p.hero.cap)}</figcaption>` : ''}
      </figure>` : '';
    const plates = (p.plates && p.plates.length)
      ? `<div class="plates">${p.plates.map(f => fig(f, 'fig--plate')).join('')}</div>` : '';
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
        backText: d.label,
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
        ${next ? `<a href="#${d.id}/${next.slug}">下一个：${esc(next.title)} →</a>` : `<a href="#${d.id}">回到${esc(d.label)} →</a>`}
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
        <figure class="about__pic shot rv"><img src="assets/img/about/portrait.jpg" alt="${esc(SITE.name)}" loading="lazy"></figure>
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
    const cards = DOWNLOADS.map((f, i) => `
      <a class="rv stagger" style="transition-delay:${Math.min(i * 60, 300)}ms" href="${f.f}" download><b>${esc(f.t)}</b><span>${esc(f.d)} · ${esc(f.s)}</span><span style="color:var(--accent-d);font-weight:700;font-size:13px">下载 PDF →</span></a>`).join('');
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
      <div class="dl" style="margin-top:18px;grid-template-columns:1fr">
        <a href="${SITE.siteUrl}" target="_blank" rel="noopener">
          <b>作品集网站（在线）</b>
          <span>同一个网址，方便转发给同事或面试官：${esc(SITE.siteUrl)}</span>
          <span style="color:var(--accent-d);font-weight:700;font-size:13px">打开网站 →</span>
        </a>
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
    runCleanups();                       // 清掉上一页的轨道/滑块监听
    disposeModels();
    mountModels(app);
    /* 项目页：章节轨道 + 草图↔成品对比滑块 */
    const domSecs = [...app.querySelectorAll('.cs__sec')].map(s => ({ h: (s.querySelector('h2') || {}).textContent || '' }));
    if (domSecs.length) initRail(app, domSecs);
    initCompare(app);
    initTabs(app);
    initFilter(app);

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
    mountHeroFX(app);
    revealNow();
    updateNav();
    isHome ? FX.start() : FX.stop();
    updateProgress();
  }

  /* ================= 滚动驱动的内容揭示（逐块滑入） ================= */
  let pendingReveal = [];
  const REVEAL_SEL = '.rv,.rv-em,.cs__lead,.cs__list,.cs__more,.fig,.tabs,.cmp,.m3d,.phero__meta,.phero__guide,.phero__title,.phero__sub,.cs__sec';

  function revealNow() {
    pendingReveal = [...app.querySelectorAll(REVEAL_SEL)];
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
    if (!pendingReveal.length) return;
    const vh = window.innerHeight;
    const rest = [];
    for (const el of pendingReveal) {
      const r = el.getBoundingClientRect();
      const show = (r.width === 0 && r.height === 0) || r.top < vh * 0.94;
      if (show) el.classList.add('in'); else rest.push(el);
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
    const chip = document.getElementById('secChip');
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
    body.classList.toggle('on-ink', !(onHome && !solid));
  }
  window.addEventListener('scroll', updateNav, { passive: true });

  /* ================= 动态背景（首页） ================= */

  /* ================= 光标 / 倾斜 / 磁吸 ================= */
  if (fine) {
    const dot = document.getElementById('cur-dot'), ring = document.getElementById('cur-ring');
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('a,button,.gate,.card,.shot,.copy-link,input');
      body.classList.toggle('cur-hover', !!t);
    });
  } else {
    document.getElementById('cur-dot')?.remove();
    document.getElementById('cur-ring')?.remove();
  }

  if (fine) {
    // 卡片倾斜（首页 gate）
    app.addEventListener('mousemove', e => {
      const g = e.target.closest('.gate');
      if (!g) return;
      const r = g.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      g.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-6px)`;
    });
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

  /* 灯箱操作提示（只在灯箱打开时显示） */
  const lbHint = document.createElement('div');
  lbHint.className = 'lb__hint';
  lbHint.textContent = '← → 切换 · Esc 关闭';
  document.body.appendChild(lbHint);
  lbHint.hidden = true;

  window.addEventListener('hashchange', render);
  render();
})();
