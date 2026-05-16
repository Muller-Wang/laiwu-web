// 来悟单词书 · 双语字典
// key 用扁平点号路径，方便 grep 与重构

export const dict = {
  zh: {
    // ====== 通用 ======
    "lang.label": "中",
    "lang.switch": "Switch to English",

    // ====== 导航 ======
    "nav.wordbook": "词库",
    "nav.study": "学习计划",
    "nav.about": "关于",
    "nav.enterWordbook": "进入词库",
    "nav.menu": "菜单",

    // ====== Footer ======
    "footer.tagline":
      "中国本土版柯林斯词典。AI 驱动的 7000 词雅思单词书，鲜活例句 + 多元巧记法 + 熟词生义标注。",
    "footer.subtagline1": "为雅思考生与海外华人打造",
    "footer.subtagline2": "让单词学习从机械记忆走向真正理解",
    "footer.sitemap": "站点",
    "footer.nodes": "访问节点",
    "footer.nodeCN": "中国大陆",
    "footer.nodeGlobal": "全球",
    "footer.copyright": "© 2026 来悟单词书",
    "footer.madeWith": "Made with care for English learners.",

    // ====== 首页 ======
    "home.badge": "为雅思考生与海外华人打造",
    "home.brand": "来悟",
    "home.brandSuffix": "单词书",
    "home.subtitle": "中国本土版柯林斯词典",
    "home.intro":
      "AI 驱动的 7000 词雅思单词书。鲜活例句 · 多元巧记 · 熟词生义 —— 让记单词从机械重复走向真正理解。",
    "home.cta.enter": "进入词库",
    "home.cta.about": "了解项目背景",

    "home.stats.words": "核心雅思词汇",
    "home.stats.examples": "AI 仿写鲜活例句",
    "home.stats.fresh": "近两年语料占比",

    "home.section.title": "我们用 AI 重新定义单词书",
    "home.section.subtitle": "四个维度，让 7000 词从「背得快」变成「用得好」",

    "home.inn1.title": "实时鲜活例句",
    "home.inn1.desc":
      "Grok3 模型自动抓取《经济学人》《时代周刊》等权威期刊 2022-2024 年最新文章，新鲜度高达 85%，告别十年前的过时语料。",
    "home.inn1.badge": "技术创新",
    "home.inn2.title": "多元巧记法",
    "home.inn2.desc":
      "谐音法、象形法、词根词缀法、故事联想法四大记忆策略，由 DeepSeek 智能匹配。用户实测记忆效率提升 40%。",
    "home.inn2.badge": "方法创新",
    "home.inn3.title": "熟词生义标注",
    "home.inn3.desc":
      "国内首创系统性熟词生义体系，1200+ 典型案例覆盖雅思高频易错点和留学生活场景。lit、sick、goat 都不再是字面意思。",
    "home.inn3.badge": "内容创新",
    "home.inn4.title": "跨学科专业力",
    "home.inn4.desc":
      "语言学专业逻辑 × AI 技术应用 × 产品思维的有机融合。横跨语言学、计算机科学、英语口译与工商管理的跨领域协作。",
    "home.inn4.badge": "团队优势",

    "home.cta2.title": "准备好开始你的雅思词汇之旅了吗？",
    "home.cta2.subtitle": "7000 个单词在等你 · 现在就开始",
    "home.cta2.button": "立即进入词库",

    // ====== 词库页 ======
    "wordbook.crumb": "词库",
    "wordbook.title": "7000 雅思核心词",
    "wordbook.summaryAll": "共收录 {{total}} 个词条 · 每个词都配有 AI 鲜活例句",
    "wordbook.summaryFiltered": "共筛选出 {{total}} 个词条",
    "wordbook.searchPlaceholder": "搜索单词、释义、例句…",
    "wordbook.clearSearch": "清空",
    "wordbook.filter": "筛选",
    "wordbook.filterExpand": "展开",
    "wordbook.filterCollapse": "收起",
    "wordbook.filterClear": "清空",
    "wordbook.freq": "词频",
    "wordbook.freqAll": "全部词频",
    "wordbook.freq1": "高频",
    "wordbook.freq2": "中频",
    "wordbook.freq3": "低频",
    "wordbook.pos": "词性",
    "wordbook.filterSlang": "🔥 含熟词生义",
    "wordbook.filterMn": "💡 含助记法",
    "wordbook.prev": "上一页",
    "wordbook.next": "下一页",
    "wordbook.page": "第 {{page}} 页 / 共 {{total}} 页",
    "wordbook.empty.title": "没找到相关词条",
    "wordbook.empty.desc": "试试换个关键词，或清除筛选条件再试",
    "wordbook.empty.clear": "清除所有筛选",

    "wordcard.slang": "含熟词生义",
    "wordcard.mn": "含助记法",

    // ====== 单词详情 ======
    "word.back": "返回词库",
    "word.us": "美",
    "word.uk": "英",
    "word.speak": "发音",
    "word.section.core": "核心释义",
    "word.section.slang": "熟词生义",
    "word.section.example": "鲜活例句",
    "word.section.mnemonic": "记忆窍门",
    "word.section.assoc": "词汇联想",
    "word.assoc.synonyms": "近义词",
    "word.assoc.antonyms": "反义词",
    "word.assoc.collocations": "常用搭配",
    "word.assoc.morphology": "词形变化",
    "word.action.mark": "标记已学",
    "word.action.plan": "加入计划",
    "word.toast.mark": "已加入学习记录",
    "word.toast.plan": "已加入今日学习计划",

    "mnemonic.root_affix": "词根词缀",
    "mnemonic.homophone": "谐音联想",
    "mnemonic.image": "象形记忆",
    "mnemonic.story": "故事联想",
    "mnemonic.association": "联想记忆",
    "mnemonic.default": "助记",

    // ====== 学习计划 ======
    "study.crumb": "我的学习计划",
    "study.planName": "30 天速过雅思核心 2000 词",
    "study.intro": "每天约学习 67 个词 · 包含 5 词回顾 · 评审展示用 Demo 数据",
    "study.progress.total": "总进度",
    "study.progress.dayN": "第 {{done}} / {{total}} 天",
    "study.progress.remain": "还有 {{n}} 天",
    "study.kpi.learned": "已掌握",
    "study.kpi.pendingNew": "待新学",
    "study.kpi.pendingReview": "待复习",
    "study.kpi.streak": "连续打卡",
    "study.kpi.unitWord": "词",
    "study.kpi.unitDay": "天",
    "study.heatmap.title": "过去 90 天学习记录",
    "study.heatmap.less": "少",
    "study.heatmap.more": "多",
    "study.today.title": "今日清单",
    "study.today.start": "开始今日学习",
    "study.today.tabNew": "新学词",
    "study.today.tabReview": "待复习",
    "study.cta.title": "🚀 开始今日学习",
    "study.cta.desc": "预计 15 分钟 · {{newN}} 个新词 + {{reviewN}} 个复习",

    // ====== 学习模式 ======
    "session.back": "返回计划",
    "session.progress": "{{cur}} / {{total}}",
    "session.cardIdx": "第 {{idx}} 个",
    "session.flipHint": "点击查看释义",
    "session.recallHint": "先回忆这个单词的意思，再翻面对照",
    "session.rate.forget": "忘记",
    "session.rate.hard": "困难",
    "session.rate.good": "良好",
    "session.rate.easy": "简单",
    "session.rate.forgetHint": "明天再见",
    "session.rate.hardHint": "10 分钟后",
    "session.rate.goodHint": "明天",
    "session.rate.easyHint": "4 天后",
    "session.done.title": "今日完成！",
    "session.done.desc": "你刚刚学习了 {{total}} 个单词，连续打卡 +1 🔥",
    "session.done.back": "返回计划",
    "session.done.restart": "再来一组",

    // ====== 关于页 ======
    "about.badge": "重新定义 AI 时代的英语词汇学习",
    "about.title.l1": "让单词学习从机械记忆",
    "about.title.l2": "走向真正",
    "about.title.l3": "理解与运用",
    "about.subtitle":
      "鲜活语料 · 多元巧记 · 熟词生义 —— 一本面向 AI 时代的雅思核心词书",

    "about.story.tag": "产品故事",
    "about.story.title": "来自对传统词书三大痛点的深刻洞察",
    "about.pain1.tag": "例句陈旧",
    "about.pain1.desc":
      "市面绝大多数雅思单词书沿用十年前甚至更早的语料，与当今英语使用语境严重脱节。",
    "about.pain2.tag": "记忆方法单一",
    "about.pain2.desc":
      "缺乏科学、有趣的记忆引导，学习者只能依赖机械重复，遗忘率极高。",
    "about.pain3.tag": "忽视熟词生义",
    "about.pain3.desc":
      "学习者掌握单词基础义却在实际使用中频繁出错，尤其影响口语考试中的理解与表达。",
    "about.story.summary":
      "「来悟单词书」以多模型协作的 AI 内容生产管线为技术底座，服务雅思备考人群与广大英语学习者，定位「中国本土版柯林斯词典」，强调产品思维与用户中心理念。",

    "about.inn.tag": "四大创新",
    "about.inn.title": "用 AI 重新定义单词书",

    "about.inn1.title": "实时鲜活例句体系",
    "about.inn1.p1":
      "Grok3 自动抓取《经济学人》《时代周刊》等顶级期刊 2022-2024 年文章",
    "about.inn1.p2": "上下文相关性多层评分筛选 + 人工抽样复核",
    "about.inn1.p3": "目前 7000 词均配权威母语者语料，新鲜度高达 85%",
    "about.inn1.p4": "月度更新机制，让学习内容与时代同步",

    "about.inn2.title": "多元巧记法体系",
    "about.inn2.p1": "四大记忆方法：谐音法、象形法、词根词缀法、故事联想法",
    "about.inn2.p2": "DeepSeek 模型按词源 / 释义 / 词频智能匹配策略",
    "about.inn2.p3":
      "Kimi 模型合理性评估 + 人工抽样审核 + 用户反馈闭环",
    "about.inn2.p4": "用户测试反馈：记忆效率平均提升 40%，遗忘周期明显延长",

    "about.inn3.title": "熟词生义标注",
    "about.inn3.p1": "国内词书市场率先系统性引入熟词生义 + 中外异义标注",
    "about.inn3.p2":
      "Grok3 模型对英美主流媒体语料大规模分析，自动识别义项差异",
    "about.inn3.p3": "英美用法差异、正式 / 非正式语体差异专项标注",
    "about.inn3.p4": "已完成 1200+ 典型案例，覆盖雅思高频易错点与留学生活场景",

    "about.inn4.title": "跨学科专业力",
    "about.inn4.p1": "核心成员横跨语言学、计算机科学、英语口译、工商管理",
    "about.inn4.p2": "语言学专业素养 × AI 技术应用 × 产品思维的有机融合",
    "about.inn4.p3": "从英语习得规律与跨文化交际双重视角设计内容",
    "about.inn4.p4": "兼具学术深度与产品打磨能力，每条词条经多轮人工抽检",

    "about.pipe.tag": "技术架构",
    "about.pipe.title": "多模型协作的 AI 内容生产管线",
    "about.pipe.subtitle":
      "三轮模型迭代 · 提示词工程六维框架 · AI 内容可用率从 72% 提升至 93%",
    "about.pipe.p1.label": "原始词表",
    "about.pipe.p1.desc": "Python PDF 解析",
    "about.pipe.p2.label": "Coze 工作流",
    "about.pipe.p2.desc": "豆包内容生成",
    "about.pipe.p3.label": "Kimi 校验",
    "about.pipe.p3.desc": "质量评估",
    "about.pipe.p4.label": "Supabase",
    "about.pipe.p4.desc": "结构化存储",
    "about.pipe.p5.label": "Web 端",
    "about.pipe.p5.desc": "本网站",

    "about.ach.tag": "项目成果",
    "about.ach.title": "用数据说话",
    "about.ach.l1": "核心雅思词汇",
    "about.ach.l2": "AI 鲜活例句",
    "about.ach.l3": "熟词生义案例",
    "about.ach.l4": "助记法覆盖率",
    "about.ach.l5": "首播观看人次",
    "about.ach.l6": "AI 内容可用率",

    "about.contact.title": "想了解更多？",
    "about.contact.desc": "欢迎合作伙伴、教育机构、内容创作者联系我们",
    "about.contact.enter": "进入词库",
    "about.contact.copy": "© 2026 来悟单词书 · 让单词学习从机械记忆走向真正理解",

    // ====== 学习计划扩展 ======
    "plan.create.title": "创建你的学习计划",
    "plan.create.desc": "选择词库范围和完成天数，每日学习量将自动算出",
    "plan.create.scope": "词库范围",
    "plan.create.scope.freq1": "高频核心 · 约 2000 词",
    "plan.create.scope.freq12": "高频 + 中频 · 约 4500 词",
    "plan.create.scope.all": "全部 7000 词",
    "plan.create.days": "完成天数",
    "plan.create.daysLabel": "{{n}} 天",
    "plan.create.daily": "每日学习量",
    "plan.create.dailyValue": "约 {{n}} 词 / 天",
    "plan.create.submit": "开始学习计划",
    "plan.create.change": "更换计划",
    "plan.dashboard.noPlan": "还没有学习计划",
    "plan.dashboard.noPlanDesc":
      "创建一个计划，AI 会帮你规划每天学多少词、何时复习",
    "plan.dashboard.startBtn": "立即创建计划",
    "plan.dashboard.today.allDone": "今日清单已完成 🎉 明天再来",

    // ====== 测验 ======
    "quiz.title": "单词测验",
    "quiz.crumb": "测验",
    "quiz.intro": "从已学词中抽取，多种题型混合，错题自动归档",
    "quiz.start.mc_zh2en": "中 → 英 选择题",
    "quiz.start.mc_en2zh": "英 → 中 选择题",
    "quiz.start.spelling": "拼写题",
    "quiz.start.dictation": "听写题",
    "quiz.start.wrong": "错题专项",
    "quiz.config.count": "题目数量",
    "quiz.config.start": "开始测验",
    "quiz.q.prompt.zh2en": "下面这个中文释义对应的单词是？",
    "quiz.q.prompt.en2zh": "这个单词的中文释义是？",
    "quiz.q.prompt.spelling": "根据中文释义和首字母提示，写出完整单词",
    "quiz.q.prompt.dictation": "听音输入完整单词",
    "quiz.q.play": "播放",
    "quiz.q.submit": "提交",
    "quiz.q.next": "下一题",
    "quiz.q.correct": "✅ 答对了",
    "quiz.q.wrong": "❌ 答错了，正确答案是",
    "quiz.q.progress": "第 {{cur}} / {{total}} 题",
    "quiz.done.title": "测验完成",
    "quiz.done.score": "正确 {{correct}} / {{total}}",
    "quiz.done.again": "再来一组",
    "quiz.done.back": "返回测验中心",
    "quiz.empty": "还没有可测验的单词。先去学一些再回来吧！",

    // ====== 收藏 ======
    "bookmark.add": "收藏",
    "bookmark.remove": "取消收藏",
    "bookmark.toastAdd": "已加入收藏",
    "bookmark.toastRemove": "已取消收藏",
    "bookmark.page.title": "我的收藏",
    "bookmark.page.empty": "收藏夹是空的，去词库找喜欢的词收藏起来吧",

    // ====== 搜索建议 ======
    "search.suggestion": "你是不是要找：",

    // ====== 404 ======
    "notFound.title": "没找到这个词条",
    "notFound.desc": "可能是单词拼写有误，或这个词还没收录。",
    "notFound.browse": "浏览词库",
    "notFound.home": "回到首页",
  },

  en: {
    // ====== Common ======
    "lang.label": "EN",
    "lang.switch": "切换到中文",

    // ====== Nav ======
    "nav.wordbook": "Wordbook",
    "nav.study": "Study Plan",
    "nav.about": "About",
    "nav.enterWordbook": "Open Wordbook",
    "nav.menu": "Menu",

    // ====== Footer ======
    "footer.tagline":
      "The Chinese-localized Collins dictionary. An AI-powered 7000-word IELTS vocabulary book — fresh examples, mnemonic strategies, slang meanings.",
    "footer.subtagline1": "Built for IELTS candidates and Chinese learners abroad",
    "footer.subtagline2": "From rote memorization to true understanding.",
    "footer.sitemap": "Sitemap",
    "footer.nodes": "Access Nodes",
    "footer.nodeCN": "China Mainland",
    "footer.nodeGlobal": "Worldwide",
    "footer.copyright": "© 2026 Laiwu Wordbook",
    "footer.madeWith": "Made with care for English learners.",

    // ====== Home ======
    "home.badge": "Built for IELTS candidates and Chinese learners abroad",
    "home.brand": "Laiwu",
    "home.brandSuffix": "Wordbook",
    "home.subtitle": "A Chinese-localized Collins dictionary",
    "home.intro":
      "An AI-powered 7000-word IELTS vocabulary book. Fresh corpus · Smart mnemonics · Slang meanings — turning rote drills into true comprehension.",
    "home.cta.enter": "Open Wordbook",
    "home.cta.about": "About the Project",

    "home.stats.words": "Core IELTS Words",
    "home.stats.examples": "AI Fresh Examples",
    "home.stats.fresh": "Last 2 Years Corpus",

    "home.section.title": "We are redefining vocabulary books with AI",
    "home.section.subtitle":
      "Four dimensions that turn 7000 words from \"memorized fast\" into \"used well\"",

    "home.inn1.title": "Real-time Fresh Examples",
    "home.inn1.desc":
      "Grok3 automatically fetches 2022-2024 articles from The Economist, Time and other authoritative outlets. 85% recency — no more decade-old corpora.",
    "home.inn1.badge": "Technology",
    "home.inn2.title": "Multi-strategy Mnemonics",
    "home.inn2.desc":
      "Four mnemonic strategies — homophone, image, root-affix, story — matched intelligently by DeepSeek. User trials show ~40% memory boost.",
    "home.inn2.badge": "Methodology",
    "home.inn3.title": "Slang Meaning Annotations",
    "home.inn3.desc":
      "China's first systematic slang-meaning system. 1200+ cases cover IELTS pitfalls and overseas-life scenarios. Words like lit, sick, goat are no longer literal.",
    "home.inn3.badge": "Content",
    "home.inn4.title": "Cross-Disciplinary Team",
    "home.inn4.desc":
      "Linguistic rigor × AI engineering × product mindset. Cross-domain collaboration spanning linguistics, computer science, interpreting and business administration.",
    "home.inn4.badge": "Team",

    "home.cta2.title": "Ready to start your IELTS vocabulary journey?",
    "home.cta2.subtitle": "7000 words await · start right now",
    "home.cta2.button": "Open the Wordbook",

    // ====== Wordbook ======
    "wordbook.crumb": "Wordbook",
    "wordbook.title": "7000 Core IELTS Words",
    "wordbook.summaryAll":
      "{{total}} entries · every word comes with AI-curated fresh examples",
    "wordbook.summaryFiltered": "{{total}} entries matched",
    "wordbook.searchPlaceholder": "Search words, definitions, examples…",
    "wordbook.clearSearch": "Clear",
    "wordbook.filter": "Filters",
    "wordbook.filterExpand": "Expand",
    "wordbook.filterCollapse": "Collapse",
    "wordbook.filterClear": "Clear",
    "wordbook.freq": "Frequency",
    "wordbook.freqAll": "All Frequencies",
    "wordbook.freq1": "High",
    "wordbook.freq2": "Medium",
    "wordbook.freq3": "Low",
    "wordbook.pos": "Part of Speech",
    "wordbook.filterSlang": "🔥 Has slang meaning",
    "wordbook.filterMn": "💡 Has mnemonic",
    "wordbook.prev": "Previous",
    "wordbook.next": "Next",
    "wordbook.page": "Page {{page}} / {{total}}",
    "wordbook.empty.title": "No matching entries",
    "wordbook.empty.desc":
      "Try a different keyword, or clear the filters and search again",
    "wordbook.empty.clear": "Clear all filters",

    "wordcard.slang": "Has slang meaning",
    "wordcard.mn": "Has mnemonic",

    // ====== Word Detail ======
    "word.back": "Back to Wordbook",
    "word.us": "US",
    "word.uk": "UK",
    "word.speak": "Speak",
    "word.section.core": "Core Meanings",
    "word.section.slang": "Slang Meaning",
    "word.section.example": "Fresh Example",
    "word.section.mnemonic": "Memory Tip",
    "word.section.assoc": "Associations",
    "word.assoc.synonyms": "Synonyms",
    "word.assoc.antonyms": "Antonyms",
    "word.assoc.collocations": "Collocations",
    "word.assoc.morphology": "Morphology",
    "word.action.mark": "Mark as Learned",
    "word.action.plan": "Add to Plan",
    "word.toast.mark": "Added to your learning history",
    "word.toast.plan": "Added to today's study plan",

    "mnemonic.root_affix": "Root & Affix",
    "mnemonic.homophone": "Homophone",
    "mnemonic.image": "Visual",
    "mnemonic.story": "Story",
    "mnemonic.association": "Association",
    "mnemonic.default": "Tip",

    // ====== Study Plan ======
    "study.crumb": "My Study Plan",
    "study.planName": "30-Day IELTS Core 2000",
    "study.intro":
      "Roughly 67 words per day · 5 reviews bundled · demo data for showcase",
    "study.progress.total": "Total Progress",
    "study.progress.dayN": "Day {{done}} / {{total}}",
    "study.progress.remain": "{{n}} days to go",
    "study.kpi.learned": "Mastered",
    "study.kpi.pendingNew": "New to Learn",
    "study.kpi.pendingReview": "To Review",
    "study.kpi.streak": "Day Streak",
    "study.kpi.unitWord": "words",
    "study.kpi.unitDay": "days",
    "study.heatmap.title": "Last 90 Days",
    "study.heatmap.less": "Less",
    "study.heatmap.more": "More",
    "study.today.title": "Today's List",
    "study.today.start": "Start Today",
    "study.today.tabNew": "New",
    "study.today.tabReview": "Review",
    "study.cta.title": "🚀 Start Today's Session",
    "study.cta.desc":
      "~15 minutes · {{newN}} new + {{reviewN}} review",

    // ====== Study Session ======
    "session.back": "Back to Plan",
    "session.progress": "{{cur}} / {{total}}",
    "session.cardIdx": "Card {{idx}}",
    "session.flipHint": "Tap to reveal meaning",
    "session.recallHint":
      "Recall the meaning first, then flip to compare",
    "session.rate.forget": "Forgot",
    "session.rate.hard": "Hard",
    "session.rate.good": "Good",
    "session.rate.easy": "Easy",
    "session.rate.forgetHint": "tomorrow",
    "session.rate.hardHint": "10 min",
    "session.rate.goodHint": "tomorrow",
    "session.rate.easyHint": "4 days",
    "session.done.title": "All done!",
    "session.done.desc":
      "You just studied {{total}} words. Streak +1 🔥",
    "session.done.back": "Back to Plan",
    "session.done.restart": "Another Set",

    // ====== About ======
    "about.badge": "Reimagining vocabulary learning in the AI era",
    "about.title.l1": "From mechanical memorization",
    "about.title.l2": "to true",
    "about.title.l3": "understanding & use",
    "about.subtitle":
      "Fresh corpus · Smart mnemonics · Slang meanings — an IELTS core wordbook for the AI era",

    "about.story.tag": "The Story",
    "about.story.title": "Born from three deep pains of traditional wordbooks",
    "about.pain1.tag": "Stale Examples",
    "about.pain1.desc":
      "Most IELTS wordbooks still use corpora from a decade ago, badly out of sync with how English is actually used today.",
    "about.pain2.tag": "Single-track Memorization",
    "about.pain2.desc":
      "No scientific or engaging memory cues — learners can only rely on rote repetition, leading to fast forgetting.",
    "about.pain3.tag": "Ignored Slang Meanings",
    "about.pain3.desc":
      "Learners know the literal meaning but stumble in real usage, especially in speaking exams and overseas conversations.",
    "about.story.summary":
      "Laiwu Wordbook is built on a multi-model AI content pipeline, serving IELTS candidates and English learners alike. Positioned as a Chinese-localized Collins dictionary, with product thinking and user-centric design at its core.",

    "about.inn.tag": "Four Innovations",
    "about.inn.title": "Redefining the vocabulary book with AI",

    "about.inn1.title": "Real-time Fresh Example System",
    "about.inn1.p1":
      "Grok3 scrapes 2022-2024 articles from The Economist, Time and other top outlets",
    "about.inn1.p2":
      "Multi-layer contextual relevance scoring + manual spot checks",
    "about.inn1.p3":
      "All 7000 words now have native-author corpora, 85% recency",
    "about.inn1.p4":
      "Monthly refresh mechanism keeps content in sync with the times",

    "about.inn2.title": "Multi-strategy Mnemonic System",
    "about.inn2.p1":
      "Four methods: homophone, image, root-affix, story association",
    "about.inn2.p2":
      "DeepSeek matches the right strategy by etymology / definition / frequency",
    "about.inn2.p3":
      "Kimi rationality review + manual spot checks + user feedback loop",
    "about.inn2.p4":
      "User trials report ~40% improved retention with longer recall cycles",

    "about.inn3.title": "Slang Meaning Annotations",
    "about.inn3.p1":
      "China's first systematic slang-meaning + cross-cultural divergence system",
    "about.inn3.p2":
      "Grok3 analyzes US/UK media corpora at scale to detect sense gaps",
    "about.inn3.p3":
      "Dedicated tagging of US/UK and formal/informal register differences",
    "about.inn3.p4":
      "1200+ canonical cases covering IELTS pitfalls and overseas-life scenes",

    "about.inn4.title": "Cross-Disciplinary Strength",
    "about.inn4.p1":
      "Core members span linguistics, computer science, interpreting, business administration",
    "about.inn4.p2":
      "Linguistic rigor × AI engineering × product thinking, organically fused",
    "about.inn4.p3":
      "Content designed with both acquisition theory and cross-cultural lenses",
    "about.inn4.p4":
      "Academic depth + product polish, every entry goes through multiple human reviews",

    "about.pipe.tag": "Architecture",
    "about.pipe.title": "Multi-model AI content production pipeline",
    "about.pipe.subtitle":
      "3 iterations · 6-dimensional prompt engineering · AI content usability lifted from 72% to 93%",
    "about.pipe.p1.label": "Word List",
    "about.pipe.p1.desc": "PDF parsing in Python",
    "about.pipe.p2.label": "Coze Workflow",
    "about.pipe.p2.desc": "Doubao generation",
    "about.pipe.p3.label": "Kimi QA",
    "about.pipe.p3.desc": "Quality review",
    "about.pipe.p4.label": "Supabase",
    "about.pipe.p4.desc": "Structured store",
    "about.pipe.p5.label": "Web",
    "about.pipe.p5.desc": "This website",

    "about.ach.tag": "Results",
    "about.ach.title": "Numbers speak",
    "about.ach.l1": "Core IELTS Words",
    "about.ach.l2": "AI Fresh Examples",
    "about.ach.l3": "Slang Meaning Cases",
    "about.ach.l4": "Mnemonic Coverage",
    "about.ach.l5": "Premiere Viewers",
    "about.ach.l6": "AI Content Usability",

    "about.contact.title": "Want to learn more?",
    "about.contact.desc":
      "Partners, educational institutions and content creators welcome",
    "about.contact.enter": "Open Wordbook",
    "about.contact.copy":
      "© 2026 Laiwu Wordbook · From rote memorization to true understanding",

    // ====== Plan ======
    "plan.create.title": "Create your study plan",
    "plan.create.desc":
      "Pick a wordbook scope and a target duration. Daily quota auto-calculated.",
    "plan.create.scope": "Wordbook scope",
    "plan.create.scope.freq1": "High frequency core · ~2,000 words",
    "plan.create.scope.freq12": "High + Medium frequency · ~4,500 words",
    "plan.create.scope.all": "All 7,000 words",
    "plan.create.days": "Target duration",
    "plan.create.daysLabel": "{{n}} days",
    "plan.create.daily": "Daily quota",
    "plan.create.dailyValue": "~{{n}} words / day",
    "plan.create.submit": "Start the plan",
    "plan.create.change": "Change plan",
    "plan.dashboard.noPlan": "No study plan yet",
    "plan.dashboard.noPlanDesc":
      "Create a plan and let AI schedule your daily quota and reviews",
    "plan.dashboard.startBtn": "Create a plan now",
    "plan.dashboard.today.allDone": "Today's list is done 🎉 See you tomorrow",

    // ====== Quiz ======
    "quiz.title": "Word Quiz",
    "quiz.crumb": "Quiz",
    "quiz.intro":
      "Drawn from words you've already studied. Wrong answers are auto-archived.",
    "quiz.start.mc_zh2en": "Multiple Choice · ZH → EN",
    "quiz.start.mc_en2zh": "Multiple Choice · EN → ZH",
    "quiz.start.spelling": "Spelling",
    "quiz.start.dictation": "Dictation",
    "quiz.start.wrong": "Wrong words drill",
    "quiz.config.count": "Question count",
    "quiz.config.start": "Start quiz",
    "quiz.q.prompt.zh2en": "Which word matches this definition?",
    "quiz.q.prompt.en2zh": "What does this word mean?",
    "quiz.q.prompt.spelling": "Type the full word from the definition and first letter",
    "quiz.q.prompt.dictation": "Listen and type the word",
    "quiz.q.play": "Play",
    "quiz.q.submit": "Submit",
    "quiz.q.next": "Next",
    "quiz.q.correct": "✅ Correct",
    "quiz.q.wrong": "❌ Wrong, the answer was",
    "quiz.q.progress": "Question {{cur}} / {{total}}",
    "quiz.done.title": "Quiz Done",
    "quiz.done.score": "Correct {{correct}} / {{total}}",
    "quiz.done.again": "Another set",
    "quiz.done.back": "Back to Quiz Center",
    "quiz.empty": "No words to quiz yet. Study some first!",

    // ====== Bookmarks ======
    "bookmark.add": "Bookmark",
    "bookmark.remove": "Unbookmark",
    "bookmark.toastAdd": "Added to bookmarks",
    "bookmark.toastRemove": "Removed from bookmarks",
    "bookmark.page.title": "My Bookmarks",
    "bookmark.page.empty": "No bookmarks yet. Browse the wordbook and save some favorites.",

    // ====== Search suggestion ======
    "search.suggestion": "Did you mean:",

    // ====== 404 ======
    "notFound.title": "Entry not found",
    "notFound.desc":
      "Maybe the spelling is off, or this word isn't in the book yet.",
    "notFound.browse": "Browse Wordbook",
    "notFound.home": "Back Home",
  },
} as const;

export type Lang = "zh" | "en";
export type DictKey = keyof (typeof dict)["zh"];
