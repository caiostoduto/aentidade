import assert from "node:assert";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { BaileysEventMap } from "@whiskeysockets/baileys";
import type { WhatsAppBot } from "../bot";

export default class WhatsAppEventHandler {
	bot: WhatsAppBot;
	events = new Map<keyof BaileysEventMap, WhatsAppEvent[]>();

	constructor(bot: WhatsAppBot) {
		this.bot = bot;
	}

	loadAll(): WhatsAppEventHandler {
		const eventDirs = readdirSync(__dirname).filter((file) =>
			statSync(join(__dirname, file)).isDirectory(),
		);

		for (const eventDir of eventDirs) {
			const eventFiles = readdirSync(join(__dirname, eventDir)).filter((file) =>
				file.endsWith(".ts"),
			);

			for (const eventFile of eventFiles) {
				const WhatsAppEvent = require(
					join(__dirname, eventDir, eventFile),
				).default;

				this.events.set(
					eventDir as keyof BaileysEventMap,
					(this.events.get(eventDir as keyof BaileysEventMap) ?? []).concat(
						new WhatsAppEvent(this.bot),
					),
				);
			}
		}

		return this;
	}

	update(): void {
		for (const eventsKey of this.events.keys()) {
			assert(this.bot.sock !== undefined);

			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			this.bot.sock.ev.on(eventsKey, (...args: any[]) => {
				for (const event of this.events.get(eventsKey) ?? []) {
					if (event.enabled) {
						void event.handler(...args);
					}
				}
			});
		}
	}
}

export interface WhatsAppEvent {
	enabled: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	handler: (...args: any[]) => Promise<void>;
}
