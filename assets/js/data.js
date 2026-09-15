/* 站点内容数据 —— 全部取自本人作品集（2026-09-13 终审版）与 career/master-profile.md，未新增未经验证的事实 */
const SITE = {
  /* 低分辨率图片清单（渲染时按原尺寸显示，避免拉伸变糊） */
  smallImgs: ["assets/img/case/id/doggie-ref-1.jpg", "assets/img/case/id/doggie-ref-1.webp", "assets/img/case/id/doggie-ref-2.jpg", "assets/img/case/id/doggie-ref-2.webp", "assets/img/case/id/doggie-ref-3.jpg", "assets/img/case/id/doggie-ref-3.webp", "assets/img/case/id/doggie-ref-4.jpg", "assets/img/case/id/doggie-ref-4.webp"],

  name: '付昕', en: 'FU XIN',
  role: '产品设计 · 工业设计 · AI 产品',
  sub: 'Industrial Design × AI Product · 2027 届',
  school: '华南师范大学 · 产品设计 2023–2027',
  city: '深圳 / 广州',
  email: '3188201179@qq.com',
  wechat: 'zmdjan',
  siteUrl: 'https://fux5063-eng.github.io/fuxin-portfolio/',
  qrSite: 'assets/img/qr/site-512.png',
  qrSiteHi: 'assets/img/qr/site-1024.png',
  wechatQr: '',            /* 如需展示微信二维码，把图片放到 assets/img/qr/wechat.png 并在这里填路径 */
  heroKicker: 'PORTFOLIO 2026 · 2027 届校招',
  heroRole: '工业设计 × AI 产品 · 从概念到原型落地',
  heroTitle1: '把设计判断，',
  heroTitle2: '变成<span class="mk">可重复的流程</span>',
  heroLead: '工业设计与 AI 产品并行，从概念一路做到能跑的原型。'
};

const MARQUEE = ['AI 产品', '工业设计', '机器人产品', 'DesignDNA', 'Rhino 建模', 'KeyShot 渲染',
  '语音闭环', '商业改款', '工作流工具', 'CMF', '结构整合', '视觉交付'];


const DOWNLOADS = [
  { t: 'AI 产品方向作品集', d: '50 页 · 机器人产品 / DesignDNA / 个人 AI 工具 / 实体产品', f: 'download/付昕-AI产品方向作品集.pdf', s: '4.5 MB' },
  { t: '工业设计方向作品集', d: '52 页 · 航标灯 / 牵引绳 / Lumora / 商业产品设计', f: 'download/付昕-工业设计作品集.pdf', s: '7.2 MB' },
  { t: '产品设计 / 工业设计 简历', d: 'PDF · 1 页', f: 'download/付昕-产品设计工业设计-简历.pdf', s: '0.47 MB' },
  { t: 'AI 智能硬件与机器人产品 简历', d: 'PDF · 1 页', f: 'download/付昕-AI智能硬件与机器人产品-简历.pdf', s: '0.46 MB' },
  { t: 'AI 智能硬件与产品设计 综合简历', d: 'PDF · 2 页', f: 'download/付昕-AI智能硬件与产品设计-简历.pdf', s: '0.55 MB' }
];

const ABOUT = {
  intro: '华南师范大学产品设计专业 2027 届，意向城市深圳、广州。作品集中在两条线：工业设计与商业产品改款（航标灯、落水报警终端、智能锁系列），以及 AI 与实体交互（桌面陪伴机器人、DesignDNA、个人 AI 工具组）。习惯把事情拆成可验证的步骤，再把过程留成可以复用的记录。',
  timeline: [
    { time: '2026.07–11', org: '优必选 UBTECH · 机器人产品组｜产品实习生', desc: '体验研发新版本、发现体验问题、提出改进意见并反馈研发。' },
    { time: '2026.03–09', org: '深圳壹点工业设计 · 商业产品设计协作', desc: '商业产品造型推进、Rhino 建模、KeyShot 渲染与方案提案协作。' },
    { time: '2025 暑假', org: '云尚教育 · 工业设计软件班助教', desc: '协助约 30 名学生完成 Rhino 与 KeyShot 学习。' },
    { time: '2024', org: '鸿元金属 · CNC 数控操机师', desc: '数控编程与加工实操，理解从模型到实物的加工约束。' }
  ],
  skills: [
    { k: '3D', v: 'Rhino 曲面建模、C4D' },
    { k: '渲染', v: 'KeyShot 视觉表达' },
    { k: '平面', v: 'Photoshop、Illustrator' },
    { k: '视频', v: 'Premiere' },
    { k: 'AI', v: 'AI 辅助设计与工作流（Codex、ChatGPT 等）' },
    { k: '制造', v: 'CNC 加工实操、3D 打印与手板协作、STEP / 工程图输出' }
  ]
};

