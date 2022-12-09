import * as React from 'react';
import { Handle, Position, Node } from 'reactflow';

function StartNode({ data }: Node) {
  return (
    <div className="container">
      START 
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default StartNode;