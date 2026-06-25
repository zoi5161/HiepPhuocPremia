# CONTEXT: Dựng landing page bất động sản (bản TĨNH, 1 dự án, thông tin cứng)

Dán toàn bộ file này vào 1 session Claude Code mới để dựng lại từ đầu.

---

## 0. Mục tiêu & kiến trúc
Dựng 1 landing page giới thiệu **1 dự án bất động sản** với **nội dung cứng** (hardcode trong code, không CMS, không database).

- **Stack:** React + Vite + TailwindCSS v4. KHÔNG có backend.
- **Thu lead:** form (tên + SĐT) gửi **trực tiếp** lên Google Sheets qua **Apps Script Web App** (fetch thẳng từ browser, không qua server trung gian).
- **Deploy:** chỉ Vercel (web tĩnh). Không Render, không MongoDB → không cold-start.
- Nội dung dự án để trong 1 file `src/data/project.js` (1 object), render bằng `<LandingPage project={data} />`.

## 1. Khởi tạo
- Vite + React, TailwindCSS v4 qua plugin `@tailwindcss/vite`. File CSS: `@import "tailwindcss";` + khối `@theme` định nghĩa biến màu.
- `@theme` tokens: `--color-brand` (xanh rêu #0f3d2e), `--color-brand-light` (#1b5e44), `--color-gold` (#c9a86a), `--color-gold-dark` (#a9883f), font `Be Vietnam Pro`.
- `html { scroll-behavior: smooth }`. **Quan trọng:** Tailwind v4 để con trỏ nút là mũi tên → thêm CSS `button:not(:disabled), [role=button], a { cursor: pointer }`.
- Biến môi trường (file `.env`, gitignore): `VITE_SHEETS_WEBHOOK_URL` (URL Apps Script), `VITE_CLOUDINARY_*` (nếu muốn upload ảnh; với bản cứng có thể bỏ, dùng link ảnh trực tiếp).

## 2. Cấu trúc dữ liệu (object `project` — nguồn dữ liệu duy nhất)
```
theme: { brand, brandLight, gold, goldDark, nav }   // bộ màu; nav = màu navbar riêng
logo, name, shortDescription
badges: [{label, value}] x3                          // ưu đãi / thanh toán / lãi suất
heroImage                                            // ảnh lớn làm NỀN hero
longDescription: [string]                            // mô tả dài, nhiều đoạn
infoTitle, info: [{label, value}]                    // bảng thông tin
highlights: [{label, value}] x4                      // 4 chỉ số (vòng tròn)
cta: { title, subtitle, hotline, note }              // khối form thu lead
location: { title, paragraphs:[], image }
differences: { title, items:[{title, description}] }     // 3 điểm khác biệt
amenities: { title, paragraphs:[], images:[{src, caption}] }  // ảnh có chú thích
floorPlan: { title, paragraphs:[], image }
design: { title, paragraphs:[], images:[] }
pricing: { title, units:[{type, area, price, payment}] }
reasons: { title, items:[{title, description}] }
buyers: { title, items:[{title, description}] }
faq: { title, items:[{question, answer}] }           // tối thiểu 2
consultant: { title, image, name, role, phone, description:[] }
zalo                                                 // link zalo.me/<sđt>
footer: { company, address, hotline, email, copyright }
```
Khi render, mọi mảng phải có guard `(arr || []).map(...)` để không vỡ nếu thiếu.

## 3. Thứ tự các section (component `LandingPage`)
1. **Header** (navbar) — sticky/fixed, **ẩn khi cuộn xuống, hiện khi cuộn lên** (theo dõi scrollY). Nền tối màu `theme.nav` (mặc định = brand) để logo trắng nổi. Bên phải có nút "Nhận bảng giá".
2. **Hero** — ảnh lớn làm **nền** (dùng `<img>` absolute inset-0 object-cover + lớp gradient tối đè lên, KHÔNG dùng background-image). Bên trái: tên dự án, mô tả ngắn (màu gold), 3 badge dạng thẻ kính mờ, nút CTA gold.
3. **Intro** — mô tả dài, canh giữa, max-width hẹp.
4. **ProjectInfo** — 2 cột: TRÁI bảng thông tin (`info`), PHẢI 4 **vòng tròn** chỉ số (`aspect-square rounded-full`, viền gold dày, nền brand, chữ trắng), căn giữa dọc.
5. **LeadForm (lần 1)** — xem mục 4.
6. **Location** — xếp dọc: tiêu đề → các đoạn → ảnh (max-w-2xl, canh giữa).
7. **Differences** — 3 thẻ, mỗi thẻ có số thứ tự tròn.
8. **Amenities** — các đoạn + lưới ảnh, **mỗi ảnh có chú thích (figcaption) bên dưới**.
9. **FloorPlan** — ảnh trái, chữ phải.
10. **Design** — chữ + 2 ảnh phòng.
11. **Pricing** — các thẻ loại căn (type/diện tích/giá/thanh toán), header thẻ nền brand chữ gold.
12. **LeadForm (lần 2)**.
13. **Reasons** — danh sách lý do, số thứ tự tròn gold.
14. **Buyers** — 3 thẻ nhóm khách, viền trên gold.
15. **FAQ** — accordion: click mở/đóng **mượt** bằng kỹ thuật grid-rows `0fr → 1fr` + opacity, icon **chevron SVG xoay 180°**, câu đang mở viền gold.
16. **Consultant** — ảnh trái (dọc), phải: tên, chức danh, mô tả nhiều đoạn, nút gọi.
17. **LeadForm (lần 3)**.
18. **Footer** — nền brand, thông tin công ty + hotline + email.
19. **ZaloButton** — nút tròn nổi cố định góc phải dưới, màu xanh Zalo #0068ff, link `project.zalo`.

Tông màu: nền section xen kẽ trắng / `bg-stone-50`. Tiêu đề section IN HOA, có gạch chân gold ngắn ở giữa. Responsive: mobile 1 cột.

## 4. Form thu lead (QUAN TRỌNG — gửi thẳng Apps Script)
- 3 vị trí (sau ProjectInfo, sau Pricing, sau Consultant). Khối nền brand, bên trái tiêu đề + hotline, bên phải thẻ form trắng (ô Tên, ô SĐT, nút "Nhận bảng giá ngay").
- Submit: `fetch(import.meta.env.VITE_SHEETS_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ projectName: project.name, createdAt: new Date().toLocaleString('vi-VN'), name, phone, source }) })`.
- Có trạng thái "Đang gửi…", sau khi gửi xong hiện màn cảm ơn ("Cảm ơn {tên}! Bảng giá sẽ gửi qua Zalo số {sđt}"). Validate SĐT cơ bản.
- Vì gửi thẳng từ browser nên dùng `mode:'no-cors'` nếu Apps Script không trả CORS header (khi đó không đọc được response — cứ coi như thành công sau khi fetch xong). Hoặc cấu hình Apps Script trả JSON + để "Anyone".

## 5. Google Apps Script (dán vào Sheet → Extensions → Apps Script)
```javascript
var SHEET_NAME = 'Leads'
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
    if (sheet.getLastRow() === 0)
      sheet.appendRow(['Dự án', 'Thời gian', 'Tên khách', 'Số điện thoại', 'Nguồn'])
    var d = JSON.parse(e.postData.contents)
    sheet.appendRow([d.projectName || '', d.createdAt || new Date(), d.name || '', d.phone || '', d.source || ''])
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON)
  }
}
```
Deploy: **New deployment → Web app → Execute as: Me → Who has access: Anyone** → copy URL `/exec` → bỏ vào `.env` (`VITE_SHEETS_WEBHOOK_URL`). Nếu sửa code phải Deploy lại bản version mới. Tên dự án là **cột đầu** trong Sheet.

## 6. Các pattern/gotcha bắt buộc nhớ
- **Theming bằng biến CSS:** class `bg-brand`/`text-gold`… compile ra `var(--color-brand)`. Để đổi màu cả trang, set inline style `{'--color-brand':..., '--color-gold':..., '--color-brand-light':..., '--color-gold-dark':...}` trên wrapper `<LandingPage>`. Navbar dùng `theme.nav` qua inline `backgroundColor` (fallback `var(--color-brand)`).
- **Component `Img` thông minh:** nhận đường dẫn không đuôi (vd `/images/hero`) thì tự thử lần lượt `.jpg/.jpeg/.png/.webp/.avif/.gif` qua `onError`, cuối cùng fallback placehold.co. Cho phép dán URL ngoài trực tiếp. (Với bản cứng có thể chỉ cần dùng URL ảnh thẳng.)
- **Hero là `<img>` absolute** chứ không phải background-image (để dùng chung fallback + đổi đuôi).
- **Navbar `position: fixed`** → thêm padding-top cho nội dung hoặc để hero tự có padding. Ẩn/hiện bằng `transform: translateY(-100%)` + `transition`.
- **FAQ animation:** wrapper `grid grid-rows-[0fr]` → `grid-rows-[1fr]` + con bên trong `overflow-hidden`; KHÔNG animate `height:auto` trực tiếp.
- **`.env` chỉ nạp lúc khởi động** Vite — đổi xong phải restart `npm run dev`.

## 7. Deploy (chỉ Vercel)
- Push code lên GitHub. Vercel → Import project → preset **Vite**, Build `npm run build`, Output `dist`.
- Thêm env trên Vercel: `VITE_SHEETS_WEBHOOK_URL` (+ Cloudinary nếu dùng).
- Vì là web 1 trang, không cần proxy `/api`. Nếu có nhiều route (client-side routing) thì thêm `vercel.json` rewrite mọi path về `/index.html`. Với 1 trang đơn thì không cần.
- KHÔNG cần Render, KHÔNG cần MongoDB.

## 8. Việc cần làm khi bắt đầu
1. Tạo Vite React + Tailwind v4, khai báo `@theme`.
2. Tạo `src/data/project.js` chứa toàn bộ nội dung cứng (theo cấu trúc mục 2).
3. Dựng các component section (mục 3) — đổ dữ liệu từ object `project`.
4. Làm `LeadForm` gửi thẳng Apps Script (mục 4–5).
5. Áp theme bằng biến CSS (mục 6).
6. Deploy Vercel (mục 7).
