import { readFileSync, writeFileSync } from "node:fs";

export default class Settings {
	private readonly settingsPath = process.env.SETTINGS_PATH ?? "settings.json";

	coordinators: string[] = [];
	prefix: string;

	constructor() {
		let obj: SettingsOBJ;
		try {
			obj = JSON.parse(readFileSync(this.settingsPath, "utf-8"));
		} catch (e) {
			obj = {};
		}

		this.coordinators = obj.coordinators?.map((c) => c.trim()) ?? [];
		this.prefix = obj.prefix ?? "/";
	}

	save(): void {
		const obj: SettingsOBJ = {
			coordinators: this.coordinators,
			prefix: this.prefix,
		};

		writeFileSync(this.settingsPath, JSON.stringify(obj, null, 2));
	}
}

interface SettingsOBJ {
	coordinators?: string[];
	prefix?: string;
}
