import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DocumentList.css';

function DocumentList({ documents, loading, onDelete }) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📄</div>
        <h3>No documents yet</h3>
        <p>Create your first collaborative document to get started!</p>
      </div>
    );
  }

  return (
    <div className="document-list">
      <h2>Your Documents</h2>
      <div className="documents-grid">
        {documents.map((doc) => (
          <div key={doc.documentId} className="document-card">
            <div 
              className="document-content"
              onClick={() => navigate(`/document/${doc.documentId}`)}
            >
              <h3>{doc.title || 'Untitled Document'}</h3>
              <p className="document-date">
                Last updated: {formatDate(doc.updatedAt)}
              </p>
              <p className="document-id">ID: {doc.documentId}</p>
              {doc.activeUsers && doc.activeUsers.length > 0 && (
                <div className="document-users">
                  <span className="users-online">
                    👥 {doc.activeUsers.length} user{doc.activeUsers.length > 1 ? 's' : ''} online
                  </span>
                </div>
              )}
            </div>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this document?')) {
                  onDelete(doc.documentId);
                }
              }}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentList;
