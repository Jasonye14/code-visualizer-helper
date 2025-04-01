
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";

interface NodeTooltipProps {
  data: {
    label: string;
    type: string;
    description: string;
  };
}

function NodeTooltip({ data }: NodeTooltipProps) {
  return (
    <div className="tooltip-node">
      <Handle type="target" position={Position.Top} />
      <div className="p-3">
        <div className="font-bold">{data.label}</div>
        <div className="text-xs text-muted-foreground">{data.type}</div>
        {data.description && (
          <div className="mt-2 text-sm">{data.description}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export default memo(NodeTooltip);
