import { useCallback, useState } from 'react';
import { Handle, Position, useOnSelectionChange } from 'reactflow';

const handleStyle = { left: 10 };

function TextUpdaterNode({ data }) {

  const [showTextareas, setShowTextareas] = useState(false);

  const initialLabelData = data.label ? data.label : ""
  const [label, setLabel] = useState(initialLabelData)

  const initialActivationEligibility = data.activationEligibility ? data.activationEligibility : ""
  const [activationEligibility, setActivationEligibility] = useState(initialActivationEligibility)

  const initialActivationTask = data.activationTask ? JSON.stringify(data.activationTask) : ""
  const [activationTask, setActivationTask] = useState(initialActivationTask)

  const onChangeNodeDescription = useCallback((evt) => {
    const value = evt.target.value
    setLabel(value)
    data["label"] = value
    data["activationEligibilityDescription"] = label
  }, []);

  const onChangeActivationEligibility = useCallback((evt) => {
    const value = evt.target.value
    setActivationEligibility(value)
    data["activationEligibility"] = value
    console.log(`Activation Eligibility change: ${data["activationEligibility"]}`)
  }, []);

  // const onChangeActivationTask = useCallback((evt) => {
  //   const value = evt.target.value
  //   setActivationTask(value)
  //   data["activationTask"] = value
  // }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div>
        <label htmlFor="nodeDescription">Node Description:</label>
        <input type="text" id="nodeDescription" name="nodeDescription" value={label} onChange={onChangeNodeDescription} className="nodrag" />

        <br />


        {showTextareas ? (
          <div id="activationEligibilitySection">
            <label htmlFor="activationEligibility">Activation Eligibility:</label>
            <textarea
              id="activationEligibility"
              name="activationEligibility"
              value={activationEligibility}
              onChange={onChangeActivationEligibility}
              className="nodrag"
            ></textarea>
          </div>
        ) : null}

        <br />


        {/* {showTextareas ? (
          <div id="activationTaskSection">
            <label htmlFor="activationTask">Activation Task:</label>
            <textarea id="activationTask" name="activationTask" value={activationTask} onChange={onChangeActivationTask} className="nodrag"></textarea>
          </div>
        ) : null} */}

        {showTextareas ? (
          <div id="activationTaskSection">
            <label htmlFor="activationTask">Activation Task:</label>
            <textarea id="activationTask" name="activationTask" value={activationTask} disabled={true} className="nodrag"></textarea>
          </div>
        ) : null}

        <br />

        <button style={{ float: 'right' }} onClick={() => setShowTextareas(!showTextareas)}>
          {showTextareas ? true : false}
        </button>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      />
    </>
  );
}

export default TextUpdaterNode;