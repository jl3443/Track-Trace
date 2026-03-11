import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
  try {
    const { to, cc, bcc, subject, body } = await req.json()

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields: to, subject, body" }, { status: 400 })
    }

    const user = process.env.GMAIL_USER
    const pass = process.env.GMAIL_APP_PASSWORD

    if (!user || !pass) {
      return NextResponse.json(
        { error: "Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local" },
        { status: 500 },
      )
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    })

    const info = await transporter.sendMail({
      from: `Shipment Tracking Agent <${user}>`,
      to,
      cc: cc || undefined,
      bcc: bcc || undefined,
      subject,
      html: body,
    })

    return NextResponse.json({ success: true, messageId: info.messageId })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Email send error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
