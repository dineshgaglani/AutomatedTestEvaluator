import React, { useState } from 'react';
import TestDataPane from './components/testDataPane.js';

import Diagram from './diagram/diagram.js';

function App() {

  const [evaluateDiagramSocketOpen, setEvaluateDiagramSocketOpen] = useState(false)
  const [evaluateTestDataSocketOpen, setEvaluateTestDataSocketOpen] = useState(false)

  const handleEvaluateClick = () => {
    handleEvaluateDiagram()
    handleEvaluateTestData()
  }

  const handleEvaluateDiagram = () => {
    console.log('Evaluate diagram initiated on App.js');
    setEvaluateDiagramSocketOpen(true)
  } 

  const handleEvaluateTestData = () => {
    console.log('Evaluate TestData initiated on App.js');
    setEvaluateTestDataSocketOpen(true)
  }

  return (
    <div style={{display: "flex" }}>
      <button style={{display: "top", height: '300px'}} onClick={handleEvaluateClick}>Evaluate Diagram with TestData</button>
      <Diagram id="diagramPane" socketOpen={evaluateDiagramSocketOpen}></Diagram>
      <TestDataPane id="testDataPane" socketOpen={evaluateTestDataSocketOpen} style={{width: '300px'}}></TestDataPane>
    </div>
  );
}

export default App;
