import React, { useEffect, useState } from 'react';

function SeleniumUIInputDetailNode({ selectedNode }) {

    const newStep = { locator: "", action: "", param: "" }
    const defaultCurrSteps = selectedNode.data.activationTask.taskType == "SeleniumUI" ? selectedNode.data.activationTask.taskProps : [newStep]
    const [currSteps, setCurrSteps] = useState(defaultCurrSteps)
    console.log(`Curr Steps on SeleniumUIInputDetailNode render: ${JSON.stringify(currSteps)}`)

    useEffect(() => {
        const effectCurrSteps = selectedNode.data.activationTask.taskType == "SeleniumUI" ? selectedNode.data.activationTask.taskProps : [newStep]
        setCurrSteps(effectCurrSteps)
        console.log(`Curr Steps on SeleniumUIInputDetailNode useEffect: ${JSON.stringify(currSteps)}`)
    }, [selectedNode])

    function onClickAddStep(event) {
        selectedNode.data.activationTask.taskType = "SeleniumUI"
        setCurrSteps(steps => {
            return [...steps, newStep]
        })
        console.log(`Curr Steps on SeleniumUIInputDetailNode onClickAddStep: ${JSON.stringify(currSteps)}`)
    }

    function getChangedSteps(steps, index, key, value) {
        console.log(`Changing SeleniumUIInputDetailNode step at index: ${index}`)
        const stepsBeforeChangedStep = steps.slice(0, index)
        console.log(`Changing SeleniumUIInputDetailNode step: ${steps[index]}`)
        const changedStep = { ...steps[index], [key]: value }
        const stepsAfterChangedStep = steps.slice(index + 1)
        const newSteps = [...stepsBeforeChangedStep, changedStep, ...stepsAfterChangedStep] // Concatenate
        return newSteps
    }

    function onChange(index, key, value) {
        setCurrSteps((steps) => {
            const newSteps = getChangedSteps(steps, index, key, value)
            console.log(`Updated Curr Steps in setCurrSteps: ${JSON.stringify(newSteps)}`)
            return newSteps
        })
        selectedNode.data.activationTask.taskProps = getChangedSteps(currSteps, index, key, value)
    }

    function onLocatorChange(event, index) {
        onChange(index, "locator", event.target.value)
    }

    function onActionChange(event, index) {
        onChange(index, "action", event.target.value)
    }

    function onParamChange(event, index) {
        onChange(index, "param", event.target.value)
    }

    return (
        <>
            <button data-testid="addSeleniumStepBtn" onClick={onClickAddStep}>Add Selenium Step</button>
            <div data-testid="stepsContainer">
                {currSteps.map((currStep, index) => (
                    <div data-testid={`step${index}`} key={index}>
                        <label for="locator">Locator:</label>
                        <input onChange={(e) => onLocatorChange(e, index)} data-testid={`locatorInput${index}`} value={currStep.locator}></input>

                        <label for="action">Action:</label>
                        <input onChange={(e) => onActionChange(e, index)} data-testid={`actionInput${index}`} value={currStep.action}></input>

                        <label for="param">Param:</label>
                        <input onChange={(e) => onParamChange(e, index)} data-testid={`paramInput${index}`} value={currStep.param}></input>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SeleniumUIInputDetailNode