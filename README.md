# Hướng dẫn deploy PAT VAULT lên GitHub Pages + cài đặt app

## 1. Đưa 6 file lên GitHub
1. Tạo repo mới trên GitHub (public).
2. Đẩy 6 file: `index.html`, `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-512-maskable.png` lên **thư mục gốc** của repo (không để trong thư mục con).
3. Vào Settings → Pages → Source: chọn branch `main`, thư mục `/ (root)` → Save.
4. Đợi vài phút, mở `https://<username>.github.io/<ten-repo>/`.

Vì `start_url` và `scope` dùng đường dẫn tương đối nên không cần sửa gì thêm dù URL có dạng `username.github.io/ten-repo/`.

## 2. Cài trên Android (Chrome)
Mở link → menu 3 chấm → "Cài đặt ứng dụng" / "Thêm vào Màn hình chính".

## 3. Cài trên Windows 11 (Edge/Chrome)
Mở link → bấm icon "Cài đặt" trên thanh địa chỉ (hoặc menu → Ứng dụng → "Cài đặt trang này như một ứng dụng").

## 4. Kiểm tra chuẩn PWA
DevTools (F12) → tab Lighthouse → chọn "Progressive Web App" → Analyze.

## Lưu ý
- File vẫn mở được bình thường qua double-click (`file://`), chạy offline hoàn toàn; service worker chỉ đăng ký khi chạy qua http/https.
- Dữ liệu nghiệp vụ (localStorage/IndexedDB) không bị service worker đụng tới.
- Khi sửa `index.html` và deploy lại, đổi `pat-vault-cache-v1` → `v2` trong `sw.js` để máy đã cài nhận bản mới.
