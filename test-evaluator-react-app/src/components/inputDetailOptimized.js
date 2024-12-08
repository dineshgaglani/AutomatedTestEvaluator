import { useEffect, useState } from "react"

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import PythonInputDetail from "./pythonInputDetailNode"
import SeleniumUInputDetail from "./seleniumUIInputDetailNode"
import HttpApiInputDetailNode from "./httpApiInputDetailNode";

function InputDetailOptimized({ infoText, diagPaneHeight, setDiagPaneHeight, heightDifferential, textAreaHeight, selectedNode }) {
    // const taskProps = selectedNode ? selectedNode.data.activationTask.taskProps : { httpMethod: "GET", httpAddress: "" }

    const [inputAreaOpen, setInputAreaOpen] = useState(false)
    const [inputAreaSymbol, setInputAreaSymbol] = useState(`${infoText} ^`)

    const [selectedStepType, setSelectedStepType] = useState(selectedNode ? selectedNode.data.activationTask.taskType : "HttpAPI")
    const [selectedStepTaskComponent, setSelectedStepTaskComponent] = useState(selectedNode ? getComponentBySelection(selectedNode.data.activationTask.taskType) : <HttpApiInputDetailNode selectedNode={selectedNode}/>)

    function toggleInputArea() {
        const origInputAreaOpen = inputAreaOpen
        setInputAreaOpen(!origInputAreaOpen)

        const inputAreaNewSymbol = origInputAreaOpen ? "^" : ">"
        setInputAreaSymbol(`${infoText} ${inputAreaNewSymbol}`)

        const newDiagPaneHeight = origInputAreaOpen ? diagPaneHeight + heightDifferential : diagPaneHeight - heightDifferential
        setDiagPaneHeight(newDiagPaneHeight)
    }

    function getComponentBySelection(selection) {
        if(selection == "HttpAPI") {
            if(selectedNode.data.activationTask.taskType != "HttpAPI") {
                selectedNode.data.activationTask.taskProps = { httpMethod: "GET", httpAddress: "" }
            }
            selectedNode.data.activationTask.taskType = "HttpAPI"
            return <HttpApiInputDetailNode selectedNode={selectedNode} />
        } else if(selection == "SeleniumUI") {
            if(selectedNode.data.activationTask.taskType != "SeleniumUI") {
                selectedNode.data.activationTask.taskProps = { }
            }
            selectedNode.data.activationTask.taskType = "SeleniumUI"
            return <SeleniumUInputDetail selectedNode={selectedNode} />
        } else if(selection == "PythonCode") {
            if(selectedNode.data.activationTask.taskType != "PythonCode") {
                selectedNode.data.activationTask.taskProps = { pythonText: "" }
            }
            selectedNode.data.activationTask.taskType = "PythonCode"
            return <PythonInputDetail selectedNode={selectedNode} />
        }
    }

    function selectStepType(selection) {
        setSelectedStepType(selection.value)
        setSelectedStepTaskComponent(getComponentBySelection(selection.value))
    }

    useEffect(() => {
        selectStepType({ "value": selectedNode.data.activationTask.taskType })
    }, [selectedNode]);

    return (
        <>

            <div style={{ marginTop: "10px" }}>
                <button onClick={toggleInputArea} style={{ width: "90vh", border: "black", height: "18px", backgroundColor: "grey" }}>{inputAreaSymbol}</button>
                <div>
                    <div style={{ display: 'flex' }}>
                        {inputAreaOpen && <label style={{ display: 'flex' }}>selectStepType:<Dropdown style={{ float: "left" }} options={["HttpAPI", "SeleniumUI", "PythonCode"]} onChange={selectStepType} value={selectedStepType} placeholder="Step Type" /></label>}
                        {/* {inputAreaOpen && <button style={{ marginLeft: "20px" }} onClick={saveNodeInput} id="saveInputDetails" data-testid="saveInputDetails">Save</button>} */}
                    </div>
                    {inputAreaOpen && selectedStepTaskComponent}
                </div>
            </div>
        </>
    )

}

export default InputDetailOptimized