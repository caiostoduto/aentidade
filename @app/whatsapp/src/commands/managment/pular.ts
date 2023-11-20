import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'
import { reshuffleParticipante } from '../../utils/misc'

export default class Pular implements WhatsAppCommand {
  name = 'pular'
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async run (msgInfo: proto.IWebMessageInfo): Promise<void> {
    assert(this.bot.sock !== undefined && (msgInfo.key.remoteJid != null) && (msgInfo.key.participant != null))
    await this.bot.sock.readMessages([msgInfo])

    const participantId = msgInfo.key.participant

    const timeNum = this.bot.partidas[this.bot.partidas.length - 1]?.times
      .findIndex(t => t.get(participantId))

    if (timeNum !== -1 && timeNum !== undefined) {
      await reshuffleParticipante(this.bot, participantId, timeNum)

      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}!! ✨\n\n` +
          'Você pulou sua vez na partida atual!\n\n' +
          'Caso deseje sair da fila use o comando "*/sair*"'
        })
    } else {
      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}!! ✨\n\n` +
          'Você não está participando da partida atual!\n\n' +
          'Caso deseje sair da fila use o comando "*/sair*"'
        })
    }
  }
}
