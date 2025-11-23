export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { line } from "@/lib/line";

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type");
  const rawBody = await req.text(); // Webhook では必須

  // LINE Webhook のみ JSON パース
  const isLine = contentType?.includes("application/json");

  if (!isLine) {
    // Stripe / PayPay / その他 Webhook が来ても落とさない
    console.log("Non-LINE webhook received");
    return new Response("ok", { status: 200 });
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch (e) {
    console.error("LINE Webhook JSON parse error:", e);
    return new Response("invalid json", { status: 400 });
  }

  // LINE events の処理
  for (const event of body.events ?? []) {
    if (event.type === "message" && event.message.type === "text") {
      const text = event.message.text.trim();

      // 「急募 3人 10〜15 時給1200」みたいなフォーマット
      const m = text.match(
        /急募\s*(\d+)\s*人?\s*(\d+)[~\-～]\s*(\d+)\s*時給\s*(\d+)/i
      );

      if (m) {
        const [_, people, start, end, pay] = m;

        try {
          // Supabase 登録
          await supabase.from("jobs").insert({
            shop_line_id: event.source.userId,
            required_people: Number(people),
            start_time: `${start.padStart(2, "0")}:00`,
            end_time: `${end.padStart(2, "0")}:00`,
            hourly_pay: Number(pay),
            status: "open",
          });

          // LINE 返信
          await line.reply(
            event.replyToken,
            `NiSe: ${people}人 ${start}-${end}時 時給${pay}円 で募集開始`
          );
        } catch (e) {
          console.error("LINE job insert or reply error:", e);
        }
      }
    }
  }

  return NextResponse.json({ ok: true });
}
