# TODO LIST - User Authentication & Authorization

## Phase 1: Backend - User Entity & Auth Module

### 1.1 Create User Module
- [x] Create `user.entity.ts` with fields: `id`, `email`, `password`, `name`, `createdAt`, `updatedAt`
- [x] Create `user.module.ts`, `user.service.ts`, `user.controller.ts`
- [x] Create DTOs: `create-user.dto.ts` (sign up), `login-user.dto.ts` (sign in)
- [x] Add validation for email and password (class-validator)
- [x] Create seed data for user (`users.ts`, `user.seed.ts`)
- [x] Add UserModule to `app.module.ts`

### 1.2 Create Auth Module (JWT)
- [x] Install dependencies: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
- [x] Install dev dependencies: `@types/passport-jwt`, `@types/bcrypt`
- [x] Create `auth.module.ts`, `auth.service.ts`, `auth.controller.ts`
- [x] Implement `hashPassword` and `comparePassword` functions (bcrypt)
- [x] Implement endpoint `POST /auth/signup` - register new user
- [x] Implement endpoint `POST /auth/login` - login, return JWT token
- [x] Implement endpoint `GET /auth/profile` - get current user info
- [x] Create `jwt.strategy.ts` (Passport JWT Strategy)
- [x] Create `jwt-auth.guard.ts` (Auth Guard)
- [x] Add `JWT_SECRET` and `JWT_EXPIRATION` to `.env` file

### 1.3 Update Entity Relations
- [x] Add `userId` field and `@ManyToOne(() => User)` relation to `cart-item.entity.ts`
- [x] Add `userId` field and `@ManyToOne(() => User)` relation to `order.entity.ts`
- [x] Update seed data for `cart` and `orders` to include `userId`
- [x] Run migration / sync database

## Phase 2: Backend - Protect Routes & Filter by User

### 2.1 Apply Auth Guard to Routes
- [x] Apply `@UseGuards(JwtAuthGuard)` to `CartItemController`
- [x] Apply `@UseGuards(JwtAuthGuard)` to `OrderController`
- [x] Apply `@UseGuards(JwtAuthGuard)` to `PaymentSummaryController`
- [x] Create custom decorator `@CurrentUser()` to extract user from request

### 2.2 Update Service & Controller to Filter by User
- [x] `CartItemService` - add condition `where: { userId }` to all queries
- [x] `CartItemController` - pass `userId` from `@CurrentUser()` to service
- [x] `OrderService` - add condition `where: { userId }` to all queries
- [x] `OrderController` - pass `userId` from `@CurrentUser()` to service
- [x] `PaymentSummaryService` - calculate based on current user's cart
- [x] Update `create-item.dto.ts` (remove userId from body, extract from token)

### 2.3 Testing Backend
- [x] Write unit tests for `PaymentSummaryService`, `PaymentSummaryController`, `UserService`
- [ ] Write unit tests for `AuthService`
- [ ] Write unit tests for `JwtStrategy`
- [ ] Manually test endpoints using Postman/Thunder Client
- [ ] Update e2e tests (`app.e2e-spec.ts`)

## Phase 3: Frontend - Auth Pages & State Management

### 3.1 Auth State Management
- [x] Install dependency (if needed): `axios` or configure fetch interceptor
- [x] Create `useAuthStore.ts` (Zustand) - state: `user`, `token`, `isAuthenticated`
- [x] Implement actions: `login()`, `signup()`, `logout()`, `loadUser()`
- [x] Save JWT token to `localStorage`
- [x] Create utility/interceptor to automatically attach `Authorization: Bearer <token>` to every request

### 3.2 Create Auth Pages
- [x] Create folder `src/pages/auth/`
- [x] Create `LoginPage.tsx` - form with email & password, "Sign In" button
- [x] Create `SignUpPage.tsx` - form with name, email, password, confirm password, "Sign Up" button
- [x] Add toggle links between Login ↔ Sign Up
- [x] Display error message on login failure
- [x] Display error message on signup failure
- [x] Redirect to HomePage after successful login
- [x] Redirect to HomePage after successful signup

### 3.3 Update Routing
- [x] Add route `/auth/login` → `LoginPage`
- [x] Add route `/auth/signup` → `SignUpPage`

## Phase 4: Frontend - Update UI Components

### 4.1 Update Header
- [x] Display user name when logged in
- [x] Add "Logout" dropdown when logged in

### 4.2 Update Cart & Order Logic
- [x] `useCartStore.ts` - fetch cart items from API by user (token)
- [x] `OrdersPage.tsx` - fetch orders for current user
- [x] `TrackingPage.tsx` - fetch tracking info for current user
- [x] `Product.tsx` - check auth before "Add to Cart", redirect if not logged in

### 4.3 Testing Frontend
- [ ] Write tests for `LoginPage` and `SignUpPage`
- [x] Update tests for `HomePage`
- [x] Update tests for `PaymentSummary`
- [x] Update tests for `Product`
- [ ] Test complete flow: Sign Up → Login → Add to Cart → Checkout → View Orders

## Phase 5: Polish & Finalize

- [ ] Handle expired token (auto logout, refresh token - optional)
- [ ] Add loading spinner during login/signup
- [ ] Add toast notification for login/signup success/error
- [ ] Responsive design for Login/SignUp pages
- [ ] Update API `documentation.md`
- [ ] Update seed data (`run-seed.ts`) to seed users first, then assign userId to cart & orders
- [ ] Final review & code cleanup