# 📝 Real-Time Collaborative Document Editor

A modern, feature-rich collaborative document editor built with React.js, Node.js, Socket.io, and MongoDB. Edit documents together in real-time with multiple users!

## ✨ Features

- **Real-time Collaboration**: Multiple users can edit the same document simultaneously
- **Live User Presence**: See who's currently editing with color-coded user badges
- **Auto-save**: Documents automatically save every 2 seconds
- **Rich Text Editing**: Full-featured text editor with formatting, lists, links, images, and more
- **Document Management**: Create, view, and delete documents
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework for building dynamic interfaces
- **Quill.js** - Rich text editor
- **Socket.io-client** - Real-time WebSocket communication
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (v4.4 or higher)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd collab-editor
```

### 2. Install MongoDB

**For Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**For macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**For Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### 3. Setup Backend Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
npm start
# OR for development with auto-reload
npm run dev
```

The server will run on `http://localhost:5000`

### 4. Setup Frontend Client

Open a new terminal window:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the React app
npm start
```

The client will run on `http://localhost:3000`

## 🎯 Usage

1. **Create a New Document**
   - Click "Create New Document" button on the home page
   - You'll be redirected to a new document with a unique ID

2. **Edit Documents**
   - Start typing in the editor
   - Use the toolbar for text formatting
   - Changes are automatically saved every 2 seconds

3. **Collaborate in Real-time**
   - Share the document URL with others
   - Multiple users can edit simultaneously
   - See active users in the top-right corner

4. **Manage Documents**
   - View all documents on the home page
   - Click on a document to open it
   - Delete documents using the trash icon

## 📁 Project Structure

```
collab-editor/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor.js
│   │   │   ├── Editor.css
│   │   │   ├── DocumentList.js
│   │   │   └── DocumentList.css
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── server/                 # Node.js backend
    ├── server.js          # Main server file
    └── package.json
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/collab-editor
```

### MongoDB Connection

The default MongoDB connection string is:
```
mongodb://localhost:27017/collab-editor
```

Modify this in `server/server.js` if using a different database.

## 🌐 API Endpoints

### REST API

- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get a specific document
- `POST /api/documents` - Create a new document
- `DELETE /api/documents/:id` - Delete a document

### Socket.io Events

**Client → Server:**
- `join-document` - Join a document room
- `send-changes` - Send text changes to other users
- `save-document` - Save document to database
- `leave-document` - Leave a document room
- `cursor-position` - Send cursor position

**Server → Client:**
- `load-document` - Load document content
- `receive-changes` - Receive text changes from others
- `active-users` - Get list of active users
- `user-joined` - Notification when a user joins
- `user-left` - Notification when a user leaves
- `cursor-update` - Receive cursor position updates

## 🎨 Features in Detail

### Rich Text Editor
- Headers (H1-H6)
- Font styles
- Bold, Italic, Underline, Strike-through
- Ordered and Unordered lists
- Text color and background
- Subscript and Superscript
- Text alignment
- Code blocks and blockquotes
- Links and images

### Real-time Collaboration
- Operational Transformation for conflict resolution
- User presence indicators
- Color-coded user badges
- Live cursor tracking (optional)

### Auto-save
- Saves every 2 seconds automatically
- No manual save required
- Prevents data loss

## 🔒 Security Considerations

For production deployment, consider implementing:
- User authentication and authorization
- Document access control
- Rate limiting
- Input sanitization
- HTTPS/WSS encryption
- CORS configuration
- Environment-based configuration

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Update MongoDB connection string (use MongoDB Atlas)
3. Deploy the server directory

### Frontend Deployment (Vercel/Netlify)
1. Build the React app: `npm run build`
2. Deploy the build folder
3. Update API URLs to point to production backend

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running: `sudo systemctl status mongodb`
- Check connection string in server.js
- Verify MongoDB port (default: 27017)

**Socket.io Connection Issues:**
- Check CORS configuration in server.js
- Verify server and client URLs match
- Check firewall settings

**Port Already in Use:**
- Change PORT in .env file
- Kill process using the port: `lsof -ti:5000 | xargs kill -9`

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Quill.js for the rich text editor
- Socket.io for real-time communication
- MongoDB for flexible data storage
- React.js community

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for CODTECH Internship**

**Completion Certificate will be issued on internship end date**
