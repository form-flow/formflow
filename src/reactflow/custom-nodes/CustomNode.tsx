import * as React from 'react';
import { useRef } from 'react';
import { Handle,  Node, Position, useReactFlow, getIncomers, getOutgoers } from 'reactflow';
import useStore from '../store';

function CustomNode({ id, data }: Node): React.ReactElement {
  const { nodes, edges, updateNodeLabel, addNodeBeside } = useStore();
  const { fitView} = useReactFlow();
  const containerRef = useRef(null);

  const node = nodes.find(el => el.id === id);
  let [numIncomers, numOutgoers] = [0,0];
  if (node) {
    numIncomers = getIncomers(node, nodes, edges).length;
    numOutgoers = getOutgoers(node, nodes, edges).length;
  }

  const onClick = () => {
    addNodeBeside(id);
    setTimeout(() => fitView({duration: 500}));
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeLabel(id, event.target.value);
  }

  return (
    <div ref={containerRef}
      className={`container in-${numIncomers} out-${numOutgoers}`}>
      <Handle type="target" position={Position.Top} />
      {/* this cannot be <input> for a11y */}
      <div className="nodrag label-input" 
        contentEditable={true} 
        suppressContentEditableWarning={true}
        onChange={onChange}
      >
        {data.label}
      </div>
      <span className="add-node-button" onClick={onClick}>+</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default CustomNode;
