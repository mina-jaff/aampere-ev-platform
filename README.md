Aampere EV Platform
A full-stack application for listing and exploring electric vehicles. This platform allows users to browse available EVs, filter by various criteria, and view detailed information about each vehicle.
Project Structure
The project is organized into two main parts:

Backend: Node.js with Express and TypeScript, connected to a PostgreSQL database
Frontend: React with TypeScript for a responsive user interface

Prerequisites
Before running this application, make sure you have the following installed:

Node.js (v14+)
npm (v7+)
PostgreSQL (v12+)
Git

Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/aampere-ev-platform.git
```
cd aampere-ev-platform
2. Set up the database
Make sure PostgreSQL is running on your machine, then create a new database and user:
```bash
# Connect to PostgreSQL
psql postgres
```

# In the PostgreSQL prompt, run:
CREATE USER aampere_user WITH PASSWORD 'aampere_password';
CREATE DATABASE aampere_evs;
GRANT ALL PRIVILEGES ON DATABASE aampere_evs TO aampere_user;
\q
3. Set up the backend
```bash
# Navigate to the backend directory
cd backend
```

# Install dependencies
npm ci

# Create a .env file
echo "NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://aampere_user:aampere_password@localhost:5432/aampere_evs
JWT_SECRET=your_jwt_secret_here" > .env
4. Set up the frontend
```bash
# Navigate to the frontend directory
cd ../frontend
```

# Install dependencies
npm ci

# Create a .env file for the frontend port
echo "PORT=8081" > .env
Running the Application
1. Start the backend server
```bash
# From the backend directory
npm run dev
```
The backend server will start on http://localhost:3000.
2. Seed the database with sample data
In a new terminal window:
```bash
# From the backend directory
npm run seed
```
3. Start the frontend development server
In a new terminal window:
```bash
# From the frontend directory
npm start
```
The frontend will be available at http://localhost:8081.
API Endpoints
The backend provides the following RESTful API endpoints:

GET /api/vehicles - Get all vehicles with optional filtering
GET /api/vehicles/:id - Get a specific vehicle by ID
POST /api/vehicles - Create a new vehicle
PUT /api/vehicles/:id - Update a vehicle
DELETE /api/vehicles/:id - Delete a vehicle

Filtering Options
You can filter vehicles by adding query parameters to the /api/vehicles endpoint:

brand - Filter by vehicle brand (e.g., Tesla, Nissan)
model - Filter by vehicle model
year - Filter by manufacturing year
minPrice & maxPrice - Filter by price range
condition - Filter by condition (New or Used)
location - Filter by location

Example: /api/vehicles?brand=Tesla&minPrice=50000&maxPrice=100000
Running Tests
```bash
# From the backend directory
npm test
```

## Technologies Used

### Backend
- Node.js
- Express
- TypeScript
- TypeORM
- PostgreSQL
- Jest (for testing)

### Frontend
- React
- TypeScript
- React Router
- CSS3 with responsive design

## Deployment Instructions (AWS)
To deploy this application to AWS, you would:

### Database: Use Amazon RDS for PostgreSQL
- Create a new PostgreSQL instance
- Configure security groups to allow connections from your application
- Update the DATABASE_URL in your environment variables


### Backend: Use AWS Elastic Beanstalk or EC2
- Create a new Elastic Beanstalk environment for Node.js
- Deploy your backend code
- Set environment variables for DATABASE_URL, JWT_SECRET, etc.


### Frontend: Use AWS S3 and CloudFront
- Build your React application (npm run build)
- Upload the build files to an S3 bucket for website hosting
- Set up CloudFront for global content delivery
- Configure CloudFront to point to your S3 bucket

### Domain and HTTPS: Use Route 53 and ACM
- Register a domain or use an existing one
- Create SSL certificates with AWS Certificate Manager
- Configure CloudFront to use HTTPS


### CI/CD: Use AWS CodePipeline
- Set up a pipeline that automatically builds and deploys your app when you push to your repository

## Future Improvements
- User authentication and personal vehicle lists
- Advanced search with more filtering options
- Vehicle comparison feature
- Messaging, notifications and status updates from sellers
- Integration with mapping services for vehicle locations
