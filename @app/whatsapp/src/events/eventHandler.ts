import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { type WhatsAppBot } from '../bot'
import { type BaileysEventMap } from '@whiskeysockets/baileys'
import type makeWASocket from '@whiskeysockets/baileys'
import assert from 'assert'

export default class WhatsAppEventHandler {
  bot: WhatsAppBot
  events = new Map<keyof BaileysEventMap, WhatsAppEvent[]>()

  constructor (bot: WhatsAppBot) {
    this.bot = bot
  }

  loadAll (): WhatsAppEventHandler {
    const eventDirs = readdirSync(__dirname)
      .filter((file) =>
        statSync(join(__dirname, file)).isDirectory())

    eventDirs.forEach((eventDir) => {
      const eventFiles = readdirSync(join(__dirname, eventDir))
        .filter((file) => file.endsWith('.ts'))

      eventFiles.forEach((eventFile) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const WhatsAppEvent = require(join(__dirname, eventDir, eventFile)).default

        this.events.set(eventDir as keyof BaileysEventMap,
          (this.events.get(eventDir as keyof BaileysEventMap) ?? [])
            .concat(new WhatsAppEvent(this.bot)))
      })
    })

    return this
  }

  updateEV (): void {
    [...this.events.entries()].forEach((event) => {
      assert(this.bot.sock !== undefined);

      (this.bot.sock)
        .ev.on(event[0] as keyof BaileysEventMap, (...args: any[]) => {
          event[1].forEach((event) => {
            if (event.enabled) {
              void event.handler(...args)
            }
          })
        })
    })
  }
}

export interface WhatsAppEvent {
  enabled: boolean
  handler: (...args: any[]) => Promise<void>
}
