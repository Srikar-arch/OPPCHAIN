import { useState } from 'react';
import { motion } from 'framer-motion';
import type { OpportunityPathData } from '../types';
import OpportunityNodeComponent from './OpportunityNode';

interface OpportunityPathProps {
  data: OpportunityPathData;
  compact?: boolean;
}

export default function OpportunityPath({
  data,
  compact = false,
}: OpportunityPathProps) {
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  return (
    <div
      className={`relative flex flex-col items-stretch ${compact ? 'gap-2' : 'gap-3'}`}
      role="list"
      aria-label="Opportunity path"
    >
      {data.nodes.map((node, i) => (
        <div key={node.id} role="listitem" className="relative">
          {/* Connecting line above */}
          {i > 0 && (
            <motion.div
              className="absolute left-7 -top-3 h-3 w-px"
              style={{
                background:
                  node.status === 'completed' || data.nodes[i - 1].status === 'completed'
                    ? 'linear-gradient(to bottom, rgba(16,185,129,0.4), rgba(16,185,129,0.15))'
                    : node.status === 'active'
                      ? 'linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(99,102,241,0.15))'
                      : 'linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
              }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            />
          )}
          <OpportunityNodeComponent
            node={node}
            isActive={activeNodeId === node.id}
            onClick={setActiveNodeId}
            index={i}
          />
        </div>
      ))}
    </div>
  );
}
