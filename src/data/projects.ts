// 项目展示数据。新增项目只需在此追加一项即可，无需改动页面。
export interface Project {
	name: string;
	description: string;
	url: string;
	repo?: string;
	tags: string[];
	featured?: boolean;
	status: '活跃' | '维护' | '归档';
}

export const projects: Project[] = [
	{
		name: 'Tyou',
		description:
			'基于 Cocos Creator 3.8.7 与 TypeScript 的客户端框架，统一组织 UI、资源、事件、网络、配置表与编辑器生产链路，同时是一套面向 GPT-5.6 Sol 与 Codex 的 AI 原生工程样本。',
		url: 'https://github.com/xiayu519/Tyou',
		repo: 'xiayu519/Tyou',
		tags: ['Cocos Creator', 'TypeScript', 'AI 工作流', 'Codex', '框架'],
		featured: true,
		status: '活跃',
	},
];
