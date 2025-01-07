import React, { useEffect, useState } from 'react';

function SeleniumUIInputDetailNode({ selectedNode }) {

    const newStep = { locator: "", action: "", param: "" }
    const newReturn = { name: "", locator: "" }

    let defaultCurrSteps = [newStep]
    let defaultCurrReturns = [newReturn]
    if(selectedNode.data.activationTask.taskType == "SeleniumUI") {
        defaultCurrSteps = selectedNode.data.activationTask.taskProps["steps"]
        defaultCurrReturns = selectedNode.data.activationTask.taskProps["returns"]
    } 
    const [currSteps, setCurrSteps] = useState(defaultCurrSteps)
    console.log(`Curr Steps on SeleniumUIInputDetailNode render: ${JSON.stringify(currSteps)}`)

    const [currReturns, setCurrReturns] = useState(defaultCurrReturns)
    console.log(`Curr Returns on SeleniumUIInputDetailNode render: ${JSON.stringify(currReturns)}`)

    useEffect(() => {
        let effectCurrSteps = [newStep]
        let effectCurrReturns = [newReturn] 
        if(selectedNode.data.activationTask.taskType == "SeleniumUI") {
            effectCurrSteps = selectedNode.data.activationTask.taskProps["steps"]
            effectCurrReturns = selectedNode.data.activationTask.taskProps["returns"]
        }
        setCurrSteps(effectCurrSteps)
        // console.log(`Curr Steps on SeleniumUIInputDetailNode useEffect: ${JSON.stringify(currSteps)}`)

        setCurrReturns(effectCurrReturns)
        // console.log(`Curr Returns on SeleniumUIInputDetailNode useEffect: ${JSON.stringify(currReturns)}`)
    }, [selectedNode])

    function onClickAddStep(event) {
        selectedNode.data.activationTask.taskType = "SeleniumUI"
        setCurrSteps(steps => {
            return [...steps, newStep]
        })
        // console.log(`Curr Steps on SeleniumUIInputDetailNode onClickAddStep: ${JSON.stringify(currSteps)}`)
    }

    function onClickAddReturn(event) {
        selectedNode.data.activationTask.taskType = "SeleniumUI"
        setCurrReturns(returns => {
            return [...returns, newReturn]
        })
        // console.log(`Curr Returns on SeleniumUIInputDetailNode onClickAddReturn: ${JSON.stringify(currReturns)}`)
    }

    function getChangedList(list, index, key, value) {
        // console.log(`Changing SeleniumUIInputDetailNode list at index: ${index}`)
        const itemsBeforeChangedItem = list.slice(0, index)
        // console.log(`Changing SeleniumUIInputDetailNode list item: ${list[index]}`)
        const changedItem = { ...list[index], [key]: value }
        const listAfterChangedItem = list.slice(index + 1)
        const newList = [...itemsBeforeChangedItem, changedItem, ...listAfterChangedItem] // Concatenate
        return newList
    }

    function onChangeSteps(index, key, value) {
        setCurrSteps((steps) => {
            const newSteps = getChangedList(steps, index, key, value)
            // console.log(`Updated Curr Steps in setCurrSteps: ${JSON.stringify(newSteps)}`)
            return newSteps
        })
        selectedNode.data.activationTask.taskProps["steps"] = getChangedList(currSteps, index, key, value)
    }

    function onLocatorChange(event, index) {
        onChangeSteps(index, "locator", event.target.value)
    }

    function onActionChange(event, index) {
        onChangeSteps(index, "action", event.target.value)
    }

    function onParamChange(event, index) {
        onChangeSteps(index, "param", event.target.value)
    }

    function onChangeReturns(index, key, value) {
        setCurrReturns((returns) => {
            const newReturns = getChangedList(returns, index, key, value)
            // console.log(`Updated Curr Returns in setCurrReturns: ${JSON.stringify(newReturns)}`)
            return newReturns
        })
        selectedNode.data.activationTask.taskProps["returns"] = getChangedList(currReturns, index, key, value)
    }

    function onReturnsLocatorChange(event, index) {
        onChangeReturns(index, "locator", event.target.value)
    }

    function onReturnsNameChange(event, index) {
        onChangeReturns(index, "name", event.target.value)
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
            <button data-testid="addReturnValBtn" onClick={onClickAddReturn}>Add Return Value</button>
            <div data-testid="returnsContainer">
                {currReturns.map((currReturn, index) => (
                    <div data-testid={`return${index}`} key={index}>
                        <label for="returnLocator">Locator:</label>
                        <input onChange={(e) => onReturnsLocatorChange(e, index)} data-testid={`returnsLocatorInput${index}`} value={currReturn.locator}></input>

                        <label for="returnName">Name:</label>
                        <input onChange={(e) => onReturnsNameChange(e, index)} data-testid={`returnsNameInput${index}`} value={currReturn.name}></input>
                    </div>
                ))}
            </div>
        </>
    )
}

export default SeleniumUIInputDetailNode