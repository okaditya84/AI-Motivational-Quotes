# InspireVerse

Welcome to the **InspireVerse** application! This project is a full-stack motivation app designed to deliver daily motivational quotes while providing a highly professional, modern UI/UX.

The application includes:

- **Frontend:** A React-based app with a modern and responsive design inspired by platforms like Pinterest and Instagram. It features dark/light mode, polished authentication screens, a dynamic dashboard with quote cards, and a professional profile page for liked and saved quotes.
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
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication:** Secure registration and login with password hashing and JWT authentication.
- **Daily Quote Display:** Automatic fetching and display of a daily motivational quote.
- **Interactive Quote Cards:** Options to like, save, share, and copy quotes.
- **User Profile:** A dedicated profile page to showcase liked and saved quotes.
- **Theme Toggle:** Seamless dark/light mode toggling.
- **Responsive & Modern UI:** A clean, minimalistic design with smooth animations powered by Framer Motion.
- **Quote Generation API:** A FastAPI-powered microservice that provides motivational quotes.

---

## Prerequisites

Ensure you have the following installed before you begin:

- **Node.js** (v14 or later) and **npm** (for both Backend and Frontend)
- **Python 3.8+** (for the FastAPI service)
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

Below is a suggested directory layout for the project:

```
InspireVerse/
├── backend
│   ├── controllers
│   │   └── authController.js       # Handles authentication operations.
│   │   └── quoteController.js      # Handles quote operations.
│   ├── middleware
│   │   └── authMiddleware.js       # Secures routes using JWT.
│   ├── models
│   │   └── userModel.js            # User schema & SQLite interactions.
│   ├── routes
│   │   └── authRoutes.js           # Defines endpoints for user auth.
│   │   └── quoteRoutes.js         # Defines endpoints for quote operations.
│   ├── utils
│   │   └── db.js                   # Database connection and queries.
│   ├── .env                        # Environment variables (e.g., JWT_SECRET).
│   ├── package.json                # Dependencies and start scripts.
│   └── server.js                   # Express server entry point.
│
├── frontend
│   ├── public
│   │   └── index.html              # Main HTML file.
│   ├── src
│   │   ├── components
│   │   │   ├── Dashboard.js        # Dashboard displaying the daily quote.
│   │   │   ├── QuoteCard.js        # Individual quote card component.
│   │   │   ├── Profile.js          # User profile for saved and liked quotes.
│   │   │   └── ThemeToggle.js      # Button for dark/light mode.
│   │   ├── pages
│   │   │   ├── Home.js             # Landing page.
│   │   │   ├── Login.js            # Login form.
│   │   │   └── Register.js         # Registration form.
│   │   ├── App.js                  # Main React app component.
│   │   ├── index.js                # React entry point.
│   │   └── styles
│   │       └── main.css            # Global styles.
│   ├── package.json                # Frontend dependencies and scripts.
│   └── README.md                   # Frontend-specific documentation.
│
├── fastapi
│   ├── quote_generator.py         # FastAPI app for generating quotes.
│   ├── requirements.txt           # Python dependencies.
│   └── README.md                  # FastAPI service instructions.
│
├── .gitignore                     # Files and directories to ignore in Git.
└── README.md                      # Main project documentation.
```

Feel free to adjust the structure as needed based on any additional features or refactoring.

---

## Environment Variables

### Backend (`backend/.env`)

Make sure to set any necessary environment variables here (e.g., for JWT authentication):

```
JWT_SECRET=your_secret_key_here
```

If additional configuration is needed (for example, database paths or third-party API keys), add them to the appropriate `.env` file.

---

## API Endpoints

### Backend (Express)

Below are some example endpoints included in the backend:

- `POST /api/auth/register` – Register a new user.
- `POST /api/auth/login` – Login a user and receive a JWT.
- `GET /api/quote` – Retrieve the daily motivational quote.
- `POST /api/quote/like` – Like a motivational quote.
- `POST /api/quote/save` – Save a motivational quote.

*Note: Actual endpoints may vary based on further backend implementation.*

### FastAPI Service

- `GET /` – Returns a randomly selected motivational quote.

---

## Testing

### Backend Testing

- Consider writing tests using [Jest](https://jestjs.io/) or [Mocha](https://mochajs.org/) to cover route controllers and middleware.
- Place test files alongside your controllers or in a dedicated `tests/` folder in the backend directory.

### Frontend Testing

- Use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and/or [Jest](https://jestjs.io/) for component and UI testing.
- Add tests in a `__tests__/` directory or co-located with your components.

### FastAPI Testing

- Use [pytest](https://docs.pytest.org/) along with [httpx](https://www.python-httpx.org/) for API endpoint testing.
- Organize your tests in a `tests/` folder within the FastAPI service directory.

---

## Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes.
4. Push to your fork and submit a pull request.

Please make sure your code is well-tested and follows the coding style of the project.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

