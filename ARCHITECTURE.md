# 🏗️ System Architecture & Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Component Details](#component-details)
4. [Data Flow](#data-flow)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Real-time Communication](#real-time-communication)
8. [Technology Decisions](#technology-decisions)

---

## System Overview

The Real-time Collaborative Document Editor is a full-stack web application that enables multiple users to simultaneously edit documents in real-time. The system uses WebSocket technology for instant synchronization and MongoDB for persistent data storage.

### Key Components
- **Frontend:** React.js single-page application
- **Backend:** Node.js/Express REST API server
- **Real-time Engine:** Socket.io for WebSocket communication
- **Database:** MongoDB for document storage
- **Text Editor:** Quill.js rich text editor

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    │
│  │   Browser    │    │   Browser    │    │   Browser    │    │
│  │   User 1     │    │   User 2     │    │   User N     │    │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘    │
│         │                   │                   │             │
│         └───────────────────┴───────────────────┘             │
│                             │                                  │
│                    ┌────────▼────────┐                        │
│                    │   React App     │                        │
│                    │  (Port 3000)    │                        │
│                    │                 │                        │
│                    │  Components:    │                        │
│                    │  - App          │                        │
│                    │  - Editor       │                        │
│                    │  - DocumentList │                        │
│                    └────────┬────────┘                        │
│                             │                                  │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                    HTTP/WebSocket
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                        SERVER LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ┌─────────────────┐                         │
│                    │  Node.js Server │                         │
│                    │   (Port 5000)   │                         │
│                    │                 │                         │
│                    │  ┌───────────┐  │                         │
│                    │  │ Express   │  │                         │
│                    │  │ REST API  │  │                         │
│                    │  └─────┬─────┘  │                         │
│                    │        │        │                         │
│                    │  ┌─────▼─────┐  │                         │
│                    │  │ Socket.io │  │                         │
│                    │  │  Server   │  │                         │
│                    │  └─────┬─────┘  │                         │
│                    │        │        │                         │
│                    │  ┌─────▼─────┐  │                         │
│                    │  │ Mongoose  │  │                         │
│                    │  │    ODM    │  │                         │
│                    │  └─────┬─────┘  │                         │
│                    └────────┼────────┘                         │
│                             │                                  │
└─────────────────────────────┼──────────────────────────────────┘
                              │
                         MongoDB Protocol
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                      DATABASE LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ┌─────────────────┐                         │
│                    │    MongoDB      │                         │
│                    │   (Port 27017)  │                         │
│                    │                 │                         │
│                    │  Collections:   │                         │
│                    │  - documents    │                         │
│                    └─────────────────┘                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### Frontend Components

#### 1. App Component (`App.js`)
**Responsibility:** Main application container, routing, and navigation

**Key Features:**
- React Router integration
- Home page with document list
- Document editor page routing
- Document creation and deletion

**State Management:**
- `documents`: Array of all documents
- `loading`: Loading state for API calls

#### 2. Editor Component (`Editor.js`)
**Responsibility:** Rich text editing and real-time collaboration

**Key Features:**
- Quill.js integration for rich text editing
- Socket.io client for real-time updates
- Auto-save functionality (2-second interval)
- User presence indicators
- Document title editing

**State Management:**
- `socket`: Socket.io connection
- `quill`: Quill editor instance
- `title`: Document title
- `activeUsers`: List of currently editing users
- `currentUser`: Current user information

**Lifecycle:**
1. Initialize Quill editor
2. Connect to Socket.io server
3. Join document room
4. Load document content
5. Listen for changes from other users
6. Send local changes to server
7. Auto-save periodically

#### 3. DocumentList Component (`DocumentList.js`)
**Responsibility:** Display and manage all documents

**Key Features:**
- Grid layout of document cards
- Document metadata display
- Delete functionality
- Empty state handling
- Loading state

**Props:**
- `documents`: Array of documents
- `loading`: Loading state
- `onDelete`: Delete handler function

### Backend Components

#### 1. Express Server (`server.js`)
**Responsibility:** HTTP server, REST API, and WebSocket server

**Key Modules:**
- Express: Web framework
- HTTP: Server creation
- Socket.io: Real-time communication
- Mongoose: MongoDB ODM
- CORS: Cross-origin resource sharing

**Configuration:**
- Port: 5000 (default)
- CORS enabled for localhost:3000
- JSON body parsing
- MongoDB connection

#### 2. REST API Routes

**GET /api/documents**
- Returns all documents sorted by update time

**GET /api/documents/:id**
- Returns specific document by ID
- Creates new document if not exists

**POST /api/documents**
- Creates new document
- Accepts title and content

**DELETE /api/documents/:id**
- Deletes document by ID

#### 3. Socket.io Event Handlers

**Connection Events:**
- `connection`: New client connected
- `disconnect`: Client disconnected

**Document Events:**
- `join-document`: User joins document room
- `leave-document`: User leaves document room
- `send-changes`: Send text changes to others
- `save-document`: Save document to database
- `cursor-position`: Send cursor position

**User Events:**
- `user-joined`: Broadcast new user
- `user-left`: Broadcast user departure
- `active-users`: Send current active users

---

## Data Flow

### Document Loading Flow

```
1. User navigates to /document/:id
                ↓
2. React component mounts
                ↓
3. Socket.io connects to server
                ↓
4. Emit 'join-document' event
                ↓
5. Server joins socket to room
                ↓
6. Server queries MongoDB for document
                ↓
7. Server emits 'load-document' with content
                ↓
8. Client updates Quill editor
                ↓
9. User can start editing
```

### Real-time Editing Flow

```
User types in editor
        ↓
Quill 'text-change' event fires
        ↓
Check if change is from user (not remote)
        ↓
Emit 'send-changes' to server with delta
        ↓
Server broadcasts to all users in room
        ↓
Other clients receive 'receive-changes'
        ↓
Update their Quill editors with delta
        ↓
Documents stay synchronized
```

### Auto-save Flow

```
Every 2 seconds (setInterval)
        ↓
Get current content from Quill
        ↓
Stringify content to JSON
        ↓
Emit 'save-document' to server
        ↓
Server updates MongoDB document
        ↓
Document persisted to database
```

---

## Database Schema

### Document Collection

```javascript
{
  documentId: String,      // Unique identifier (indexed)
  title: String,           // Document title
  content: String,         // JSON string of Quill Delta
  createdAt: Date,         // Creation timestamp
  updatedAt: Date,         // Last update timestamp (indexed)
  activeUsers: [           // Currently active users
    {
      userId: String,      // Unique user ID
      username: String,    // Display name
      color: String        // User color badge
    }
  ]
}
```

**Indexes:**
- `documentId`: Unique index for fast lookups
- `updatedAt`: Index for sorting by recent updates

**Example Document:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "documentId": "abc123def456",
  "title": "Meeting Notes",
  "content": "{\"ops\":[{\"insert\":\"Hello World\\n\"}]}",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:45:00.000Z",
  "activeUsers": [
    {
      "userId": "user123",
      "username": "User42",
      "color": "#FF6B6B"
    }
  ]
}
```

---

## API Documentation

### REST API Endpoints

#### GET /api/documents
**Description:** Retrieve all documents

**Response:**
```json
[
  {
    "documentId": "abc123",
    "title": "My Document",
    "content": "...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T14:45:00.000Z",
    "activeUsers": []
  }
]
```

#### GET /api/documents/:id
**Description:** Get specific document or create if not exists

**Parameters:**
- `id`: Document ID (path parameter)

**Response:**
```json
{
  "documentId": "abc123",
  "title": "My Document",
  "content": "...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:45:00.000Z",
  "activeUsers": []
}
```

#### POST /api/documents
**Description:** Create new document

**Request Body:**
```json
{
  "documentId": "abc123",
  "title": "New Document",
  "content": ""
}
```

**Response:**
```json
{
  "documentId": "abc123",
  "title": "New Document",
  "content": "",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "activeUsers": []
}
```

#### DELETE /api/documents/:id
**Description:** Delete document

**Parameters:**
- `id`: Document ID (path parameter)

**Response:**
```json
{
  "message": "Document deleted successfully"
}
```

---

## Real-time Communication

### Socket.io Events

#### Client → Server Events

**join-document**
```javascript
socket.emit('join-document', {
  documentId: 'abc123',
  userId: 'user123',
  username: 'User42'
});
```

**send-changes**
```javascript
socket.emit('send-changes', {
  documentId: 'abc123',
  delta: { ops: [{ insert: 'Hello' }] }
});
```

**save-document**
```javascript
socket.emit('save-document', {
  documentId: 'abc123',
  content: '{"ops":[...]}',
  title: 'My Document'
});
```

**leave-document**
```javascript
socket.emit('leave-document', {
  documentId: 'abc123',
  userId: 'user123'
});
```

#### Server → Client Events

**load-document**
```javascript
socket.emit('load-document', {
  documentId: 'abc123',
  title: 'My Document',
  content: '{"ops":[...]}'
});
```

**receive-changes**
```javascript
socket.emit('receive-changes', {
  ops: [{ insert: 'Hello' }]
});
```

**active-users**
```javascript
socket.emit('active-users', [
  { userId: 'user123', username: 'User42', color: '#FF6B6B' }
]);
```

**user-joined**
```javascript
socket.emit('user-joined', {
  userId: 'user456',
  username: 'User789',
  color: '#4ECDC4'
});
```

**user-left**
```javascript
socket.emit('user-left', {
  userId: 'user123'
});
```

---

## Technology Decisions

### Why React.js?
- Component-based architecture for reusability
- Virtual DOM for efficient updates
- Large ecosystem and community support
- Great for building dynamic UIs

### Why Node.js + Express?
- JavaScript on both frontend and backend
- Non-blocking I/O for real-time applications
- Easy integration with Socket.io
- Fast and lightweight

### Why Socket.io?
- Real-time bidirectional communication
- Automatic reconnection handling
- Room-based architecture
- Fallback to polling if WebSocket unavailable

### Why MongoDB?
- Flexible schema for document storage
- JSON-like documents match application data
- Scalable and performant
- Easy to use with Mongoose ODM

### Why Quill.js?
- Modern, powerful rich text editor
- Delta format for operational transformation
- Extensive toolbar customization
- Good documentation and support

---

## Performance Considerations

### Frontend Optimization
- React component memoization
- Lazy loading of components
- Debouncing of frequent operations
- Efficient state management

### Backend Optimization
- Connection pooling for MongoDB
- Efficient Socket.io room management
- Compression of HTTP responses
- Rate limiting to prevent abuse

### Database Optimization
- Indexing frequently queried fields
- Limiting result set sizes
- Using lean queries for better performance
- Regular database maintenance

---

## Security Considerations

### Current Implementation
- CORS configuration
- Input validation on server
- MongoDB injection prevention (via Mongoose)

### Recommended Additions
- User authentication (JWT, OAuth)
- Document access control
- Rate limiting
- Input sanitization
- HTTPS/WSS in production
- XSS protection
- CSRF tokens

---

## Scalability

### Horizontal Scaling
- Load balancer for multiple server instances
- Redis adapter for Socket.io room synchronization
- MongoDB replica sets for high availability

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching (Redis)

---

## Future Enhancements

1. **User Authentication**
   - Login/Register system
   - User profiles
   - Document ownership

2. **Advanced Collaboration**
   - Comments and suggestions
   - Version history
   - Real-time cursors

3. **Rich Features**
   - Document templates
   - Export to PDF/Word
   - Offline mode
   - Mobile app

4. **Performance**
   - Lazy loading of documents
   - Pagination
   - Caching layer

---

**This architecture supports the CODTECH Internship requirements for a real-time collaborative document editor!**
