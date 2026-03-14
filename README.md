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
- Go online / offline by updating location
- View available ride requests
- Accept rides
- Start and end rides
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
│   │   │   ├── create/
│   │   │   ├── accept/
│   │   │   ├── start/
│   │   │   └── end/
│   │   ├── captain/
│   │   │   └── update-location/
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
│   ├── validCoordinates.ts
│   └── validNumberPlate.ts
│
├── components/
│
└── README.md
```

---

## 🔑 API Reference

### 🔐 Authentication

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user or captain | Public |
| `POST` | `/api/auth/login` | Login and get session | Public |

---

### 🚗 Ride

#### `POST /api/ride/create`
Create a new ride request. Finds available captains within 5km of pickup.

**Role:** User

**Body:**
```json
{
  "pickupLocation": {
    "type": "Point",
    "coordinates": [78.209, 29.613]
  },
  "dropLocation": {
    "type": "Point",
    "coordinates": [78.300, 29.700]
  },
  "rider": "userId",
  "distance": 12.5
}
```

**Ride Status Flow:**
```
searching → accepted → ongoing → completed
```

---

#### `PATCH /api/ride/accept?rideId=<id>`
Captain accepts a ride request. Marks ride as `accepted` and captain as unavailable.

**Role:** Captain

- Checks captain is available
- Checks captain has no active ride
- Uses atomic update to prevent race conditions

---

#### `PATCH /api/ride/start?rideId=<id>`
Captain starts the ride after arriving at pickup. Transitions ride from `accepted` → `ongoing`.

**Role:** Captain

---

#### `PATCH /api/ride/end?rideId=<id>`
Captain ends the ride at destination. Transitions ride from `ongoing` → `completed` and marks captain as available again.

**Role:** Captain

---

### 🧑‍✈️ Captain

#### `PATCH /api/captain/update-location`
Captain updates their current location and goes online (marks as available).

**Role:** Captain

**Body:**
```json
{
  "coordinates": [78.209, 29.613]
}
```

> ⚠️ MongoDB requires a `2dsphere` index on the `location` field for geospatial queries to work.
> ```ts
> CaptainSchema.index({ location: "2dsphere" });
> ```

---

### 🚘 Vehicle

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/api/vehicle` | Add a vehicle for a captain | Captain |
| `GET` | `/api/vehicle` | Get captain's vehicle details | Captain |

---

### 💳 Payment

| Method | Endpoint | Description | Role |
|--------|----------|-------------|------|
| `POST` | `/api/payment` | Create a payment record for a ride | User |
| `GET` | `/api/payment` | Get payment details | User/Captain |

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

### `validNumberPlate`
Validates vehicle number plates before storing them in the database, ensuring only properly formatted vehicle numbers are accepted.

### `validCoordinates`
Validates that location coordinates are in the correct format `[longitude, latitude]` before processing ride or location requests.

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

## 👨‍💻 Author

**Shivam Bisht**

GitHub:  
https://github.com/shivambishtt

---

⭐ If you like this project, consider giving it a **star** on GitHub!