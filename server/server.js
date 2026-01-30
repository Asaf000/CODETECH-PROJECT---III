const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/CODETECH PROJECT - III';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Document Schema
const documentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  title: { type: String, default: 'Untitled Document' },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  activeUsers: [{ 
    userId: String, 
    username: String, 
    color: String 
  }]
});

const Document = mongoose.model('Document', documentSchema);

// REST API Routes
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find().sort({ updatedAt: -1 });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/documents/:id', async (req, res) => {
  try {
    let document = await Document.findOne({ documentId: req.params.id });
    if (!document) {
      document = await Document.create({
        documentId: req.params.id,
        title: 'Untitled Document',
        content: ''
      });
    }
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const document = await Document.create({
      documentId: req.body.documentId || generateId(),
      title: req.body.title || 'Untitled Document',
      content: req.body.content || ''
    });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/documents/:id', async (req, res) => {
  try {
    await Document.findOneAndDelete({ documentId: req.params.id });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.io for real-time collaboration
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join-document', async ({ documentId, userId, username }) => {
    socket.join(documentId);
    
    // Generate random color for user
    const color = generateUserColor();
    
    try {
      // Update active users
      const document = await Document.findOne({ documentId });
      if (document) {
        // Add user to active users if not already present
        const userExists = document.activeUsers.some(u => u.userId === userId);
        if (!userExists) {
          document.activeUsers.push({ userId, username, color });
          await document.save();
        }
        
        // Notify others about new user
        socket.to(documentId).emit('user-joined', { userId, username, color });
        
        // Send current active users to new user
        socket.emit('active-users', document.activeUsers);
      }
      
      console.log(`User ${username} joined document ${documentId}`);
    } catch (error) {
      console.error('Error joining document:', error);
    }
  });

  socket.on('send-changes', ({ documentId, delta }) => {
    socket.to(documentId).emit('receive-changes', delta);
  });

  socket.on('save-document', async ({ documentId, content, title }) => {
    try {
      await Document.findOneAndUpdate(
        { documentId },
        { content, title, updatedAt: Date.now() },
        { upsert: true }
      );
      console.log(`Document ${documentId} saved`);
    } catch (error) {
      console.error('Error saving document:', error);
    }
  });

  socket.on('cursor-position', ({ documentId, userId, username, position }) => {
    socket.to(documentId).emit('cursor-update', { userId, username, position });
  });

  socket.on('leave-document', async ({ documentId, userId }) => {
    try {
      const document = await Document.findOne({ documentId });
      if (document) {
        document.activeUsers = document.activeUsers.filter(u => u.userId !== userId);
        await document.save();
        
        socket.to(documentId).emit('user-left', { userId });
      }
    } catch (error) {
      console.error('Error leaving document:', error);
    }
    socket.leave(documentId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Helper functions
function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function generateUserColor() {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
