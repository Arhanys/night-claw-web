"use server"

import { Resend } from "resend"

export interface ContactState {
  status: "idle" | "success" | "error"
  message?: string
}

export async function sendContactEmail(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name    = (formData.get("name")    as string | null)?.trim() ?? ""
  const email   = (formData.get("email")   as string | null)?.trim() ?? ""
  const subject = (formData.get("subject") as string | null)?.trim() ?? ""
  const body    = (formData.get("message") as string | null)?.trim() ?? ""

  if (!name || !email || !subject || !body) {
    return { status: "error", message: "Please fill in all fields." }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please enter a valid email address." }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from:     "NightClaw Contact <contact@nightclaw.dev>",
      to:       "ahranys@nightclaw.dev",
      reply_to: `${name} <${email}>`,
      subject:  `[Contact] ${subject}`,
      text:     `From: ${name} <${email}>\nSubject: ${subject}\n\n${body}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#08090F;font-family:'Segoe UI',Arial,sans-serif;color:#E8EAF0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#08090F;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;">

        <!-- Header -->
        <tr><td style="background:#0D0F17;border:1px solid rgba(255,255,255,0.06);border-radius:16px 16px 0 0;padding:32px 36px;text-align:center;">
          <div style="font-size:24px;font-weight:800;letter-spacing:-0.5px;">
            Night<span style="background:linear-gradient(135deg,#8B5CF6,#22D3EE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Claw</span>
          </div>
          <div style="margin-top:8px;font-size:13px;color:#6B7280;">New message from the contact form</div>
        </td></tr>

        <!-- Fields -->
        <tr><td style="background:#0D0F17;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:0 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:28px;">

            <tr>
              <td style="padding-bottom:20px;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6B7280;margin-bottom:6px;">From</div>
                <div style="font-size:15px;color:#E8EAF0;">${name}</div>
                <div style="font-size:13px;color:#8B5CF6;margin-top:2px;">${email}</div>
              </td>
            </tr>

            <tr>
              <td style="padding-bottom:24px;border-top:1px solid rgba(255,255,255,0.04);padding-top:20px;">
                <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6B7280;margin-bottom:6px;">Subject</div>
                <div style="font-size:15px;color:#E8EAF0;">${subject.replace(/</g, "&lt;")}</div>
              </td>
            </tr>

          </table>
        </td></tr>

        <!-- Message -->
        <tr><td style="background:#0D0F17;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:0 36px 28px;">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6B7280;margin-bottom:10px;">Message</div>
          <div style="background:#13151E;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:20px 24px;font-size:14px;line-height:1.7;color:#C9CBD4;white-space:pre-wrap;">${body.replace(/</g, "&lt;")}</div>
        </td></tr>

        <!-- Reply button -->
        <tr><td style="background:#0D0F17;border-left:1px solid rgba(255,255,255,0.06);border-right:1px solid rgba(255,255,255,0.06);padding:0 36px 32px;text-align:center;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}"
             style="display:inline-block;background:linear-gradient(135deg,#8B5CF6,#7C3AED);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 32px;border-radius:10px;letter-spacing:0.2px;">
            Reply to ${name}
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0D0F17;border:1px solid rgba(255,255,255,0.06);border-top:1px solid rgba(255,255,255,0.04);border-radius:0 0 16px 16px;padding:20px 36px;text-align:center;">
          <div style="font-size:12px;color:#4B5563;">NightClaw · nightclaw.dev</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })

    return { status: "success" }
  } catch (err) {
    console.error("[contact] resend error:", err)
    return { status: "error", message: "Failed to send message. Please try again later." }
  }
}
