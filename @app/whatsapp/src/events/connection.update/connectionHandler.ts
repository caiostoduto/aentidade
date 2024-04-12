import type { Boom } from "@hapi/boom";
import {
	type ConnectionState,
	DisconnectReason,
} from "@whiskeysockets/baileys";
import type { WhatsAppBot } from "../../bot";
import type { WhatsAppEvent } from "../eventHandler";

export default class SaveCreds implements WhatsAppEvent {
	enabled = true;
	bot: WhatsAppBot;

	constructor(bot: WhatsAppBot) {
		this.bot = bot;
	}

	async handler(update: Partial<ConnectionState>): Promise<void> {
		const { connection, lastDisconnect } = update;

		if (connection === "close") {
			const shouldReconnect =
				(lastDisconnect?.error as Boom)?.output?.statusCode !==
				DisconnectReason.loggedOut;

			console.log(
				"connection closed due to ",
				lastDisconnect?.error,
				", reconnecting ",
				shouldReconnect,
			);

			// reconnect if not logged out
			if (shouldReconnect) {
				await this.bot.connect();
			}
		} else if (connection === "open") {
			console.log("opened connection");
		}
	}
}
