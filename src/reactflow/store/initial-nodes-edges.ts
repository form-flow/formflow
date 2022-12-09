import { Edge, Node } from 'reactflow';

export const initialEdges: Edge[]  = [
  { 
    id: 'start-1', 
    source: 'start', 
    target: '1', 
    type: 'custom'
  },
  {
    id: '1-end',
    source: '1',
    target: 'end',
    type: 'custom',
    label: 'label',
  },
] as Edge[];

export const initialNodes: Node[] = [
  {
    id: 'start',
    type: 'start',
    deletable: false,
    position: { x: 100, y: 0 },
  },
  {
    id: '1',
    type: 'custom',
    data: { label: 'Page 1'},
    position: { x: 72, y: 120 },
  },
  {
    id: 'end',
    type: 'end',
    deletable: false,
    position: { x: 103, y: 280 },
  },
] as Node[];
