import React, { useEffect, useState } from 'react'

function PythonInputDetail({ nodePythonText, setPythonText}) {
//   console.log(`Python input task props: ${JSON.stringify(taskProps)}`)
  
//   const defaultPythonText = taskProps && taskProps["pythonText"] ? taskProps["pythonText"] : ""
  const [componentPythonText, setComponentPythonText] = useState(nodePythonText)  

  useEffect(() => {
    const pythonText = nodePythonText
    setComponentPythonText(pythonText)
  }, [nodePythonText]) 

  function onChangePythonText(evt) {
    setComponentPythonText(evt.target.value)
    setPythonText(evt.target.value)
  }

  return (
    <div>
      <textarea onChange={(e) => onChangePythonText(e)} value={componentPythonText} style={{ width: "79vh", height: `50px`, float: 'bottom' }} ></textarea>
    </div>
  )
}

export default PythonInputDetail
