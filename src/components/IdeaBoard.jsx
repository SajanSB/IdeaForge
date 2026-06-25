import React, { useEffect, useRef, useState } from 'react';
import IdeaCard from './IdeaCard';
import { 
  Plus, 
  Lightbulb, 
  ClipboardList, 
  TrendingUp, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function IdeaBoard({ 
  ideas, 
  connections, 
  viewMode, 
  filterTag, 
  searchQuery, 
  onSelectIdea, 
  onDeleteIdea, 
  onToggleConnect, 
  connectionSourceId,
  onAddIdea
}) {
  const boardRef = useRef(null);
  const [linePaths, setLinePaths] = useState([]);

  // Calculate filtered ideas
  const filteredIdeas = ideas.filter(idea => {
    const matchesTag = filterTag === 'all' || (idea.tags && idea.tags.includes(filterTag));
    const matchesSearch = !searchQuery || 
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (idea.tags && idea.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesTag && matchesSearch;
  });

  const todoIdeas = filteredIdeas.filter(i => i.status === 'todo');
  const progressIdeas = filteredIdeas.filter(i => i.status === 'progress');
  const doneIdeas = filteredIdeas.filter(i => i.status === 'done');

  // Recalculate connection lines coordinates
  const updateConnections = () => {
    if (!boardRef.current) return;
    
    const boardRect = boardRef.current.getBoundingClientRect();
    const paths = [];

    connections.forEach(([fromId, toId]) => {
      const fromEl = document.getElementById(`idea-card-${fromId}`);
      const toEl = document.getElementById(`idea-card-${toId}`);

      if (fromEl && toEl) {
        const rectA = fromEl.getBoundingClientRect();
        const rectB = toEl.getBoundingClientRect();

        // Calculate center coordinates relative to board element
        const x1 = rectA.left + rectA.width / 2 - boardRect.left;
        const y1 = rectA.top + rectA.height / 2 - boardRect.top;
        const x2 = rectB.left + rectB.width / 2 - boardRect.left;
        const y2 = rectB.top + rectB.height / 2 - boardRect.top;

        // Bending horizontal curves
        const dx = Math.abs(x2 - x1) * 0.5;
        const path = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

        paths.push({
          path,
          fromId,
          toId,
          key: `${fromId}-${toId}`
        });
      }
    });

    setLinePaths(paths);
  };

  // Recalculate connection coordinates on layouts/updates
  useEffect(() => {
    // Standard delay for React DOM render & transitions
    const timer = setTimeout(updateConnections, 150);

    const handleResize = () => {
      requestAnimationFrame(updateConnections);
    };

    window.addEventListener('resize', handleResize);

    // Scroll containers can shift cards relative to the board
    const scrollContainers = document.querySelectorAll('.column-cards, .main-content');
    scrollContainers.forEach(container => {
      container.addEventListener('scroll', handleResize);
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      scrollContainers.forEach(container => {
        container.removeEventListener('scroll', handleResize);
      });
    };
  }, [ideas, connections, viewMode, filterTag, searchQuery]);

  // Re-run if window is scrolled or container updates
  useEffect(() => {
    updateConnections();
  }, [filteredIdeas.length]);

  return (
    <div ref={boardRef} className="board-container transition-board">
      {/* SVG connections overlay */}
      {linePaths.length > 0 && (
        <svg className="svg-connections-overlay">
          <defs>
            <linearGradient id="conn-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--secondary)" />
            </linearGradient>
          </defs>
          {linePaths.map(item => (
            <g key={item.key}>
              {/* Outer soft glow line */}
              <path 
                className="connection-line glow" 
                d={item.path} 
                stroke="url(#conn-gradient)"
              />
              {/* Inner animated dashed line */}
              <path 
                className="connection-line" 
                d={item.path} 
                stroke="url(#conn-gradient)"
              />
            </g>
          ))}
        </svg>
      )}

      {filteredIdeas.length === 0 ? (
        <div className="empty-state">
          <HelpCircle className="empty-icon" />
          <h3 className="empty-title">No ideas found</h3>
          <p>Create a new idea card or adjust your filters to start brainstorming.</p>
          <button className="btn btn-primary" onClick={onAddIdea}>
            <Plus size={18} />
            <span>Create Card</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid-view">
          {filteredIdeas.map(idea => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onSelect={onSelectIdea}
              onDelete={onDeleteIdea}
              onToggleConnect={onToggleConnect}
              isConnectionSource={connectionSourceId === idea.id}
            />
          ))}
        </div>
      ) : (
        /* KANBAN VIEW */
        <div className="kanban-view">
          {/* TO DO COLUMN */}
          <div className="kanban-column">
            <div className="column-header">
              <span className="column-title" style={{ color: 'var(--todo-color)' }}>
                <ClipboardList size={18} />
                To Do
              </span>
              <span className="column-badge">{todoIdeas.length}</span>
            </div>
            <div className="column-cards">
              {todoIdeas.map(idea => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onSelect={onSelectIdea}
                  onDelete={onDeleteIdea}
                  onToggleConnect={onToggleConnect}
                  isConnectionSource={connectionSourceId === idea.id}
                />
              ))}
            </div>
          </div>

          {/* IN PROGRESS COLUMN */}
          <div className="kanban-column">
            <div className="column-header">
              <span className="column-title" style={{ color: 'var(--progress-color)' }}>
                <TrendingUp size={18} />
                In Progress
              </span>
              <span className="column-badge">{progressIdeas.length}</span>
            </div>
            <div className="column-cards">
              {progressIdeas.map(idea => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onSelect={onSelectIdea}
                  onDelete={onDeleteIdea}
                  onToggleConnect={onToggleConnect}
                  isConnectionSource={connectionSourceId === idea.id}
                />
              ))}
            </div>
          </div>

          {/* COMPLETED COLUMN */}
          <div className="kanban-column">
            <div className="column-header">
              <span className="column-title" style={{ color: 'var(--done-color)' }}>
                <CheckCircle size={18} />
                Completed
              </span>
              <span className="column-badge">{doneIdeas.length}</span>
            </div>
            <div className="column-cards">
              {doneIdeas.map(idea => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onSelect={onSelectIdea}
                  onDelete={onDeleteIdea}
                  onToggleConnect={onToggleConnect}
                  isConnectionSource={connectionSourceId === idea.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
