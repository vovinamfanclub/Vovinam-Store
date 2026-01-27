
# VovinamStore - Deployment Guide

Dự án này được tối ưu hóa để triển khai nhanh lên **Vercel**.

## Các bước triển khai qua GitHub:

1. **Tạo Repository mới trên GitHub**:
   - Truy cập [github.com/new](https://github.com/new).
   - Đặt tên repo (ví dụ: `vovinam-store`).
   - Đẩy toàn bộ code hiện tại lên repo này.

2. **Kết nối với Vercel**:
   - Truy cập [vercel.com/dashboard](https://vercel.com/dashboard).
   - Nhấn **Add New** -> **Project**.
   - Chọn repository bạn vừa tạo.

3. **Cấu hình Build (Quan trọng)**:
   - Vì dự án này sử dụng công nghệ trình duyệt hiện đại (ESM + Import Maps) chạy trực tiếp không cần bundler:
   - **Framework Preset**: Chọn `Other`.
   - **Build Command**: Để trống (hoặc ghi `none`).
   - **Output Directory**: Ghi `.` (dấu chấm - nghĩa là thư mục gốc).
   - Nhấn **Deploy**.

4. **Tên miền**:
   - Sau khi deploy, bạn có thể vào tab **Settings > Domains** để thêm tên miền `.com` hoặc `.vn` của riêng mình.

## Tính năng nổi bật:
- **Auto-Sync**: Dữ liệu tự cập nhật từ Google Sheet sau mỗi 10 phút.
- **PWA Ready**: Có thể cài đặt trực tiếp vào màn hình chính điện thoại.
- **High Performance**: Đạt điểm tối ưu trên Lighthouse nhờ ESM.
