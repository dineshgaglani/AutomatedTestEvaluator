import React, { useEffect } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import { useCallback, useState, useMemo } from 'react';

import 'reactflow/dist/style.css';

import TextUpdaterNode from '../nodes/TextNode.js';
import initialNodes from '../nodes/allNodes'
import initialEdges from '../edges/allEdges'

function Diagram({ socketOpen }) {

  const initPosition = { 'x': 100, 'y': 150 }
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodePosition, setPosition] = useState(initPosition)

  useEffect(() => {
    if (socketOpen) {
      console.log('Socket open on Diagram')
      // const ws = new WebSocket('wss://socketsbay.com/wss/v2/1/demo/');

      // ws.onopen = () => {
      //   console.log('WebSocket connection established in Diagram.');
      // };

      // ws.onmessage = (event) => {
      //   console.log(`event: ${JSON.stringify(event)} in Diagram`)
      //   // setNodes((prevNodes) => {
      //   //   let updatedNodes =  [...prevNodes]
      //   //   let nodeToChange = updatedNodes.find(node => {
      //   //     event.nodeId.includes(node.id)
      //   //   })
      //   //   nodeToChange.style.backgroundColor = '#ff0e00'

      //   //   return updatedNodes
      //   // })
      // };

      setNodes((prevNodes) => {
          const newNodes = prevNodes.map(node => {
            if(["1", "2", "3"].includes(node.id)) {
              console.log(`Node to update: ${JSON.stringify(node)}`)
              const changedStyle = {...node.style, 'backgroundColor': '#ff0e00'}
              return {...node, 'style': changedStyle}
            }
            return node
          })

          return newNodes
          
        })

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