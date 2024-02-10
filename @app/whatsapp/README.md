aentidade [WhatsApp](https://whatsapp.com/) bot using [Baileys](https://github.com/WhiskeySockets/Baileys)

# Features

## WhatsApp

- [x] (WhatsApp) Shuffling participants to create equivalent teams
- [x] (WhatsApp) Notifies participants of their team
- [x] (WhatsApp) Notifies participants of the next round
- [x] (WhatsApp) Option to left or skip the current round
- [x] (WhatsApp) Every participant play the same amount of games

### Commands

- `/participar` - Join the queue
- `/sair` - Leave the queue
- `/pular` - Skip the current round
- `/sortear` - Shuffle participants to create equivalent teams

# Getting Started

1. Clone the repository
```bash
$ git clone git@github.com:caiostoduto/aentidade.git
```

2. Install dependencies
```bash
$ pnpm whatsapp install
```

3. Rename @app/whatsapp/settings.example.json to settings.json and fill the fields
```JSON
{
  "coordinators":["<your_number>@s.whatsapp.net"],
  "prefix":"/"
}
```

4. Start the WhatsApp bot
```bash
$ pnpm whatsapp start
```

5. (*Only first time*) Scan the QR code on your terminal with your phone
![Image from WhatsApp app 'Scan QR Code'](https://github.com/caiostoduto/aentidade/blob/main/@app/whatsapp/docs/images/scanning_qrcode.jpeg)
