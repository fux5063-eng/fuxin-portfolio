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
              <figure class="shot"><img src="${esc(x.f)}" alt="${esc(x.t)}" loading="lazy"></figure>
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
    import('./model3d.js?v=20260914c').then(mod => {
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
            <a class="btn btn--light mag" href="#ai">看 AI 产品方向<span class="btn__ar">→</span></a>
            <a class="btn btn--outline-light mag" href="#id">看工业设计方向<span class="btn__ar">→</span></a>
          </div>
          <div class="hero__meta">
            <span><b>${esc(SITE.name)}</b> ${esc(SITE.sub)}</span>
            <span>${esc(SITE.school)}</span>
            <span>意向城市 <b>${esc(SITE.city)}</b></span>
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
      <p class="hero__cue rv">往下是两条线的代表作：<b>工业方向</b>可以转 DOGGIE 牵引绳、看航标灯改款；<b>AI 方向</b>是机器人毕设与自研工具。每个项目页都能<b>拖模型、拖对比条、点标签看细节</b>。</p>
      <div class="hero__scroll"><i></i><span>SCROLL ↓</span></div>
    </section>

    <div class="sheet">
      <section class="sec" id="directions">
        <div class="wrap">
          <div class="sec__head">
            <div>
              <div class="en-label">TWO DIRECTIONS</div>
              <h2>选一个方向开始看</h2>
              <p>两个方向共用同一套工作方法：先判断边界，再推进造型与验证，最后把过程留成可复用的记录。</p>
            </div>
          </div>
          <div class="gates">${gates}</div>
        </div>
      </section>
    </div>

    <div class="marquee" aria-hidden="true"><div class="marquee__row">${mq}</div></div>

    <div class="sheet">
      <section class="sec" id="modelBand">
        <div class="wrap">
          <div class="sec__head">
            <div>
              <div class="en-label">REAL MODEL · 3D</div>
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
              <div class="en-label">ABOUT ME</div>
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
    const cards = d.projects.map(p => `
      <a class="card rv" href="#${d.id}/${p.slug}">
        <div class="card__img"><img src="${p.images[0]}" alt="${esc(p.title)}" loading="lazy"></div>
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
    <section class="sec"><div class="wrap">
      <a class="backlink" href="#/">← 返回首页</a>
      <div class="sec__head" style="margin-top:20px">
        <div>
          <div class="en-label">${esc(d.en)}</div>
          <h2>${esc(d.label)}</h2>
          <p>${esc(d.title)} — ${esc(d.lead)}</p>
        </div>
        <a class="btn btn--ghost" href="${d.pdf}" download>下载完整 PDF</a>
      </div>
      <div class="cards">${cards}</div>
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
      <section class="cs__sec rv">
        <div class="cs__side">
          <span class="cs__no">${String(k + 1).padStart(2, '0')}</span>
          ${s.en ? `<span class="cs__en">${esc(s.en)}</span>` : ''}
        </div>
        <div class="cs__main">
          <h2>${esc(s.h)}</h2>
          ${s.lead ? `<p class="cs__lead">${esc(s.lead)}</p>` : ''}
          ${(s.items || []).length ? `<ul class="cs__list">${s.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
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
    <section class="pd"><div class="wrap">
      <a class="backlink" href="#${d.id}">← ${esc(d.label)}</a>
      <div class="pd__head pd__hero" style="margin-top:18px">
        <div class="en-label">${esc(p.en)}</div>
        <h1>${esc(p.title)}</h1>
        <p class="pd__lead">${esc(p.summary)}</p>
        <div class="tags" style="margin-top:16px">${tags(p.tags)}</div>
        <div class="pd__facts">${facts}</div>
        <p class="pd__guide">
          <span>本页结构</span>${secs.map((x, i) => `<b>${String(i + 1).padStart(2, '0')} ${esc(x.h)}</b>`).join('<span class="sep">→</span>')}
          <span class="sep">·</span>
          <span>可以这样看：<em>拖动对比条</em>看前后、<em>点标签</em>看细节、<em>拖动模型</em>转着看</span>
        </p>
      </div>
      ${hero}
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
    </div></section>`;
  }

  function viewAbout() {
    const tl = ABOUT.timeline.map(t => `
      <li><time>${esc(t.time)}</time><div><b>${esc(t.org)}</b><span>${esc(t.desc)}</span></div></li>`).join('');
    const sk = ABOUT.skills.map(s => `<li><time>${esc(s.k)}</time><div><b>${esc(s.v)}</b></div></li>`).join('');
    return `
    <section class="sec"><div class="wrap">
      <a class="backlink" href="#/">← 返回首页</a>
      <div class="sec__head" style="margin-top:20px">
        <div><div class="en-label">ABOUT ME</div><h2>关于我</h2><p>${esc(SITE.name)} · ${esc(SITE.sub)} · ${esc(SITE.school)}</p></div>
      </div>
      <div class="about">
        <div class="about__pic"><img src="assets/img/about/portrait.jpg" alt="${esc(SITE.name)}"></div>
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
    const cards = DOWNLOADS.map(f => `
      <a href="${f.f}" download><b>${esc(f.t)}</b><span>${esc(f.d)} · ${esc(f.s)}</span><span style="color:var(--accent-d);font-weight:700;font-size:13px">下载 PDF →</span></a>`).join('');
    return `
    <section class="sec"><div class="wrap">
      <a class="backlink" href="#/">← 返回首页</a>
      <div class="sec__head" style="margin-top:20px">
        <div><div class="en-label">DOWNLOAD</div><h2>作品集与简历</h2>
        <p>完整 PDF 版本（页数较多，适合面试前了解全貌）。如需更小体积或指定方向的版本，邮件或微信联系即可。</p></div>
      </div>
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
    return `<section class="sec"><div class="wrap"><div class="sec__head"><div><div class="en-label">404</div>
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

    /* 导航高亮：标出当前所在方向/页面 */
    const cur = '#' + (a || '');
    app.querySelectorAll('.nav a').forEach(link => {
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
    revealNow();
    updateNav();
    isHome ? FX.start() : FX.stop();
    updateProgress();
  }

  function revealNow() {
    const els = app.querySelectorAll('.rv');
    if (reduce || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents, o) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(e => io.observe(e));
    setTimeout(() => els.forEach(e => e.classList.add('in')), 1400);
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
  const FX = (() => {
    const cv = document.getElementById('fx');
    if (!cv) return { start() {}, stop() {} };
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, parts = [], raf = 0, on = false;
    const mouse = { x: -9999, y: -9999, on: false };

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = cv.clientWidth || window.innerWidth;
      H = cv.clientHeight || window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(230, Math.max(60, (W * H) / 11000)));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        r: Math.random() * 1.6 + .7, hot: Math.random() < .19,
        /* 每个粒子自己的相位 + 生命周期：避免所有粒子锁到同一条流线上"糊成一条线" */
        ph: Math.random() * 6.283, age: Math.random() * 500, life: 320 + Math.random() * 700
      }));
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        const a = (Math.sin((p.x + t * .00012) * .0026 + p.ph) + Math.cos((p.y + t * .00009) * .0031 + p.ph * 1.7)) * Math.PI;
        p.vx += Math.cos(a) * .013 + (Math.random() - .5) * .028;   // 随机扰动：不让粒子对齐成线
        p.vy += Math.sin(a) * .013 + (Math.random() - .5) * .028;
        if (mouse.on) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 31000 && d2 > 1) {
            const d = Math.sqrt(d2), f = (1 - d / 176) * .5;
            p.vx += dx / d * f; p.vy += dy / d * f;
          }
        }
        p.vx *= .986; p.vy *= .986;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 1.6) { p.vx = p.vx / sp * 1.6; p.vy = p.vy / sp * 1.6; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < -24) p.x = W + 24; else if (p.x > W + 24) p.x = -24;
        if (p.y < -24) p.y = H + 24; else if (p.y > H + 24) p.y = -24;
        /* 到寿命就换个位置重生 */
        p.age++;
        if (p.age > p.life) {
          p.x = Math.random() * W; p.y = Math.random() * H;
          p.vx = (Math.random() - .5) * .3; p.vy = (Math.random() - .5) * .3;
          p.age = 0; p.life = 320 + Math.random() * 700; p.ph = Math.random() * 6.283;
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < 20500) {
            ctx.strokeStyle = 'rgba(255,255,255,' + ((1 - Math.sqrt(d2) / 148) * .5).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const p of parts) {
        ctx.fillStyle = p.hot ? 'rgba(255,116,40,1)' : 'rgba(255,255,255,.85)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      if (mouse.on) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 190);
        g.addColorStop(0, 'rgba(232,89,12,.16)'); g.addColorStop(1, 'rgba(232,89,12,0)');
        ctx.fillStyle = g; ctx.fillRect(mouse.x - 190, mouse.y - 190, 380, 380);
      }
      raf = requestAnimationFrame(frame);
    }

    window.addEventListener('resize', () => { if (on) size(); });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.on = true; }, { passive: true });
    document.addEventListener('mouseleave', () => { mouse.on = false; });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf), raf = 0; }
      else if (on && !raf) raf = requestAnimationFrame(frame);
    });

    return {
      start() {
        if (on) return;                 /* 动效是首页的识别特征，不随 prefers-reduced-motion 关闭 */
        on = true; size(); raf = requestAnimationFrame(frame);
      },
      stop() { on = false; if (raf) cancelAnimationFrame(raf); raf = 0; ctx.clearRect(0, 0, W, H); }
    };
  })();

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
