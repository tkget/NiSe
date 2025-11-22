import axios from 'axios'
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
}
export const line = {
  reply: (token: string, msg: string) => axios.post('https://api.line.me/v2/bot/message/reply', { replyToken: token, messages: [{ type: 'text', text: msg }] }, { headers }),
  push: (to: string, msg: string) => axios.post('https://api.line.me/v2/bot/message/push', { to, messages: [{ type: 'text', text: msg }] }, { headers })
}
