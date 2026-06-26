# Dog Registration App

A full-stack web application for registering dogs and their owners. Built with React, Node.js, Express, and MongoDB.

---

## Tech Stack

**Frontend**
- React 19
- React Router DOM
- Vite

**Backend**
- Node.js
- Express
- Express Validator
- Mongoose

**Database**
- MongoDB (local)

---

## Project Structure

```
dog-registration-app/
├── backend/
│   ├── models/
│   │   └── Registration.js
│   ├── routes/
│   │   └── registrations.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── src/
│   ├── pages/
│   │   ├── RegisterPage.jsx
│   │   └── RecordsPage.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## Features

**Registration Form**
- Dog details: name, breed, primary color, secondary color, date of birth, gender, neutered, spayed
- Owner details: name, email, phone, address, city, state, postal code
- Client-side and server-side validation
- Inline validation messages
- Submit button disabled until form is valid
- Loading indicator during submission
- Success and error toast notifications
- Auto reset after successful submission
- Progress bar showing form completion

**Records Page**
- Table displaying all registered dogs
- Search by dog name, owner name, or email
- Sort by registration date (newest / oldest)
- Pagination (10 records per page)
- Loading state while fetching
- Empty state when no records exist

---

## Form Validations

| Field | Rule |
|---|---|
| Dog Name | Required, minimum 3 characters |
| Dog Breed | Required |
| Dog Primary Color | Required, one of: Black, White, Brown, Gray |
| Dog Date of Birth | Required, cannot be a future date |
| Dog Gender | Required |
| Neutered / Spayed | Required, Yes or No |
| Owner Name | Required |
| Owner Email | Required, valid email format |
| Owner Phone | Required, exactly 10 digits |
| Owner Postal Code | Required, digits only |
| Address / City / State | Required |

---

## API Endpoints

### POST /api/register
Accepts registration form data, validates it, and saves to MongoDB.

**Request Body**
```json
{
  "dogName": "Buddy",
  "dogBreed": "Golden Retriever",
  "dogColor1": "Brown",
  "dogColor2": "White",
  "dogDob": "2021-04-15",
  "dogGender": "male",
  "neutered": "yes",
  "spayed": "no",
  "ownerName": "John Smith",
  "email": "john@example.com",
  "address": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "phoneNum": "9876543210"
}
```

**Success Response**
```json
{
  "success": true,
  "message": "Registration completed successfully."
}
```

**Validation Error Response**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "dogName": "Dog name is required"
  }
}
```

---

### GET /api/registrations
Retrieves all stored registration records with pagination and search.

**Query Parameters**

| Parameter | Default | Description |
|---|---|---|
| page | 1 | Page number |
| limit | 10 | Records per page |
| search | "" | Search by name or email |
| sortOrder | desc | asc or desc |

**Success Response**
```json
{
  "success": true,
  "data": [...],
  "total": 50,
  "page": 1,
  "pages": 5
}
```

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB installed and running locally

### 1. Clone the repository
```
git clone https://github.com/Guddu-Pandit/Dog-Registration-Form.git
cd Dog-Registration-Form
```

### 2. Install frontend dependencies
```
npm install
```

### 3. Install backend dependencies
```
cd backend
npm install
```

### 4. Configure environment variables
The `backend/.env` file is already set up for local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/dog-registration
PORT=5000
```

### 5. Start MongoDB
```
net start MongoDB
```

### 6. Start the backend (Terminal 1)
```
cd backend
npm run dev
```
You should see:
```
MongoDB connected
Server running -> http://localhost:5000
```

### 7. Start the frontend (Terminal 2)
```
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Database

MongoDB is used for persistent storage. No manual setup is required.

- The database `dog-registration` is created automatically on first backend start.
- The `registrations` collection is created automatically on first form submission.

### Record Schema

| Field | Type | Description |
|---|---|---|
| dogName | String | Dog's name |
| dogBreed | String | Dog's breed |
| dogColor1 | String | Primary color |
| dogColor2 | String | Secondary color (optional) |
| dogDob | Date | Date of birth |
| dogGender | String | male or female |
| neutered | String | yes or no |
| spayed | String | yes or no |
| ownerName | String | Owner's full name |
| email | String | Owner's email address |
| address | String | Street address |
| city | String | City |
| state | String | State |
| postalCode | String | Postal code |
| phoneNum | String | 10-digit phone number |
| createdAt | Date | Auto-generated timestamp |
| updatedAt | Date | Auto-generated timestamp |

---

## Scripts

**Frontend**

| Command | Description |
|---|---|
| npm run dev | Start development server |
| npm run build | Build for production |
| npm run preview | Preview production build |

**Backend**

| Command | Description |
|---|---|
| npm run dev | Start with nodemon (auto-restart) |
| npm start | Start without auto-restart |
