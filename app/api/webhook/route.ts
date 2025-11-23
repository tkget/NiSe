export const runtime = "nodejs";
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { line } from '@/lib/line'

export async function POST(req: Request) {
  const body = await req.json()
  for (const event of body.events ?? []) {
    if (event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text.trim()
      const m = text.match(/急募\s*(\d+)\s*人?\s*(\d+)[~\-～]\s*(\d+)\s*時給\s*(\d+)/i)
      if (m) {
        const [_, people, start, end, pay] = m
        await supabase.from('jobs').insert({
          shop_line_id: event.source.userId,
          required_people: Number(people),
          start_time: `${start.padStart(2,'0')}:00`,
          end_time: `${end.padStart(2,'0')}:00`,
          hourly_pay: Number(pay),
          status: 'open'
        })
        await line.reply(event.replyToken, `NiSe: ${people}人 ${start}-${end}時 時給${pay}円 で募集開始`)
      }
    }
  }
  return NextResponse.json({ ok: true })
}
