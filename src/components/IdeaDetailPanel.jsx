import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Hash } from 'lucide-react';

export default function IdeaDetailPanel({ selectedIdea, onSave, onClose }) {
  const dialogRef = useRef(null);
  
  // Local form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [status, setStatus] = useState('todo');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Sync form states with selectedIdea
  useEffect(() => {
    if (selectedIdea) {
      setTitle(selectedIdea.title || '');
      setDesc(selectedIdea.desc || '');
      setStatus(selectedIdea.status || 'todo');
      setTags(selectedIdea.tags || []);
      setTagInput('');

      // Open native modal
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    } else {
      // Close native modal
      if (dialogRef.current && dialogRef.current.open) {
        dialogRef.current.close();
      }
    }
  }, [selectedIdea]);

  const handleBackdropClick = (e) => {
    // Backdrop is the dialog itself since inner contents wrapper occupies most space
    if (e.target === dialogRef.current) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
    onClose();
  };

  const handleAddTag = (e) => {
    if (e) e.preventDefault();
    const cleanTag = tagInput.trim().replace(/,/g, '');
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...selectedIdea,
      title: title.trim(),
      desc: desc.trim(),
      status,
      tags,
      updatedAt: new Date().toISOString().split('T')[0]
    });
    handleClose();
  };

  return (
    <dialog 
      ref={dialogRef}
      className="detail-dialog" 
      onClick={handleBackdropClick}
      onCancel={handleClose}
    >
      {selectedIdea && (
        <form onSubmit={handleSubmit} className="dialog-content">
          <div className="dialog-header">
            <h2>{selectedIdea.id === 'new' ? 'Forge New Idea' : 'Edit Idea Details'}</h2>
            <button 
              type="button" 
              className="dialog-close" 
              onClick={handleClose}
              aria-label="Close panel"
            >
              <X size={20} />
            </button>
          </div>

          <div className="dialog-body">
            <div className="form-group">
              <label htmlFor="idea-title" className="form-label">Title</label>
              <input 
                id="idea-title"
                type="text" 
                className="form-input"
                placeholder="Give your idea a striking title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="idea-status" className="form-label">Status</label>
              <select 
                id="idea-status"
                className="form-select"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="idea-desc" className="form-label">Description / Brain dump</label>
              <textarea 
                id="idea-desc"
                className="form-textarea"
                placeholder="Describe your idea in detail. Empty your thoughts here..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="idea-tags" className="form-label">Tags</label>
              <div className="tag-editor">
                {tags.map(tag => (
                  <span key={tag} className="tag-pill flex-row">
                    <Hash size={10} style={{ opacity: 0.6 }} />
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        marginLeft: '2px',
                        color: 'var(--text-muted)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
                <input 
                  id="idea-tags"
                  type="text"
                  className="tag-editor-input"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => handleAddTag()}
                />
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                Press Enter or Comma to add tag.
              </span>
            </div>
          </div>

          <div className="dialog-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Forge Idea
            </button>
          </div>
        </form>
      )}
    </dialog>
  );
}
