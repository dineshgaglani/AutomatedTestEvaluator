import React, { useState } from 'react';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import HttpApiInputDetail from './httpApiInputDetail';
import PythonInputDetail from './pythonInputDetailNode';
import SeleniumUInputDetail from './seleniumUIInputDetailNode';

function InputDetail({ infoText, diagPaneHeight, setDiagPaneHeight, heightDifferential, textAreaHeight, selectedStepType, setSelectedStepType, selectedTaskComponent, setSelectedTaskComponent, inputAreaContent, stepTypeItems, getComponentFunction, setNodeInput }) {

    const [inputAreaOpen, setInputAreaOpen] = useState(false)
    const [inputAreaSymbol, setInputAreaSymbol] = useState(`${infoText} ^`)

    function toggleInputArea() {
        const origInputAreaOpen = inputAreaOpen
        setInputAreaOpen(!origInputAreaOpen)

        const inputAreaNewSymbol = origInputAreaOpen ? "^" : ">"
        setInputAreaSymbol(`${infoText} ${inputAreaNewSymbol}`)

        const newDiagPaneHeight = origInputAreaOpen ? diagPaneHeight + heightDifferential : diagPaneHeight - heightDifferential
        setDiagPaneHeight(newDiagPaneHeight)
    }

    function selectStepType(selectStepTypeEvent) {
        console.log(`Step type selection changed, new selection: ${selectStepTypeEvent.value}`)
        setSelectedStepType(selectStepTypeEvent.value)
        if(inputAreaContent["taskType"] == selectStepTypeEvent.value) {
            setSelectedTaskComponent(getComponentFunction(selectStepTypeEvent.value, {}))
        } else {
            setSelectedTaskComponent(getComponentFunction(selectStepTypeEvent.value))
        }
    }

    function saveNodeInput(evt) {
        console.log(`Saving node input content`)
        setNodeInput({"taskType": selectedStepType, "taskProps": {}})
    } 

    return (
        <>

            <div style={{ marginTop: "10px" }}>
                <button onClick={toggleInputArea} style={{ width: "90vh", border: "black", height: "18px", backgroundColor: "grey" }}>{inputAreaSymbol}</button>
                <div>
                    <div style={{ display: 'flex' }}>
                        {inputAreaOpen && <Dropdown style={{ float: "left" }} options={Object.keys(stepTypeItems)} onChange={selectStepType} value={selectedStepType} placeholder="Step Type" />}
                        {inputAreaOpen && <button style={{marginLeft: "20px"}} onClick={saveNodeInput}>Save</button>}
                    </div>
                    {inputAreaOpen && selectedTaskComponent}
                </div>
            </div>
        </>
    )
}

export default InputDetail