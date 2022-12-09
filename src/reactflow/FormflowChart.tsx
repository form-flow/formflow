import * as React from 'react';
import {KeyboardEvent, useState} from 'react';
import ReactFlow, {Controls, ControlButton, Background, Edge, Node, ReactFlowInstance} from 'reactflow';
import 'reactflow/dist/style.css';
import './styles.css';

import useStore from './store';
import { customNodeTypes } from './custom-nodes';
import { customEdgeTypes } from './custom-edges';

export interface FormflowChartProps {
  nodes?: Node[],
  edges?: Edge[],
  onNodeClick?: (node:Node, nodes: Node[], edges:Edge[]) => void,
  onEdgeClick?: (edge:Edge, nodes: Node[], edges:Edge[]) => void,
  onInit?: (instance: ReactFlowInstance) => void,
}


function FormflowChart(props: FormflowChartProps) {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeUpdate,
    undo,
    redo
  } = useStore();

  React.useEffect( () => {
    if (props.nodes) setNodes(props.nodes);
    if (props.edges) setEdges(props.edges);
  }, [props])

  const onKeyDown = (event : KeyboardEvent) => {
    const ctrl = event.ctrlKey ? 'Control-' : '';
    const alt = event.altKey ? 'Alt-' : '';
    const meta = event.metaKey ? 'Meta-' : '';
    const shift = event.shiftKey ? 'Shift-' : '';
    const key = `${ctrl}${alt}${shift}${meta}${event.key}`;
    if (key === 'Meta-z') undo();
    if (key === 'Shift-Meta-z') redo();
  };

  const onNodeClick = (event:React.MouseEvent, node: Node) => {
    props.onNodeClick && props.onNodeClick(node, nodes, edges);
  }
  
  const onEdgeClick = (event:React.MouseEvent, edge: Edge) => {
    props.onEdgeClick && props.onEdgeClick(edge, nodes, edges);
  }

  const onInit = (reactFlowInstance: ReactFlowInstance) => {
    props.onInit && props.onInit(reactFlowInstance);
  }

  return (
    <ReactFlow 
      style={{minWidth: 300, minHeight: 400}}
      tabIndex={0}
      nodes={nodes}
      edges={edges}
      nodeTypes={customNodeTypes}
      edgeTypes={customEdgeTypes}
      onKeyDown={(e) => onKeyDown(e)}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onEdgeUpdate={onEdgeUpdate}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onInit={onInit}
      fitView
    >
      <Controls style={{display: 'flex', backgroundColor: '#FFF'}}>
        <ControlButton onClick={undo}>&#x27F2;</ControlButton>
        <ControlButton onClick={redo}>&#x27F3;</ControlButton>
      </Controls>
      <Background />
    </ReactFlow>
  );
}

export default FormflowChart;
