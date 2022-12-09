import create from 'zustand';
import {
  Connection, Edge, Node,
  EdgeChange, NodeChange, addEdge,
  applyNodeChanges, applyEdgeChanges,
  updateEdge,
} from 'reactflow';

import { addNodeOn } from './add-node-on';
import { addNodeBeside } from './add-node-beside';
import { initialEdges, initialNodes } from './initial-nodes-edges';
import { StoreState } from '../types.d';
import { UndoRedo } from './undo-redo';

UndoRedo.addHistory({nodes: initialNodes, edges: initialEdges});

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<StoreState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  nextNodeId: 1,

  setNodes: (nodes: Node[]) => {
    const nextNodeId = nodes.reduce( 
      (max, node) => Math.max(max, +node.id || 0), 0
    );
    nodes = structuredClone(nodes);
    set({nodes, nextNodeId});
  },

  setEdges: (edges: Edge[]) => {
    edges = structuredClone(edges);
    set({edges});
    UndoRedo.reset({nodes: get().nodes, edges: get().edges});
  },

  setNextNodeId: () => {
    const nextNodeId = get().nextNodeId + 1;
    set({nextNodeId});
    return nextNodeId.toString();
  },

  onNodesChange: (changes: NodeChange[]) => {
    // console.log('node changes', changes) // change, add, remove
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });

    if (changes.find(el => el.type === 'remove')) {
      UndoRedo.addHistory({nodes: get().nodes, edges: get().edges});
    }
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const edges = get().edges;
    const connectionEdge: Edge[] = [];
    const pattern = `${changes.length}-${changes[0]?.type}-${changes[1]?.type}`;
    // When a node removed with 1 in edge and 1 out edge, add a connection ege
    if (pattern === '2-remove-remove') {
      const edge1 = edges.find(el => el.id === (changes[0] as any).id);
      const edge2 = edges.find(el => el.id === (changes[1] as any).id);
      if (edge1 && edge2 && edge1.target === edge2.source) {
        connectionEdge.push({...edge1, ...{target: edge2.target}});
      }
    }
    set({ edges: applyEdgeChanges(changes, edges).concat(connectionEdge) });

    if (changes.find(el => el.type === 'remove')) {
      UndoRedo.addHistory({nodes: get().nodes, edges: get().edges});
    }
  },

  onEdgeUpdate: (oldEdge, newConnection) => {
    // replace the updated edge id as the format of source-target
    const newId = `${newConnection.source}-${newConnection.target}`
    const edges = get().edges;
    const oldEdgeNdx = edges.findIndex(el => el.id === oldEdge.id);
    oldEdge.id = newId;
    edges[oldEdgeNdx].id = newId;

    set({
      edges: updateEdge(oldEdge, newConnection, edges)
    });
    
    UndoRedo.addHistory({nodes: get().nodes, edges: get().edges});
  },

  onConnect: (connection: Connection) => {
    const existingEdges: any[] = get().edges;
    const newEdge = {
      id:  `${connection.source}-${connection.target}`,
      type: 'custom',
      source: connection.source, 
      target: connection.target
    }
    const edges: Edge[] = [...existingEdges, newEdge];
    set({edges: addEdge(connection, edges)});

    UndoRedo.addHistory({nodes: get().nodes, edges: get().edges});

  },

  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, label }; // it's important to create a new object here
        }

        return node;
      }),
    });
  },

  updateEdgeLabel: (edgeId: string, label: string) => {
    set({
      edges: get().edges.map((edge) => {
        if (edge.id === edgeId) {
          edge.label = label;
        }

        return edge;
      }),
    });
  },

  addNodeOn: (edgeId: string) => {
    set({nextNodeId: get().nextNodeId + 1});
    const options: any= {
      nodes: get().nodes,
      edges: get().edges,
      nextNodeId: '' + get().nextNodeId
    }
    const {nodes, edges} = addNodeOn(edgeId, options);
    set({nodes, edges});

    UndoRedo.addHistory({nodes: get().nodes, edges: get().edges});
  },

  addNodeBeside: (nodeId: string) => {
    set({nextNodeId: get().nextNodeId + 1});
    const options: any = {
      nodes: get().nodes,
      edges: get().edges,
      nextNodeId: '' + get().nextNodeId
    }
    const {nodes, edges} = addNodeBeside(nodeId, options);
    set({nodes, edges});

    UndoRedo.addHistory({nodes: get().nodes, edges: get().edges});
  },

  undo: () => {
    const state = UndoRedo.undo();
    if (state) {
      set({nodes: state.nodes, edges: state.edges});
    }
  },

  redo: () => {
    const state = UndoRedo.redo();
    if (state) {
      set({nodes: state.nodes, edges: state.edges});
    }
  },
}));

export default useStore;
