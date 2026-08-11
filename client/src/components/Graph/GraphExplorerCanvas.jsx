import React, { useRef, useCallback, useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { User, Cpu, FolderGit2, Building2, Briefcase, Info, X } from 'lucide-react';

const NODE_COLORS = {
  Person: '#536DF2',
  Skill: '#10B981',
  Project: '#F59E0B',
  Company: '#8B5CF6',
  JobRole: '#F43F5E'
};

const NODE_ICONS = {
  Person: User,
  Skill: Cpu,
  Project: FolderGit2,
  Company: Building2,
  JobRole: Briefcase
};

export const GraphExplorerCanvas = ({ graphData, onNodeClick, height = 600 }) => {
  const fgRef = useRef();
  const containerRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || height
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 400);
      fgRef.current.zoom(2.5, 400);
    }
    if (onNodeClick) onNodeClick(node);
  }, [onNodeClick]);

  const drawNode = useCallback((node, ctx, globalScale) => {
    const label = node.label || node.id;
    const fontSize = 12 / globalScale;
    const radius = node.type === 'Person' ? 8 : 6;
    const color = NODE_COLORS[node.type] || '#94A3B8';

    // Glow Effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    // Node Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.shadowBlur = 0; // reset shadow
    ctx.lineWidth = 1.5 / globalScale;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Node Text Label
    if (globalScale > 1.2 || node.type === 'Person') {
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText(label, node.x, node.y + radius + fontSize + 2);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[500px] glass-panel rounded-2xl overflow-hidden border border-slate-800">
      
      {/* Legend Header */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 p-3 bg-slate-950/80 backdrop-blur-md rounded-xl border border-slate-800 text-xs">
        {Object.entries(NODE_COLORS).map(([type, color]) => (
          <div key={type} className="flex items-center space-x-1.5 px-2 py-1 rounded bg-slate-900/60 border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-slate-300 font-medium">{type}</span>
          </div>
        ))}
      </div>

      {/* Interactive Force Graph */}
      {graphData && graphData.nodes && graphData.nodes.length > 0 ? (
        <ForceGraph2D
          ref={fgRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeCanvasObject={drawNode}
          nodePointerAreaPaint={(node, color, ctx) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false);
            ctx.fill();
          }}
          onNodeClick={handleNodeClick}
          linkColor={() => 'rgba(148, 163, 184, 0.25)'}
          linkWidth={1.5}
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleColor={() => '#536DF2'}
          cooldownTicks={100}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500 text-sm">
          No graph visualization data available.
        </div>
      )}

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 z-20 w-80 p-5 glass-panel rounded-2xl border border-brand-500/40 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-lg text-white" style={{ backgroundColor: NODE_COLORS[selectedNode.type] || '#536DF2' }}>
                <Info className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{selectedNode.type}</span>
                <h4 className="text-base font-bold text-slate-100">{selectedNode.label}</h4>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            {Object.entries(selectedNode)
              .filter(([k]) => !['x', 'y', 'vx', 'vy', 'index', 'id', 'rawId', 'type', 'label'].includes(k))
              .map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span className="text-slate-400 capitalize">{key}:</span>
                  <span className="font-semibold text-slate-200">{String(value)}</span>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default GraphExplorerCanvas;
