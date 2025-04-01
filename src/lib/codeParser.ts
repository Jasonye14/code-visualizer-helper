
import { Node, Edge } from "@xyflow/react";

/**
 * Parses code into a graph structure for visualization
 */
export function parseCodeToGraph(code: string): { nodes: Node[]; edges: Edge[] } {
  // This is a simplified parser for demonstration
  // In a production app, you would use a proper parser like:
  // - esprima or acorn for JavaScript
  // - ast-types for TypeScript
  // - tree-sitter for multiple languages
  
  // For this demo, we'll use simple regex patterns to find code elements
  const lines = code.split("\n");
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  
  let nodeId = 1;
  const nodeMap = new Map<string, string>();
  
  // First pass: Detect modules, classes, functions, and variables
  lines.forEach((line, index) => {
    // Check for imports
    const importMatch = line.match(/import\s+(\{[^}]+\}|\*\s+as\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|([a-zA-Z_$][a-zA-Z0-9_$]*))/);
    if (importMatch) {
      const name = importMatch[1] || importMatch[2] || importMatch[3];
      const id = `node_${nodeId++}`;
      nodes.push({
        id,
        type: "default",
        data: { 
          label: `Import: ${name.trim()}`,
          type: "import",
          description: "Imported module or component"
        },
        position: { x: 100, y: 100 + index * 50 },
        className: "node-import"
      });
      nodeMap.set(name.trim(), id);
      return;
    }
    
    // Check for class declarations
    const classMatch = line.match(/class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (classMatch) {
      const name = classMatch[1];
      const id = `node_${nodeId++}`;
      nodes.push({
        id,
        type: "tooltip",
        data: { 
          label: `Class: ${name}`,
          type: "class",
          description: "A blueprint for creating objects"
        },
        position: { x: 300, y: 100 + index * 60 },
        className: "node-class"
      });
      nodeMap.set(name, id);
      return;
    }
    
    // Check for function declarations
    const funcMatch = line.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)|const\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*\(.*\)\s*=>/);
    if (funcMatch) {
      const name = funcMatch[1] || funcMatch[2];
      if (name) {
        const id = `node_${nodeId++}`;
        nodes.push({
          id,
          type: "tooltip",
          data: { 
            label: `Function: ${name}`,
            type: "function",
            description: "Reusable block of code that performs a specific task"
          },
          position: { x: 500, y: 100 + index * 40 },
          className: "node-function"
        });
        nodeMap.set(name, id);
      }
      return;
    }
    
    // Check for variable declarations
    const varMatch = line.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/);
    if (varMatch && !line.includes("=>")) {
      const name = varMatch[1];
      const id = `node_${nodeId++}`;
      nodes.push({
        id,
        type: "default",
        data: { 
          label: `Variable: ${name}`,
          type: "variable",
          description: "Storage location for data"
        },
        position: { x: 700, y: 100 + index * 30 },
        className: "node-variable"
      });
      nodeMap.set(name, id);
      return;
    }
  });
  
  // Second pass: Find relationships between nodes
  lines.forEach((line) => {
    // Check for function calls
    for (const [name, id] of nodeMap.entries()) {
      const regex = new RegExp(`\\b${name}\\s*\\(`);
      if (regex.test(line)) {
        // Find who's calling this function
        for (const [callerName, callerId] of nodeMap.entries()) {
          if (line.includes(`function ${callerName}`) || line.includes(`const ${callerName} =`)) {
            edges.push({
              id: `edge_${callerId}_${id}`,
              source: callerId,
              target: id,
              label: "calls",
            });
            break;
          }
        }
      }
      
      // Check for class instances
      if (line.includes(`new ${name}`)) {
        for (const [callerName, callerId] of nodeMap.entries()) {
          if (line.includes(`function ${callerName}`) || line.includes(`const ${callerName} =`)) {
            edges.push({
              id: `edge_${callerId}_${id}`,
              source: callerId,
              target: id,
              label: "creates",
            });
            break;
          }
        }
      }
      
      // Check for imports usage
      if (line.includes(name) && !line.includes(`import`) && nodeMap.has(name)) {
        for (const [callerName, callerId] of nodeMap.entries()) {
          if (callerName !== name && (line.includes(`function ${callerName}`) || line.includes(`const ${callerName} =`))) {
            edges.push({
              id: `edge_${callerId}_${id}`,
              source: callerId,
              target: id,
              label: "uses",
            });
            break;
          }
        }
      }
    }
  });
  
  // If no nodes were found, add a helpful message node
  if (nodes.length === 0) {
    nodes.push({
      id: "help_node",
      type: "tooltip",
      data: { 
        label: "No code elements detected",
        type: "help",
        description: "Try adding JavaScript/TypeScript code with functions, classes, variables, or imports"
      },
      position: { x: 400, y: 200 },
    });
  }
  
  // Apply auto-layout (very basic)
  const layoutedNodes = applySimpleLayout(nodes);
  
  return { nodes: layoutedNodes, edges };
}

/**
 * Simple layout algorithm to position nodes in a more organized way
 */
function applySimpleLayout(nodes: Node[]): Node[] {
  // Group nodes by type
  const groupedNodes: Record<string, Node[]> = {};
  
  nodes.forEach((node) => {
    const type = node.className || "default";
    if (!groupedNodes[type]) {
      groupedNodes[type] = [];
    }
    groupedNodes[type].push(node);
  });
  
  // Position nodes by group
  const result: Node[] = [];
  let xOffset = 100;
  
  Object.values(groupedNodes).forEach((nodeGroup) => {
    let yOffset = 100;
    
    nodeGroup.forEach((node) => {
      result.push({
        ...node,
        position: { x: xOffset, y: yOffset },
      });
      yOffset += 120;
    });
    
    xOffset += 250;
  });
  
  return result;
}