const DIRECTIONS = [
  {
    id: 'ai', label: 'AI 产品方向', en: 'AI PRODUCT DIRECTION',
    title: '机器人产品 · AI 产品原型 · 智能硬件',
    lead: '从真实硬件与语音闭环出发，把 AI 能力沉淀成可重复的设计工具与工作流。',
    cover: 'assets/img/ai/toolset-p33.webp',
    keywords: ['机器人产品', 'AI 设计工具', '智能硬件与后台'],
    pdf: 'download/付昕-AI产品方向作品集.pdf',
    projects: [
      {
        slug: 'robot', title: '桌面陪伴型机器人', en: 'DESKTOP COMPANION ROBOT',
        badge: '毕业设计 · 进行中',
        tags: ['硬件与嵌入式', '语音与交互', '系统架构'],
        summary: '先用真实硬件跑通「唤醒—理解—回复—复位」的语音闭环与八类双眼状态，再进入外壳、结构与整机体验设计。',
        facts: [['角色', '产品定义 · 交互拆解 · 原型验证'], ['状态', '毕业设计进行中'], ['证据', 'ESP32-S3-CAM · 语音闭环 · 私人后台']],
        hero: { f: 'assets/img/cover/robot.webp', cap: '桌面陪伴型机器人' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '先把"能不能真的跑起来"验证掉，再谈外壳与整机——所以这个毕业设计从真实硬件和语音闭环起步。',
            items: [
              '真实硬件：ESP32-S3-CAM + 2.0 英寸竖屏 + 外接扬声器，唤醒、收音、识别、回答与播放全部跑通。',
              '一次对话：唤醒（WakeNet）→ 理解（ASR 转写）→ 回复（生成答案 + TTS）→ 复位回到待机，可再次唤醒。'
            ],
            figures: [ { f: 'assets/img/ai/robot-p06.webp', cap: '' }, { f: 'assets/img/ai/robot-p08.webp', cap: '' } ]
          },
          {
            h: '怎么做', en: 'HOW',
            lead: '把一次语音交互拆成可观察、可定位、可恢复的链路，再用双眼状态承担情感表达。',
            items: [
              '双眼状态反馈：以明暗、角度与形态变化传达平静、开心、关心、困惑、惊讶、困倦、难过、严肃八类状态。',
              '从设备到服务的产品架构：把一次语音交互拆成可观察、可定位、可恢复的链路。',
              '私人后台：运行总览、对话中心、诊断与日志，以及个性与记忆、能力与服务、系统设置等配置模块。'
            ],
            figures: [ { f: 'assets/img/ai/robot-p09.webp', cap: '' }, { f: 'assets/img/ai/robot-p13.webp', cap: '' } ]
          },
          {
            h: '做出什么', en: 'WHAT',
            lead: '当前交付是可运行的闭环原型与配套后台，验证口径统一为可复现的指标。',
            items: [
              '验证计划：统一记录口径，持续验证唤醒成功率、端到端耗时、复位与异常恢复。'
            ],
            figures: [ { f: 'assets/img/ai/robot-p15.webp', cap: '' } ]
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '毕业设计进行中，当前证据是"跑通的语音闭环 + 私人后台"，不是量产产品。',
              '八类双眼状态属于设计表达，尚未开展用户可用性测试。'
            ]
          }
        ],
        images: ['assets/img/ai/robot-p06.webp', 'assets/img/ai/robot-p08.webp', 'assets/img/ai/robot-p09.webp', 'assets/img/ai/robot-p13.webp', 'assets/img/ai/robot-p15.webp']
      },
      {
        slug: 'designdna', title: 'DesignDNA · AI 设计工作台', en: 'DESIGNDNA · AI DESIGN WORKBENCH',
        badge: '真实改款任务验证',
        tags: ['AI 工具设计', '约束与评审', '造型与形态'],
        summary: '面向工业设计改款任务的 AI 协同工作台：先用产品 DNA 与约束地图控制探索范围，再通过逐条评审支持人工决策。',
        facts: [['角色', '产品定义 · 流程与交互设计'], ['验证案例', 'Fusion Audio 高端户外便携音响改款'], ['机制', '四步流程 · 全程可回溯']],
        hero: { f: 'assets/img/cover/designdna-ui.webp', cap: 'DesignDNA 工作台：项目简报 · 变体树 · 约束评审' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '改款任务最容易失控的不是"画不出来"，而是没有边界——所以先做约束，再做发散。',
            items: [
              '约束地图把改款边界分成三层：保留（双扬声器开孔、顶部控制、承重提手）、可控（箱体比例、侧向护梁、表面层级）、自由（色彩、材料、表面处理）。',
              '把跨品类参考转成可执行的设计语言：从运动鞋提取防护分层，从智能手表提取精密边界。'
            ],
            figures: [ { f: 'assets/img/ai/designdna-p18.webp', cap: '', wide: true }, { f: 'assets/img/ai/designdna-p19.webp', cap: '', wide: true } ]
          },
          {
            h: '怎么做', en: 'HOW',
            lead: '四步流程：任务简报 → 约束地图 → 变体树 → 评审记录，每一步都有输入、产出与可回溯的记录。',
            items: [
              '九个造型方向共享同一组硬约束，先拉开轮廓差异再判断。',
              '评审记录逐条落盘，支持人工决策，而不是让模型直接给结论。'
            ],
            figures: [ { f: 'assets/img/ai/designdna-p20.webp', cap: '', wide: true }, { f: 'assets/img/ai/designdna-p22.webp', cap: '', wide: true } ]
          },
          {
            h: '做出什么', en: 'WHAT',
            lead: '发散到最后收敛成两个可延展的方向，并建立系列化的 CMF 识别。',
            items: [
              'CMF 建立系列识别：矿物色、沙岩色、石墨色与户外包胶关系。',
              '按识别度、握持可行性、分件合理性与系列延展，收敛为石墨灰与矿物橙两个方向。'
            ],
            figures: [ { f: 'assets/img/ai/designdna-p25.webp', cap: '' } ]
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '验证案例为作品集内的示例任务（Fusion Audio 高端户外便携音响改款），用于说明工作台流程。',
              '工作台为自研原型，尚未做多人协作、权限与生产级部署。'
            ]
          }
        ],
        images: ['assets/img/ai/designdna-p18.webp', 'assets/img/ai/designdna-p19.webp', 'assets/img/ai/designdna-p20.webp', 'assets/img/ai/designdna-p22.webp', 'assets/img/ai/designdna-p25.webp'],
        links: [{ t: 'DesignDNA 界面走查（在线演示）', u: 'demo/designdna/' }]
      },
      {
        slug: 'toolset', title: '个人 AI 工具组', en: 'PERSONAL AI TOOLSET',
        badge: '4 个工具 · 自用中',
        tags: ['AI 工具设计', '可回滚设计', '隐私边界'],
        summary: '围绕素材采集、技能管理、资源观察与运行环境切换，为自己的设计工作流搭的四件工具。',
        facts: [['角色', '需求定义 · 交互设计 · 实现与迭代'], ['形态', '桌面常驻工具 + 浏览器扩展'], ['原则', '高风险动作可回滚、凭据不外传']],
        hero: { f: 'assets/img/cover/toolset.webp', cap: '个人 AI 工具组界面' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '围绕素材采集、技能管理、资源观察与运行环境切换这四件反复发生的事，把动作固化成工具，而不是每次重来。',
            items: [
              '四条原则：展示层与治理层分开、高风险动作可回滚、本机快照优先、凭据不外传。'
            ],
            figures: [ { f: 'assets/img/ai/toolset-p33.webp', cap: '' } ]
          },
          {
            h: '四个工具', en: 'FOUR TOOLS',
            lead: '点下面的标签，逐个看这四件工具分别解决什么问题。',
            items: [],
            tabs: [
              { t: 'AIGC Skill Hub', o: '把 34 项 Skill 收进一个注册表：总入口负责找，管理页负责改，跨端同步只补齐缺失项、不静默覆盖同名。', f: 'assets/img/ai/toolset-p27.webp', d: '当前注册表收录 34 项 Skill，统一处理发现、分类、调用与跨端同步；总入口负责找，管理页负责改；同步原则是补齐缺失项，不静默覆盖同名 Skill。' },
              { t: 'Codex Camera', o: '现实画面一次操作进入输入流：唤起、镜像预览、拍照保存、复制到剪贴板合成一个动作。', f: 'assets/img/ai/toolset-p29.webp', d: '把唤起、镜像预览、拍照保存与复制剪贴板压缩为一次操作，让现实画面直接进入输入流。' },
              { t: '模式切换器', o: '切换成为一次可回滚事务：先识别当前线路再选目标；高风险动作前弹窗交代影响范围与同步范围。', f: 'assets/img/ai/toolset-p32.webp', d: '把不同线路放进同一决策界面；切换做成一次可回滚事务，先识别当前线路再选择目标方案，高风险动作前弹窗交代影响范围与同步范围。' },
              { t: 'Codex Meter', o: '桌面常驻胶囊随时显示各账户可用状态与近期用量，点开即看明细，设置页拆开常驻行为与视觉参数。', f: 'assets/img/ai/toolset-p37.webp', d: '桌面常驻胶囊显示各账户当前可用状态与近期用量，点击展开明细；设置页把常驻行为、同步来源与视觉参数拆开。' }
            ]
          },
          {
            syncTo: 'tabs', h: '做出什么', en: 'WHAT',
            lead: '四件工具都已在本机长期使用，形态是桌面常驻工具 + 浏览器扩展。',
            items: [
              '所有工具都遵循"可回滚 + 凭据不外传"，异常时先给影响范围再动作。'
            ],
            figures: [ { f: 'assets/img/ai/toolset-p33.webp', cap: '' } ]
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '工具均为个人自用原型，未做公开分发、多用户支持与商业级测试。',
              '涉及账号与网络的部分只在本机处理，不采集、不外传凭据。'
            ]
          }
        ],
        images: ['assets/img/ai/toolset-p27.webp', 'assets/img/ai/toolset-p29.webp', 'assets/img/ai/toolset-p32.webp', 'assets/img/ai/toolset-p33.webp', 'assets/img/ai/toolset-p37.webp']
      },
      {
        slug: 'proto', title: '快速原型实验（可在线玩）', en: 'QUICK PROTOTYPES',
        badge: '在线可玩',
        tags: ['交互原型', '规则拆解', '调试记录'],
        summary: '一组 HTML / Canvas 快速原型：俄罗斯方块、切西瓜、打方块。用来练习规则拆解、状态管理与问题定位。',
        facts: [['形式', '网页原型 · 点开即玩'], ['能力指向', '快速原型 / 规则拆解 / 测试意识'], ['边界', '玩法类型并非原创，属于借助 AI 的交互实验']],
        hero: { f: 'assets/img/cover/proto.webp', cap: '可在线玩的原型实验（俄罗斯方块原型截图）' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '用一组小原型练习规则拆解、状态管理与问题定位——重点不是玩法创意，而是"能不能快速做出来、并且能被验证"。',
            items: [
              '这组练习保留故障定位与规则调整的记录，用来证明借助 AI 做快速交互实验和调试的过程。'
            ],
            figures: []
          },
          {
            h: '做了什么', en: 'WHAT',
            lead: '三个原型都能直接在线玩；下面用标签逐个切换。',
            items: [],
            tabs: [
              { t: '俄罗斯方块', f: 'assets/img/ai/proto-tetris.webp', d: 'Canvas 渲染、7-bag 随机、消行 / 等级 / 计分、落点影子、移动端控制、声音与本地最高分，并根据实际操作反馈修改硬降与提示。' },
              { t: '切西瓜', f: 'assets/img/ai/proto-fruit.webp', d: '同批原型之一，用于练习物理近似、切割判定与状态管理。' },
              { t: '打方块', f: 'assets/img/ai/proto-breakout.webp', d: '同批原型之一，用于练习碰撞检测、关卡参数与节奏控制。' }
            ]
          },
          {
            h: '怎么做', en: 'HOW',
            lead: '每个原型都按"先跑通核心循环，再加表现与边界处理"的顺序推进，把踩到的坑留成记录。',
            items: [
              '规则拆解：先定义状态与转换，再写渲染循环。',
              '问题定位：把异常现象、复现步骤与修改结果分条记录。'
            ],
            figures: []
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '玩法类型并非原创，属于借助 AI 的交互实验，不作为原创玩法作品。',
              '代码以练习与验证为目的，未做性能与多端兼容的工程化处理。'
            ]
          }
        ],
        images: ['assets/img/ai/proto-tetris.webp', 'assets/img/ai/proto-fruit.webp', 'assets/img/ai/proto-breakout.webp'],
        links: [
          { t: '玩俄罗斯方块', u: 'demo/games/tetris/index.html' },
          { t: '玩切西瓜', u: 'demo/games/fruit/index.html' },
          { t: '玩打方块', u: 'demo/games/breakout/index.html' }
        ]
      },
      {
        slug: 'internship', title: '硬件联网适配（实习）', en: 'INTERNSHIP · HARDWARE',
        badge: '2026 实习',
        tags: ['硬件与嵌入式', '异常定位', '跨学科协作'],
        summary: '实习中完成的连接确认、参数适配、异常定位与复现记录。真实硬件经历让我在定义 AI 功能时，同时考虑设备、网络与异常恢复。',
        facts: [['角色', '产品组实习生'], ['内容', '连接确认 · 参数适配 · 异常定位 · 复现记录'], ['意义', '硬件 + 网络的真实约束']],
        hero: { f: 'assets/img/cover/internship.webp', cap: '硬件联网适配实习记录' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '在真实硬件环境里做联网适配，让我在定义 AI 功能时同时考虑设备、网络与异常恢复，而不是只画界面。',
            items: [
              '角色是产品组实习生，内容集中在连接确认、参数适配、异常定位与复现记录。'
            ],
            figures: []
          },
          {
            h: '实际做的事', en: 'WHAT',
            lead: '把模块与主控的连接逐一确认，按环境适配参数，遇到不稳定时回到日志和复现步骤定位问题。',
            items: [
              '把每一次异常都留成可复现的记录，避免同类问题重复排查。',
              '记录口径统一：现象、环境、复现步骤、修改与验证结果。'
            ],
            figures: [ { f: 'assets/img/ai/internship-p39.webp', cap: '' } ]
          },
          {
            h: '这件事的意义', en: 'SO WHAT',
            lead: '硬件与网络的真实约束，反过来影响了我做产品定义时的判断：先确认链路，再谈功能。',
            items: [
              '在设备侧留可观察的状态与日志，异常时能定位而不是猜。',
              '复现优先：先能稳定复现，再动手改。'
            ],
            figures: []
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '实习内容为硬件联网适配，不含产品定义与外观设计。',
              '文中不涉及公司名称、客户信息与具体参数细节，按公开边界匿名化处理。'
            ]
          }
        ],
        images: ['assets/img/ai/internship-p39.webp']
      },
      {
        slug: 'doggie', link: '#/id/doggie', title: 'DOGGIE 多功能宠物牵引绳', en: 'DOGGIE PET LEASH',
        badge: '实体产品 · AI 辅助流程',
        tags: ['产品定义', 'Rhino 建模', 'CMF'],
        summary: '把牵引、互动玩具携带与简单清洁集中到一个随身产品，从使用任务到产品架构与曲面建模。',
        facts: [['角色', '产品定义 · 建模 · 渲染（独立完成）'], ['品类', '便携宠物用品'], ['完整案例', '见工业设计方向']],
        hero: { f: 'assets/img/case/id/doggie-hero-16x10.webp', cap: 'DOGGIE 多功能宠物牵引绳' },
        sections: [
          {
            h: '完整案例', en: 'FULL CASE',
            lead: '这个项目在工业设计方向里有完整过程记录：从使用任务拆解、结构排布到 Rhino 建模与 KeyShot 交付。',
            items: [
              '产品与设计过程见工业设计方向 · DOGGIE 多功能宠物牵引绳。',
              '在 AI 方向里它是「AI 辅助流程」的实体产品落点：需求整理、方案对比与交付物节点由 AI 工具辅助推进。'
            ],
            figures: []
          }
        ]
      },
      {
        slug: 'lumora', link: '#/id/lumora', title: 'Lumora 光健康伴护仪', en: 'LUMORA CARE DEVICE',
        badge: '实体产品 · AI 辅助流程',
        tags: ['造型与形态', 'CMF', '结构配合'],
        summary: '以光健康为切入的伴护设备，完成外观造型、材质与结构配合的整体推进。',
        facts: [['角色', '造型 · CMF · 结构配合（独立完成）'], ['品类', '居家康养照明'], ['完整案例', '见工业设计方向']],
        hero: { f: 'assets/img/cover/lumora.webp', cap: 'Lumora 光健康伴护仪' },
        sections: [
          {
            h: '完整案例', en: 'FULL CASE',
            lead: '这个项目在工业设计方向里有完整过程记录：形态推演、CMF 与结构配合。',
            items: [
              '产品与设计过程见工业设计方向 · Lumora 光健康伴护仪。',
              '在 AI 方向里它同样属于「AI 辅助流程」的实体产品落点。'
            ],
            figures: []
          }
        ]
      }
    ]
  },
  {
    id: 'id', label: '工业设计方向', en: 'INDUSTRIAL DESIGN DIRECTION',
    title: '产品定义 · 造型设计 · 建模与视觉交付',
    lead: '真实商业项目中的造型推进、方案迭代与整套视觉交付，加上个人项目的完整设计叙事。',
    cover: 'assets/img/id/navlight-p04.webp',
    keywords: ['真实商业改款', '造型与建模', 'Rhino + KeyShot 交付'],
    pdf: 'download/付昕-工业设计作品集.pdf',
    projects: [
      {
        slug: 'navlight', title: '航标灯 Navigation Lights', en: 'NAVIGATION LIGHTS',
        badge: '既有平台改款',
        tags: ['造型与形态', 'Rhino 建模', 'KeyShot 交付'],
        summary: '在既有海上导航设备平台上完成外观协作改款，强化海事设备识别，并建立可延展的系列设计语言。',
        facts: [['角色', '造型推进 · Rhino 建模 · KeyShot 视觉表达'], ['约束', '沿用既有结构、光学组件与安装维护边界'], ['目标', '外观升级 + 系列设计语言']],
        hero: { f: 'assets/img/cover/navlight.webp', cap: '改款后的外观与项目背景（商业信息已匿名化）' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '这是一次在既有平台上的外观协作改款：结构、光学组件与安装维护边界都不能动，要在这些前提下强化海事设备的识别性。',
            items: [
              '竞品观察：SL-155 强调一体化灯罩与稳定底座；Apollo-155 用分层灯体与深色散热段强化设备属性；NOVA-65 HI 以紧凑体量与高识别色适配小型化场景。',
              '设计机会：保留光学、安装与维护边界，通过轮廓比例、散热格栅与灯带层次做外观升级。'
            ],
            figures: [
              { f: 'assets/img/id/navlight-p05.webp', cap: '竞品与参考观察' }
            ]
          },
          {
            h: '怎么做', en: 'HOW',
            lead: '从轮廓比例入手，逐轮比较体量与视觉重心，再把分割、格栅与提手收进同一套设计语言。',
            items: [
              '比较锥形、柱形与外扩底座，控制视觉重心和稳定感。',
              '反复调整上盖、灯带与主体比例，保证远距离轮廓识别。',
              '把 V 形分割、纵向格栅与提手连接统一到同一设计语言，并同步考虑散热、安装孔位与维护操作。'
            ],
            figures: [
              { f: 'assets/img/id/navlight-p06.webp', cap: '造型推敲与形体比较', wide: true },
              { f: 'assets/img/id/navlight-p09.webp', cap: '结构拆解与尺寸关系（沿用既有平台边界）', wide: true }
            ]
          },
          {
            h: '做出什么', en: 'WHAT',
            compare: { before: { f: 'assets/img/id/navlight-p06.webp', label: '形体推敲' }, after: { f: 'assets/img/id/navlight-p04.webp', label: '改款外观' }, cap: '从形体推敲到最终外观的同项目对照。' },
            lead: '交付覆盖外观造型推进、Rhino 建模与 KeyShot 视觉表达，用于方案评审与后续量产落地的前置沟通。',
            items: [
              '外观方案：在既有平台边界内完成造型升级，并留出系列延展的空间。',
              '技术表达：同步给出安装、维护与散热等约束在造型上的处理方式。'
            ]
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '本项目为在既有海上导航设备平台上的外观协作改款，光学组件、内部结构与安装接口沿用原有方案。',
              '图片取自作品集，客户名称与未公开信息已按匿名化规则处理。'
            ]
          }
        ],
        images: []
      },
      {
        slug: 'doggie', title: 'DOGGIE 多功能宠物牵引绳', en: 'DOGGIE · MULTI-FUNCTION LEASH',
        badge: '个人项目',
        tags: ['产品定义', 'Rhino 建模', '品牌与包装'],
        summary: '把牵引、互动玩具携带与简单清洁集成到一个随身产品，减少外出携带负担。',
        facts: [['角色', '调研整理 · 产品定义 · 造型 · 建模 · 渲染 · 品牌包装'], ['功能', '牵引 / 握持 / 可拆卸清洁刷 / 玩具球仓 / 垃圾袋收纳'], ['过程', '连续 Rhino 阶段文件可追溯']],
        hero: { f: 'assets/img/case/id/doggie-hero-16x10.webp', cap: '成品配色阵列：主色 + 多套 CMF 方案' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '日常遛狗是高频场景，而市场上的牵引绳功能趋同——机会点不在再多加一个功能，而在把「带玩具、清理脚底、随手带垃圾袋」这些零散动作收进同一个随身产品。',
            items: [
              '主握持区保持简洁；透明玩具球仓、可拆卸清洁刷与袋卷收纳分布在把手周围。',
              '把手内部垃圾袋收纳属于最终功能；清洁刷用于清理宠物脚底的灰尘与污物。'
            ],
            quote: ['设计机会', '把互动与随手清洁变成结构上顺手就能完成的动作，而不是额外多带一件东西。'],
            figures: [
              { f: 'assets/img/case/id/doggie-ref-1.webp', cap: '使用场景：遛狗与互动' },
              { f: 'assets/img/case/id/doggie-ref-2.webp', cap: '现有产品形态参考' },
              { f: 'assets/img/case/id/doggie-ref-3.webp', cap: '手持方式与材质' },
              { f: 'assets/img/case/id/doggie-ref-4.webp', cap: '功能细节参考' }
            ]
          },
          {
            h: '怎么做', en: 'HOW',
            lead: '从使用任务出发，经过草图发散、造型确认、分件与结构，再到 CMF；Rhino 与 KeyShot 全程留档，形成可追溯的过程记录。',
            items: [
              'Rhino 阶段文件覆盖造型发散、造型初步确认、分件、结构与最终造型外观。',
              'KeyShot 覆盖主页图、三视图、爆炸图、功能特写与配色展示。'
            ],
            figures: [
              { f: 'assets/img/case/id/doggie-sketch.webp', cap: '草图发散与形态推演', wide: true },
              { f: 'assets/img/case/id/doggie-story.webp', cap: '故事板：把使用流程拆成连续动作' },
              { f: 'assets/img/case/id/doggie-threeview.webp', cap: '三视图与尺寸关系' },
              { f: 'assets/img/case/id/doggie-explode.webp', cap: '爆炸示意：表达部件关系，不等同于工程结构设计' }
            ]
          },
          {
            h: '做出什么', en: 'WHAT',
            compare: { before: { f: 'assets/img/case/id/doggie-sketch.webp', label: '草图探索' }, after: { f: 'assets/img/case/id/doggie-hero-16x10.webp', label: '成品配色' }, cap: '左边是草图发散页，右边是成品配色阵列——同一个造型从推演到收敛。' },
            lead: '交付包含产品外观、多套配色、局部细节、三视图、爆炸示意与包装设计。同一个模型也放在这一节里，可以自己转着看。',
            items: [
              '外观与配色：主色方案 + 多套 CMF，用于不同使用人群与场景。',
              '细节件：防滑握持、可拆卸清洁刷、高抗拉织带、后部功能件。',
              '包装与场景：盒体与手持包装展示，配合真实使用场景图。'
            ],
            figures: [
              { f: 'assets/img/case/id/doggie-pack.webp', cap: '包装设计：盒体与手持展示', wide: true },
              { f: 'assets/img/case/id/doggie-scene.webp', cap: '使用场景' }
            ],
            tabs: [
              { t: '防滑握持', f: 'assets/img/case/id/doggie-d1.webp', d: '主握持区保持简洁，握感与防滑靠表面处理解决，不额外增加零件。' },
              { t: '可拆卸清洁刷', f: 'assets/img/case/id/doggie-d2.webp', d: '清洁刷用于清理宠物脚底的灰尘与污物，可拆下单独清洗。' },
              { t: '高抗拉织带', f: 'assets/img/case/id/doggie-d3.webp', d: '织带与主体的连接按受力方向布置，避免应力集中在单一位置。' },
              { t: '后部功能件', f: 'assets/img/case/id/doggie-d4.webp', d: '把手内部的垃圾袋收纳属于最终功能，后部功能件承担开合与固定。' }
            ]
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '作品集中的用户画像、用户旅程与情绪曲线来自桌面资料研究整理，不作为本人开展真实用户访谈的证据。',
              '未制作实体模型；做过纸质握持测试，用于展示早期尺度与握持关系，不作为结构、受力或耐久测试。',
              '爆炸示意表达部件关系，不等同于完成工程结构设计或受力验证。'
            ]
          }
        ],
        images: []
      },
      {
        slug: 'lumora', title: 'Lumora 光健康伴护仪', en: 'LUMORA · LIGHT HEALTH COMPANION',
        badge: '课程项目 · 4 周',
        tags: ['灯具设计', '功能整合', '结构设计'],
        summary: '一盏可收纳的居家照明设备：通过折叠灯臂、物理控制与柜体收纳适配居家多场景。',
        facts: [['角色', '产品定义 · 功能整合 · 造型 · Rhino 建模 · 视觉表达'], ['周期', '灯具设计课程约 4 周'], ['重点', '展开 / 收纳状态的空间占用']],
        hero: { f: 'assets/img/cover/lumora.webp', cap: '居家阅读场景：灯臂展开状态与暖光表达' },
        /* model2 已撤：静态方案下用「形态推演」图表达 A/B 方案对比，不再单独放第二个模型块 */
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '居家照明的问题不在「不够亮」，而在「不好收、不好调」：灯臂占地方、控制方式随手、收纳状态没有位置。这一版把调节、开启、收纳和移动重新组织成一套低认知负担的操作顺序。',
            items: [
              '操作：保留旋钮与按键，减少进入照明前的步骤。',
              '体量：灯臂收入柜体侧面，降低非使用状态的空间占用。'
            ],
            figures: [
              { f: 'assets/img/case/id/lumora-p2.webp', cap: '用户分析与使用场景梳理', wide: true }
            ]
          },
          {
            h: '怎么做', en: 'HOW',
            lead: '先用草图把多关节灯臂的运动关系摊开，再在建模阶段逐轮校验展开态与收纳态的尺寸基准。',
            items: [
              '在建模阶段持续检查灯臂转动、灯头覆盖、柜体容积与使用高度。',
              'Rhino 尺寸视图统一展开态、收纳态与移动状态的尺寸基准；细节围绕操作可达性与收纳状态展开。'
            ],
            figures: [
              { f: 'assets/img/case/id/lumora-p3.webp', cap: '草图发散：灯臂、关节与灯头的形态推演', wide: true },
              { f: 'assets/img/case/id/lumora-p4.webp', cap: '功能与结构：灯臂运动、收纳关系与操作件', wide: true }
            ]
          },
          {
            h: '做出什么', en: 'WHAT',
            compare: { before: { f: 'assets/img/case/id/lumora-p3.webp', label: '草图发散' }, after: { f: 'assets/img/case/id/lumora-hero.webp', label: '居家场景成品' }, cap: '从草图发散到居家场景里的成品状态。' },
            lead: '课程结束时交付两个造型方案：造型方向不同，但共用同一套功能与收纳逻辑。下面两个模型保留原始比例，可以直接转动对比。',
            items: [
              '方案 A：以折叠灯臂与柜体收纳为主，展开态作为主要使用姿态。',
              '方案 B：同课程另一造型方向，用于对比体量、轮廓与灯头关系的取舍。'
            ]
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '本项目为灯具设计课程作业（约 4 周），造型与建模由本人完成，未进行量产结构与安规验证。',
              '模型为本人建模文件导出，展示外形与分件关系，不等同于工程结构设计。'
            ]
          }
        ],
        images: []
      },
      {
        slug: 'wateralarm', title: '落水报警终端', en: 'WATER ALARM TERMINAL',
        badge: '商业协作 · 已匿名化',
        tags: ['造型与形态', '模型迭代', '视觉与版式'],
        summary: '围绕穿戴、识别与海上使用场景，完成多方向造型探索、模型迭代与视觉提案。',
        facts: [['角色', '多方向造型探索与对比 · 模型迭代 · 提案'], ['形式', '匿名化商业项目（客户信息与未公开内容已移除）'], ['阶段', '三组形态方向均为阶段性探索']],
        hero: { f: 'assets/img/cover/wateralarm.webp', cap: '穿戴与落水识别场景表达（已匿名化）' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '终端要同时满足两个矛盾的要求：贴身佩戴时不能碍事，落水后又要第一时间被识别。造型探索因此围绕「穿戴舒适」与「远距离识别」这两端来回权衡。',
            items: [
              '使用场景：海上作业与近水环境下的穿戴、误触与紧急识别。',
              '设计约束：体量要小、佩戴要稳，同时保留足够的识别特征与操作可达性。'
            ]
          },
          {
            h: '怎么做', en: 'HOW',
            lead: '用三组形态方向拉开差异，比较防护性、体量与使用姿态，再逐轮迭代模型与细节。',
            items: [
              'A 防护切角、B 圆润包覆、C 柔和曲面三组探索，比较防护性、体量与使用姿态的不同取舍。',
              '三个方向均为阶段性探索，未在该阶段收敛；页面保留归纳出的造型语言与后续优化重点。'
            ],
            figures: [
              { f: 'assets/img/id/wateralarm-p38.webp', cap: '三组形态方向并列对比', wide: true }
            ]
          },
          {
            h: '做出什么', en: 'WHAT',
            compare: { before: { f: 'assets/img/id/wateralarm-p38.webp', label: '三方向形态' }, after: { f: 'assets/img/id/wateralarm-p37.webp', label: '场景与成品' }, cap: '从形态方向对比到场景表达（已匿名化）。' },
            lead: '交付包含多方向造型对比、模型迭代与 CMF / 场景表达，用于方案评审与后续收敛。',
            items: [
              'CMF 与场景：同一产品在不同材料与使用语境下保持识别一致。',
              '按匿名化规则移除客户名称、Logo 与未公开信息，仅展示本人参与的造型与视觉部分。'
            ],
            figures: [
              { f: 'assets/img/id/wateralarm-p40.webp', cap: 'CMF 与使用场景表达', wide: true }
            ]
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '三组形态方向均为阶段性探索，未在该阶段收敛为量产方案；页面展示的是本人参与的造型与视觉部分。',
              '客户名称、品牌与未公开内容已按匿名化规则移除；模型与图片均不构成工程结构或受力验证。'
            ]
          }
        ],
        images: []
      },
      {
        slug: 'smartlock', title: '智能锁系列 · 商业持续设计支持', en: 'SMART LOCK SERIES',
        badge: '商业协作 · 已匿名化',
        tags: ['Rhino 建模', '造型与形态', 'KeyShot 交付'],
        summary: '根据前期需求与草图制作 Rhino 模型，承担模型修改、KeyShot 渲染与效果图制作，持续支持商业改款节奏。',
        facts: [['角色', '建模 · 模型修改 · 渲染 · 效果图'], ['内容', '3D 效果 / 海报 / 包装 / 专利多视图 / 修图改字'], ['边界', '持续执行型协作，不作为独立原创项目']],
        hero: { f: 'assets/img/cover/smartlock.webp', cap: '商业改款的效果图交付（客户信息已匿名化）' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '商业改款需要跟得上节奏：需求与草图给过来之后，模型和效果图要能持续、稳定地跟上。',
            items: [
              '根据前期需求与草图建立 Rhino 模型，按反馈持续修改造型与细节。',
              '参与一项外观专利文件的建模与修改，处于申请准备阶段。'
            ],
            figures: [ { f: 'assets/img/id/smartlock-p41.webp', cap: '' }, { f: 'assets/img/id/smartlock-p43.webp', cap: '' } ]
          },
          {
            h: '怎么做', en: 'HOW',
            lead: '按"建模 → 修改 → 渲染 → 落地物料"的节奏推进，每轮反馈都能回溯到具体模型版本。',
            items: [
              '交付覆盖 KeyShot 渲染、效果图、海报、包装与专利多视图等。',
              '在改款循环里承担模型与视觉的执行环节，保证造型与素材一致。'
            ],
            figures: [ { f: 'assets/img/id/smartlock-p44.webp', cap: '' } ]
          },
          {
            h: '做出什么', en: 'WHAT',
            lead: '交付物以可直接使用的素材为主：3D 效果图、海报、包装与专利多视图。',
            items: [
              '把渲染图与版式素材整理成可直接对外使用的成品件。',
              '效果图与改字修图按商业交付标准执行。'
            ],
            figures: []
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '参与一项外观专利文件的建模与修改，处于申请准备阶段，暂不宣称授权或量产。',
              '该部分能证明持续的商业设计执行能力，但不能整体表述为独立原创设计。',
              '按公开边界匿名化处理，不含客户名称与品牌信息。'
            ]
          }
        ],
        images: ['assets/img/id/smartlock-p41.webp', 'assets/img/id/smartlock-p43.webp', 'assets/img/id/smartlock-p44.webp']
      },
      {
        slug: 'aid', title: 'AI 能力在产品设计中的两种应用', en: 'AI & PRODUCT DESIGN',
        badge: '毕业设计 + 工具',
        tags: ['交互原型', 'AI 工具设计', '产品定义'],
        summary: '毕业设计呈现智能产品原型，DesignDNA 把 AI 能力沉淀为可重复的设计工作流。',
        facts: [['形式', '毕业设计呈现 + 自研工作流'], ['关联', '与 AI 产品方向同一套项目'], ['价值', '设计判断可回溯、可复用']],
        hero: { f: 'assets/img/cover/aid.webp', cap: '毕业设计与 AI 工作流的关系' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '把两条线放在一起看：一条是能真实跑起来的实体原型，一条是可重复、可回溯的设计工作流。',
            items: [
              '两条线共用同一套判断：先确认边界与链路，再谈表现。'
            ],
            figures: []
          },
          {
            h: '这条线：桌面陪伴型机器人', en: 'LINE 01',
            lead: '把唤醒、语音对话、双眼状态与后台观察组织为一轮可恢复的实体交互。',
            items: [
              '真实硬件跑通闭环，双眼状态承担情感表达。',
              '后台提供运行总览、对话中心与诊断日志，让链路可观察。'
            ],
            figures: [ { f: 'assets/img/id/aid-p45.webp', cap: '' } ],
            links: [ { t: '看这个项目的完整案例', u: '#ai/robot' } ]
          },
          {
            h: '这条线：DesignDNA 工作台', en: 'LINE 02',
            lead: '用产品识别与约束控制探索范围，再通过逐条评审支持人工决策。',
            items: [
              '任务简报 → 约束地图 → 变体树 → 评审记录，全程可回溯。',
              '让"设计判断"变成可以复用、可以解释的流程。'
            ],
            figures: [ { f: 'assets/img/id/aid-p46.webp', cap: '' }, { f: 'assets/img/id/aid-p47.webp', cap: '' } ],
            links: [ { t: '看这个项目的完整案例', u: '#ai/designdna' } ]
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '本页是两条线的对照呈现，完整内容分别在 AI 产品方向的两个项目页。',
              '两条线都处于原型与进行中阶段，未做量产或规模验证。'
            ]
          }
        ],
        images: ['assets/img/id/aid-p45.webp', 'assets/img/id/aid-p46.webp', 'assets/img/id/aid-p47.webp']
      },
      {
        slug: 'visual', title: '视觉设计：平面与品牌标识', en: 'VISUAL DESIGN',
        badge: '平面 / 标识',
        tags: ['视觉与版式', '品牌与包装', '产品定义'],
        summary: '平面与海报设计（版式、图像节奏与氛围表达）以及品牌标识设计（标识构思、形态推演与应用呈现）。',
        facts: [['内容', '海报 / 版式 / 品牌标识'], ['能力', '视觉节奏与识别一致性'], ['用途', '商业交付与产品包装']],
        hero: { f: 'assets/img/cover/visual.webp', cap: '平面与品牌标识产出' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '平面与品牌标识是产品之外的另一条能力线：既服务于商业交付，也用在包装与展示上。',
            items: [
              '产品最终要落到物料上，版式与识别一致性会直接影响交付完整度。'
            ],
            figures: []
          },
          {
            h: '平面与版式', en: 'GRAPHIC',
            lead: '海报与版式：处理信息层级、图像节奏与整体氛围。',
            items: [
              '把产品信息拆成主次层级，用图像节奏控制阅读顺序。'
            ],
            figures: [ { f: 'assets/img/id/visual-p48.webp', cap: '' } ]
          },
          {
            h: '品牌标识', en: 'IDENTITY',
            lead: '品牌标识：从构思、形态推演到应用呈现，保证识别一致。',
            items: [
              '标识在不同尺寸与材质上保持一致识别。',
              '标识与产品造型语言互相呼应。'
            ],
            figures: [ { f: 'assets/img/id/visual-p49.webp', cap: '' } ]
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '这部分为视觉执行类工作，不是产品设计主业，用来说明商业交付的完整度。',
              '按公开边界处理，不含客户名称与具体品牌信息。'
            ]
          }
        ],
        images: ['assets/img/id/visual-p48.webp', 'assets/img/id/visual-p49.webp']
      },
      {
        slug: 'exercises', title: '其他产品练习', en: 'SELECTED EXERCISES',
        badge: '日常练习',
        tags: ['Rhino 建模', '造型与形态', 'KeyShot 交付'],
        summary: '建模、造型与效果表达的日常练习，用于保持形态手感与渲染表达的手感。',
        facts: [['形式', '练习集合'], ['重点', '形态与效果表达'], ['说明', '非商业项目']],
        hero: { f: 'assets/img/cover/exercises.webp', cap: '形态与效果表达练习' },
        sections: [
          {
            h: '为什么做', en: 'WHY',
            lead: '建模、造型与效果表达的日常练习，用于保持形态手感与渲染表达的手感。',
            items: [
              '练习类产出，非商业项目，作为形态与表达能力的补充展示。'
            ],
            figures: []
          },
          {
            h: '练什么', en: 'WHAT',
            lead: '重点在形态把握与效果表达：形体关系、曲面质量与渲染氛围。',
            items: [
              '形体与比例：把造型拆成可校验的几何关系。',
              '渲染表达：用材质与光位把形体讲清楚。'
            ],
            figures: [ { f: 'assets/img/id/exercises-p50.webp', cap: '' } ]
          },
          {
            h: '怎么练', en: 'HOW',
            lead: '把建模、造型与渲染拆成小目标，定期做完整的一轮并留档。',
            items: [
              '每轮都保留过程文件，便于回看推进路径。'
            ],
            figures: []
          },
          {
            h: '边界说明', en: 'BOUNDARY',
            items: [
              '非商业项目，不作为项目经历主张，仅用于补充展示形态与表达能力。'
            ]
          }
        ],
        images: ['assets/img/id/exercises-p50.webp']
      }
    ]
  }
];

