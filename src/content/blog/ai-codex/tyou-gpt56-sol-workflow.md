---
title: 'Tyou 的 GPT-5.6 Sol 原生工作流'
description: '前言：不是给项目加一个 AI，而是把项目改造成 AI 能理解、能约束、能验证的系统。记录 Tyou 基于 GPT-5.6 Sol 与 Codex 的原生工程工作流。'
pubDate: 'Jul 17 2026'
updatedDate: 'Jul 17 2026'
category: 'AI 工程化'
tags: ['Tyou', 'Cocos Creator', 'GPT-5.6', 'Codex', 'AI 工作流', 'AGENTS.md']
project: 'Tyou'
featured: true
slug: 'tyou-gpt56-sol-workflow'
---


Tyou 是一个基于 Cocos Creator 3.8.7 与 TypeScript 的客户端框架。它解决的不只是 UI、资源、事件、网络和配置表问题，也在尝试回答另一个越来越现实的问题：当 AI 真正进入长期工程后，怎样让它不只“会写代码”，而是能够在复杂仓库中稳定地理解边界、执行任务并证明结果。

项目地址：<https://github.com/xiayu519/Tyou>

## 先说结论

我认为，AI 编程进入 GPT-5.6 Sol 这一阶段后，工程效率的上限已经不再取决于“提示词写得有多长”，而取决于仓库是否具备三种能力：

1. **可解释**：模型能快速知道项目是什么、当前任务属于哪个领域、哪些规则真正相关。
2. **可治理**：模型知道哪些事情可以直接做，哪些变化必须先对齐语义边界，哪些目录和契约不能擅自触碰。
3. **可验证**：模型完成任务后，能够通过测试、构建、结构检查、资源解析或行为 eval 证明结果，而不是用一段看起来合理的总结宣布完成。

Tyou 当前的 Codex 工作流，就是围绕这三点重新设计的。

它不是在旧流程上把模型名替换成 `gpt-5.6-sol`，也不是把 OpenSpec、长提示词、全量文档和多代理全部堆上去。相反，它做的是一次主动减法：保留目标、边界、证据和决策价值，删除不再改变结果的仪式。

## Tyou 是什么

Tyou 是一个面向 Cocos Creator 3.8.7 的 TypeScript 客户端框架。运行时通过统一的 `tyou.*` 入口组织 UI、资源、事件、计时器、对象池、音频、场景、网络、HTTP、FSM、ECS、持久化、Luban 配表和多语言模块。

框架尤其重视客户端生产链路，而不只是运行时 API：

- 从 PSD 切图、节点结构导出，到 Cocos Creator 中还原 UI；
- 根据节点前缀检查并补齐正确组件；
- 自动生成 UI 类、字段绑定、事件注册、`UIName.ts` 与 `UIImportAll.ts`；
- 通过资源索引、引用计数和 Bundle 发现管理资源生命周期；
- 使用 Luban 源 Excel/Defines 生成二进制配置与多语言数据；
- 提供 Creator 扩展、Prefab/Scene 资产检查以及面向小游戏环境的 2D Shader 工作流。

如果只看功能，Tyou 是一个偏工程化、偏生产效率的 Cocos 客户端框架；如果看仓库组织，它也在尝试成为一个适合长期 AI 协作的工程样本。

## 当前 Codex 工作流长什么样

整个流程可以压缩成一条链：

```text
AGENTS 常驻规则
↓
Direct / Planned / Deep 风险路由
↓
按任务命中领域 Skill
↓
渐进加载最少 reference 与源码证据
↓
在授权边界内实施
↓
目标测试 / 构建 / 资源解析 / 生成器校验
↓
routing eval + outcome eval + workflow check
↓
同步必要文档与长期项目知识，然后停止
```

当前仓库固定使用 `gpt-5.6-sol`，日常 reasoning 为 `high`，官方 Plan mode 使用 `xhigh`，`max` 只用于最困难、质量优先且有明确评价标准的任务或 eval。原因很简单：reasoning 是成本与延迟资源，不是一个越高越正确的等级开关。

仓库目前有 10 个项目级 Skills，分别覆盖通用 Tyou 开发、Creator 扩展、Cocos 资产 JSON、Luban、本地化、2D Shader、文档查询与同步、轻量 SDD，以及图片资产流水线。Skill 只在任务命中后加载完整说明和必要 reference，避免每次对话都把整个项目手册塞进上下文。

常驻的 `AGENTS.md` 只保留真正必须长期生效的规则：项目定位、风险门槛、受保护目录、UI/Prefab 红线、TypeScript 约束和验证入口。更具体的规则放在对应目录的 `AGENTS.override.md`、Skill 或 reference 中。

