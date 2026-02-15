# E-Commerce Project

A full-stack E-Commerce web application built with modern technologies. The project consists of a NestJS backend API and a React frontend, providing a complete shopping experience including product browsing, cart management, order processing, and delivery tracking.

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)

## Introduction

This E-Commerce platform provides a seamless online shopping experience with the following features:

- **Product Catalog**: Browse and search products
- **Shopping Cart**: Add, update, and remove items from cart
- **Delivery Options**: Choose from multiple delivery methods
- **Order Management**: Place orders and view order history
- **Order Tracking**: Track delivery status of orders
- **Payment Summary**: View detailed payment breakdown

## Tech Stack

### Backend (API)

| Technology            | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| **NestJS**            | Progressive Node.js framework for building scalable server-side applications |
| **TypeORM**           | ORM for TypeScript and JavaScript                                            |
| **TypeScript**        | Typed superset of JavaScript                                                 |
| **PostgreSQL**        | Powerful open-source relational database                                     |
| **Class Validator**   | Decorator-based validation                                                   |
| **Class Transformer** | Object transformation library                                                |

### Frontend (Web)

| Technology           | Description                                     |
| -------------------- | ----------------------------------------------- |
| **React 18+**        | JavaScript library for building user interfaces |
| **TypeScript**       | Typed superset of JavaScript                    |
| **Vite**             | Next-generation frontend build tool             |
| **Tailwind CSS**     | Utility-first CSS framework                     |
| **Zustand**          | Lightweight state management library            |
| **React Router DOM** | Declarative routing for React                   |
| **Axios**            | Promise-based HTTP client                       |
| **Vitest**           | Vite-native unit testing framework              |

## Project Structure

```
E-Commerce/
├── api/ # Backend NestJS application
│ ├── src/
│ │ ├── database/ # Database configuration and seeds
│ │ │ ├── seeds/ # Seed data and scripts
│ │ │ │ ├── data/ # Raw seed data
│ │ │ │ └── scripts/ # Seed execution scripts
│ │ │ └── database.module.ts
│ │ ├── middleware/ # Custom middleware
│ │ │ └── logging/ # Request logging middleware
│ │ ├── modules/ # Feature modules
│ │ │ ├── cart-item/ # Shopping cart functionality
│ │ │ ├── delivery-option/ # Delivery options management
│ │ │ ├── order/ # Order processing
│ │ │ ├── payment-summary/ # Payment calculations
│ │ │ ├── product/ # Product catalog
│ │ │ └── reset/ # Database reset functionality
│ │ ├── app.module.ts
│ │ └── main.ts
│ ├── test/ # E2E tests
│ └── package.json
│
├── web/ # Frontend React application
│ ├── public/ # Static assets
│ │ ├── favicon/
│ │ └── images/
│ │ ├── products/ # Product images
│ │ └── ratings/ # Rating icons
│ ├── src/
│ │ ├── assets/ # Application assets
│ │ ├── components/ # Reusable components
│ │ ├── pages/ # Page components
│ │ │ ├── checkout/ # Checkout page
│ │ │ ├── home/ # Home/product listing page
│ │ │ ├── orders/ # Orders history page
│ │ │ └── tracking/ # Order tracking page
│ │ ├── store/ # Zustand state management
│ │ ├── types/ # TypeScript type definitions
│ │ ├── utils/ # Utility functions
│ │ ├── App.tsx
│ │ └── main.tsx
│ └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)

### Backend Setup

1.  Navigate to the API directory:

    ```bash
    cd api
    ```

2.  Install dependencies:

    ```bash
     npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the `api` directory with the following content:

    ```env
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=yourusername
    DB_PASSWORD=yourpassword
    DB_NAME=ecommerce
    NODE_ENV=development
    ```

4.  Run database migrations and seed data:
    ```bash
    npm run db:seed
    ```
5.  Start the backend server:
    ```bash
    npm run start:dev
    ```

### Frontend Setup

1. Navigate to the Web directory:

   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
    npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Available Scripts

### Backend

- `npm run start:dev`: Start the backend server in development mode with hot-reloading
- `npm run db:seed`: Seed the database with initial data

### Frontend

- `npm run dev`: Start the frontend development server
- `npm run build`: Build the frontend for production
- `npx vitest`: Run frontend unit tests
