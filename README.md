# InspireVerse

Welcome to the **InspireVerse** application! This project is a full-stack motivation app designed to deliver daily motivational quotes while providing a highly professional, modern UI/UX. The application includes:

- **Frontend:** A React-based app with a modern and responsive design inspired by platforms like Pinterest and Instagram. It includes features like dark/light mode, polished authentication screens, a dynamic dashboard with quote cards, and a professional profile page for liked and saved quotes.
- **Backend:** An Express-based Node.js server that handles user registration, login, quote liking/saving, and delivers your motivational quote data. It utilizes SQLite for data storage and JSON Web Tokens (JWT) for authentication.
- **FastAPI Service:** A lightweight FastAPI service for generating motivational quotes. This service can be used as an additional or fallback quote provider.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [FastAPI Service Setup](#fastapi-service-setup)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication:** Register and login with secure password hashing and JWT authentication.
- **Dashboard:** Automatically fetch and display a daily motivational quote; interactive quote cards with options to like, save, share, and copy.
- **Profile Page:** A dedicated user profile displaying both liked and saved quotes.
- **Theme Toggle:** Seamless dark/light mode toggling throughout the application.
- **Responsive and Modern UI:** Professionally designed UI elements including modern animations (via Framer Motion) and an overall clean, minimalistic aesthetic.
- **Quote Generation API (FastAPI):** A separate microservice that provides randomly selected motivational quotes.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or later) and **npm** (for both Backend and Frontend)
- **Python 3.8+** (for FastAPI service)
- **Git**

---

## Installation

### Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file with your environment variables, for example:
   ```
   JWT_SECRET=your_secret_key_here
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on port **5000** by default.

### Frontend Setup

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm start
   ```
   The app will be running in development mode at [http://localhost:3000](http://localhost:3000).

### FastAPI Service Setup

1. Navigate to the `fastapi/` directory:
   ```bash
   cd fastapi
   ```
2. (Optional) Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```
3. Activate the virtual environment:
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run the FastAPI service using Uvicorn:
   ```bash
   uvicorn quote_generator:app --reload --port 8000
   ```
   The service will be accessible at [http://localhost:8000](http://localhost:8000).

---

## Project Structure 
/project-root
├── backend
│ ├── package.json
│ ├── server.js // Express server
│ └── database.db // SQLite database (generated)
├── frontend
│ ├── package.json
│ ├── public
│ │ ├── index.html
│ │ └── manifest.json
│ └── src
│ ├── components // React components (AuthLayout, Login, Register, Dashboard, Profile, QuoteCard, etc.)
│ ├── context // ThemeContext for global dark/light mode management
│ ├── theme // Theme definitions
│ ├── App.js
│ ├── index.js
│ └── styles.css
├── fastapi
│ ├── requirements.txt
│ └── quote_generator.py // FastAPI quote generation service
└── README.md
