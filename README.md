# Rwanda Citizen Engagement System

A modern platform for Rwandan citizens to submit complaints and feedback about public services, enabling better communication between citizens and government agencies.

## Features

- 📝 Submit complaints and feedback
- 🏢 Automatic routing to appropriate government agencies
- 📊 Track complaint status
- 📱 Responsive design for all devices
- 🔒 Secure authentication system with role-based access
- 📈 Admin dashboard for government officials
- 🌐 Localized for Rwanda
- 🔐 Strong password requirements
- 📱 Phone number validation (Rwanda format)
- 🆔 National ID validation (16 digits)

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Python FastAPI
- Database: MongoDB
- Authentication: JWT with role-based access
- File Storage: AWS S3 (for attachments)

## Current Progress

### Completed Features
1. Frontend:
   - User authentication (login/register)
   - Role-based navigation (Citizen, Agency Admin, System Admin)
   - Responsive Material-UI components
   - Form validations for:
     - National ID (16 digits)
     - Phone numbers (Rwanda format)
     - Strong passwords
   - Dashboard layouts for different user roles

2. Backend:
   - FastAPI setup with MongoDB integration
   - User authentication endpoints
   - Role-based access control
   - Data validation schemas
   - Superuser creation script

### In Progress
1. Backend:
   - MongoDB connection setup
   - API endpoint implementation
   - File upload functionality

2. Frontend:
   - Complaint submission form
   - Status tracking interface
   - Agency dashboard features

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8+
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd MVP-for-a-Citizen-Complaints-and-Engagement-System
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

4. **Set up MongoDB:**
   - Install MongoDB on your system
   - Start MongoDB service
   - The backend will connect to `mongodb://localhost:27017` by default

5. **Create a superuser:**
   ```bash
   cd backend
   python create_superuser.py admin@rwanda.gov Admin@12345 "System Administrator" 0785043355 1200280067198176
   ```

6. **Run the development servers:**
   - **Frontend:**
     ```bash
     cd frontend
     npm start
     ```
   - **Backend:**
     ```bash
     cd backend
     uvicorn main:app --reload --port 5000
     ```

## Project Structure

```
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/     # Page components
│   │   ├── contexts/  # React contexts
│   │   └── utils/     # Utility functions
├── backend/           # FastAPI backend application
│   ├── routers/      # API route handlers
│   ├── models/       # Database models
│   └── utils/        # Utility functions
├── docs/             # Documentation
└── README.md         # Project documentation
```

## Troubleshooting

- **MongoDB Connection Issues:**
  - Ensure MongoDB is installed and running
  - Check if MongoDB is running on the default port (27017)
  - Verify MongoDB connection string in backend configuration

- **Python dependency errors:**
  - Make sure you are using Python 3.8+
  - Install dependencies from requirements.txt
  - If you see errors about uvicorn, install it separately:
    ```bash
    pip install uvicorn
    ```

- **Frontend issues:**
  - Clear node_modules and reinstall:
    ```bash
    cd frontend
    rm -rf node_modules
    npm install
    ```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 