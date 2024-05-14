import React, { useEffect, useState } from 'react';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function HttpApiInputDetail({ nodeHttpMethod, nodeHttpAddress, setHttpMethod, setHttpAddress }) {

    console.log(`in httpinputdetail, selected node params: ${nodeHttpMethod}, ${nodeHttpAddress}`)

    const [postSelected, setPostSelected] = useState(false)
    const [componentHttpMethod, setComponentHttpMethod] = useState(nodeHttpMethod)
    const [componentHttpAddress, setComponentHttpAddress] = useState(nodeHttpAddress)

    const httpMethodItems = ["GET", "POST", "PUT", "DELETE"]

    const selectMethodType = (selectedMethodEvent) => {
        const selectedMethod = selectedMethodEvent.value
        setComponentHttpMethod(selectedMethod)
        setHttpMethod(selectedMethod)
        if (["POST", "PUT"].includes(selectedMethod)) {
            setPostSelected(true)
        } else {
            setPostSelected(false)
        }
    }

    useEffect(() => {
        setComponentHttpMethod(nodeHttpMethod)
        setComponentHttpAddress(nodeHttpAddress)

        if(componentHttpMethod == "POST") {
            setPostSelected(true)
        } else {
            setPostSelected(false)
        }
    }, [nodeHttpMethod, nodeHttpAddress])

    function onChangeHttpAddress(evt) {
        console.log(evt.target.value)
        setComponentHttpAddress(evt.target.value)
        setHttpAddress(evt.target.value)
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                <Dropdown options={httpMethodItems} value={nodeHttpMethod} onChange={selectMethodType} placeholder="HTTP Method" />
                <input onChange={e => onChangeHttpAddress(e)} placeholder="Http Address" style={{ width: '70vh' }} value={componentHttpAddress} />
            </div>
            {postSelected && <textarea style={{ width: "79vh", height: `50px`, float: 'bottom' }}></textarea>}
        </>
    )
}

export default HttpApiInputDetail