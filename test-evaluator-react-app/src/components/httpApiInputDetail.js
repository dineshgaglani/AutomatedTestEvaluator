import React, { useState } from 'react';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function HttpApiInputDetail({taskProps}) {

    console.log(`in httpinputdetail: ${JSON.stringify(taskProps)}`)

    const [postSelected, setPostSelected] = useState(false)

    const httpMethodItems = ["GET", "POST", "PUT", "DELETE"]
    const defaultOption = httpMethodItems[0];

    const selectMethodType = (selectedMethodEvent) => {
        const selectedMethod = selectedMethodEvent.value
        if(["POST", "PUT"].includes(selectedMethod)) {
            setPostSelected(true)
        } else {
            setPostSelected(false)
        }
    }
    
    return (
        <>
            <div style={{ display: 'flex' }}>
                <Dropdown options={httpMethodItems} value={taskProps ? taskProps['httpMethod'] : defaultOption} onChange={selectMethodType} placeholder="HTTP Method" />
                <input readOnly={true} placeholder="Http Address" style={{ width: '70vh' }} value={taskProps ? taskProps['httpAddress'] : ""} />
            </div>
            {postSelected && <textarea style={{ width: "79vh", height: `50px`, float: 'bottom' }}></textarea> }
        </>
    )
}

export default HttpApiInputDetail