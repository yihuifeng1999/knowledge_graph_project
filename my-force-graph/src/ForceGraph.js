// src/ForceGraph.js
import React, { useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import graph_Data_json from './graph_data.json'; // Assuming it's in src folder
import learning_json from './Learning.json'; // Assuming it's in src folder
import technical_development_json from './Technical_development.json'; // Assuming it's in src folder
import a_cloud_guru_json from './A_cloud_guru.json'; // Assuming it's in src folder
import relativity_one_json from './Relativity_one.json'; // Assuming it's in src folder
import expert_json from './expert.json'; // Assuming it's in src folder


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
    const [graphData, setGraphData] = useState(graph_Data_json);
    const [graphHistory, setGraphHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNode, setSelectedNode] = useState(null);
    const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });

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

    const handleSearch = () => {
        let matchedNode = graphData.nodes.find(
            (node) => node.id.toLowerCase() === searchTerm.toLowerCase()
        );
        if(searchTerm === "Email Review"){
            matchedNode = graphData.nodes.find(
                (node) => node.id.toLowerCase() === "Relativity One".toLowerCase()
            );
        }
        if (matchedNode) {
            // Save the current state to history
            setGraphHistory((prevHistory) => [...prevHistory, graphData]);

            // Find directly connected nodes
            const connectedNodeIds = new Set();
            connectedNodeIds.add(matchedNode.id);

            graphData.links.forEach((link) => {
                if (link.source.id === matchedNode.id) {
                    connectedNodeIds.add(link.target.id);
                } else if (link.target.id === matchedNode.id) {
                    connectedNodeIds.add(link.source.id);
                }
            });

            // Filter nodes and links
            const newNodes = graphData.nodes.filter((node) =>
                connectedNodeIds.has(node.id)
            );
            const newLinks = graphData.links.filter(
                (link) =>
                    connectedNodeIds.has(link.source.id) &&
                    connectedNodeIds.has(link.target.id)
            );

            const newGraphData = { nodes: newNodes, links: newLinks };
            setGraphData(newGraphData);
            setSelectedNode(matchedNode);

            // Center the camera on the matched node
            if (fgRef.current) {
                const distance = 200;
                const distRatio =
                    1 + distance / Math.hypot(matchedNode.x || 1, matchedNode.y || 1, matchedNode.z || 1);
                fgRef.current.cameraPosition(
                    {
                        x: (matchedNode.x || 0) * distRatio,
                        y: (matchedNode.y || 0) * distRatio,
                        z: (matchedNode.z || 0) * distRatio,
                    },
                    matchedNode, // Look at the clicked node
                    1000  // Transition duration in ms
                );
            }
        } else {
            alert('Node not found.');
        }
    }
    const handleBack = () => {
        if (graphHistory.length > 0) {
            // Get the last graph state from history
            const previousGraphData = graphHistory[graphHistory.length - 1];
            // Remove the last state from history
            setGraphHistory((prevHistory) => prevHistory.slice(0, -1));
            // Update the graph data
            setGraphData(previousGraphData);
        } else {
            // If no history, reset to initial data
            setGraphData(initialData);
        }
    }
    const hadnleNodeOnClick = (node) => {
        // Save the current state to history  
        setGraphHistory((prevHistory) => [...prevHistory, graphData]);
        if (selectedNode == node) {
            
            if(node.id == "Learning"){
                setGraphData(learning_json);
            }else if(node.id == "Technical Development"){
                setGraphData(technical_development_json);
            }else if(node.id == "A Cloud Guru"){
                setGraphData(a_cloud_guru_json);
            }else if(node.id == "Relativity One"){
                setGraphData(relativity_one_json);
            }else if(node.id == "Expert"){
                setGraphData(expert_json);
            }
            else{
                const newGraphData = generateNewGraphData(node);
            setGraphData(newGraphData);
            }
            
        } else {
            // Set the selected node
            setSelectedNode(node);
        }


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
                1000  // Transition duration in ms
            );
            // Delay the calculation to allow camera movement
            setTimeout(() => {
                const coords = { x: window.innerWidth * 4 / 5 + 100, y: window.innerHeight * 3 / 10, z: 100 };
                setPanelPosition(coords);
            }, 800); // Match the camera transition duration
        }
    }


    return (
        <div className="relative">
            <div className="absolute top-1 z-10 justify-start space-x-1">
                <button className="relative bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none" onClick={handleBack}>
                    Back
                </button>

                <input
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    placeholder="Search APP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <button onClick={handleSearch}
                    className="relative bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none">Search</button>

            </div>
            {selectedNode && (
                <div
                    className="absolute z-10 bg-white p-4 rounded shadow-lg"
                    style={{
                        top: panelPosition.y,
                        left: panelPosition.x,
                        transform: 'translate(-100%, -100%)',
                    }}
                >
                    <h3 className="text-lg font-bold mb-2">Node Details</h3>
                    <p><strong>ID:</strong> {selectedNode.id}</p>
                    <p><strong>Stakeholders:</strong> TBA </p>
                    <p><strong>Notes:</strong> TBA </p>
                    <p><strong>URL:</strong> TBA </p>
                    {/* <p><strong>Group:</strong> {selectedNode.group}</p> */}
                    {/* Add more node properties as needed */}
                    <button
                        onClick={() => setSelectedNode(null)}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            )}
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
                    sprite.material.depthWrite = false;
                    sprite.color = node.color;
                    sprite.textHeight = 8;
                    return sprite;
                }}
                onNodeClick={hadnleNodeOnClick}
            />
        </div>
    );
};

export default ForceGraph;