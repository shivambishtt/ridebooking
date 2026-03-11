# 🚗 RideBooking App

A full-stack **ride booking platform** that allows users to request rides and captains (drivers) to accept and manage them.

This project demonstrates **modern full-stack development**, including authentication, REST APIs, role-based access control, and scalable backend architecture using **Next.js and MongoDB**.

---

## 🚀 Features

### 👤 User Features
- Register and login securely
- Book rides by providing pickup and destination
- View ride details and ride status
- Track ride requests

### 🚖 Captain Features
- Register as a captain
- Add and manage vehicle details
- View available ride requests
- Accept or reject rides
- Manage ride status

### 🔐 Authentication & Authorization
- Secure authentication using **NextAuth**
- Role-based access control:
  - `User`
  - `Captain`
- Protected API routes

### 📡 API System
- RESTful APIs built using **Next.js API routes**
- Modular backend structure
- Middleware for route protection

---

## 🛠 Tech Stack

### Frontend
- **Next.js**
- **React**
- **Tailwind CSS**

### Backend
- **Next.js API Routes**
- **Node.js**

### Database
- **MongoDB**
- **Mongoose**

### Authentication
- **NextAuth.js**

### Tools
- **Git**
- **GitHub**
- **Postman (API Testing)**

---

## 📂 Project Structure

```
ridebooking/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── ride/
│   │   ├── captain/
│   │   ├── vehicle/
│   │   └── payment/
│   │
│   ├── login/
│   ├── register/
│   └── dashboard/
│
├── models/
│   ├── UserModel.ts
│   ├── CaptainModel.ts
│   ├── RideModel.ts
│   ├── VehicleModel.ts
│   └── PaymentModel.ts
│
├── lib/
│   ├── connectDB.ts
│   └── validNumberPlate.ts
│
├── components/
│
└── README.md
```

---

## 🚗 Vehicle Management

Captains can register and manage their vehicles.

Features include:

- Add vehicle details
- Validate vehicle number plate
- Associate vehicle with captain
- Store vehicle information in MongoDB

---

## 💳 Payment System

The platform includes a payment model to manage ride payments.

Features include:

- Store payment details for rides
- Link payments with ride records
- Track payment status

---

## 🧩 Utility Functions

Utility functions help maintain clean and reusable logic.

### `validNumberPlate`

A helper function used to validate vehicle number plates before storing them in the database.

This ensures that only properly formatted vehicle numbers are accepted.

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/shivambishtt/ridebooking.git
cd ridebooking
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create environment variables

Create a `.env.local` file in the root directory and add:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4️⃣ Run the development server

```bash
npm run dev
```

Open the application in your browser:

```
http://localhost:3000
```

---

## 🔑 API Overview

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Ride

```
POST /api/ride/create
GET  /api/ride
```

### Captain

```
POST /api/captain/vehicle
GET  /api/captain/rides
```

### Payment

```
POST /api/payment
GET  /api/payment
```


---

## 👨‍💻 Author

**Shivam Bisht**

GitHub:  
https://github.com/shivambishtt

---

⭐ If you like this project, consider giving it a **star** on GitHub!