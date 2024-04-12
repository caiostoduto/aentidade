import assert from "node:assert";
import type { proto } from "@whiskeysockets/baileys";
import type { WhatsAppBot } from "../bot";
import { Roles } from "../commands/commandHandler";

export function getArgs(msgInfo: proto.IWebMessageInfo): string[] {
	assert(msgInfo.message?.conversation);

	return msgInfo.message.conversation.split(" ");
}

export function getRole(
	bot: WhatsAppBot,
	msgInfo: proto.IWebMessageInfo,
): Roles {
	const coordenadores = bot.settings.coordinators;

	if (coordenadores?.includes(msgInfo.key.participant as string)) {
		return Roles.COORDENADOR;
	}

	return Roles.PARTICIPANTE;
}
