// src/ForceGraph.js
import React, { useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

// Sample initial graph data
const initialData = {
    nodes: [
      // Group 1
      { id: 'Node 1', group: 1 },
      { id: 'Node 2', group: 1 },
      { id: 'Node 3', group: 1 },
      // Group 2
      { id: 'Node 4', group: 2 },
      { id: 'Node 5', group: 2 },
      { id: 'Node 6', group: 2 },
      // Group 3
      { id: 'Node 7', group: 3 },
      { id: 'Node 8', group: 3 },
      { id: 'Node 9', group: 3 },
    ],
    links: [
      // Links within Group 1
      { source: 'Node 1', target: 'Node 2' },
      { source: 'Node 2', target: 'Node 3' },
      { source: 'Node 3', target: 'Node 1' },
      // Links within Group 2
      { source: 'Node 4', target: 'Node 5' },
      { source: 'Node 5', target: 'Node 6' },
      { source: 'Node 6', target: 'Node 4' },
      // Links within Group 3
      { source: 'Node 7', target: 'Node 8' },
      { source: 'Node 8', target: 'Node 9' },
      { source: 'Node 9', target: 'Node 7' },
      // Links between groups
      { source: 'Node 3', target: 'Node 4' },
      { source: 'Node 6', target: 'Node 7' },
    ],
  };

  const ForceGraph = () => {
    const fgRef = useRef();
    const [graphData, setGraphData] = useState(initialData);
  
    // Function to generate new graph data when a node is clicked
    const generateNewGraphData = (node) => {
      const numNewNodes = 5;
      const newNodes = [];
      const newLinks = [];
  
      for (let i = 1; i <= numNewNodes; i++) {
        const newNodeId = `${node.id}-${i}`;
        newNodes.push({ id: newNodeId, group: node.group });
        newLinks.push({ source: node.id, target: newNodeId });
      }
  
      // Include the clicked node in the new data
      newNodes.push(node);
  
      return { nodes: newNodes, links: newLinks };
    };
  
    return (
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeLabel="id"
        nodeAutoColorBy="group"
        linkWidth={2}
        linkOpacity={0.5}
        nodeThreeObject={(node) => {
          // Display text instead of spheres
          const sprite = new SpriteText(node.id);
          sprite.color = node.color;
          sprite.textHeight = 8;
          return sprite;
        }}
        onNodeClick={(node) => {
          const newGraphData = generateNewGraphData(node);
          setGraphData(newGraphData);
  
          // Optionally, center the camera on the clicked node
          if (fgRef.current) {
            const distance = 200;
            const distRatio =
              1 + distance / Math.hypot(node.x || 1, node.y || 1, node.z || 1);
  
            fgRef.current.cameraPosition(
              {
                x: (node.x || 0) * distRatio,
                y: (node.y || 0) * distRatio,
                z: (node.z || 0) * distRatio,
              },
              node, // Look at the clicked node
              3000  // Transition duration in ms
            );
          }
        }}
      />
    );
  };
  
  export default ForceGraph;