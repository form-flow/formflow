import { Node, Edge, getOutgoers } from "reactflow";
import { TAddNode, TAddNodeOptions} from '../types.d';

const NODE_GAP_V = 120;
const NODE_WIDTH = 200;

// Returns all connected target nodes from all nodes
function getTargetNodes(targetNode: Node, nodes: Node[], edges:Edge[], acc: Node[]) {
  const targetNodes = getOutgoers(targetNode, nodes, edges);
  targetNodes.forEach(node => {
    acc.push(node);
    getTargetNodes(node, nodes, edges, acc); // tail-recursive
  });
  return acc
}

export function addNodeOn(
  edgeId: string, 
  options: TAddNodeOptions
) : TAddNode {
  const nodes = [...options.nodes];
  const edges = [...options.edges];
  const nextNodeId = options.nextNodeId;

  const currentEdge = edges.find(el => el.id === edgeId);
  if (!currentEdge) {
    return {nodes, edges};
  }
  const edgeSourceNode = nodes.find(el => el.id === currentEdge.source);
  const edgeTargetNode = nodes.find(el => el.id === currentEdge.target);
  if (!edgeSourceNode || !edgeTargetNode) {
    return {nodes, edges};
  }

  const staCenter = edgeSourceNode.position.x + (edgeSourceNode.width || NODE_WIDTH) / 2;
  const endCenter = edgeTargetNode.position.x + (edgeTargetNode.width || NODE_WIDTH) / 2;
  const posX = (staCenter + endCenter - NODE_WIDTH) / 2;

  // create a new node with positionY increased. Then, add it to nodes
  const newNode: Node = {
    id: nextNodeId,
    type: 'custom',
    data: { label: `Page ${nextNodeId}`},
    position: { x: posX, y: edgeSourceNode.position.y + NODE_GAP_V },
  }
  const sourceNodeNdx = nodes.findIndex(el => el.id === currentEdge.source);
  nodes.splice(sourceNodeNdx+1, 0, newNode); // splice updates nodes itself

  // Create a edge between new node and target node, Then add it to edges
  currentEdge.id = `${edgeSourceNode.id}-${newNode.id}`;
  currentEdge.target = newNode.id; // update current edge target to a new node
  const newEdge: Edge = {
    id: `${newNode.id}-${edgeTargetNode.id}`, 
    source: newNode.id, 
    target: edgeTargetNode.id, 
    type: 'custom'
  }
  const currentEdgeNdx = edges.findIndex(el => el.id === currentEdge.id);
  edges.splice(currentEdgeNdx+1, 0, newEdge); // splice updates edges itself

  // get all connected target nodes. then iterate all by increasing position.y by 100
  const allTargetNodes = getTargetNodes(newNode, nodes, edges, []);
  allTargetNodes.forEach(node => {
    node.position.y += NODE_GAP_V;
  });

  return {nodes, edges}
}
