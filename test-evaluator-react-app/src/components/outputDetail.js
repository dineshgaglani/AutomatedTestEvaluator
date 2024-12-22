import React, { useEffect, useState } from 'react';

function OutputDetail({ infoText, diagPaneHeight, setDiagPaneHeight, heightDifferential, textAreaHeight, selectedNode, selectedTestData }) {

    const [textAreaOpen, setTextAreaOpen] = useState(false)
    const [textAreaSymbol, setTextAreaSymbol] = useState(`${infoText} ^`)
    const [textAreaValue, setTextAreaValue] = useState("")
    const [isImageTypeOutput, setImageTypeOutput] = useState(false)
    const [images, setImages] = useState([])

    function toggleTextArea() {
        const origTextAreaOpen = textAreaOpen
        setTextAreaOpen(!origTextAreaOpen)

        const textAreaNewSymbol = origTextAreaOpen ? "^" : ">"
        setTextAreaSymbol(`${infoText} ${textAreaNewSymbol}`)

        const newDiagPaneHeight = origTextAreaOpen ? diagPaneHeight + heightDifferential : diagPaneHeight - heightDifferential
        setDiagPaneHeight(newDiagPaneHeight)
    }

    useEffect(() => {
        console.log(`UseEffect in outputDetails: selectedNode.data.output: ${JSON.stringify(selectedNode.data.output)}, selectedTestData: ${JSON.stringify(selectedTestData)}`)
        setTextAreaValue("")
        if (selectedNode.data.output && selectedNode.data.output[selectedTestData]) {
            console.log(`setting textarea value to ${JSON.stringify(selectedNode.data.output[selectedTestData])}`)
            //TODO - create a new component for SeleniumUI instead of using if here
            if (selectedNode.data.activationTask.taskType == "SeleniumUI") {
                setImageTypeOutput(true)
                const parsedToJsonImages = JSON.parse(selectedNode.data.output[selectedTestData])
                setImages(parsedToJsonImages)
            } else {
                setTextAreaValue(selectedNode.data.output[selectedTestData])
            }
        }
    }, [selectedNode, selectedTestData])

    return (
        <>
            <div style={{ marginTop: "10px" }}>
                <button onClick={toggleTextArea} style={{ width: "90vh", border: "black", height: "18px", backgroundColor: "grey" }}>{textAreaSymbol}</button>
                {textAreaOpen && !isImageTypeOutput && <textarea data-testid="nodeOutput" style={{ width: "90vh", height: `${textAreaHeight}px` }} value={textAreaValue}></textarea>}
                {isImageTypeOutput && images.map(image => (
                    <img src={image} alt=""></img>
                ))}
            </div>
        </>
    )
}

export default OutputDetail