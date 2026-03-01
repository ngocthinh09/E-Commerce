# TODO LIST - User Authentication & Authorization

## Phase 1: Backend - User Entity & Auth Module

### 1.1 Tạo User Module
- [x] Tạo `user.entity.ts` với các field: `id`, `email`, `password`, `name`, `createdAt`, `updatedAt`
- [x] Tạo `user.module.ts`, `user.service.ts`, `user.controller.ts`
- [x] Tạo DTO: `create-user.dto.ts` (sign up), `login-user.dto.ts` (sign in)
- [x] Thêm validation cho email và password (class-validator)
- [x] Tạo seed data cho user (`users.ts`, `user.seed.ts`)
- [x] Thêm UserModule vào `app.module.ts`

### 1.2 Tạo Auth Module (JWT)
- [x] Cài đặt dependencies: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
- [x] Cài đặt dev dependencies: `@types/passport-jwt`, `@types/bcrypt`
- [x] Tạo `auth.module.ts`, `auth.service.ts`, `auth.controller.ts`
- [x] Implement hàm `hashPassword` và `comparePassword` (bcrypt)
- [x] Implement endpoint `POST /auth/signup` - đăng ký user mới
- [x] Implement endpoint `POST /auth/login` - đăng nhập, trả về JWT token
- [x] Implement endpoint `GET /auth/profile` - lấy thông tin user hiện tại
- [x] Tạo `jwt.strategy.ts` (Passport JWT Strategy)
- [x] Tạo `jwt-auth.guard.ts` (Auth Guard)
- [x] Thêm `JWT_SECRET` và `JWT_EXPIRATION` vào file `.env`

### 1.3 Cập nhật quan hệ Entity
- [x] Thêm field `userId` và relation `@ManyToOne(() => User)` vào `cart-item.entity.ts`
- [x] Thêm field `userId` và relation `@ManyToOne(() => User)` vào `order.entity.ts`
- [x] Cập nhật seed data cho `cart` và `orders` để gắn `userId`
- [x] Chạy migration / sync database

## Phase 2: Backend - Bảo vệ Routes & Lọc theo User

### 2.1 Áp dụng Auth Guard cho các route
- [ ] Áp dụng `@UseGuards(JwtAuthGuard)` cho `CartItemController`
- [ ] Áp dụng `@UseGuards(JwtAuthGuard)` cho `OrderController`
- [ ] Áp dụng `@UseGuards(JwtAuthGuard)` cho `PaymentSummaryController`
- [ ] Tạo custom decorator `@CurrentUser()` để extract user từ request

### 2.2 Cập nhật Service & Controller để lọc theo User
- [ ] `CartItemService` - tất cả query thêm điều kiện `where: { userId }`
- [ ] `CartItemController` - truyền `userId` từ `@CurrentUser()` vào service
- [ ] `OrderService` - tất cả query thêm điều kiện `where: { userId }`
- [ ] `OrderController` - truyền `userId` từ `@CurrentUser()` vào service
- [ ] `PaymentSummaryService` - tính toán dựa trên cart của user hiện tại
- [ ] Cập nhật `create-item.dto.ts` (bỏ userId khỏi body, lấy từ token)

### 2.3 Testing Backend
- [ ] Viết unit test cho `AuthService` (signup, login, validate)
- [ ] Viết unit test cho `JwtStrategy`
- [ ] Test thủ công các endpoint bằng Postman/Thunder Client
- [ ] Cập nhật e2e test (`app.e2e-spec.ts`)

## Phase 3: Frontend - Auth Pages & State Management

### 3.1 Auth State Management
- [ ] Cài đặt dependency (nếu cần): `axios` hoặc cấu hình fetch interceptor
- [ ] Tạo `useAuthStore.ts` (Zustand) - state: `user`, `token`, `isAuthenticated`
- [ ] Implement actions: `login()`, `signup()`, `logout()`, `loadUser()`
- [ ] Lưu JWT token vào `localStorage`
- [ ] Tạo utility/interceptor để tự động gắn `Authorization: Bearer <token>` vào mọi request

### 3.2 Tạo Auth Pages
- [ ] Tạo folder `src/pages/auth/`
- [ ] Tạo `LoginPage.tsx` - form với email & password, nút "Sign In"
- [ ] Tạo `SignUpPage.tsx` - form với name, email, password, confirm password, nút "Sign Up"
- [ ] Tạo `AuthPage.css` - styling cho login/signup pages
- [ ] Thêm link chuyển đổi giữa Login ↔ Sign Up
- [ ] Hiển thị error message khi login/signup thất bại
- [ ] Redirect về HomePage sau khi login/signup thành công

### 3.3 Cập nhật Routing
- [ ] Thêm route `/login` → `LoginPage`
- [ ] Thêm route `/signup` → `SignUpPage`
- [ ] Tạo `ProtectedRoute` component (redirect về `/login` nếu chưa đăng nhập)
- [ ] Bọc các route `/checkout`, `/orders`, `/tracking` bằng `ProtectedRoute`
- [ ] Route `/` (HomePage) vẫn public, nhưng nút "Add to Cart" yêu cầu đăng nhập

## Phase 4: Frontend - Cập nhật UI Components

### 4.1 Cập nhật Header
- [ ] Hiển thị tên user khi đã đăng nhập
- [ ] Thêm nút "Sign In" khi chưa đăng nhập
- [ ] Thêm nút/dropdown "Logout" khi đã đăng nhập
- [ ] Số lượng cart items hiển thị theo user hiện tại

### 4.2 Cập nhật Cart & Order logic
- [ ] `useCartStore.ts` - fetch cart items từ API theo user (token)
- [ ] `useCartStore.ts` - clear cart state khi logout
- [ ] `OrdersPage.tsx` - fetch orders theo user hiện tại
- [ ] `TrackingPage.tsx` - fetch tracking info theo user hiện tại
- [ ] `Product.tsx` - kiểm tra auth trước khi "Add to Cart", redirect nếu chưa login

### 4.3 Testing Frontend
- [ ] Viết test cho `LoginPage` và `SignUpPage`
- [ ] Cập nhật test cho `HomePage` (mock auth state)
- [ ] Cập nhật test cho `PaymentSummary` (mock auth state)
- [ ] Test flow hoàn chỉnh: Sign Up → Login → Add to Cart → Checkout → View Orders

## Phase 5: Polish & Hoàn thiện

- [ ] Xử lý token hết hạn (auto logout, refresh token - optional)
- [ ] Thêm loading spinner khi đang login/signup
- [ ] Thêm toast notification cho login/signup success/error
- [ ] Responsive design cho Login/SignUp pages
- [ ] Cập nhật `documentation.md` của API
- [ ] Cập nhật seed data (`run-seed.ts`) để seed user trước, rồi gắn userId cho cart & order
- [ ] Final review & cleanup code