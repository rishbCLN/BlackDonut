export type ProjectImageAsset = {
	src: string;
	alt: string;
};

export type ProjectMediaTemplate = {
	assetDirectory: string;
	coverImage: ProjectImageAsset | null;
	gallery: ProjectImageAsset[];
	expectedFiles: string[];
};

export type ProjectRecord = {
	id: string;
	number: string;
	slug: string;
	client: string;
	year: string;
	title: string;
	description: string;
	tags: string[];
	metric: string;
	metricLabel: string;
	preview: string;
	accent: string;
	media: ProjectMediaTemplate;
};

const PROJECTS: ProjectRecord[] = [
	{
		id: "nova-fintech",
		number: "01",
		slug: "nova-fintech",
		client: "Nova Fintech",
		year: "2024",
		title: "Digital banking\nwith less friction",
		description: "A launch system for a fintech product that reduced onboarding drop-off by 64% by removing visual noise and making every next step obvious.",
		tags: ["Product UX", "Motion design", "Launch site"],
		metric: "64%",
		metricLabel: "drop-off reduced",
		preview: "linear-gradient(135deg, rgba(126,242,255,0.16), rgba(183,124,255,0.08) 42%, rgba(10,7,20,0.1) 100%)",
		accent: "#7ef2ff",
		media: {
			assetDirectory: "/projects/nova-fintech/",
			coverImage: null,
			gallery: [],
			expectedFiles: ["cover.webp", "shot-01.webp", "shot-02.webp"],
		},
	},
	{
		id: "terraki",
		number: "02",
		slug: "terraki",
		client: "Terraki",
		year: "2023",
		title: "A climate brand\nthat can scale",
		description: "Identity, motion language, and launch collateral for a climate-tech team that needed to look investor-ready without losing warmth.",
		tags: ["Identity", "Deck system", "Campaign motion"],
		metric: "3x",
		metricLabel: "investor interest",
		preview: "linear-gradient(135deg, rgba(255,118,207,0.14), rgba(183,124,255,0.1) 48%, rgba(10,7,20,0.12) 100%)",
		accent: "#ff76cf",
		media: {
			assetDirectory: "/projects/terraki/",
			coverImage: null,
			gallery: [],
			expectedFiles: ["cover.webp", "shot-01.webp"],
		},
	},
	{
		id: "lume",
		number: "03",
		slug: "lume",
		client: "Lume",
		year: "2024",
		title: "An editor that\nfeels cinematic",
		description: "A WebGL-heavy product surface for AI-assisted creation, shipped in 14 weeks with a visual layer that made the product feel instantly premium.",
		tags: ["WebGL", "AI tools", "Full-stack build"],
		metric: "7K",
		metricLabel: "users day one",
		preview: "linear-gradient(135deg, rgba(183,124,255,0.18), rgba(126,242,255,0.08) 44%, rgba(10,7,20,0.12) 100%)",
		accent: "#b77cff",
		media: {
			assetDirectory: "/projects/lume/",
			coverImage: null,
			gallery: [],
			expectedFiles: ["cover.webp", "shot-01.webp", "shot-02.webp", "shot-03.webp"],
		},
	},
];

export async function getFeaturedProjects(): Promise<ProjectRecord[]> {
	return PROJECTS;
}

export function getProjectBySlug(slug: string): Promise<ProjectRecord | undefined> {
	return Promise.resolve(PROJECTS.find((project) => project.slug === slug));
}
