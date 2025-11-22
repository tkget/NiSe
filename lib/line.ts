import axios from 'axios'

export const line = {
  reply: async (token: string, msg: string) => {
    if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) return { status: 'skipped' }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    }
    return await axios.post('https://api.line.me/v2/bot/message/reply', { replyToken: token, messages: [{ type: 'text', text: msg }] }, { headers })
  },
  push: async (to: string, msg: string) => {
    if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) return { status: 'skipped' }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
    }
    return await axios.post('https://api.line.me/v2/bot/message/push', { to, messages: [{ type: 'text', text: msg }] }, { headers })
  }
}