import React from 'react';
import { 
  Lightbulb, 
  Layers, 
  GitCommit, 
  GitMerge, 
  Trash2, 
  PieChart, 
  CheckCircle, 
  TrendingUp, 
  HelpCircle,
  Hash
} from 'lucide-react';

export default function Sidebar({ 
  ideas, 
  connections, 
  onDeleteConnection,
  filterTag,
  onSelectTag,
  activeSection,
  setActiveSection
}) {
  // Aggregate stats
  const total = ideas.length;
  const todo = ideas.filter(i => i.status === 'todo').length;
  const progress = ideas.filter(i => i.status === 'progress').length;
  const done = ideas.filter(i => i.status === 'done').length;

  // Aggregate tags
  const tagsMap = {};
  ideas.forEach(idea => {
    (idea.tags || []).forEach(tag => {
      if (tag.trim()) {
        tagsMap[tag] = (tagsMap[tag] || 0) + 1;
      }
    });
  });
  const topTags = Object.entries(tagsMap).sort((a, b) => b[1] - a[1]);

  // Translate connection IDs to names
  const getConnectionLabel = (id) => {
    const idea = ideas.find(i => i.id === id);
    return idea ? idea.title : 'Deleted Idea';
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">
          <Lightbulb size={24} />
        </div>
        <span className="brand-name">IdeaForge</span>
      </div>

      <nav className="nav-section">
        <span className="nav-title">Workspace Views</span>
        <button 
          className={`nav-btn ${activeSection === 'board' ? 'active' : ''}`}
          onClick={() => setActiveSection('board')}
        >
          <Layers size={18} />
          <span>Idea Board</span>
        </button>
        <button 
          className={`nav-btn ${activeSection === 'connections' ? 'active' : ''}`}
          onClick={() => setActiveSection('connections')}
        >
          <GitMerge size={18} />
          <span>Connections ({connections.length})</span>
        </button>
      </nav>

      {activeSection === 'board' && (
        <div className="nav-section">
          <span className="nav-title">Filter by Tag</span>
          <div className="tag-container mt-2" style={{ paddingInline: '0.5rem' }}>
            <button 
              className={`tag-pill ${filterTag === 'all' ? 'active' : ''}`}
              style={{ 
                cursor: 'pointer',
                borderColor: filterTag === 'all' ? 'var(--accent)' : 'var(--border)',
                background: filterTag === 'all' ? 'var(--accent-glow)' : 'var(--surface-hover)',
                color: filterTag === 'all' ? 'var(--accent)' : 'var(--text)'
              }}
              onClick={() => onSelectTag('all')}
            >
              All Tags
            </button>
            {topTags.map(([tag, count]) => (
              <button 
                key={tag}
                className={`tag-pill ${filterTag === tag ? 'active' : ''}`}
                style={{ 
                  cursor: 'pointer',
                  borderColor: filterTag === tag ? 'var(--accent)' : 'var(--border)',
                  background: filterTag === tag ? 'var(--accent-glow)' : 'var(--surface-hover)',
                  color: filterTag === tag ? 'var(--accent)' : 'var(--text)'
                }}
                onClick={() => onSelectTag(tag)}
              >
                <span className="flex-row">
                  <Hash size={10} style={{ opacity: 0.6 }} />
                  {tag} ({count})
                </span>
              </button>
            ))}
            {topTags.length === 0 && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No tags created yet.</span>
            )}
          </div>
        </div>
      )}

      {activeSection === 'connections' && (
        <div className="nav-section" style={{ flexGrow: 1, overflowY: 'auto' }}>
          <span className="nav-title">Active Links</span>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {connections.map((conn, idx) => (
              <li 
                key={idx} 
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: 'var(--radius-sm)', 
                  background: 'var(--surface)', 
                  border: '1px solid var(--border)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  position: 'relative'
                }}
              >
                <div style={{ color: 'var(--text-header)', fontWeight: 600, paddingRight: '1.5rem' }}>
                  {getConnectionLabel(conn[0])}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent)' }}>
                  <GitCommit size={14} />
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>Linked to</span>
                </div>
                <div style={{ color: 'var(--text-header)', fontWeight: 600 }}>
                  {getConnectionLabel(conn[1])}
                </div>
                <button 
                  onClick={() => onDeleteConnection(idx)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    padding: '2px'
                  }}
                  title="Remove link"
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
            {connections.length === 0 && (
              <div className="text-xs" style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>
                No connections defined yet. Go back to Board and click the link icon on two cards.
              </div>
            )}
          </ul>
        </div>
      )}

      {/* Stats Board at Bottom */}
      <div className="stats-card">
        <div className="stat-item">
          <span className="stat-val">{total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-item">
          <span className="stat-val" style={{ color: 'var(--todo-color)' }}>{todo}</span>
          <span className="stat-label">To Do</span>
        </div>
        <div className="stat-item">
          <span className="stat-val" style={{ color: 'var(--progress-color)' }}>{progress}</span>
          <span className="stat-label">Doing</span>
        </div>
        <div className="stat-item">
          <span className="stat-val" style={{ color: 'var(--done-color)' }}>{done}</span>
          <span className="stat-label">Done</span>
        </div>
      </div>
    </aside>
  );
}
