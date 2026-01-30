import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Editor from './components/Editor';
import DocumentList from './components/DocumentList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/document/:id" element={<EditorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/documents');
      const data = await response.json();
      setDocuments(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setLoading(false);
    }
  };

  const createNewDocument = async () => {
    const documentId = Math.random().toString(36).substring(2, 15);
    navigate(`/document/${documentId}`);
  };

  const deleteDocument = async (documentId) => {
    try {
      await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: 'DELETE'
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>📝 Collaborative Document Editor</h1>
        <p>Create and edit documents in real-time with others</p>
      </header>
      
      <div className="home-content">
        <button className="new-doc-btn" onClick={createNewDocument}>
          + Create New Document
        </button>
        
        <DocumentList 
          documents={documents} 
          loading={loading}
          onDelete={deleteDocument}
        />
      </div>
    </div>
  );
}

function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="editor-page">
      <div className="editor-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to Documents
        </button>
        <h2>Document ID: {id}</h2>
      </div>
      <Editor documentId={id} />
    </div>
  );
}

export default App;
