# 🏥 Doctor Appointment Booking System (MERN Stack)

![License](https://img.shields.io/badge/License-ISC-blue.svg)
![MERN](https://img.shields.io/badge/Stack-MERN-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![React](https://img.shields.io/badge/Frontend-React-61DAFB)
![Node.js](https://img.shields.io/badge/Backend-Node.js-339933)
![Express](https://img.shields.io/badge/API-Express-black)

A modern and scalable **Doctor Appointment Booking System** built with the **MERN Stack** — MongoDB, Express.js, React.js, and Node.js. This platform simplifies the healthcare appointment process by enabling patients to book appointments online while allowing doctors and administrators to efficiently manage schedules, profiles, and appointments.

The system includes:

* 🔐 Secure JWT Authentication
* 👨‍⚕️ Role-Based Dashboards (Admin, Doctor, User)
* ☁️ Cloudinary Image Upload Integration
* 📱 Fully Responsive React Frontend
* 📊 Appointment Management & Analytics
* ⚡ Optimized MERN Architecture

---

# 📑 Table of Contents

* [✨ Features](#-features)
* [📂 Project Structure](#-project-structure)
* [🛠️ Tech Stack](#️-tech-stack)
* [⚙️ Installation & Setup](#️-installation--setup)
* [🌐 API Endpoints](#-api-endpoints)
* [🧪 Testing](#-testing)
* [🚀 Deployment](#-deployment)
* [📌 Future Improvements](#-future-improvements)
* [👩‍💻 Author](#-author)
* [🙏 Acknowledgments](#-acknowledgments)

---

# ✨ Features

## 👤 User Features

* Secure user registration & login using JWT authentication
* Update profile details and upload profile images
* Browse doctors by specialization
* Book appointments seamlessly
* View upcoming and previous appointments
* Cancel appointments easily
* Secure payment workflow (expandable)
* Responsive UI for mobile and desktop users

## 🩺 Doctor Features

* Dedicated doctor login and dashboard
* Manage appointments efficiently
* Accept, complete, or cancel appointments
* Update professional profile and details
* Dashboard analytics overview
* Appointment tracking and patient management

## 🛠️ Admin Features

* Secure admin authentication
* Add and manage doctors
* Toggle doctor availability
* Monitor all appointments across the platform
* Access dashboard metrics and analytics
* Manage healthcare system operations efficiently

## 🔐 Security Features

* JWT-based authentication system
* Password hashing with bcrypt
* Protected routes and middleware authorization
* Role-based access control
* Secure RESTful API structure
* Cloudinary + Multer integration for image uploads
* Global error handling and validation

## 🌐 Frontend Highlights

* Built with React + Vite for fast performance
* Tailwind CSS for modern UI styling
* Axios integration for API communication
* React Router DOM for routing
* Toast notifications for enhanced UX
* Clean and reusable component structure

---

# 📂 Project Structure

```bash
📦 DOCTOR-APPOINTMENT-SYSTEM
├── backend
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── admin-portal
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
├── frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── vite.config.js
│   └── package.json
```

---

# 🛠️ Tech Stack

## 🔹 Backend

| Technology | Purpose                       |
| ---------- | ----------------------------- |
| Node.js    | Runtime Environment           |
| Express.js | Backend Framework             |
| MongoDB    | NoSQL Database                |
| Mongoose   | MongoDB ODM                   |
| JWT        | Authentication                |
| bcrypt     | Password Hashing              |
| Cloudinary | Image Storage                 |
| Multer     | File Upload Handling          |
| dotenv     | Environment Variables         |
| cors       | Cross-Origin Resource Sharing |

## 🔹 Frontend

| Technology       | Purpose          |
| ---------------- | ---------------- |
| React.js         | Frontend Library |
| Vite             | Build Tool       |
| Tailwind CSS     | Styling          |
| Axios            | API Requests     |
| React Router DOM | Routing          |
| React Toastify   | Notifications    |

---

# ⚙️ Installation & Setup

## 📦 Prerequisites

Make sure you have installed:

* Node.js
* MongoDB Atlas
* Git
* Cloudinary Account

---

## 🚀 Clone Repository

```bash
git clone https://github.com/codingwithriha/doctor-appointment-booking-system.git
cd doctor-appointment-booking-system
```

---

# 🔧 Backend Setup

```bash
cd backend
npm install
```

## Create `.env` file

```env
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ADMIN_EMAIL=admin_email
ADMIN_PASSWORD=admin_password
```

## Run Backend Server

```bash
npm run server
```

---

# 🌐 Frontend Setup

```bash
cd frontend
npm install
```

## Create `.env` file

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Run Frontend

```bash
npm run dev
```

---

# 🛠️ Admin Portal Setup

```bash
cd admin-portal
npm install
```

## Create `.env` file

```env
VITE_BACKEND_URL=http://localhost:4000
```

## Run Admin Portal

```bash
npm run dev
```

---

# ✅ Full System Workflow

### 👨‍💼 Admin Flow

1. Login as admin
2. Add doctors
3. Manage doctor availability
4. Monitor appointments

### 🩺 Doctor Flow

1. Login as doctor
2. View appointments
3. Accept or complete appointments
4. Update profile information

### 👤 User Flow

1. Register/Login
2. Browse doctors
3. Book appointments
4. Make payment
5. Cancel appointments if needed

---

# 🌐 API Endpoints

## 👤 User Routes (`/api/user`)

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/register`           | Register new user   |
| POST   | `/login`              | User login          |
| GET    | `/get-profile`        | Get user profile    |
| POST   | `/update-profile`     | Update user profile |
| POST   | `/book-appointment`   | Book appointment    |
| GET    | `/appointments`       | Get appointments    |
| POST   | `/cancel-appointment` | Cancel appointment  |
| POST   | `/make-payment`       | Payment endpoint    |

---

## 🩺 Doctor Routes (`/api/doctor`)

| Method | Endpoint                | Description           |
| ------ | ----------------------- | --------------------- |
| GET    | `/list`                 | Get doctors list      |
| POST   | `/login`                | Doctor login          |
| GET    | `/appointments`         | Doctor appointments   |
| POST   | `/complete-appointment` | Complete appointment  |
| POST   | `/cancel-appointment`   | Cancel appointment    |
| GET    | `/dashboard`            | Dashboard metrics     |
| GET    | `/profile`              | Doctor profile        |
| POST   | `/update-profile`       | Update doctor profile |

---

## 🛠️ Admin Routes (`/api/admin`)

| Method | Endpoint               | Description          |
| ------ | ---------------------- | -------------------- |
| POST   | `/login`               | Admin login          |
| POST   | `/add-doctor`          | Add doctor           |
| GET    | `/all-doctors`         | Get all doctors      |
| POST   | `/change-availability` | Change availability  |
| GET    | `/appointments`        | Get all appointments |
| POST   | `/cancel-appointment`  | Cancel appointment   |
| GET    | `/dashboard`           | Dashboard analytics  |

---

# 🧪 Testing

## Backend Testing

* Use Postman or Thunder Client for API testing
* Future integration with Jest/Mocha for automated testing

## Frontend Testing

* React Testing Library
* Cypress for E2E testing
* Responsive UI testing across devices

---

# 🚀 Deployment

## Backend Deployment

Recommended platforms:

* Render
* Railway
* Heroku
* DigitalOcean

## Frontend Deployment

Recommended platforms:

* Vercel
* Netlify
* AWS Amplify

## Production Services

* MongoDB Atlas
* Cloudinary CDN

---

# 📌 Future Improvements

* 📧 Email notifications for appointments
* 💳 Stripe/PayPal payment integration
* 📅 Doctor availability calendar
* 📊 Advanced analytics dashboard
* 🔍 Appointment filtering & pagination
* 🌙 Dark mode support
* 📱 Mobile app version
* 🤖 AI powered doctor recommendations

---

# 👩‍💻 Author

## Riha Shahzadi

💼 Software Engineer & MERN Stack Developer

### 🌐 Connect With Me

* GitHub: [https://github.com/codingwithriha](https://github.com/codingwithriha)
* LinkedIn: [https://linkedin.com/in/riha-shahzadi](https://linkedin.com/in/riha-shahzadi)
* Email: [rihashehzadi2003@gmail.com](mailto:rihashehzadi2003@gmail.com)

---

# 🙏 Acknowledgments

Special thanks to:

* MongoDB Atlas for cloud database services
* Cloudinary for media storage
* The MERN Stack community for amazing open-source resources
* React & Node.js ecosystems

---

# ⭐ Support

If you like this project, please give it a ⭐ on GitHub and share it with others.

Happy Coding 🚀
