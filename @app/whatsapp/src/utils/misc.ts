import assert from "node:assert";
import type { Participant, WhatsAppBot } from "../bot";

export async function shuffleParticipante(
	bot: WhatsAppBot,
	participanteJid: string,
	timeNum: number,
): Promise<void> {
	bot.matches[bot.matches.length - 1]?.teams[timeNum].delete(participanteJid);
	bot.matches[bot.matches.length - 1]?._excluded.push(participanteJid);

	const participantsMatch = bot.matches[bot.matches.length - 1].teams
		.map((t) => [...t.entries()].map((p) => p[0]))
		.reduce((a, b) => a.concat(b), []);

	// Not in match, not in excluded, participating
	const outsideMatchParticipants = [...bot.participants.entries()].filter(
		(p) =>
			!participantsMatch.includes(p[0]) &&
			!bot.matches[bot.matches.length - 1]?._excluded.includes(p[0]) &&
			p[1].participating,
	);

	const newParticipant = outsideMatchParticipants
		.sort(() => Math.random() - 0.5)
		.sort((a, b) => a[1].queue - b[1].queue)[0];

	if (newParticipant !== undefined) {
		bot.matches[bot.matches.length - 1].teams[timeNum].set(
			newParticipant[0],
			newParticipant[1],
		);

		await sendMessageConvocado(bot, newParticipant, timeNum);
	}
}

export async function sendMessageConvocado(
	bot: WhatsAppBot,
	participant: [string, Participant],
	teamNum: number,
): Promise<void> {
	assert(bot.sock);

	const participantjid = participant[0];
	const participantName = participant[1].name;
	const participantsTeam = [
		...bot.matches[bot.matches.length - 1].teams[teamNum].entries(),
	]
		.map((p) => p[1].name)
		.join(", ");

	await bot.sock.sendMessage(participantjid, {
		text: `Olá, ${participantName}!! ✨\nVocê foi convocado para jogar!\n\nSeu time (${
			teamNum + 1
		}) é: ${participantsTeam}\n\nCaso deseje pular essa partida use o comando '*/pular*'\nCaso deseje sair da fila use o comando '*/sair*'`,
	});
}
