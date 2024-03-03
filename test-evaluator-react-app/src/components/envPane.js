import React, { useState } from 'react';

function EnvPane({setEnvData}) {

    const [keyVals, setKeyVals] = useState([])

    function addKeyVal() {
        setKeyVals([...keyVals, {'key': 'newKey', 'value': 'newValue'}]);
    }

    function onKeyValChange(event, index, itemType) {
        const updatedKeyVals = [...keyVals]
        updatedKeyVals[index][itemType] = event.target.value
        setKeyVals(updatedKeyVals)
        setEnvData(updatedKeyVals)
    }

    return (
        <div style={{border: '1px solid black', marginTop: '10px'}}>
            <h2>Env Vars</h2>
            <button onClick={() => addKeyVal()} >Add EnvKeyValue</button>
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                    </tr>
                </thead>

                <tbody>
                    {keyVals.length > 0 ? (
                        keyVals.map((currkeyVal, index) => {
                            return <tr key={'envKeyVal_' + index}>
                                <td><input onChange={(event) => onKeyValChange(event, index, 'key')} value={currkeyVal['key']} style={{ width: '50px' }} /></td>
                                <td><input onChange={(event) => onKeyValChange(event, index, 'value')} value={currkeyVal['value']} style={{ width: '50px' }}></input></td>
                            </tr>
                        })
                    ) : (
                        <tr>
                            
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

}

export default EnvPane;