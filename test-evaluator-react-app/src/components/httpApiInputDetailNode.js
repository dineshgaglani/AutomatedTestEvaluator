import React, { useEffect, useState } from 'react';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function HttpApiInputDetailNode ({ selectedNode }) {

    const [postSelected, setPostSelected] = useState(false)
    const [componentHttpMethod, setComponentHttpMethod] = useState(selectedNode.data.activationTask.taskProps.httpMethod)
    const [componentHttpAddress, setComponentHttpAddress] = useState(selectedNode.data.activationTask.taskProps.httpAddress)

    const httpMethodItems = ["GET", "POST", "PUT", "DELETE"]

    const selectMethodType = (selectedMethodEvent) => {
        const selectedMethod = selectedMethodEvent.value
        setComponentHttpMethod(selectedMethod)
        selectedNode.data.activationTask.taskProps.httpMethod = selectedMethod
        if (["POST", "PUT"].includes(selectedMethod)) {
            setPostSelected(true)
        } else {
            setPostSelected(false)
        }
    }

    useEffect(() => {
        const taskProps = selectedNode.data.activationTask.taskProps
        console.log(`In httpApiInputDetailNode useEffect, Setting nodeHttpMethod: ${taskProps.httpMethod},  nodeHttpAddress: ${taskProps.httpAddress}`)
        setComponentHttpMethod(taskProps.httpMethod)
        setComponentHttpAddress(taskProps.httpAddress)

        if(taskProps.httpMethod == "POST") {
            setPostSelected(true)
        } else {
            setPostSelected(false)
        }
    }, [selectedNode])

    function onChangeHttpAddress(evt) {
        console.log(`In onChangeHttpAddress: ${evt.target.value}`)
        setComponentHttpAddress(evt.target.value)
        selectedNode.data.activationTask.taskProps.httpAddress = evt.target.value
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                <Dropdown options={httpMethodItems} value={componentHttpMethod} onChange={selectMethodType} placeholder="HTTP Method" id="httpMethod" data-testid="httpMethod"/>
                <input onChange={e => onChangeHttpAddress(e)} placeholder="Http Address" style={{ width: '70vh' }} value={componentHttpAddress} id="httpAddress" data-testid="httpAddress"/>
            </div>
            {postSelected && <textarea style={{ width: "79vh", height: `50px`, float: 'bottom' }}></textarea>}
        </>
    )

}

export default HttpApiInputDetailNode