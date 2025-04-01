
import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Panel,
  useReactFlow,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeTooltip from "./NodeTooltip";
import { Button } from "./ui/button";
import { ZoomInIcon, ZoomOutIcon, MaximizeIcon } from "lucide-react";

interface DiagramViewProps {
  graph: {
    nodes: Node[];
    edges: Edge[];
  };
}

export default function DiagramView({ graph }: DiagramViewProps) {
  const { fitView, zoomIn, zoomOut } = useReactFlow();
  
  const nodeTypes = useMemo(() => ({ tooltip: NodeTooltip }), []);
  
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, includeHiddenNodes: false });
  }, [fitView]);
  
  // Add custom styling to nodes and edges
  const styledNodes = useMemo(() => {
    return graph.nodes.map(node => ({
      ...node,
      style: {
        ...node.style,
        borderRadius: 8,
        border: '1px solid',
        padding: 10,
        fontSize: 14,
        fontWeight: 500,
        width: 180,
        textAlign: 'center' as const,
      },
      data: {
        ...node.data,
        label: node.data?.label || node.id,
      },
    }));
  }, [graph.nodes]);
  
  const styledEdges = useMemo(() => {
    return graph.edges.map(edge => ({
      ...edge,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
      animated: true,
      style: {
        stroke: '#a3a3a3',
        strokeWidth: 2,
      },
    }));
  }, [graph.edges]);
  
  return (
    <div className="flow-canvas h-full">
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Panel position="top-right" className="space-x-2">
          <Button variant="secondary" size="icon" onClick={zoomIn}>
            <ZoomInIcon size={18} />
          </Button>
          <Button variant="secondary" size="icon" onClick={zoomOut}>
            <ZoomOutIcon size={18} />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleFitView}>
            <MaximizeIcon size={18} />
          </Button>
        </Panel>
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