这与 Codex 官方的 AGENTS 分层机制一致：Codex 从项目根目录向当前工作目录逐层发现指令，每层最多选择一份文件，越靠近目标目录的规则拥有更高优先级。换句话说，规则应当靠近它所保护的代码，而不是全部挤在一份全局超级提示词里。

## 为什么这套设计最贴合 GPT-5.6 Sol

### 1. 从“规定每一步”转向“定义什么叫完成”

GPT-5.6 的官方指导强调结果导向：给出目标、上下文、约束、所需证据、成功标准和输出格式，让模型自己选择有效路径，而不是机械规定每一次搜索、每一个工具和每一步思考。

Tyou 的工作流正是这样组织的。常驻规则不要求所有任务执行同一套仪式，而是先判断任务需要什么结果、有哪些真实风险、怎样验证。目标和路径已经明确的任务直接实施；只有需求、验收或设计存在会改变结果的不确定性时，才进入对齐阶段。

这不是减少严谨性，而是把严谨性从“流程长度”迁移到“结果契约”。

### 2. 用分层上下文替代无限增长的总提示词

旧式 AI 工程很容易走向一个误区：每次出现问题，就向总提示词里追加一条规则。最终提示词越来越长，同义约束互相重复，局部知识污染全局任务，模型需要先穿过大量无关内容才能开始工作。

Tyou 把上下文分成三层：

- `AGENTS.md` 保存跨任务稳定生效的工程不变量；
- Skill 负责领域路由、工作流和工具入口；
- reference 只在当前任务确实需要时渐进加载。

这恰好利用了 GPT-5.6 更强的意图理解和任务路由能力。模型不需要提前背完整个仓库，但必须能在需要时找到正确的规则和源码证据。

### 3. 授权边界比“请谨慎”更有效

能力越强的模型，越不能只用一句“请谨慎修改”约束它。真正有效的是明确区分：只读查询、诊断、普通实施、公共契约变化、受保护框架修改、外部写入和破坏性操作分别授权到什么程度。

Tyou 使用 Direct、Planned、Deep 三个风险标签：

- **Direct**：目标、行为、路径和验证都明确，且不改变公共语义，可直接实施；
- **Planned**：存在会改变结果的需求、验收或设计不确定性，先用轻量 Change Contract 对齐；
- **Deep**：涉及框架、公共契约、schema、生成规则、工作流语义、受保护边界或高回滚成本，必须先明确批准。

这里的关键不是标签本身，而是让模型知道什么时候应该自主推进，什么时候必须停下来。GPT-5.6 的主动性因此不会被压制，也不会越过工程边界。

### 4. 不把新能力默认变成新复杂度

GPT-5.6 提供了 `max` reasoning、Programmatic Tool Calling、多代理、显式缓存和 persisted reasoning 等能力，但“可用”不等于“应该全局开启”。

官方指导明确建议在代表性任务上比较效果，而不是假设最高 effort 永远最好；PTC 也只适合边界明确、可预测处理大量中间结果的阶段，多次工具调用本身并不构成启用理由。

因此 Tyou 不默认开启这些能力：日常任务使用 `high`，Plan mode 使用 `xhigh`，`max` 只显式用于最难任务或 eval；多代理和 PTC 只有在任务能够干净拆分、并且确实降低总成本或墙钟时间时才采用。

这是一种很重要的工程判断：**先进能力应该按问题形状启用，而不是按版本号启用。**

### 5. 让模型接受回归测试，而不是接受信任

Prompt 不是配置文件，它会受到模型版本、上下文和工具环境影响。因此 Tyou 为 Codex 工作流本身也建立了测试：

- workflow checker 检查 Skills、AGENTS、配置、单一规则源和遗留路径；
- routing eval 检查任务是否选择正确模式、确认状态和 Skill 集合；
- outcome eval 在隔离 fixture 中检查只读任务是否保持只读、明确任务是否少问、空搜索是否有限 fallback、完成后是否停止；
- 业务修改仍然运行真实的模块测试、构建、资源解析或生成器验证。

当前 workflow checker 共 41 项检查全部通过；routing eval 配置了 smoke/full 用例，outcome eval 也有独立的 smoke/full 行为回归。

真正稳定的 AI 工作流不是“提示词看起来很完整”，而是模型行为发生变化时，你能知道哪里变了。

## 为什么舍弃以前的 OpenSpec 仓库

先说我的观点：OpenSpec 没有错，正式 Spec 也不会过时。对于多人协作、跨团队接口、审计合规、长周期产品设计和高成本迁移，proposal/design/tasks/spec/archive 仍然有价值。

但一个工具是否先进，不取决于它能覆盖多少流程，而取决于它是否匹配当前团队、模型和风险结构。

Tyou 当前是单人开发，模型固定为 GPT-5.6 Sol。旧 OpenSpec 链路要求大量任务在实施前后维护 proposal、design、tasks、spec、run report 和 archive。它带来了几个实际问题：

