import assert from "node:assert";
import type { proto } from "@whiskeysockets/baileys";
import type { WhatsAppBot } from "../../bot";
import { getRole } from "../../utils/command";
import { sendMessageConvocado } from "../../utils/misc";
import { Roles, type WhatsAppCommand } from "../commandHandler";

export default class Sortear implements WhatsAppCommand {
	name = "sortear";
	enabled = true;
	bot: WhatsAppBot;

	constructor(bot: WhatsAppBot) {
		this.bot = bot;
	}

	async run(msgInfo: proto.IWebMessageInfo): Promise<void> {
		assert(this.bot.sock !== undefined && msgInfo.key.remoteJid);

		await this.bot.sock.readMessages([msgInfo]);

		const chatJid = msgInfo.key.remoteJid;
		const participantName = msgInfo.pushName as string;

		if (getRole(this.bot, msgInfo) !== Roles.COORDENADOR) {
			await this.bot.sock.sendMessage(chatJid, {
				text: `Olá, ${participantName}!! ✨\n\nVocê não tem permissão para usar esse comando!`,
			});

			return;
		}

		let participantes = [...this.bot.participants.entries()]
			.filter((p) => p[1].participating)
			.sort(() => Math.random() - 0.5)
			.sort((a, b) => a[1].queue - b[1].queue);

		if (participantes.length <= 1) {
			await this.bot.sock.sendMessage(chatJid, {
				text: `Olá, ${participantName}!! ✨\n\nNão há participantes suficientes para sortear!`,
			});

			return;
		}

		if (participantes.length >= 12) {
			participantes = participantes.slice(0, 12);
		} else if (participantes.length % 2 === 1) {
			participantes = participantes.slice(0, participantes.length - 1);
		}

		participantes = participantes.sort(() => Math.random() - 0.5);
		const time0 = participantes.slice(0, participantes.length / 2);
		const time1 = participantes.slice(participantes.length / 2);

		this.bot.matches.push({
			teams: [new Map(time0), new Map(time1)],
			_excluded: [],
		});

		await this.bot.sock.sendMessage(chatJid, {
			text:
				`Olá, ${participantName}!! ✨\n\n` +
				`Time 1: ${time0.map((p) => p[1].name).join(", ")}\n` +
				`Time 2: ${time1.map((p) => p[1].name).join(", ")}`,
		});

		for (const [i, t] of [time0, time1].entries()) {
			for (const p of t) {
				p[1].queue++;

				await sendMessageConvocado(this.bot, p, i);
			}
		}
	}
}
