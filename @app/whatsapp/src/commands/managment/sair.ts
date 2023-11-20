import { type proto } from '@whiskeysockets/baileys'
import { type WhatsAppBot } from '../../bot'
import { type WhatsAppCommand } from '../commandHandler'
import assert from 'assert'
import { reshuffleParticipante } from '../../utils/misc'

export default class Sair implements WhatsAppCommand {
  name = 'sair'
  enabled = true
  bot: WhatsAppBot

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  async run (msgInfo: proto.IWebMessageInfo): Promise<void> {
    assert(this.bot.sock !== undefined && (msgInfo.key.remoteJid != null) && (msgInfo.key.participant != null))
    await this.bot.sock.readMessages([msgInfo])

    const participantId = msgInfo.key.remoteJid

    const participante = this.bot.participantes.get(participantId)
    if (participante === undefined || !participante.participando) {
      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}!! ✨\n\n` +
          'Você não está participando dos sorteios dos times!'
        })
    } else {
      this.bot.participantes.set(msgInfo.key.remoteJid, {
        nome: msgInfo.pushName as string,
        participando: false,
        queue: participante?.queue ?? 0
      })

      const time = this.bot.partidas[this.bot.partidas.length - 1]?.times
        .findIndex(t => t.get(participantId))

      if (time !== -1 && time !== undefined) {
        await reshuffleParticipante(this.bot, participantId, time)
      }

      await this.bot.sock.sendMessage(
        msgInfo.key.remoteJid, {
          text:
          `Olá, ${msgInfo.pushName}!! ✨\n\n` +
          'Você saiu dos sorteios dos times!'
        })
    }
  }
}
