import React, { useState } from 'react';
import EnvPane from './components/envPane.js';
import TestDataPane from './components/testDataPane.js';

import Diagram from './diagram/diagram.js';

function App() {

  const [evaluateDiagramSocketOpen, setEvaluateDiagramSocketOpen] = useState(false)
  const [evaluateTestDataSocketOpen, setEvaluateTestDataSocketOpen] = useState(false)
  const [testData, setTestData] = useState([])
  const [envData, setEnvData] = useState([])

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
    <div style={{ display: "flex" }}>
      <Diagram id="diagramPane" socketOpen={evaluateDiagramSocketOpen} testData={testData} envData={envData}></Diagram>
      <div style={{ float: "right" }}>
        <EnvPane style={{ width: '300px', height: '300px' }} setEnvData={setEnvData}></EnvPane>
        <TestDataPane id="testDataPane" socketOpen={evaluateTestDataSocketOpen} style={{ width: '300px' }} setTestData={setTestData}></TestDataPane>
        <button style={{ display: "top", height: '70px', marginTop: '10px' }} onClick={handleEvaluateClick}>Evaluate Diagram with TestData</button>
      </div>
    </div>
  );
}

export default App;
