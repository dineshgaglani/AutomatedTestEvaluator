import React, { useEffect, useState } from 'react';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function HttpApiInputDetail({ nodeHttpMethod, nodeHttpAddress, setHttpMethod, setHttpAddress }) {

    console.log(`in httpinputdetail, selected node params: ${nodeHttpMethod}, ${nodeHttpAddress}`)

    const [postSelected, setPostSelected] = useState(false)

    const httpMethodItems = ["GET", "POST", "PUT", "DELETE"]

    // useEffect(() => {
    //     setHttpMethod(httpMethod)
    //     setHttpAddress(httpAddress)
    // }, [nodeHttpMethod, nodeHttpAddress])

    const selectMethodType = (selectedMethodEvent) => {
        const selectedMethod = selectedMethodEvent.value
        // setHttpMethod(selectedMethod)
        if (["POST", "PUT"].includes(selectedMethod)) {
            setPostSelected(true)
        } else {
            setPostSelected(false)
        }
    }

    function onChangeHttpAddress(evt) {
        console.log(evt.target.value)
    }

    return (
        <>
            <div style={{ display: 'flex' }}>
                <Dropdown options={httpMethodItems} value={nodeHttpMethod} onChange={selectMethodType} placeholder="HTTP Method" />
                <input readOnly={true} placeholder="Http Address" style={{ width: '70vh' }} value={nodeHttpAddress} />
            </div>
            {postSelected && <textarea style={{ width: "79vh", height: `50px`, float: 'bottom' }}></textarea>}
        </>
    )
}

export default HttpApiInputDetail