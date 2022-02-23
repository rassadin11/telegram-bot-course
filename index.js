import TelegramApi from 'node-telegram-bot-api'
import { againOptions, gameOptions } from './options.js'

const token = '5122395412:AAHJlODiyWuriXkgOhiH73_SX9IXdaGrV5E'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Let's go play. I wished one number between 0 and 9. Can you guess it number?`,
  )

  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber

  return bot.sendMessage(chatId, 'Guess it', gameOptions)
}

function start() {
  bot.setMyCommands([
    { command: '/start', description: 'Start message' },
    { command: '/info', description: 'Get info about me' },
    { command: '/game', description: 'Do you want to play game?' },
  ])

  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      return bot.sendMessage(chatId, `Welcome! I'm glad to see you here =)`)
    }

    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Your name: ${msg.from.first_name} ${msg.from.last_name}`,
      )
    }

    if (text === '/game') {
      return startGame(chatId)
    }

    return bot.sendMessage(chatId, `I don't understand you =(, I'm not a human`)
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return startGame(chatId)
    }

    if (+data === chats[chatId]) {
      await bot.sendMessage(chatId, `You are right! Congrats!!!`, againOptions)
    } else {
      await bot.sendMessage(chatId, `No =(, repeat plz`)
    }
  })
}

start()
