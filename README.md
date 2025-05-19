# Rwanda Citizen Engagement System

## How to Use the Application

### For Citizens (End Users)

1. **Access the Application**
   - Open your browser and go to `http://localhost:3000` 

2. **Register an Account**
   - Click on the **Register** link.
   - Fill in your details:
     - Email Address
     - Password & Confirm Password
     - Full Name
     - National ID (16 digits)
     - Phone Number (Rwanda format)
   - Click **Register**.
   - If registration fails, check for:
     - All fields are filled correctly.
     - Password meets requirements.
     - National ID is 16 digits.
     - Phone number is valid.
     - The email or national ID is not already registered.

3. **Log In**
   - After registering, go to the **Sign In** page.
   - Enter your email and password.
   - Click **Login**.

4. **Submit a Complaint**
   - Once logged in, navigate to the **Dashboard**.
   - Click **Submit Complaint**.
   - Fill in the complaint form (title, description, category, location, etc.).
   - Attach files if needed.
   - Submit your complaint.
   - You can track the status of your complaints from the dashboard.

5. **View Complaint Status**
   - Go to the dashboard to see all your submitted complaints and their statuses.

---

### For Admins (System/Admin/Agency)

1. **Create a Superuser (First Time Only)**
   - In the backend directory, run:
     ```bash
     python create_superuser.py admin@rwanda.gov Admin@12345 "System Administrator" 0785043355 1200280067198176
     ```
   - Log in with the superuser credentials.

2. **Access the Admin Dashboard**
   - Log in as an admin.
   - Access the dashboard to manage users, agencies, and complaints.

3. **Manage Complaints**
   - View, assign, and update the status of complaints.
   - Use analytics and search features as needed.

---

### Troubleshooting & Tips

- **Registration Fails:**
  - Check the error message. Common issues:
    - Duplicate email or national ID.
    - Invalid field formats.
    - Backend server is not running.
    - MongoDB is not running.
- **Cannot Connect to Backend:**
  - Ensure the backend is running with:
    ```bash
    uvicorn backend.main:app --reload --port 5000
    ```
  - Ensure MongoDB is running and accessible.
- **Frontend Not Loading:**
  - Make sure you are in the `frontend` directory and run:
    ```bash
    npm start
    ```
- **Method Not Allowed (405):**
  - This means you tried to access a POST endpoint (like `/api/auth/register`) with a GET request (e.g., by visiting the URL directly). Use the app's forms to interact with these endpoints.
- **422 Unprocessable Content:**
  - The data sent to the backend does not match what is expected. Double-check the registration form fields.

---

A modern platform for Rwandan citizens to submit complaints and feedback about public services, enabling better communication between citizens and government agencies.

## Features

### User Management
- Secure authentication with JWT
- Role-based access control (Citizen, Agency Admin, System Admin)
- Phone number validation (Rwanda format)
- National ID validation (16 digits)
- Strong password requirements

### Complaint Management
- Submit complaints with attachments
- Automatic routing to appropriate government agencies
- Track complaint status
- Analytics dashboard for administrators
- Search and filter complaints

### User Interface
- Responsive design for all devices
- Modern Material-UI components
- Localized for Rwanda
- Intuitive navigation
- Interactive dashboards

## User Roles and Permissions

The system supports three main user roles:

### 1. Citizen
- Can register and log in to the platform
- Submit complaints and feedback about public services
- Track the status of their complaints
- View their complaint history

### 2. Agency Admin
- Manages complaints assigned to their agency
- Updates the status of complaints (e.g., in progress, resolved)
- Communicates with citizens regarding their complaints
- Views analytics and reports related to their agency

### 3. System Admin
- Has full access to all system features
- Manages all users (citizens, agency admins)
- Manages government agencies
- Assigns complaints to agencies
- Views system-wide analytics and reports
- Can create other admin accounts

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls
- Form validation with Yup
- Context API for state management

### Backend
- FastAPI (Python)
- MongoDB for database
- JWT for authentication
- Pydantic for data validation
- Uvicorn for ASGI server

### Development Tools
- Git for version control
- ESLint for code quality
- TypeScript for type safety
- npm for package management
- pip for Python dependencies

## Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── constants/      # Constants and configurations
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── public/             # Static files
│   └── package.json        # Frontend dependencies
│
├── backend/                 # FastAPI backend application
│   ├── routers/            # API route handlers
│   ├── models/             # Database models
│   ├── schemas/            # Pydantic schemas
│   ├── utils/              # Utility functions
│   └── requirements.txt    # Python dependencies
│
└── docs/                   # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Telesphore-Uwabera/MVP-for-a-Citizen-Complaints-and-Engagement-System.git
   cd MVP-for-a-Citizen-Complaints-and-Engagement-System
   ```

2. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   pip install email-validator
   uvicorn main:app --reload --port 5000
   ```

4. **Set up MongoDB**
   - Install MongoDB on your system
   - Start MongoDB service
   - The backend will connect to `mongodb://localhost:27017` by default

5. **Create a superuser**
   ```bash
   cd backend
   python create_superuser.py admin@rwanda.gov Admin@12345 "System Administrator" 0785043355 1200280067198176
   ```

## API Documentation

The API documentation is available at `http://localhost:5000/docs` when the backend server is running.

### Key Endpoints

- `/api/auth/register` - User registration
- `/api/auth/login` - User login
- `/api/complaints` - Complaint management
- `/api/agencies` - Agency management
- `/api/users` - User management

## Development

### Frontend Development
- The frontend runs on `http://localhost:3000`
- Hot reloading is enabled
- TypeScript type checking is enforced
- ESLint is configured for code quality

### Backend Development
- The backend runs on `http://localhost:5000`
- API documentation is auto-generated
- MongoDB connection is required
- Environment variables can be configured in `.env`

## Deployment

### Frontend Deployment
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `build` directory to your hosting service

### Backend Deployment
1. Set up a production MongoDB instance
2. Configure environment variables
3. Deploy using a production ASGI server (e.g., Gunicorn)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Rwanda Information Society Authority (RISA)
- Ministry of ICT and Innovation

## Contributors

- Developed by Telesphore Uwabera
- Visit [my portfolio](https://uwaberatelesphore.netlify.com)
