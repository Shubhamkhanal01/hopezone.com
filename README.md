# Hope Zone Backend

Backend server for the Hope Zone Gaming Center application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the Backend directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://shubhamkhanal57:Shubham123%23%23@hopeapi.ghxbk.mongodb.net/hopezone?retryWrites=true&w=majority
   ```

   > Note: This application uses MongoDB Atlas cloud database, so no local MongoDB installation is required.

## Running the Server

### Option 1: Using the provided scripts (Recommended)
- **For Windows PowerShell**: Right-click on `start-backend.ps1` and select "Run with PowerShell".
- **For Windows CMD**: Double-click on `start-backend.bat`.

### Option 2: Using npm commands
```
# From the Backend directory
npm run dev   # Development mode with auto-restart
npm start     # Production mode
```

## MongoDB Atlas Connection

This project uses MongoDB Atlas, a fully managed cloud database. The connection string is already configured in the `.env` file, so you don't need to install MongoDB locally.

If you want to use your own MongoDB Atlas database:
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string from the cluster
4. Replace the MONGODB_URI in the `.env` file with your connection string

## Troubleshooting

### Windows PowerShell Issues

In Windows PowerShell, the `&&` operator might not work as expected. Use these commands:

```powershell
# Navigate to Backend directory
cd Backend

# Then run the dev server
npm run dev
```

### MongoDB Connection Issues

If you see errors connecting to MongoDB Atlas:

1. Check your internet connection
2. Verify that the MongoDB Atlas connection string in the `.env` file is correct
3. Make sure your IP address is whitelisted in the MongoDB Atlas Network Access settings
4. Check if the MongoDB Atlas username and password are correct

### Offline Mode

The server can run without a MongoDB connection, but database features (user registration, login, etc.) won't work. You'll see "Running in offline mode" in the console and visiting the home page (`http://localhost:5000`) will show the current status.

## API Endpoints

- `POST /api/register` - Register a new user
  - Body: `{ name, email, password }`
  - Response: User data with ID

- `POST /api/login` - Login a user
  - Body: `{ email, password }`
  - Response: User data with ID

- `GET /api/users/:id` - Get user profile

- `GET /api/status` - Check server and database status

## Authentication

The API uses a simple authentication system where the user ID is passed as a header:
```
user-id: [userId]
```

This can easily be enhanced with JWT tokens in the future.

## Project Structure

```
Backend/
├── models/         # Database models (User, Booking)
├── routes/         # API routes
├── middlewares/    # Middleware functions
├── .env            # Environment variables
├── package.json    # Project dependencies
├── server.js       # Entry point
└── README.md       # Documentation
``` 