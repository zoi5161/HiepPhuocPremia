// ============================================================================
// Google Apps Script — nhận lead từ landing page, ghi vào Google Sheet.
// Cách dùng:
//   1. Mở Google Sheet > Extensions > Apps Script
//   2. Dán toàn bộ file này, lưu lại
//   3. Deploy > New deployment > chọn "Web app"
//        - Execute as: Me
//        - Who has access: Anyone
//   4. Copy URL (.../exec) > dán vào .env (VITE_SHEETS_WEBHOOK_URL) và env Vercel
//   5. Mỗi lần sửa code phải Deploy lại bản version mới.
// ============================================================================

var SHEET_NAME = 'Leads'

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Dự án', 'Thời gian', 'Tên khách', 'Số điện thoại', 'Nguồn'])
    }
    var d = JSON.parse(e.postData.contents)
    sheet.appendRow([
      d.projectName || '',
      d.createdAt || new Date(),
      d.name || '',
      d.phone || '',
      d.source || '',
    ])
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

// Cho phép mở URL /exec bằng GET để kiểm tra deploy còn sống.
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, service: 'Hiep Phuoc Premia leads' })
  ).setMimeType(ContentService.MimeType.JSON)
}
