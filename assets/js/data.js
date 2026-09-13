/* 站点内容数据 —— 全部取自本人作品集（2026-09-13 终审版）与 career/master-profile.md，未新增未经验证的事实 */
const SITE = {
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
  heroLead: '产品设计背景，两个方向并行：一边做真实的工业设计与商业改款（建模、渲染、整套视觉交付），一边把机器人、语音交互和 AI 工具做成能跑起来的原型。'
};

const MARQUEE = ['AI 产品', '工业设计', '机器人产品', 'DesignDNA', 'Rhino 建模', 'KeyShot 渲染',
  '语音闭环', '商业改款', '工作流工具', 'CMF', '结构整合', '视觉交付'];

const DOWNLOADS = [
  { t: 'AI 产品方向作品集', d: '49 页 · 机器人产品 / DesignDNA / 个人 AI 工具 / 实体产品', f: 'download/付昕-AI产品方向作品集.pdf', s: '4.4 MB' },
  { t: '工业设计方向作品集', d: '51 页 · 航标灯 / 牵引绳 / Lumora / 商业产品设计', f: 'download/付昕-工业设计作品集.pdf', s: '7.1 MB' },
  { t: '产品设计 / 工业设计 简历', d: 'PDF · 1 页', f: 'download/付昕-产品设计工业设计-简历.pdf', s: '0.35 MB' },
  { t: 'AI 智能硬件与机器人产品 简历', d: 'PDF · 1 页', f: 'download/付昕-AI智能硬件与机器人产品-简历.pdf', s: '0.35 MB' },
  { t: 'AI 智能硬件与产品设计 综合简历', d: 'PDF · 2 页', f: 'download/付昕-AI智能硬件与产品设计-简历.pdf', s: '0.42 MB' }
];