/* 图片变体表：[原图宽, sm宽(900), md宽(1200)]；0=该档不生成（原图更小） */
const IMGV = {
  'assets/img/about/portrait.webp': [1086, 900, 0, 760],
  'assets/img/ai/designdna-p18.webp': [1500, 900, 1200, 760],
  'assets/img/ai/designdna-p19.webp': [1500, 900, 1200, 760],
  'assets/img/ai/designdna-p20.webp': [1500, 900, 1200, 760],
  'assets/img/ai/designdna-p22.webp': [1500, 900, 1200, 760],
  'assets/img/ai/designdna-p25.webp': [1500, 900, 1200, 760],
  'assets/img/ai/internship-p39.webp': [1500, 900, 1200, 760],
  'assets/img/ai/proto-breakout.webp': [1500, 900, 1200, 760],
  'assets/img/ai/proto-fruit.webp': [1500, 900, 1200, 760],
  'assets/img/ai/proto-tetris.webp': [1500, 900, 1200, 760],
  'assets/img/ai/robot-p06.webp': [1500, 900, 1200, 760],
  'assets/img/ai/robot-p08.webp': [1500, 900, 1200, 760],
  'assets/img/ai/robot-p09.webp': [1500, 900, 1200, 760],
  'assets/img/ai/robot-p13.webp': [1500, 900, 1200, 760],
  'assets/img/ai/robot-p15.webp': [1500, 900, 1200, 760],
  'assets/img/ai/toolset-p27.webp': [1500, 900, 1200, 760],
  'assets/img/ai/toolset-p29.webp': [1500, 900, 1200, 760],
  'assets/img/ai/toolset-p32.webp': [1500, 900, 1200, 760],
  'assets/img/ai/toolset-p33.webp': [1500, 900, 1200, 760],
  'assets/img/ai/toolset-p37.webp': [1500, 900, 1200, 760],
  'assets/img/case/id/doggie-d1.webp': [1184, 900, 0, 760],
  'assets/img/case/id/doggie-d2.webp': [1184, 900, 0, 760],
  'assets/img/case/id/doggie-d3.webp': [1184, 900, 0, 760],
  'assets/img/case/id/doggie-d4.webp': [1184, 900, 0, 760],
  'assets/img/case/id/doggie-explode.webp': [1600, 900, 1200, 760],
  'assets/img/case/id/doggie-hero-16x10.webp': [1600, 900, 1200, 760],
  'assets/img/case/id/doggie-pack.webp': [1504, 900, 1200, 760],
  'assets/img/case/id/doggie-sketch.webp': [1600, 900, 1200, 760],
  'assets/img/case/id/doggie-story.webp': [1600, 900, 1200, 760],
  'assets/img/case/id/doggie-threeview.webp': [1600, 900, 1200, 760],
  'assets/img/case/id/lumora-hero.webp': [1160, 900, 0, 760],
  'assets/img/case/id/lumora-p2.webp': [1600, 900, 1200, 760],
  'assets/img/case/id/lumora-p3.webp': [1600, 900, 1200, 760],
  'assets/img/case/id/lumora-p4.webp': [1600, 900, 1200, 760],
  'assets/img/cover/aid.webp': [1600, 900, 1200, 760],
  'assets/img/cover/designdna-ui.webp': [1600, 900, 1200, 760],
  'assets/img/cover/exercises.webp': [1600, 900, 1200, 760],
  'assets/img/cover/internship.webp': [1600, 900, 1200, 760],
  'assets/img/cover/lumora.webp': [1600, 900, 1200, 760],
  'assets/img/cover/navlight.webp': [1600, 900, 1200, 760],
  'assets/img/cover/proto.webp': [1600, 900, 1200, 760],
  'assets/img/cover/robot.webp': [1600, 900, 1200, 760],
  'assets/img/cover/smartlock.webp': [1600, 900, 1200, 760],
  'assets/img/cover/toolset.webp': [1600, 900, 1200, 760],
  'assets/img/cover/visual.webp': [1600, 900, 1200, 760],
  'assets/img/cover/wateralarm.webp': [1600, 900, 1200, 760],
  'assets/img/id/aid-p45.webp': [1500, 900, 1200, 760],
  'assets/img/id/aid-p46.webp': [1500, 900, 1200, 760],
  'assets/img/id/aid-p47.webp': [1500, 900, 1200, 760],
  'assets/img/id/exercises-p50.webp': [1500, 900, 1200, 760],
  'assets/img/id/navlight-p04.webp': [1500, 900, 1200, 760],
  'assets/img/id/navlight-p05.webp': [1500, 900, 1200, 760],
  'assets/img/id/navlight-p06.webp': [1500, 900, 1200, 760],
  'assets/img/id/navlight-p09.webp': [1500, 900, 1200, 760],
  'assets/img/id/smartlock-p41.webp': [1500, 900, 1200, 760],
  'assets/img/id/smartlock-p43.webp': [1500, 900, 1200, 760],
  'assets/img/id/smartlock-p44.webp': [1500, 900, 1200, 760],
  'assets/img/id/visual-p48.webp': [1500, 900, 1200, 760],
  'assets/img/id/visual-p49.webp': [1500, 900, 1200, 760],
  'assets/img/id/wateralarm-p37.webp': [1500, 900, 1200, 760],
  'assets/img/id/wateralarm-p38.webp': [1500, 900, 1200, 760],
  'assets/img/id/wateralarm-p40.webp': [1500, 900, 1200, 760],
};
