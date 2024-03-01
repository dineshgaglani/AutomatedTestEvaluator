import { useCallback, useState } from 'react';
import { Handle, Position } from 'reactflow';

const handleStyle = { left: 10 };

function TextUpdaterNode({ data }) {

  const [showTextareas, setShowTextareas] = useState(false);

  const onChangeNodeDescription = useCallback((evt) => {
    data["label"] = evt.target.value
    data["activationEligibilityDescription"] = evt.target.value
    console.log(`Node: ${JSON.stringify(data)}`)
  }, []);

  const onChangeActivationEligibility = useCallback((evt) => {
    data["activationEligibility"] = evt.target.value
  }, []);

  const onChangeActivationTask = useCallback((evt) => {
    data["activationTask"] = evt.target.value
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div>
        <label htmlFor="nodeDescription">Node Description:</label>
        <input type="text" id="nodeDescription" name="nodeDescription" value={data['label']} onChange={onChangeNodeDescription} className="nodrag" />

        <br />


        {showTextareas ? (
          <div id="activationEligibilitySection">
            <label htmlFor="activationEligibility">Activation Eligibility:</label>
            <textarea
              id="activationEligibility"
              name="activationEligibility"
              value={data['activationEligibility']}
              onChange={onChangeActivationEligibility}
              className="nodrag"
            ></textarea>
          </div>
        ) : null}

        <br />


        {showTextareas ? (
          <div id="activationTaskSection">
            <label htmlFor="activationTask">Activation Task:</label>
            <textarea id="activationTask" name="activationTask" value={data['activationTask']} onChange={onChangeActivationTask} className="nodrag"></textarea>
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