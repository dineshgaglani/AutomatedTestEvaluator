import React, { useEffect, useState } from 'react';
import { convertObjectStringToSingleQuotesString } from '../utils/jsonUtils.js';

function OutputDetail({ infoText, diagPaneHeight, setDiagPaneHeight, heightDifferential, textAreaHeight, selectedNode, selectedTestData }) {

    const [textAreaOpen, setTextAreaOpen] = useState(false)
    const [textAreaSymbol, setTextAreaSymbol] = useState(`${infoText} ^`)
    const [textAreaValue, setTextAreaValue] = useState("")
    const [isImageTypeOutput, setImageTypeOutput] = useState(false)
    const [images, setImages] = useState([])
    const [responsiveTextAreaHeight, setResponsiveTextAreaHeight] = useState(textAreaHeight)

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
        setImages([])
        setImageTypeOutput(false)
        setResponsiveTextAreaHeight(textAreaHeight)
        const selectedTestDataStr = convertObjectStringToSingleQuotesString(selectedTestData)
        console.log(`selectedTestData after string conversion: ${selectedTestDataStr}`)
        if (selectedNode.data.output && selectedNode.data.output[selectedTestDataStr]) {
            console.log(`setting textarea value to ${JSON.stringify(selectedNode.data.output[selectedTestDataStr])}`)
            //TODO - create a new component for SeleniumUI instead of using if here
            let textAreaValue = selectedNode.data.output[selectedTestDataStr]
            if (selectedNode.data.activationTask.taskType == "SeleniumUI") {
                setImageTypeOutput(true)
                const parsedToJsonSeleniumResponse = JSON.parse(selectedNode.data.output[selectedTestDataStr])
                const parsedToJsonImages = parsedToJsonSeleniumResponse["s3Locations"]
                setImages(parsedToJsonImages)
                const { s3Locations, ...objExcludingS3LocationsKey } = parsedToJsonSeleniumResponse
                console.log(`UseEffect in outputDetails: Selenium s3Locations excluded obj ${JSON.stringify(objExcludingS3LocationsKey)} `)
                textAreaValue = JSON.stringify(objExcludingS3LocationsKey)
                setResponsiveTextAreaHeight(25)
            } 
            setTextAreaValue(textAreaValue)
        }
    }, [selectedNode, selectedTestData])

    return (
        <>
            <div style={{ marginTop: "10px" }}>
                <button onClick={toggleTextArea} style={{ width: "90vh", border: "black", height: "18px", backgroundColor: "grey" }}>{textAreaSymbol}</button>
                {textAreaOpen && <div data-testid="nodeOutputContainer">
                    <textarea data-testid="nodeOutput" style={{width: "90vh", height: `${responsiveTextAreaHeight}px`} } value={textAreaValue}></textarea>
                    {isImageTypeOutput && images.map((image, idx) => (
                        <img data-testId={`outputScr${idx}`} src={image} alt=""></img>
                    ))}
                </div>}
            </div>
        </>
    )
}

export default OutputDetail