import React, { useState } from 'react';

function SavedDiagramsModal({ diagramsList, modalOpen, renderDiagram, generateWithApi }) {
    
    const [diagramPromptText, setDiagramPromptText] = useState('')

    function forwardPromptToParent() {
        generateWithApi(diagramPromptText)
    }

    return (
        <div>
            <button onClick={() => modalOpen(false)}> X </button>
            <div>
                {diagramsList.map((diagramName, index) => 
                    <li onClick={() => renderDiagram(index)} key={index}>{diagramName}</li>
                )}
            </div>
            <textarea onChange={(evt) => setDiagramPromptText(evt.target.value)} value={diagramPromptText}></textarea>
            <li key="generate"><button onClick={forwardPromptToParent}>Generate with ChatGPT</button></li>
        </div>
    )
}

export default SavedDiagramsModal