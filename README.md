# 🛒 N-Web E-Commerce Platform

Chào mừng bạn đến với dự án **N-Web** - Nền tảng website bán hàng thương mại điện tử hiện đại, được xây dựng với mục tiêu cung cấp trải nghiệm mua sắm trực tuyến mượt mà, tốc độ cao và quản trị dễ dàng.

## 🌟 Giới thiệu tổng quan

Dự án này là một hệ thống web bán hàng toàn diện, bao gồm cả giao diện hiển thị cho người mua (Storefront) và trang quản trị dành riêng cho chủ cửa hàng (Admin Dashboard). N-Web sẽ giúp doanh nghiệp dễ dàng số hóa quy trình kinh doanh, quản lý kho hàng, đơn hàng và đem lại trải nghiệm mua sắm tốt nhất cho khách hàng.

## 🚀 Các tính năng chính

### Dành cho Khách hàng
- **Mua sắm linh hoạt:** Giao diện trang chủ chuyên nghiệp, thân thiện. 
- **Tài khoản & Bảo mật:** Đăng ký, Đăng nhập, Quên mật khẩu an toàn.
- **Khám phá sản phẩm:** Danh mục, tìm kiếm và xem chi tiết sản phẩm rõ ràng.
- **Giỏ hàng & Thanh toán:** Thao tác thêm vào giỏ, nhập thông tin liên hệ và đặt hàng nhanh chóng.
- **Quản lý đơn hàng cá nhân:** Theo dõi lịch sử mua hàng cá nhân.

### Dành cho Quản trị viên (Admin)
- **Dashboard tổng quan:** Thống kê doanh số, số lượng đơn hàng tổng quan.
- **Quản lý Sản phẩm:** Tạo, cập nhật, xóa sản phẩm kèm theo mô tả và giá cả.
- **Quản lý Đơn hàng (Orders):** Tiếp nhận, thay đổi trạng thái tiến trình đơn hàng (Chờ xử lý, Đang giao, Đã hoàn thành).
- **Quản lý Người dùng & Khuyến mại:** Kiểm soát tài khoản khách hàng, áp dụng Coupon giảm giá.

## 🛠 Công nghệ sử dụng (Tech Stack)

Dự án được xây dựng dựa trên những công nghệ web mạnh mẽ nhất hiện nay:
- **Framework (Frontend & Backend):** [Next.js](https://nextjs.org/) (App Router kết hợp API Routes)
- **Ngôn ngữ phát triển:** TypeScript
- **Giao diện (Styling):** Tailwind CSS
- **Cơ sở dữ liệu (Database):** MongoDB kết hợp cùng Mongoose
- **Xác thực (Authentication):** NextAuth.js

---

## ⚙️ Hướng dẫn cài đặt (Installation & Setup)

Làm theo quy trình dưới đây để có thể chạy dự án trực tiếp trên máy tính của bạn (Môi trường Local).

### Yêu cầu môi trường
- Cài đặt [Node.js](https://nodejs.org/) (Khuyên dùng phiên bản 18+).
- Một chuỗi kết nối [MongoDB](https://www.mongodb.com/products/platform/atlas-database) (Có thể dùng Local hoặc tạo một Database miễn phí trên MongoDB Atlas).

### Các vành điều khiển chi tiết

**Bước 1: Clone dự án hoặc truy cập vào thư mục code**
```bash
# Clone dự án từ GitHub
git clone https://github.com/Kuntoichoi/-n-web.git
cd "Web bán hàng" # (Hoặc thư mục bạn đã tải xuống)
```

**Bước 2: Cài đặt các thư viện dependencies (Gói phụ thuộc)**
```bash
npm install
# Hoặc nếu dùng yarn: yarn install
```

**Bước 3: Thiết lập Biến môi trường (Environment Variables)**
Tại thư mục gốc của dự án, bạn tạo một file tên là `.env.local` (hoặc `.env`) và khai báo lại các thông số sau:
```env
# Chuỗi kết nối đến Database MongoDB của bạn
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.../web-ban-hang

# Secret cho NextAuth (Tạo ra một chuỗi ngẫu nhiên khó đoán)
NEXTAUTH_SECRET=your_super_secret_string

# URL gốc của Local (dành cho NextAuth)
NEXTAUTH_URL=http://localhost:3000
```

**Bước 4: Chạy server Test (Development Mode)**
```bash
npm run dev
# Hoặc: yarn run dev
```

Sau khi Terminal báo server khởi động thành công, bạn mở trình duyệt và truy cập vào đường link sau để chiêm ngưỡng tác phẩm của mình:
👉 **[http://localhost:3000](http://localhost:3000)**

---

**✍️ Phát triển và bảo trì bởi:** [Kuntoichoi](https://github.com/Kuntoichoi)
