import React, { useEffect, useRef, useState, useCallback } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import './Editor.css';

const SAVE_INTERVAL = 2000; // Auto-save every 2 seconds
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  ['clean'],
];

function Editor({ documentId }) {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const [title, setTitle] = useState('Untitled Document');
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentUser] = useState({
    userId: Math.random().toString(36).substring(2, 15),
    username: `User${Math.floor(Math.random() * 1000)}`
  });

  // Initialize Quill editor
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { 
        toolbar: TOOLBAR_OPTIONS,
        history: {
          userOnly: true
        }
      },
    });
    
    q.disable();
    q.setText('Loading document...');
    setQuill(q);
  }, []);

  // Connect to Socket.io server
  useEffect(() => {
    const s = io('http://localhost:5000');
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Load document and join room
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once('load-document', (document) => {
      quill.setContents(document.content ? JSON.parse(document.content) : {});
      setTitle(document.title || 'Untitled Document');
      quill.enable();
    });

    socket.emit('join-document', { 
      documentId, 
      userId: currentUser.userId, 
      username: currentUser.username 
    });

    return () => {
      socket.emit('leave-document', { documentId, userId: currentUser.userId });
    };
  }, [socket, quill, documentId, currentUser]);

  // Receive changes from other users
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket, quill]);

  // Send changes to other users
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', { documentId, delta });
    };

    quill.on('text-change', handler);

    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill, documentId]);

  // Auto-save document
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      const content = JSON.stringify(quill.getContents());
      socket.emit('save-document', { documentId, content, title });
    }, SAVE_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentId, title]);

  // Handle active users
  useEffect(() => {
    if (socket == null) return;

    socket.on('active-users', (users) => {
      setActiveUsers(users);
    });

    socket.on('user-joined', (user) => {
      setActiveUsers(prev => [...prev, user]);
    });

    socket.on('user-left', ({ userId }) => {
      setActiveUsers(prev => prev.filter(u => u.userId !== userId));
    });

    return () => {
      socket.off('active-users');
      socket.off('user-joined');
      socket.off('user-left');
    };
  }, [socket]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="editor-container">
      <div className="editor-toolbar-wrapper">
        <input
          type="text"
          className="document-title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Document Title"
        />
        
        <div className="active-users">
          <span className="users-label">Active Users:</span>
          {activeUsers.map((user) => (
            <div 
              key={user.userId} 
              className="user-badge"
              style={{ backgroundColor: user.color }}
            >
              {user.username}
            </div>
          ))}
          {activeUsers.length === 0 && <span className="no-users">Only you</span>}
        </div>
      </div>
      
      <div className="editor-wrapper" ref={wrapperRef}></div>
    </div>
  );
}

export default Editor;
