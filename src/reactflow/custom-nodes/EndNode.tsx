import * as React from 'react';
import { Handle, Node, Position } from 'reactflow';

function EndNode({ data }: Node) {
  return (
    <div className="container">
      <Handle type="target" position={Position.Top} />
      END 
    </div>
  );
}

export default EndNode;