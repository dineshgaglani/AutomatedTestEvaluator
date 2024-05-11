import React from 'react'

function PythonInputDetail({taskProps}) {
  console.log(`Python input task props: ${JSON.stringify(taskProps)}`)
  return (
    <div>
      <textarea readOnly={true} value={taskProps ? taskProps['pythonText'] : ""} style={{ width: "79vh", height: `50px`, float: 'bottom' }} ></textarea>
    </div>
  )
}

export default PythonInputDetail
