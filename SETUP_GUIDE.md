# 🚀 Complete Setup & Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Database Configuration](#database-configuration)
3. [Running the Application](#running-the-application)
4. [Production Deployment](#production-deployment)
5. [Common Issues & Solutions](#common-issues--solutions)

---

## Local Development Setup

### Step 1: Install Node.js and npm

**Windows:**
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify installation:
```bash
node --version
npm --version
```

**macOS:**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install MongoDB

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Add MongoDB to PATH
4. Start MongoDB service from Services

**macOS:**
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify installation
mongosh
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Create list file
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongosh
```

### Step 3: Project Setup

```bash
# Clone or download the project
cd collab-editor

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## Database Configuration

### Local MongoDB Configuration

The application automatically creates a database named `collab-editor` when you first run it.

**Verify MongoDB is running:**
```bash
# Check status
sudo systemctl status mongod  # Linux
brew services list            # macOS
# Check Services app           # Windows

# Connect to MongoDB shell
mongosh

# Use the database
use collab-editor

# View collections
show collections
```

### MongoDB Atlas (Cloud) Configuration

For production or if you don't want to install MongoDB locally:

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create Cluster:**
   - Create a new cluster (free tier available)
   - Choose a cloud provider and region
   - Wait for cluster creation (2-5 minutes)

3. **Configure Access:**
   - Click "Database Access" → Add user
   - Create username and password
   - Click "Network Access" → Add IP Address
   - Add `0.0.0.0/0` (allows access from anywhere)

4. **Get Connection String:**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password

5. **Update Server Configuration:**
   ```javascript
   // In server/server.js, update the MONGODB_URI
   const MONGODB_URI = 'mongodb+srv://username:password@cluster.mongodb.net/collab-editor?retryWrites=true&w=majority';
   ```

---

## Running the Application

### Development Mode

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
# Client runs on http://localhost:3000
```

**Access the Application:**
- Open browser and go to `http://localhost:3000`
- Create a new document
- Share the URL with others to collaborate!

### Production Mode

**Build Frontend:**
```bash
cd client
npm run build
# Creates optimized production build in client/build/
```

**Serve Static Files:**
```javascript
// Add to server/server.js
const path = require('path');

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});
```

---

## Production Deployment

### Option 1: Deploy to Heroku

**Backend Deployment:**
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Add MongoDB Atlas connection string
heroku config:set MONGODB_URI="your-connection-string"

# Deploy server
cd server
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku master
```

**Frontend Deployment (on Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel

# Update API URLs in client code to point to Heroku backend
```

### Option 2: Deploy to Railway

**Backend:**
1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Add MongoDB Atlas connection string as environment variable
5. Deploy automatically

**Frontend:**
1. Deploy to Vercel or Netlify
2. Update environment variables with Railway backend URL

### Option 3: Deploy to AWS EC2

**Setup EC2 Instance:**
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
# (Follow Linux installation steps above)

# Clone your repo
git clone your-repo-url
cd collab-editor

# Install dependencies
cd server && npm install
cd ../client && npm install && npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start server
cd server
pm2 start server.js --name "collab-editor"
pm2 save
pm2 startup
```

**Setup Nginx:**
```bash
sudo apt-get install nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/collab-editor
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/collab-editor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using port
lsof -ti:5000

# Kill the process
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

### Issue 3: CORS Errors

**Error:** `Access to fetch at 'http://localhost:5000/api/documents' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
```javascript
// In server/server.js, ensure CORS is properly configured
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',  // Update for production
  credentials: true
}));
```

### Issue 4: Socket.io Connection Issues

**Error:** WebSocket connection failed

**Solutions:**
1. Check firewall settings
2. Ensure server is running
3. Verify Socket.io configuration:
```javascript
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});
```

### Issue 5: npm install Errors

**Error:** Various dependency installation errors

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If using different Node version
nvm install 18
nvm use 18
npm install
```

### Issue 6: React Build Errors

**Error:** Build optimization failed

**Solutions:**
```bash
# Increase Node memory limit
export NODE_OPTIONS=--max_old_space_size=4096
npm run build

# Or update package.json scripts
"build": "react-scripts --max_old_space_size=4096 build"
```

---

## Performance Optimization

### 1. Enable Compression
```bash
npm install compression
```

```javascript
// In server.js
const compression = require('compression');
app.use(compression());
```

### 2. Add Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Database Indexing
```javascript
// Add indexes to frequently queried fields
documentSchema.index({ documentId: 1 });
documentSchema.index({ updatedAt: -1 });
```

---

## Monitoring & Logging

### Production Logging
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## Security Best Practices

1. **Environment Variables:** Never commit .env files
2. **Authentication:** Implement JWT or OAuth for user auth
3. **Input Validation:** Sanitize all user inputs
4. **Rate Limiting:** Prevent abuse and DDoS
5. **HTTPS:** Always use SSL in production
6. **Database Security:** Use strong passwords and limit access
7. **Dependencies:** Regularly update packages

---

## Support & Resources

- **MongoDB Documentation:** https://docs.mongodb.com/
- **Socket.io Documentation:** https://socket.io/docs/
- **React Documentation:** https://reactjs.org/docs/
- **Node.js Documentation:** https://nodejs.org/docs/

For issues, create a GitHub issue or contact support.

---

**Good luck with your CODTECH Internship project! 🚀**
