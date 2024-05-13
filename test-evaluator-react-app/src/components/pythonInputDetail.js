import React, { useEffect, useState } from 'react'

function PythonInputDetail({taskProps}) {
  console.log(`Python input task props: ${JSON.stringify(taskProps)}`)
  
  const defaultPythonText = taskProps && taskProps["pythonText"] ? taskProps["pythonText"] : ""
  const [pythonText, setPythonText] = useState(defaultPythonText)  

  useEffect(() => {
    const pythonText = taskProps && taskProps["pythonText"] ? taskProps["pythonText"] : ""
    setPythonText(pythonText)
  }, [taskProps]) 

  return (
    <div>
      <textarea readOnly={true} value={pythonText} style={{ width: "79vh", height: `50px`, float: 'bottom' }} ></textarea>
    </div>
  )
}

export default PythonInputDetail
