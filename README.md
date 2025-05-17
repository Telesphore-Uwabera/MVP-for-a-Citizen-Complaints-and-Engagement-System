# Rwanda Citizen Engagement System

A modern platform for Rwandan citizens to submit complaints and feedback about public services, enabling better communication between citizens and government agencies.

## Features

### User Management
- 🔐 Secure authentication with JWT
- 👥 Role-based access control (Citizen, Agency Admin, System Admin)
- 📱 Phone number validation (Rwanda format)
- 🆔 National ID validation (16 digits)
- 🔒 Strong password requirements

### Complaint Management
- 📝 Submit complaints with attachments
- 🏢 Automatic routing to appropriate government agencies
- 📊 Track complaint status
- 📈 Analytics dashboard for administrators
- 🔍 Search and filter complaints

### User Interface
- 📱 Responsive design for all devices
- 🎨 Modern Material-UI components
- 🌐 Localized for Rwanda
- 🎯 Intuitive navigation
- 📊 Interactive dashboards

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
- All contributors and stakeholders 