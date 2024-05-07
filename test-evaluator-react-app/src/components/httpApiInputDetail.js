import React, { useState } from 'react';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

function HttpApiInputDetail() {

    const httpMethodItems = ["GET", "POST", "PUT", "DELETE"]
    const defaultOption = httpMethodItems[0];

    return (
        <>
            <Dropdown options={httpMethodItems} value={defaultOption} placeholder="HTTP Method" />
            <input placeholder="Http Address" style={{width: '70vh'}} />
        </>
    )
}

export default HttpApiInputDetail