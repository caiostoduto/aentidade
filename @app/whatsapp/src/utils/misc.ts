import assert from 'assert'
import { type WhatsAppBot, type Participante } from '../bot'

export async function reshuffleParticipante (bot: WhatsAppBot, participanteId: string, timeNum: number): Promise<void> {
  const participantesPartida = bot.partidas[bot.partidas.length - 1].times
    .map((t) => [...t.entries()].map((p) => p[0]))
    .reduce((a, b) => a.concat(b), [])

  console.log(participantesPartida)

  const otherParticipantes = [...bot.participantes.entries()]
    .filter((p) =>
      !participantesPartida.includes(p[0]) &&
      !bot.partidas[bot.partidas.length - 1]?._excluded.includes(p[0]) &&
      p[1].participando
    )

  console.log(otherParticipantes)

  const newParticipante = otherParticipantes
    .sort(() => Math.random() - 0.5)
    .sort((a, b) => a[1].queue - b[1].queue)[0]

  console.log(newParticipante)

  bot.partidas[bot.partidas.length - 1]?.times[timeNum].delete(participanteId)
  bot.partidas[bot.partidas.length - 1]?._excluded.push(participanteId)

  if (newParticipante !== undefined) {
    bot.partidas[bot.partidas.length - 1].times[timeNum].set(newParticipante[0], newParticipante[1])

    await sendMessageConvocado(bot, newParticipante, timeNum)
  }
}

export async function sendMessageConvocado (bot: WhatsAppBot, participante: [string, Participante], timeNum: number): Promise<void> {
  assert(bot.sock !== undefined)

  await bot.sock.sendMessage(
    participante[0], {
      text:
      `Olá, ${participante[1].nome}!! ✨\n` +
      'Você foi convocado para jogar!\n\n' +
      `Seu time (${timeNum + 1}) é: ${[...bot.partidas[bot.partidas.length - 1].times[timeNum].entries()].map((p) => p[1].nome).join(', ')}\n\n` +
      'Caso deseje pular essa partida use o comando "*/pular*"\n' +
      'Caso deseje sair da fila use o comando "*/sair*"'
    })
}
