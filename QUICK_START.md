# 🚀 QUICK START GUIDE - Real-Time Collaborative Document Editor

## 📥 What You Downloaded

This is a **complete, ready-to-run** Real-Time Collaborative Document Editor for your CODTECH Internship.

---

## ⚡ FASTEST WAY TO RUN (3 Steps)

### Step 1: Install Prerequisites

You need **Node.js** and **MongoDB** installed on your computer.

#### Install Node.js:
- **Windows/Mac:** Download from https://nodejs.org/ (Choose LTS version)
- **Linux:** 
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

#### Install MongoDB:
- **Windows:** Download from https://www.mongodb.com/try/download/community
- **Mac:** 
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community
  brew services start mongodb-community
  ```
- **Linux (Ubuntu/Debian):**
  ```bash
  curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
  echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org
  sudo systemctl start mongod
  ```

### Step 2: Extract and Navigate

```bash
# Extract the zip file (or use your file explorer)
unzip collab-editor.zip
cd collab-editor
```

### Step 3: Run the Application

**Option A - Automatic (Linux/Mac):**
```bash
chmod +x start.sh
./start.sh
```

**Option B - Manual (All Platforms):**

Open **TWO** terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm start
```

### Step 4: Open Your Browser

The app will automatically open at: **http://localhost:3000**

If not, manually open your browser and go to: **http://localhost:3000**

---

## 🎯 How to Use

1. **Create a Document:** Click "Create New Document" button
2. **Start Typing:** Use the toolbar to format your text
3. **Collaborate:** Share the URL with others to edit together!
4. **View Documents:** Click "Back to Documents" to see all your documents

---

## 🔧 Troubleshooting

### Problem: "MongoDB connection failed"
**Solution:** Make sure MongoDB is running:
```bash
# Check if MongoDB is running
sudo systemctl status mongod   # Linux
brew services list             # Mac

# Start MongoDB if not running
sudo systemctl start mongod    # Linux
brew services start mongodb-community  # Mac
```

### Problem: "Port already in use"
**Solution:** Another app is using port 5000 or 3000. Kill it:
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Problem: "npm command not found"
**Solution:** Node.js is not installed. Go back to Step 1.

### Problem: Dependencies installation fails
**Solution:** Clear cache and try again:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📁 Project Structure

```
collab-editor/
├── client/              # React Frontend
├── server/              # Node.js Backend
├── README.md            # Main documentation
├── SETUP_GUIDE.md       # Detailed setup guide
├── ARCHITECTURE.md      # Technical architecture
├── TESTING.md           # Testing guide
├── PROJECT_SUMMARY.md   # Completion info
└── start.sh            # Quick start script
```

---

## 🌐 Using MongoDB Atlas (Cloud Database - No Local Install Needed!)

If you don't want to install MongoDB locally:

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster (M0)
4. Get your connection string
5. Update `server/server.js` line 18:

```javascript
const MONGODB_URI = 'your-mongodb-atlas-connection-string';
```

---

## 🚀 Features You Can Test

- ✅ Create multiple documents
- ✅ Rich text formatting (bold, italic, lists, colors)
- ✅ Real-time collaboration (open same document in 2 browsers)
- ✅ Auto-save (no need to manually save)
- ✅ User presence (see who's editing)
- ✅ Delete documents

---

## 📚 Documentation

For detailed information, check these files:
- `README.md` - Main project documentation
- `SETUP_GUIDE.md` - Comprehensive setup instructions
- `ARCHITECTURE.md` - System architecture details
- `TESTING.md` - Testing guide
- `PROJECT_SUMMARY.md` - Project completion summary

---

## 💡 Tips

1. **Test Collaboration:** Open the same document URL in 2 different browsers (regular and incognito)
2. **Data Persistence:** All documents are saved in MongoDB
3. **Auto-save:** Documents save automatically every 2 seconds
4. **Mobile Friendly:** Try it on your phone!

---

## ✅ Completion Certificate

This project meets all CODTECH Internship requirements:
- ✅ React.js frontend
- ✅ Node.js backend
- ✅ MongoDB database
- ✅ Real-time collaboration
- ✅ Full documentation

**Completion certificate will be issued on internship end date.**

---

## 🆘 Need Help?

1. Check the `SETUP_GUIDE.md` for detailed instructions
2. Review `TESTING.md` for common issues
3. Make sure Node.js and MongoDB are properly installed
4. Verify MongoDB is running before starting the app

---

## 🎉 You're All Set!

The application should now be running at:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

**Happy Coding! 🚀**

---

**CODTECH Internship Project**
**Real-Time Collaborative Document Editor**
**Built with React.js, Node.js, MongoDB, Socket.io**
