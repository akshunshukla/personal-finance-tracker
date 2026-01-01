
# Personal Finance Tracker

A full-stack application built to manage income and expenses with real-time analytics, secure authentication, and performance-driven features.

## 🚀 Tech Stack

Frontend 

* **React 19** with Vite for high-performance development.
* **Tailwind CSS** for modern, responsive UI styling.
* **Recharts** for interactive financial data visualization.
* **React Router Dom** for secure, protected client-side routing.

Backend 

* **Node.js & Express.js** for the API server.
* **PostgreSQL** as the primary relational database.
  
* **Redis (Upstash)** for high-speed caching of analytics and categories.

* **JWT (JSON Web Token)** for secure, stateless authentication.



---

## ✨ Features

1. Secure Authentication & RBAC 

* **JWT-based Auth:** Secure login and registration flows.


* **Role-Based Access Control (RBAC):** 


* **Admin:** Full access to all features and data management.


* **User:** Manage personal transactions and view individual analytics.


* **Read-Only:** View access only; cannot add, edit, or delete data.





2. Transaction Management 

* Add, edit, and delete income/expense entries (restricted to Admin/User).


* Categorization (Food, Transport, Entertainment, etc.).


* Search and filter capabilities for easy tracking.



3. Analytics Dashboard 

* **Pie Charts:** Expense breakdown by category.


* **Line Charts:** Monthly income vs. expense trends.


* **Stats Cards:** Real-time calculation of total income, expenses, and net balance.

4. Performance & Security 

* **Caching:** Analytics data cached for 15 minutes and categories for 1 hour using Redis.


* **Rate Limiting:** Protects endpoints from abuse (e.g., 5 auth attempts per 15 mins).
* **Security Middlewares:** Implementation of `helmet`, `cors`, and protection against XSS/SQL Injection.

---

## 🛠️ Setup Instructions

### Prerequisites

* Node.js (v18+)
* PostgreSQL Database
* Redis Instance (Upstash recommended)

### Backend Setup

1. Navigate to the `backend` folder.
2. Install dependencies: `npm install`.
3. Create a `.env` file with the following:
```env
PORT=3000
DATABASE_URL=your_postgresql_url
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
JWT_SECRET=your_secret_key

```


4. Start the server: `npm run dev`.

### Frontend Setup

1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`.
3. Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api

```


4. Start the app: `npm run dev`.

---

## 📝 API Endpoints

| Method | Endpoint | Access Role |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/transactions` | All Roles |
| `POST/PUT` | `/api/transactions` | Admin, User |
| `GET` | `/api/analytics/summary` | All Roles |
| `GET` | `/api/users` | Admin Only |

 
