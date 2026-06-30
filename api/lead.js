// Vercel Serverless Function — API trung gian nhận lead rồi chuyển sang Google Apps Script.
// Mục đích: client gửi về /api/lead (same-origin), URL Apps Script được giấu ở server
// (biến môi trường) → Google Ads không thấy client gửi data ra domain ngoài.
//
// Biến môi trường trên Vercel: SHEETS_WEBHOOK_URL (hoặc dùng lại VITE_SHEETS_WEBHOOK_URL đã có).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const webhook =
    process.env.SHEETS_WEBHOOK_URL || process.env.VITE_SHEETS_WEBHOOK_URL
  if (!webhook) {
    return res.status(500).json({ ok: false, error: 'Webhook chưa cấu hình' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}

    // Chỉ chuyển tiếp đúng các trường cần thiết
    const payload = {
      projectName: String(body.projectName || ''),
      createdAt: String(body.createdAt || new Date().toLocaleString('vi-VN')),
      name: String(body.name || '').slice(0, 120),
      phone: String(body.phone || '').replace(/[^\d]/g, '').slice(0, 11),
      source: String(body.source || ''),
    }

    await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(502).json({ ok: false, error: 'Gửi không thành công' })
  }
}
