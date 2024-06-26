import { useEffect, useState } from "react"

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import HttpApiInputDetail from "./httpApiInputDetail"
import PythonInputDetail from "./pythonInputDetail"
import SeleniumUInputDetail from "./seleniumUIInputDetail"

function InputDetailOptimized({ infoText, diagPaneHeight, setDiagPaneHeight, heightDifferential, textAreaHeight, selectedNode }) {
    // console.log(`selectedNode in inputDetailOptimized: ${JSON.stringify(selectedNode)}`)
    const taskProps = selectedNode && selectedNode['data'] && selectedNode['data']['activationTask'] ? selectedNode['data']['activationTask']['taskProps'] : {}

    // Child component params
    // const nodeHttpMethod = taskProps && taskProps['httpMethod'] ? taskProps['httpMethod'] : "GET"
    // const nodeHttpAddress = taskProps && taskProps['httpAddress'] ? taskProps['httpAddress'] : ""

    // const nodeHttpMethod = taskProps['httpMethod']
    // const nodeHttpAddress = taskProps['httpAddress']

    // console.log(`taskprops in InputDetailsOptimzied: ${JSON.stringify(taskProps)}, nodeHttpMethod: ${nodeHttpMethod}, nodeHttpAddress: ${nodeHttpAddress}`)

    const [httpMethod, setHttpMethod] = useState(taskProps && taskProps['httpMethod'] ? taskProps['httpMethod'] : "GET")
    const [httpAddress, setHttpAddress] = useState(taskProps && taskProps['httpAddress'] ? taskProps['httpAddress'] : "")

    console.log(`httpMethod: ${httpMethod}, httpAddress: ${httpAddress} in inputDetailsOpitimized`)

    const [pythonText, setPythonText] = useState(taskProps && taskProps['pythonText'] ? taskProps['pythonText'] : "")

    const stepTypeItems = { "HttpAPI": <HttpApiInputDetail nodeHttpMethod={httpMethod} nodeHttpAddress={httpAddress} setHttpMethod={setHttpMethod} setHttpAddress={setHttpAddress} />, "SeleniumUI": <SeleniumUInputDetail taskProps={taskProps} />, "PythonCode": <PythonInputDetail nodePythonText={pythonText} setPythonText={setPythonText} /> }

    const [inputAreaOpen, setInputAreaOpen] = useState(false)
    const [inputAreaSymbol, setInputAreaSymbol] = useState(`${infoText} ^`)

    const [selectedStepType, setSelectedStepType] = useState(selectedNode && selectedNode['data'] && selectedNode['data']['activationTask'] ? selectedNode['data']['activationTask']['taskType'] : "HttpAPI")
    const [selectedStepTaskComponent, setSelectedStepTaskComponent] = useState(selectedNode && selectedNode['data'] && selectedNode['data']['activationTask'] ? stepTypeItems[selectedNode['data']['activationTask']['taskType']] : <HttpApiInputDetail taskProps={{}} />)

    function toggleInputArea() {
        const origInputAreaOpen = inputAreaOpen
        setInputAreaOpen(!origInputAreaOpen)

        const inputAreaNewSymbol = origInputAreaOpen ? "^" : ">"
        setInputAreaSymbol(`${infoText} ${inputAreaNewSymbol}`)

        const newDiagPaneHeight = origInputAreaOpen ? diagPaneHeight + heightDifferential : diagPaneHeight - heightDifferential
        setDiagPaneHeight(newDiagPaneHeight)
    }

    function selectStepType(selection) {
        setSelectedStepType(selection.value)
        setSelectedStepTaskComponent(stepTypeItems[selection.value])
    }

    function saveNodeInput() {
        let newTaskProps = {}
        if (selectedStepType == "HttpAPI") {
            newTaskProps = { "httpMethod": httpMethod, "httpAddress": httpAddress }
        }

        if(selectedStepType == "PythonCode") {
            newTaskProps = { "pythonText": pythonText }
        }

        console.log(`taskProps to write: ${JSON.stringify(newTaskProps)}`)
        selectedNode["data"]["activationTask"] = {
            "taskType": selectedStepType,
            "taskProps": newTaskProps
        }
    }

    useEffect(() => {
        console.log(`Re-rendering inputDetailsOptimized component`)
        const selectedNodeActivationTaskType = selectedNode && selectedNode['data'] && selectedNode['data']['activationTask'] ? selectedNode['data']['activationTask']['taskType'] : "HttpAPI"

        if (selectedStepType == "HttpAPI") {
            const nodeHttpMethod = taskProps && taskProps['httpMethod'] ? taskProps['httpMethod'] : "GET"
            const nodeHttpAddress = taskProps && taskProps['httpAddress'] ? taskProps['httpAddress'] : ""
            setHttpMethod(nodeHttpMethod)
            setHttpAddress(nodeHttpAddress)
        }

        if (selectedStepType == "PythonCode") {
            const nodePythonText = taskProps && taskProps['pythonText'] ? taskProps['pythonText'] : ""
            setPythonText(nodePythonText)
        }


        selectStepType({ "value": selectedNodeActivationTaskType })
        // if(selectedNode && selectedNode['data'] && selectedNode['data']['activationTask']['taskType']) {
        //     setSelectedStepTaskComponent(stepTypeItems[selectedNode['data']['activationTask']['taskType']])
        // }

    }, [selectedNode]);

    return (
        <>

            <div style={{ marginTop: "10px" }}>
                <button onClick={toggleInputArea} style={{ width: "90vh", border: "black", height: "18px", backgroundColor: "grey" }}>{inputAreaSymbol}</button>
                <div>
                    <div style={{ display: 'flex' }}>
                        {inputAreaOpen && <Dropdown style={{ float: "left" }} options={Object.keys(stepTypeItems)} onChange={selectStepType} value={selectedStepType} placeholder="Step Type" />}
                        {inputAreaOpen && <button style={{ marginLeft: "20px" }} onClick={saveNodeInput}>Save</button>}
                    </div>
                    {inputAreaOpen && selectedStepTaskComponent}
                </div>
            </div>
        </>
    )

    // return (<>{httpMethod}{httpAddress}</>)
}

export default InputDetailOptimized