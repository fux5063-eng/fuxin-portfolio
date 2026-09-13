/* 付昕 portfolio —— 单页 + hash 路由：#/ 首页 · #ai / #id 方向 · #ai/<slug> 项目 · #about · #download */
(function () {
  const app = document.getElementById('app');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const dir = id => DIRECTIONS.find(d => d.id === id);
  const proj = (d, slug) => d && d.projects.find(p => p.slug === slug);

  function tags(arr, cls) { return (arr || []).map(t => `<span class="${cls || 'tag'}">${esc(t)}</span>`).join(''); }

  /* ---------- views ---------- */

  function viewHome() {
    const entries = DIRECTIONS.map(d => `
      <a class="entry rv" href="#${d.id}">
        <div class="entry__img"><img src="${d.cover}" alt="${esc(d.label)}" loading="lazy"></div>
        <div class="entry__body">
          <div class="en-label">${esc(d.en)}</div>
          <h3>${esc(d.label)}</h3>
          <p>${esc(d.title)}</p>
          <div class="entry__tags">${tags(d.keywords)}</div>
          <div class="entry__foot">
            <span class="entry__go">进入方向 →</span>
            <span class="entry__count">共 ${d.projects.length} 个项目</span>
          </div>
        </div>
      </a>`).join('');

    return `
    <section class="hero"><div class="wrap">
      <div class="hero__grid">
        <div>
          <div class="en-label">${esc(SITE.heroKicker)}</div>
          <p class="hero__role">${esc(SITE.heroRole)}</p>
          <h1>${SITE.heroTitle}</h1>
          <p class="hero__lead">${esc(SITE.heroLead)}</p>
          <div class="hero__meta">
            <span><b>${esc(SITE.name)}</b> ${esc(SITE.sub)}</span>
            <span>${esc(SITE.school)}</span>
            <span>意向城市 <b>${esc(SITE.city)}</b></span>
            <span><a href="mailto:${SITE.email}"><b>${esc(SITE.email)}</b></a></span>
          </div>
        </div>
        <div class="portrait"><img src="assets/img/about/portrait.jpg" alt="${esc(SITE.name)}"></div>
      </div>
    </div></section>

    <section class="entries"><div class="wrap"><div class="entries__grid">${entries}</div></div></section>

    <section class="sec"><div class="wrap">
      <div class="sec__head">
        <div><div class="en-label">HOW TO READ</div><h2>两个方向，同一套工作方法</h2></div>
      </div>
      <div class="pd__body" style="margin-top:0">
        <div>
          <h4>AI 产品方向</h4>
          <p style="color:var(--ink-2);font-size:14.5px">从真实硬件与语音闭环开始，把 AI 能力做成能跑的原型与能重复的工具：先验证，再设计，最后把过程留成可复用的记录。</p>
        </div>
        <div>
          <h4>工业设计方向</h4>
          <p style="color:var(--ink-2);font-size:14.5px">真实商业项目（既有平台改款、匿名化商业协作）与个人项目并行：判断边界 → 造型推进 → 建模与渲染 → 整套视觉交付，过程文件可追溯。</p>
        </div>
      </div>
      <p class="note">每张卡片都可以点开看过程与边界说明；页面底部的「作品集下载」是完整 PDF 版本。</p>
    </div></section>`;
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
            <span class="entry__go">查看 →</span>
          </div>
        </div>
      </a>`).join('');

    return `
    <section class="sec" style="padding-top:52px"><div class="wrap">
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
    const body = (p.body || []).map(b => `
      <div><h4>${esc(b.h)}</h4><ul>${b.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('');
    const shots = p.images.map((src, k) => `<div class="shot${k === 0 ? ' shot--wide' : ''}"><img src="${src}" alt="${esc(p.title)} ${k + 1}" loading="lazy"></div>`).join('');
    const links = (p.links || []).map(l => `<a class="btn" href="${l.u}"${/^https?:/.test(l.u) ? ' target="_blank" rel="noopener"' : ''}>${esc(l.t)} →</a>`).join('');

    return `
    <section class="pd"><div class="wrap">
      <a class="backlink" href="#${d.id}">← ${esc(d.label)}</a>
      <div class="pd__head" style="margin-top:18px">
        <div class="en-label">${esc(p.en)}</div>
        <h1>${esc(p.title)}</h1>
        <p class="pd__lead">${esc(p.summary)}</p>
        <div class="tags" style="margin-top:16px">${tags(p.tags)}</div>
        <div class="pd__facts">${facts}</div>
      </div>
      <div class="pd__body">${body}</div>
      ${links ? `<div class="pd__links">${links}</div>` : ''}
      <div class="gallery">${shots}</div>
      <p class="note">以上图片为完整作品集 PDF 的对应页面，点开可放大。完整版含全部过程页：<a href="${d.pdf}" download style="border-bottom:1px solid currentColor">下载 ${esc(d.label)}作品集 PDF</a></p>
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
    <section class="sec" style="padding-top:52px"><div class="wrap">
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
          <p class="note">联系方式：<a href="mailto:${SITE.email}" style="border-bottom:1px solid currentColor">${esc(SITE.email)}</a> · 意向城市 ${esc(SITE.city)}</p>
        </div>
      </div>
    </div></section>`;
  }

  function viewDownload() {
    const cards = DOWNLOADS.map(f => `
      <a href="${f.f}" download><b>${esc(f.t)}</b><span>${esc(f.d)} · ${esc(f.s)}</span><span class="entry__go">下载 PDF →</span></a>`).join('');
    return `
    <section class="sec" style="padding-top:52px"><div class="wrap">
      <a class="backlink" href="#/">← 返回首页</a>
      <div class="sec__head" style="margin-top:20px">
        <div><div class="en-label">DOWNLOAD</div><h2>作品集与简历</h2>
        <p>完整 PDF 版本（页数较多，适合面试前了解全貌）。如需更小体积或指定方向的版本，邮件联系即可。</p></div>
      </div>
      <div class="dl">${cards}</div>
      <p class="note">PDF 由本人作品集源文件导出，内容与页面一致；商业项目均按公开边界匿名化处理。</p>
    </div></section>`;
  }

  function notFound() {
    return `<section class="sec"><div class="wrap"><div class="sec__head"><div><div class="en-label">404</div>
      <h2>页面不存在</h2><p>可能是链接写错了。回到首页重新选择方向。</p></div></div>
      <a class="btn" href="#/">回首页</a></div></section>`;
  }

  /* ---------- router ---------- */

  function render() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [a, b] = raw.split('/');
    let html, title = '付昕 · 工业设计 × AI 产品 / FU XIN Portfolio';

    if (!a) { html = viewHome(); }
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
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    revealNow();
  }

  function revealNow() {
    const els = app.querySelectorAll('.rv');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents, o) => {
      ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(e => io.observe(e));
    /* 兜底：无论观察器是否触发，1.2s 后全部显示，避免任何情况下内容不可见 */
    setTimeout(() => els.forEach(e => e.classList.add('in')), 1200);
  }

  /* ---------- lightbox ---------- */

  let shots = [], idx = 0;
  const lb = document.getElementById('lightbox'), lbImg = document.getElementById('lb-img');
  function openLb(list, k) {
    shots = list; idx = k;
    lbImg.src = shots[idx];
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
  function stepLb(n) { idx = (idx + n + shots.length) % shots.length; lbImg.src = shots[idx]; }

  app.addEventListener('click', e => {
    const shot = e.target.closest('.shot');
    if (!shot) return;
    const list = [...app.querySelectorAll('.shot img')].map(i => i.getAttribute('src'));
    openLb(list, Math.max(0, [...app.querySelectorAll('.shot')].indexOf(shot)));
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

  window.addEventListener('hashchange', render);
  render();
})();
