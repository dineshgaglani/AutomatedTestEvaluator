import React, { useEffect, useState } from 'react'

function PythonInputDetailNode({ selectedNode }) {  
  const defaultPythonText = selectedNode.data.activationTask.taskType == "PythonCode" ? selectedNode.data.activationTask.taskProps["pythonText"] : ""
  const [componentPythonText, setComponentPythonText] = useState(defaultPythonText)  

  useEffect(() => {
    const pythonText = selectedNode.data.activationTask.taskProps["pythonText"]
    setComponentPythonText(pythonText)
  }, [selectedNode]) 

  function onChangePythonText(evt) {
    setComponentPythonText(evt.target.value)
    selectedNode.data.activationTask.taskProps.pythonText = evt.target.value
  }

  return (
    <div>
      <textarea data-testid="pythonText" onChange={(e) => onChangePythonText(e)} value={componentPythonText} style={{ width: "79vh", height: `50px`, float: 'bottom' }} ></textarea>
    </div>
  )
}

export default PythonInputDetailNode
