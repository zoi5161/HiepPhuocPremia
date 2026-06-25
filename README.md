# Hiệp Phước Premia — Landing page tĩnh

Landing page 1 dự án bất động sản, nội dung cứng, không backend. Form thu lead gửi
**thẳng** từ trình duyệt lên Google Sheets qua Apps Script Web App. Deploy trên Vercel.

- **Stack:** React + Vite + TailwindCSS v4
- **Nội dung:** tất cả nằm trong [`src/data/project.js`](src/data/project.js)
- **Giao diện:** [`src/components/LandingPage.jsx`](src/components/LandingPage.jsx)

## Chạy local

```bash
npm install
cp .env.example .env   # rồi dán URL Apps Script vào VITE_SHEETS_WEBHOOK_URL
npm run dev
```

> `.env` chỉ nạp lúc khởi động Vite — đổi xong phải restart `npm run dev`.

## Build

```bash
npm run build      # ra thư mục dist/
npm run preview    # xem thử bản build
```

## Kết nối Google Sheets (thu lead)

1. Tạo 1 Google Sheet mới.
2. Mở **Extensions → Apps Script**, dán toàn bộ [`apps-script.gs`](apps-script.gs), lưu.
3. **Deploy → New deployment → Web app** — *Execute as: Me*, *Who has access: Anyone*.
4. Copy URL kết thúc bằng `/exec`.
5. Dán URL vào `.env` (`VITE_SHEETS_WEBHOOK_URL`) **và** vào env của Vercel.

Lead ghi vào sheet `Leads` theo cột: Dự án · Thời gian · Tên khách · Số điện thoại · Nguồn.
Mỗi lần sửa code Apps Script phải Deploy lại bản version mới.

## Deploy Vercel

1. Push code lên GitHub.
2. Vercel → Import Project → preset **Vite** (Build `npm run build`, Output `dist`).
3. Settings → Environment Variables: thêm `VITE_SHEETS_WEBHOOK_URL`.
4. Deploy.

## ⚠️ Cần xác nhận trước khi đăng

Các trường đánh dấu `// XÁC NHẬN` / `// CẦN ĐIỀN` trong `src/data/project.js`:

- Giá & chính sách thanh toán (tham khảo thị trường T06/2026).
- Hỗ trợ lãi suất 0% trong 30 tháng.
- Tổng diện tích (tài liệu CĐT ghi 80ha; vài nguồn rao vặt ghi khác).
- Giá nhà phố 4 tầng và biệt thự (đang để "Liên hệ").

Ảnh hiện dùng ảnh tạm (Unsplash). Thay bằng ảnh thật của bộ tài liệu CĐT: đặt vào
`public/images/` rồi đổi đường dẫn trong `project.js` (component `Img` tự thử các đuôi
`.jpg/.png/.webp...` nếu bỏ đuôi), hoặc dán URL ảnh trực tiếp.
