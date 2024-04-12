import assert from "node:assert";
import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import WhatsAppCommandHandler from "./commands/commandHandler";
import WhatsAppEventHandler from "./events/eventHandler";
import Settings from "./utils/settings";

export class WhatsAppBot {
	settings = new Settings();
	commandHandler = new WhatsAppCommandHandler(this).loadAll();
	eventHandler = new WhatsAppEventHandler(this).loadAll();

	authstate: Awaited<ReturnType<typeof useMultiFileAuthState>> | undefined;
	sock: ReturnType<typeof makeWASocket> | undefined;

	participants = new Map<string, Participant>();
	matches = new Array<Match>();

	private async loadAuth(): Promise<void> {
		// utility function to help save the auth state in a single folder
		// this function serves as a good guide to help write auth & key states for SQL/no-SQL databases, which I would recommend in any production grade system
		this.authstate = await useMultiFileAuthState("auth_info_baileys");
	}

	async connect(): Promise<void> {
		if (this.authstate === undefined) await this.loadAuth();

		this._makeWASocket();
		this.eventHandler.update();
	}

	private _makeWASocket(): void {
		assert(this.authstate !== undefined);

		// will use the given state to connect
		// so if valid credentials are available -- it'll connect without QR
		this.sock = makeWASocket({
			auth: this.authstate.state,
			printQRInTerminal: true,
		});
	}
}

type ParticipantJid = string;

export interface Participant {
	name: string;
	participating: boolean;
	queue: number;
}

export interface Match {
	teams: Array<Map<ParticipantJid, Participant>>;
	_excluded: ParticipantJid[];
}
