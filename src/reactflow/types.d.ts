import { 
  Node, Edge,
  OnNodesChange, 
  OnEdgesChange, 
  OnConnect, 
  OnEdgeUpdateFunc,
} from 'reactflow';

// addNodeOn(edgeId, options): TAddNode
// addNodeBeside(nodeId, options): TAddNode
export type TAddNodeOptions = {
  nodes: Node[];
  edges: Edge[];
  nextNodeId: string;
};

export type TAddNode = {
  nodes: Node[]; 
  edges: Edge[];
}

// zustand store state and methods
export type StoreState = {
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  nextNodeId: number,
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onEdgeUpdate: OnEdgeUpdateFunc,
  onConnect: OnConnect;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateEdgeLabel: (nodeId: string, label: string) => void;
  addNodeOn: (edgeId: string) => void;
  addNodeBeside: (nodeId: string) => void;
  undo: () => void;
  redo: () => void;
};