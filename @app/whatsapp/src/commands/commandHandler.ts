import assert from "node:assert";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { proto } from "@whiskeysockets/baileys";
import type { WhatsAppBot } from "../bot";
import type { MessagesUpsertEvent } from "../events/messages.upsert/messageHandler";

export default class WhatsAppCommandHandler {
	bot: WhatsAppBot;
	commands = new Map<CommandCategory, WhatsAppCommand[]>();

	constructor(bot: WhatsAppBot) {
		this.bot = bot;
	}

	loadAll(): WhatsAppCommandHandler {
		const commandDirs = readdirSync(__dirname).filter((file) =>
			statSync(join(__dirname, file)).isDirectory(),
		);

		for (const commandDir of commandDirs) {
			const commandFiles = readdirSync(join(__dirname, commandDir)).filter(
				(file) => file.endsWith(".ts"),
			);

			for (const commandFile of commandFiles) {
				const WhatsAppCommand = require(
					join(__dirname, commandDir, commandFile),
				).default;

				this.commands.set(
					commandDir,
					(this.commands.get(commandDir) ?? []).concat(
						new WhatsAppCommand(this.bot),
					),
				);
			}
		}

		return this;
	}

	async onMessageUpsert(msgEvent: MessagesUpsertEvent): Promise<void> {
		if (msgEvent.type !== "notify") return;
		assert(this.bot.sock);

		console.log(JSON.stringify(msgEvent));

		for (const msgInfo of msgEvent.messages) {
			if (msgInfo.message?.conversation == null) return;
			const text = msgInfo.message.conversation;

			if (!text.startsWith(this.bot.settings.prefix)) return;

			await [...this.commands.values()]
				.reduce((acc, val) => acc.concat(val), [])
				.find((cmd) => cmd.enabled && cmd.name === text.split(" ")[0].slice(1))
				?.run(msgInfo);
		}
	}
}

type CommandCategory = string;

export interface WhatsAppCommand {
	name: string;
	enabled: boolean;
	run: (msgInfo: proto.IWebMessageInfo) => Promise<void>;
}

export enum Roles {
	PARTICIPANTE = 0,
	COORDENADOR = 1,
}
