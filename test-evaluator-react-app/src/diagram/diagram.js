import React, { useEffect } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { useCallback, useState, useMemo } from 'react';

import axios from 'axios';

import 'reactflow/dist/style.css';

import TextUpdaterNode from '../nodes/TextNode.js';
import initialNodes from '../nodes/allNodes'
import initialEdges from '../edges/allEdges'

function Diagram({ socketOpen, testData, envData }) {

  const initPosition = { 'x': 100, 'y': 150 }
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodePosition, setPosition] = useState(initPosition)

  useEffect(() => {
    if (socketOpen) {
      console.log('Socket open on Diagram')
      // HTTP Example
      // const request = { action: 'evaluateDiagram', nodes: nodes, edges: edges, testData: `[${testData.map(td => td.value)}]`, envData: `${JSON.stringify(envData)}` }
      // console.log(`request: ${JSON.stringify(request)}`)

      // axios.post('https://1mw6gy3fj2.execute-api.us-east-1.amazonaws.com/evaluatediagram', request)
      //   .then(function (response) {
      //     console.log(response);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
      
      // Ws Example
      const ws = new WebSocket('wss://0ig7g8kowd.execute-api.us-east-1.amazonaws.com/test/');

      const request = { action: 'evaluateDiagram', nodes: nodes, edges: edges, testData: `[${testData.map(td => td.value)}]`, envData: `${JSON.stringify(envData)}` }
      ws.onopen = () => {
        console.log('WebSocket connection established in Diagram.')

        ws.send(JSON.stringify(request))
      };

      ws.onmessage = (event) => {
        // console.log(`event: ${event} in Diagram`)
        const eventDataResponse = JSON.parse(event.data)
        console.log(`All event data ${JSON.stringify(eventDataResponse)}`)
        console.log(`event data 0: ${JSON.stringify(eventDataResponse.data[0])} in Diagram`)
        const eventData = eventDataResponse.data[0]
        setNodes((prevNodes) => {
          const newNodes = prevNodes.map(node => {
            if (eventData['nodes_visited'].includes(node.id)) {
              console.log(`Node to update: ${JSON.stringify(node)}`)
              const changedStyle = { ...node.style, 'backgroundColor': '#3bb143' }
              return { ...node, 'style': changedStyle }
            }
            return node
          })

          return newNodes
        })
      };

      ws.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
      });
  
      // Clean up the WebSocket connection on component unmount
      return () => {
        ws.close();
        socketOpen = false
      };

      // const request = { action: 'evaluateDiagram', nodes: nodes, edges: edges, testData: `[${testData.map(td => td.value)}]`, envData: `${JSON.stringify(envData)}` }
      // console.log(`request to send: ${JSON.stringify(request)}`)


    }
  }, [socketOpen])

  // const onNodesChange = useCallback(
  //   (changes) => setNodes((nds) => { 
  //     // console.log(`Changes: ${JSON.stringify(changes)}, nodes: ${JSON.stringify(nds)}`)
  //     applyNodeChanges(changes, nds) }),
  //   [setNodes]
  // );
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  function addNodeClicked(evt) {
    setPosition((prevPosition) => {
      // console.log(`set position called! Prev Position is: ${JSON.stringify(prevPosition)}`)
      return { x: prevPosition["x"], y: prevPosition["y"] + 50 }
    })

    setNodes((prevNodes) => {
      return [...prevNodes, {
        id: `${prevNodes.length + 1}`,
        type: 'textUpdater',
        data: { nodeId: prevNodes.length + 1, label: 'New Node' },
        position: nodePosition,
        style: { backgroundColor: '#ff0072', color: 'white' },
      }]
    })

    // console.log(`initial Nodes: ${JSON.stringify(initialNodes)}`)
    // setNodes(initialNodes)
  }

  return (
    <>
      <button style={{ display: 'bottom', height: '300px' }} onClick={addNodeClicked}>Add Node</button>
      {socketOpen ? (<h4>Evaluate Diagram</h4>) : (<h4></h4>)}
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes} />
      </div>
    </>
  );
}

export default Diagram;