const ABOUT = {
  intro: '华南师范大学产品设计专业 2027 届，意向城市深圳、广州。作品集中在两条线：工业设计与商业产品改款（航标灯、落水报警终端、智能锁系列），以及 AI 与实体交互（桌面陪伴机器人、DesignDNA、个人 AI 工具组）。习惯把事情拆成可验证的步骤，再把过程留成可以复用的记录。',
  timeline: [
    { time: '2026.07–11', org: '优必行（优必选体系内）· 产品组实习生', desc: '体验研发新版本、发现体验问题、提出改进意见并反馈研发。' },
    { time: '2026.03–09', org: '深圳壹点工业设计 · 设计师助理', desc: '商业产品造型推进、Rhino 建模、KeyShot 渲染与方案提案协作。' },
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
    cover: 'assets/img/ai/toolset-p33.jpg',
    keywords: ['机器人产品', 'AI 设计工具', '智能硬件与后台'],
    pdf: 'download/付昕-AI产品方向作品集.pdf',
    projects: [
      {
        slug: 'robot', title: '桌面陪伴型机器人', en: 'DESKTOP COMPANION ROBOT',
        badge: '毕业设计 · 进行中',
        tags: ['真实硬件', '语音闭环', '双眼状态', '系统架构'],
        summary: '先用真实硬件跑通「唤醒—理解—回复—复位」的语音闭环与八类双眼状态，再进入外壳、结构与整机体验设计。',
        facts: [['角色', '产品定义 · 交互拆解 · 原型验证'], ['状态', '毕业设计进行中'], ['证据', 'ESP32-S3-CAM · 语音闭环 · 私人后台']],
        body: [
          { h: '已经跑通的闭环', items: [
            '真实硬件：ESP32-S3-CAM + 2.0 英寸竖屏 + 外接扬声器，唤醒、收音、识别、回答与播放全部跑通。',
            '一次对话：唤醒（WakeNet）→ 理解（ASR 转写）→ 回复（生成答案 + TTS）→ 复位回到待机，可再次唤醒。',
            '双眼状态反馈：以明暗、角度与形态变化传达平静、开心、关心、困惑、惊讶、困倦、难过、严肃八类状态。'
          ]},
          { h: '系统与后台', items: [
            '从设备到服务的产品架构：把一次语音交互拆成可观察、可定位、可恢复的链路。',
            '私人后台：运行总览、对话中心、诊断与日志，以及个性与记忆、能力与服务、系统设置等配置模块。',
            '验证计划：统一记录口径，持续验证唤醒成功率、端到端耗时、复位与异常恢复。'
          ]}
        ],
        images: ['assets/img/ai/robot-p06.jpg', 'assets/img/ai/robot-p08.jpg', 'assets/img/ai/robot-p09.jpg', 'assets/img/ai/robot-p13.jpg', 'assets/img/ai/robot-p15.jpg']
      },
      {
        slug: 'designdna', title: 'DesignDNA · AI 设计工作台', en: 'DESIGNDNA · AI DESIGN WORKBENCH',
        badge: '真实改款任务验证',
        tags: ['AI 设计工具', '约束地图', '可追溯评审'],
        summary: '面向工业设计改款任务的 AI 协同工作台：先用产品 DNA 与约束地图控制探索范围，再通过逐条评审支持人工决策。',
        facts: [['角色', '产品定义 · 流程与交互设计'], ['验证案例', 'Fusion Audio 高端户外便携音响改款'], ['机制', '四步流程 · 全程可回溯']],
        body: [
          { h: '四步流程', items: [
            '任务简报 → 约束地图 → 变体树 → 评审记录，每一步都有输入、产出与可回溯的记录。',
            '约束地图把改款边界分成三层：保留（双扬声器开孔、顶部控制、承重提手）、可控（箱体比例、侧向护梁、表面层级）、自由（色彩、材料、表面处理）。',
            '跨品类参考转成可执行设计语言：从运动鞋提取防护分层，从智能手表提取精密边界。'
          ]},
          { h: '发散到收敛', items: [
            '九个造型方向共享同一组硬约束，先拉开轮廓差异再判断。',
            'CMF 建立系列识别：矿物色、沙岩色、石墨色与户外包胶关系。',
            '按识别度、握持可行性、分件合理性与系列延展收敛为石墨灰与矿物橙两个方向。'
          ]}
        ],
        images: ['assets/img/ai/designdna-p18.jpg', 'assets/img/ai/designdna-p19.jpg', 'assets/img/ai/designdna-p20.jpg', 'assets/img/ai/designdna-p22.jpg', 'assets/img/ai/designdna-p25.jpg'],
        links: [{ t: 'DesignDNA 界面走查（在线演示）', u: 'demo/designdna/' }]
      },
      {
        slug: 'toolset', title: '个人 AI 工具组', en: 'PERSONAL AI TOOLSET',
        badge: '4 个工具 · 自用中',
        tags: ['工作流', '工具设计', '可回滚切换', '隐私边界'],
        summary: '围绕素材采集、技能管理、资源观察与运行环境切换，为自己的设计工作流搭的四件工具。',
        facts: [['角色', '需求定义 · 交互设计 · 实现与迭代'], ['形态', '桌面常驻工具 + 浏览器扩展'], ['原则', '高风险动作可回滚、凭据不外传']],
        body: [
          { h: '四个工具', items: [
            'AIGC Skill Hub：当前注册表收录 34 项 Skill，统一处理发现、分类、调用与跨端同步；展示层与治理层分开——总入口负责找，管理页负责改；同步原则是补齐缺失项，不静默覆盖同名 Skill。',
            'Codex Camera：把唤起、镜像预览、拍照保存与复制剪贴板压缩为一次操作，让现实画面直接进入输入流。',
            '模式切换器：把 ChatGPT 账号、API 直连等线路放进同一决策界面；切换做成一次可回滚事务，先识别当前线路再选择目标方案，高风险动作前弹窗交代影响范围与同步范围。',
            'Codex Meter：桌面常驻胶囊显示各账户当前可用状态与近期用量，点击展开明细；设置页把常驻行为、同步来源与视觉参数拆开，本机快照优先，凭据不外传。'
          ]}
        ],
        images: ['assets/img/ai/toolset-p27.jpg', 'assets/img/ai/toolset-p29.jpg', 'assets/img/ai/toolset-p32.jpg', 'assets/img/ai/toolset-p33.jpg', 'assets/img/ai/toolset-p37.jpg']
      },
      {
        slug: 'proto', title: '快速原型实验（可在线玩）', en: 'QUICK PROTOTYPES',
        badge: '在线可玩',
        tags: ['交互原型', '规则拆解', '调试记录'],
        summary: '一组 HTML / Canvas 快速原型：俄罗斯方块、切西瓜、打方块。用来练习规则拆解、状态管理与问题定位。',
        facts: [['形式', '网页原型 · 点开即玩'], ['能力指向', '快速原型 / 规则拆解 / 测试意识'], ['边界', '玩法类型并非原创，属于借助 AI 的交互实验']],
        body: [
          { h: '做了什么', items: [
            '俄罗斯方块包含 Canvas 渲染、7-bag 随机、消行 / 等级 / 计分、落点影子、移动端控制、声音与本地最高分，并根据实际操作反馈修改硬降与提示。',
            '这组练习保留故障定位与规则调整的记录，用来证明借助 AI 做快速交互实验和调试的过程。'
          ]}
        ],
        images: ['assets/img/ai/proto-tetris.jpg', 'assets/img/ai/proto-fruit.jpg', 'assets/img/ai/proto-breakout.jpg'],
        links: [
          { t: '玩俄罗斯方块', u: 'demo/games/tetris/index.html' },
          { t: '玩切西瓜', u: 'demo/games/fruit/index.html' },
          { t: '玩打方块', u: 'demo/games/breakout/index.html' }
        ]
      },
      {
        slug: 'internship', title: '硬件联网适配（实习）', en: 'INTERNSHIP · HARDWARE',
        badge: '2026 实习',
        tags: ['硬件', '联网适配', '异常定位'],
        summary: '实习中完成的连接确认、参数适配、异常定位与复现记录。真实硬件经历让我在定义 AI 功能时，同时考虑设备、网络与异常恢复。',
        facts: [['角色', '产品组实习生'], ['内容', '连接确认 · 参数适配 · 异常定位 · 复现记录'], ['意义', '硬件 + 网络的真实约束']],
        body: [
          { h: '实际做的事', items: [
            '把模块与主控的连接逐一确认，按环境适配参数，遇到不稳定时回到日志和复现步骤定位问题。',
            '把每一次异常都留成可复现的记录，避免同类问题重复排查。'
          ]}
        ],
        images: ['assets/img/ai/internship-p39.jpg']
      },
      {
        slug: 'entity', title: '实体产品设计：DOGGIE & Lumora', en: 'PHYSICAL PRODUCT DESIGN',
        badge: '两个产品',
        tags: ['产品定义', 'Rhino 建模', 'CMF'],
        summary: '两个实体产品：DOGGIE 多功能宠物牵引绳与 Lumora 光健康伴护仪，从使用任务到产品架构、曲面建模与 CMF。',
        facts: [['角色', '产品定义 · 建模 · 渲染（独立完成）'], ['品类', '便携宠物用品 + 居家康养照明'], ['证据', '连续 Rhino / KeyShot 工程']],
        body: [
          { h: 'DOGGIE 多功能宠物牵引绳', items: [
            '把牵引、互动玩具携带与简单清洁集中到一个随身产品：透明球仓收纳玩具球，可拆卸清洁刷清理宠物脚底，垃圾袋收纳位于把手内部。',
            '连续 Rhino 与 KeyShot 文件记录从造型发散、分件、概念结构到最终渲染的推进过程。'
          ]},
          { h: 'Lumora 光健康伴护仪', items: [
            '折叠灯臂、物理控制与柜体收纳，适配居家多场景；灯臂收入柜体侧面，降低非使用状态的空间占用。',
            '尺寸与收纳关系在建模阶段持续校验，统一展开态与收纳态的尺寸基准。'
          ]}
        ],
        images: ['assets/img/ai/entity-p41.jpg', 'assets/img/ai/entity-p45.jpg', 'assets/img/ai/entity-p47.jpg']
      }
    ]
  },
  {
    id: 'id', label: '工业设计方向', en: 'INDUSTRIAL DESIGN DIRECTION',
    title: '产品定义 · 造型设计 · 建模与视觉交付',
    lead: '真实商业项目中的造型推进、方案迭代与整套视觉交付，加上个人项目的完整设计叙事。',
    cover: 'assets/img/id/navlight-p04.jpg',
    keywords: ['真实商业改款', '造型与建模', 'Rhino + KeyShot 交付'],
    pdf: 'download/付昕-工业设计作品集.pdf',
    projects: [
      {
        slug: 'navlight', title: '航标灯 Navigation Lights', en: 'NAVIGATION LIGHTS',
        badge: '既有平台改款',
        tags: ['造型推进', 'Rhino 建模', 'KeyShot 交付'],
        summary: '在既有海上导航设备平台上完成外观协作改款，强化海事设备识别，并建立可延展的系列设计语言。',
        facts: [['角色', '造型推进 · Rhino 建模 · KeyShot 视觉表达'], ['约束', '沿用既有结构、光学组件与安装维护边界'], ['目标', '外观升级 + 系列设计语言']],
        body: [
          { h: '项目背景与约束', items: [
            '在既有海上导航设备平台上完成外观协作改款，沿用既有结构、光学组件与安装维护边界。',
            '竞品观察：SL-155 强调一体化灯罩与稳定底座；Apollo-155 用分层灯体与深色散热段强化设备属性；NOVA-65 HI 以紧凑体量与高识别色适配小型化场景。',
            '设计机会：保留光学、安装与维护边界，通过轮廓比例、散热格栅与灯带层次做外观升级。'
          ]},
          { h: '造型探索重点', items: [
            '比较锥形、柱形与外扩底座，控制视觉重心和稳定感。',
            '反复调整上盖、灯带与主体比例，保证远距离轮廓识别。',
            '把 V 形分割、纵向格栅与提手连接统一到同一设计语言，并同步考虑散热、安装孔位与维护操作。'
          ]}
        ],
        images: ['assets/img/id/navlight-p04.jpg', 'assets/img/id/navlight-p05.jpg', 'assets/img/id/navlight-p06.jpg', 'assets/img/id/navlight-p09.jpg']
      },
      {
        slug: 'doggie', title: 'DOGGIE 多功能宠物牵引绳', en: 'DOGGIE · MULTI-FUNCTION LEASH',
        badge: '个人项目',
        tags: ['产品定义', 'Rhino 建模', '品牌与包装'],
        summary: '把牵引、互动玩具携带与简单清洁集成到一个随身产品，减少外出携带负担。',
        facts: [['角色', '调研整理 · 产品定义 · 造型 · 建模 · 渲染 · 品牌包装'], ['功能', '牵引 / 握持 / 可拆卸清洁刷 / 玩具球仓 / 垃圾袋收纳'], ['过程', '连续 Rhino 阶段文件可追溯']],
        body: [
          { h: '从使用任务到产品架构', items: [
            '主握持区保持简洁，透明玩具球仓、可拆卸清洁刷与袋卷收纳分布在把手周围。',
            '把手内部垃圾袋收纳属于最终功能；清洁刷用于清理宠物脚底的灰尘与污物。'
          ]},
          { h: '过程与交付', items: [
            'Rhino 阶段文件覆盖造型发散、造型初步确认、分件、结构与最终造型外观，KeyShot 覆盖主页图、三视图、爆炸图、功能特写与配色展示。',
            '交付包含产品外观、多套配色、局部细节、三视图、爆炸示意与包装设计。'
          ]},
          { h: '边界说明', items: [
            '作品集中的用户画像、用户旅程与情绪曲线来自桌面资料研究整理，不作为本人开展真实用户访谈的证据。',
            '未制作实体模型；做过纸质握持测试，用于展示早期尺度与握持关系，不作为结构、受力或耐久测试。',
            '爆炸示意表达部件关系，不等同于完成工程结构设计或受力验证。'
          ]}
        ],
        images: ['assets/img/id/doggie-p12.jpg', 'assets/img/id/doggie-p16.jpg', 'assets/img/id/doggie-p18.jpg', 'assets/img/id/doggie-p24.jpg', 'assets/img/id/doggie-p26.jpg']
      },
      {
        slug: 'lumora', title: 'Lumora 光健康伴护仪', en: 'LUMORA · LIGHT HEALTH COMPANION',
        badge: '课程项目 · 4 周',
        tags: ['灯具设计', '功能整合', '结构校验'],
        summary: '一盏可收纳的居家照明设备：通过折叠灯臂、物理控制与柜体收纳适配居家多场景。',
        facts: [['角色', '产品定义 · 功能整合 · 造型 · Rhino 建模 · 视觉表达'], ['周期', '灯具设计课程约 4 周'], ['重点', '展开 / 收纳状态的空间占用']],
        body: [
          { h: '从居家动作定义设计机会', items: [
            '把调节、开启、收纳和移动组织成低认知负担的操作顺序。',
            '操作：保留旋钮与按键，减少进入照明前的步骤；体量：灯臂收入柜体侧面，降低非使用状态的空间占用。'
          ]},
          { h: '尺寸与收纳关系', items: [
            '在建模阶段持续检查灯臂转动、灯头覆盖、柜体容积与使用高度。',
            'Rhino 尺寸视图统一展开态、收纳态与移动状态的尺寸基准；细节围绕操作可达性与收纳状态展开。'
          ]}
        ],
        images: ['assets/img/id/lumora-p27.jpg', 'assets/img/id/lumora-p29.jpg', 'assets/img/id/lumora-p31.jpg', 'assets/img/id/lumora-p34.jpg']
      },
      {
        slug: 'wateralarm', title: '落水报警终端', en: 'WATER ALARM TERMINAL',
        badge: '商业协作 · 已匿名化',
        tags: ['形态探索', '模型迭代', '视觉提案'],
        summary: '围绕穿戴、识别与海上使用场景，完成多方向造型探索、模型迭代与视觉提案。',
        facts: [['角色', '多方向造型探索与对比 · 模型迭代 · 提案'], ['形式', '匿名化商业项目（客户信息与未公开内容已移除）'], ['阶段', '三组形态方向均为阶段性探索']],
        body: [
          { h: '形态方向对比', items: [
            'A 防护切角、B 圆润包覆、C 柔和曲面三组探索，比较防护性、体量与使用姿态的不同取舍。',
            '三个方向均为阶段性探索，未在该阶段收敛；页面保留归纳出的造型语言与后续优化重点。'
          ]},
          { h: 'CMF 与场景表达', items: [
            '同一产品在不同材料与使用语境下保持识别一致。',
            '按匿名化规则移除客户名称、Logo 与未公开信息，仅展示本人参与的造型与视觉部分。'
          ]}
        ],
        images: ['assets/img/id/wateralarm-p37.jpg', 'assets/img/id/wateralarm-p38.jpg', 'assets/img/id/wateralarm-p40.jpg']
      },
      {
        slug: 'smartlock', title: '智能锁系列 · 商业持续设计支持', en: 'SMART LOCK SERIES',
        badge: '商业协作 · 已匿名化',
        tags: ['Rhino 建模', 'KeyShot 渲染', '效果图交付'],
        summary: '根据前期需求与草图制作 Rhino 模型，承担模型修改、KeyShot 渲染与效果图制作，持续支持商业改款节奏。',
        facts: [['角色', '建模 · 模型修改 · 渲染 · 效果图'], ['内容', '3D 效果 / 海报 / 包装 / 专利多视图 / 修图改字'], ['边界', '持续执行型协作，不作为独立原创项目']],
        body: [
          { h: '工作内容', items: [
            '根据前期需求与草图建立 Rhino 模型，按反馈持续修改造型与细节。',
            '交付覆盖 KeyShot 渲染、效果图、海报、包装与专利多视图等。'
          ]},
          { h: '边界说明', items: [
            '参与一项外观专利文件的建模与修改，处于申请准备阶段，暂不宣称授权或量产。',
            '该部分能证明持续的商业设计执行能力，但不能整体表述为独立原创设计。'
          ]}
        ],
        images: ['assets/img/id/smartlock-p41.jpg', 'assets/img/id/smartlock-p43.jpg', 'assets/img/id/smartlock-p44.jpg']
      },
      {
        slug: 'aid', title: 'AI 能力在产品设计中的两种应用', en: 'AI & PRODUCT DESIGN',
        badge: '毕业设计 + 工具',
        tags: ['智能产品原型', 'AI 工作流'],
        summary: '毕业设计呈现智能产品原型，DesignDNA 把 AI 能力沉淀为可重复的设计工作流。',
        facts: [['形式', '毕业设计呈现 + 自研工作流'], ['关联', '与 AI 产品方向同一套项目'], ['价值', '设计判断可回溯、可复用']],
        body: [
          { h: '两条线', items: [
            '毕业设计：桌面陪伴型机器人——把唤醒、语音对话、双眼状态与后台观察组织为一轮可恢复的实体交互。',
            'DesignDNA：用产品识别与约束控制探索范围，再通过逐条评审支持人工决策。'
          ]}
        ],
        images: ['assets/img/id/aid-p45.jpg', 'assets/img/id/aid-p46.jpg', 'assets/img/id/aid-p47.jpg']
      },
      {
        slug: 'visual', title: '视觉设计：平面与品牌标识', en: 'VISUAL DESIGN',
        badge: '平面 / 标识',
        tags: ['版式', '图像节奏', '标识推演'],
        summary: '平面与海报设计（版式、图像节奏与氛围表达）以及品牌标识设计（标识构思、形态推演与应用呈现）。',
        facts: [['内容', '海报 / 版式 / 品牌标识'], ['能力', '视觉节奏与识别一致性'], ['用途', '商业交付与产品包装']],
        body: [
          { h: '做了什么', items: [
            '海报与版式：处理信息层级、图像节奏与整体氛围。',
            '品牌标识：从构思、形态推演到应用呈现，保证识别一致。'
          ]}
        ],
        images: ['assets/img/id/visual-p48.jpg', 'assets/img/id/visual-p49.jpg']
      },
      {
        slug: 'exercises', title: '其他产品练习', en: 'SELECTED EXERCISES',
        badge: '日常练习',
        tags: ['建模', '造型', '效果表达'],
        summary: '建模、造型与效果表达的日常练习，用于保持形态手感与渲染表达的手感。',
        facts: [['形式', '练习集合'], ['重点', '形态与效果表达'], ['说明', '非商业项目']],
        body: [{ h: '说明', items: ['练习类产出，非商业项目，作为形态与表达能力的补充展示。'] }],
        images: ['assets/img/id/exercises-p50.jpg']
      }
    ]
  }
];
