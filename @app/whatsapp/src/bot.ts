import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import WhatsAppEventHandler from './events/eventHandler'
import WhatsAppCommandHandler from './commands/commandHandler'
import assert from 'assert'

export class WhatsAppBot {
  authstate: Awaited<ReturnType<typeof useMultiFileAuthState>> | undefined
  eventHandler: WhatsAppEventHandler
  commandHandler: WhatsAppCommandHandler
  sock: ReturnType<typeof makeWASocket> | undefined
  participantes = new Map<string, Participante>()

  constructor () {
    this.commandHandler = new WhatsAppCommandHandler(this).loadAll()
    this.eventHandler = new WhatsAppEventHandler(this).loadAll()
  }

  private async loadAuth (): Promise<void> {
    // utility function to help save the auth state in a single folder
    // this function serves as a good guide to help write auth & key states for SQL/no-SQL databases, which I would recommend in any production grade system
    this.authstate = await useMultiFileAuthState('auth_info_baileys')
  }

  async connect (): Promise<void> {
    if (this.authstate === undefined) await this.loadAuth()
    assert(this.authstate !== undefined)

    // will use the given state to connect
    // so if valid credentials are available -- it'll connect without QR
    this.sock = makeWASocket({
      auth: (this.authstate).state,
      printQRInTerminal: process.env.NODE_ENV === 'development'
    })

    this.eventHandler.updateEV()
  }
}

export interface Participante {
  nome: string
  participando: boolean
  queue: number
}
