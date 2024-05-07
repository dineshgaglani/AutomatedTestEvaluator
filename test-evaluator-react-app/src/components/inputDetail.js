import React, { useState } from 'react';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import HttpApiInputDetail from './httpApiInputDetail';
import SeleniumUInputDetail from './SeleniumUIInputDetail';

function InputDetail({ infoText, diagPaneHeight, setDiagPaneHeight, heightDifferential, textAreaHeight, textAreaValue }) {

    const [selectedStepType, setSelectedStepType] = useState('')
    const stepTypeItems = { "HttpAPI": <HttpApiInputDetail style={{ float: "right" }} />, "SeleniumUI": <SeleniumUInputDetail /> }
    const defaultOption = Object.keys(stepTypeItems)[0]

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

    function selectStepType(selectedStepType) {
        setSelectedStepType(selectedStepType.value)
    }

    return (
        <>

            <div style={{ marginTop: "10px" }}>
                <button onClick={toggleInputArea} style={{ width: "90vh", border: "black", height: "18px", backgroundColor: "grey" }}>{inputAreaSymbol}</button>
                <div style={{ display: 'flex' }}>
                    {inputAreaOpen && <Dropdown style={{ float: "left" }} options={Object.keys(stepTypeItems)} onChange={selectStepType} value={defaultOption} placeholder="Step Type" />}
                    {inputAreaOpen && stepTypeItems[selectedStepType]}
                </div>
                {inputAreaOpen && <textarea style={{ width: "90vh", height: `${textAreaHeight}px`, float: 'bottom' }} ></textarea>}
            </div>
        </>
    )
}

export default InputDetail