### 1. 同一语义被维护多次

用户需求、对话中的批准、proposal、design、tasks、spec、代码和最终报告可能同时描述同一件事。文件越多并不自动意味着约束越强，反而增加了状态漂移：代码已经改变，某一层文档却仍停留在旧结论。

### 2. 小任务持续支付规格税

很多 Cocos 客户端任务的目标与实现路径非常明确，例如修复一个资源引用、调整一个 Creator 扩展入口、修改一个 Prefab 字段或补一条配置校验。强制进入完整 Spec 生命周期，会让流程成本超过任务本身。

### 3. 仪式掩盖了真正需要确认的东西

真正重要的不是有没有 proposal 文件，而是开发者是否理解并批准了：用户可见结果、成功标准、允许改变的范围、受保护边界、失败行为和重新对齐条件。

因此 Tyou 没有放弃 Spec 的决策价值，而是把它压缩成轻量 Change Contract：

```text
Goal / user-visible outcome
Success criteria
Allowed changes and protected boundaries
Recommended design（需要方案选择时）
Validation and failure/rollback behavior
Stop / re-alignment conditions
```

只有当答案真的会改变结果时才对齐；同一契约已经批准后不重复确认；任务结束后不保留没有长期价值的流水账。

### 4. GPT-5.6 更适合“语义合同 + 自主实施”

更早的模型往往需要把过程拆得很细，才能降低跑偏概率。GPT-5.6 的意图理解、工具使用和持续执行能力更强，继续强制模型逐项展开机械步骤，可能反而压缩它选择更优实现路径的空间。

所以这次迁移不是“不要 Spec”，而是：

> **保留 Spec 的功能，删除 Spec 的仪式；保留决策证据，删除重复状态；保留风险门禁，删除所有任务一刀切的流程。**

## 新旧工作流的核心差异

| 维度 | 旧 OpenSpec 链路 | 当前 GPT-5.6 Sol 原生工作流 |
| --- | --- | --- |
| 任务入口 | 先进入统一 Spec 生命周期 | 先判断真实语义风险 |
| 上下文 | proposal/design/tasks/spec 多层展开 | AGENTS + Skill + 最少 reference |
| 确认机制 | 依赖阶段和文件状态 | 依赖用户结果与 Change Contract |
| 小任务成本 | 仍需维护多个 artifact | 目标明确即可 Direct |
| 高风险任务 | 完整 Spec | Deep + 明确批准 + 真实验证 |
| 完成证据 | 文档与 run report | 测试、构建、解析、生成器与 eval |
| 长期知识 | archive/spec 持续积累 | 稳定规则进 AGENTS/reference，少量决策进 Project Knowledge |
| 停止条件 | 流程阶段结束 | 请求结果和必要验证已经交付 |

## 这套工作流适合谁

它尤其适合以下项目：

- 单人或小团队长期维护的真实工程；
- 有明确框架边界、生成链路和编辑器工具的仓库；
- 希望 AI 能直接实施，但不希望它随意改公共契约；
- 更看重实际验证，而不是 AI 生成的漂亮总结；
- 愿意为高风险变化保留设计对齐，但不想让每个小任务都进入重量级流程。

它不试图证明所有团队都应该移除 OpenSpec。恰恰相反，这套设计强调：流程必须服从风险结构。多人审批、法规审计、跨组织协作和长期兼容承诺，可能仍需要更正式的 Spec 系统。

## 最后

Tyou 最初只是一个 Cocos Creator 客户端框架，现在它逐渐变成了两套工程能力的结合：

一套面向游戏客户端，解决 UI、资源、事件、网络、配置、编辑器扩展和 PSD 到 UI 的生产效率；另一套面向 AI 协作，解决上下文、授权、风险、验证和长期知识治理。

我越来越确信，未来优秀的 AI 原生项目不会以“用了哪个模型”作为核心卖点。真正形成差距的是：

> **项目是否能够把隐性的工程经验，转化为模型可以按需加载的规则；把开发者的偏好，转化为清晰的授权边界；把“应该没问题”，转化为可重复执行的验证。**

模型会继续升级，但一个可解释、可治理、可验证的仓库不会过时。

如果你正在使用 Cocos Creator，或者也在研究 GPT-5.6 Sol 时代的 Codex 工程工作流，欢迎交流。

## 参考

- OpenAI，GPT-5.6 Prompt Guidance：<https://developers.openai.com/api/docs/guides/prompt-guidance-gpt-5p6>
- OpenAI，Codex AGENTS.md 分层项目指令：<https://developers.openai.com/codex/guides/agents-md#layer-project-instructions>
- Tyou Codex 开发工作流：<https://github.com/xiayu519/Tyou/blob/main/Books/AI-Development-Workflow.md>
