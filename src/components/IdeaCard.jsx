import React from 'react';
import { 
  Eye, 
  Trash2, 
  GitMerge, 
  Calendar,
  Hash
} from 'lucide-react';

export default function IdeaCard({ 
  idea, 
  onSelect, 
  onDelete, 
  onToggleConnect, 
  isConnectionSource 
}) {
  const formattedDate = new Date(idea.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article 
      id={`idea-card-${idea.id}`}
      className={`idea-card ${isConnectionSource ? 'connection-source' : ''}`}
      onClick={() => onSelect(idea)}
    >
      <div className="idea-card-header">
        <h3 className="idea-card-title">{idea.title}</h3>
        <span 
          className="status-dot" 
          data-status={idea.status} 
          title={`Status: ${idea.status}`} 
        />
      </div>

      <p className="idea-card-desc">
        {idea.desc || 'No description provided.'}
      </p>

      {idea.tags && idea.tags.length > 0 && (
        <div className="tag-container">
          {idea.tags.map(tag => (
            <span key={tag} className="tag-pill">
              <span className="flex-row">
                <Hash size={10} style={{ opacity: 0.6 }} />
                {tag}
              </span>
            </span>
          ))}
        </div>
      )}

      <div className="idea-card-footer" onClick={e => e.stopPropagation()}>
        <span className="card-date flex-row">
          <Calendar size={12} />
          {formattedDate}
        </span>
        <div className="card-actions">
          <button 
            type="button"
            className={`card-action-btn ${isConnectionSource ? 'active' : ''}`}
            onClick={() => onToggleConnect(idea.id)}
            title="Link this idea to another"
          >
            <GitMerge size={16} />
          </button>
          <button 
            type="button"
            className="card-action-btn"
            onClick={() => onSelect(idea)}
            title="View details"
          >
            <Eye size={16} />
          </button>
          <button 
            type="button"
            className="card-action-btn delete"
            onClick={() => onDelete(idea.id)}
            title="Delete idea"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
