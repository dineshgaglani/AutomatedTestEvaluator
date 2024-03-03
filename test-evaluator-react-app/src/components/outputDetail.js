import React, { useState } from 'react';

function OutputDetail({infoText, diagPaneHeight, setDiagPaneHeight, heightDifferential, textAreaHeight, textAreaValue}) {

    const [textAreaOpen, setTextAreaOpen] = useState(false)
    const [textAreaSymbol, setTextAreaSymbol] = useState(`${infoText} ^`)

    function toggleTextArea() {
        const origTextAreaOpen = textAreaOpen
        setTextAreaOpen(!origTextAreaOpen)

        const textAreaNewSymbol = origTextAreaOpen ? "^":">"
        setTextAreaSymbol(`${infoText} ${textAreaNewSymbol}`)

        const newDiagPaneHeight = origTextAreaOpen ? diagPaneHeight + heightDifferential : diagPaneHeight - heightDifferential
        setDiagPaneHeight(newDiagPaneHeight)
    }

    return (
        <>
            <div style={{ marginTop: "10px" }}>
                <button onClick={toggleTextArea} style={{ width: "90vh", border: "black", height: "18px", backgroundColor: "grey" }}>{textAreaSymbol}</button>
                {textAreaOpen && <textarea style={{ width: "90vh", height: `${textAreaHeight}px` }} value={textAreaValue}></textarea>}
            </div>
        </>
    )
}

export default OutputDetail