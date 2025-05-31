# Student Management App (React + Django REST Framework + JWT)

A simple React frontend integrated with a Django REST Framework backend for managing students with authentication using JWT tokens.

## Features

* User authentication (login/logout) with JWT tokens
* Student listing with pagination and search
* Add, edit, delete student records
* Modal dialogs for adding/updating students
* Secure API requests with Authorization header
* Token stored in localStorage
* React hooks and Axios for frontend API calls

## Tech Stack

* Frontend: React (with hooks), Axios, React Bootstrap for modals and styling
* Backend: Django REST Framework, Simple JWT for authentication
* Communication: REST API with JWT Bearer token

## Setup Instructions

### Backend

1. Clone the backend repository (or setup Django project if not done).

2. Install dependencies:

   ```bash
   pip install django djangorestframework djangorestframework-simplejwt
   ```

3. Configure your Django project for REST framework and JWT authentication.

4. Run migrations and start the backend server:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend

1. Clone this repository.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Update `API.js` to set the correct backend base URL.

4. Run the React development server:

   ```bash
   npm run dev
   ```

## Usage

1. Open the app in your browser (default `http://localhost:5173`).
2. Login using your credentials.
3. View, add, edit, and delete students.
4. Use pagination controls and search to filter students.
5. Logout to clear session.

## Code Overview

* **Login.js**: Handles user login, stores JWT token in localStorage.
* **Student.js**: Displays paginated student list with search, inline editing, and modals.
* **API.js**: Axios instance configured with interceptor to add Authorization header.
* **App.js**: Main app managing authentication state and routing.

## Notes

* JWT token is stored in `localStorage`—consider security implications.
* API errors are handled with basic alert messages.
* Backend endpoints are assumed to be at `/api/` and support standard CRUD operations for students.
* Pagination and search parameters are sent via query params.
