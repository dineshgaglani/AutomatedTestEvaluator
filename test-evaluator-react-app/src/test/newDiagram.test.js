import React, { act } from 'react';
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Diagram from "../diagram/diagram";
/* 
    Biggest test:
    Validate no nodes are present on blank canvas
    Add a node, validate that id is generated, name it "This is a test node", set the ActivationEligibility to 'return True', set the ActivationTask to PythonCode with content 'print "Testing"'
    Add a new node, validate that id is generated, name it "This is a second node", create edge from "This is a test node" to "This is a second node", set the ActivationEligibility to 'return True', set the ActivationTask to HttpApi with content GET www.google.com.
    Select the first node, validate the NodeTask is updated appropriately
    Select the second node, validate the NodeTask is updated appropriately
*/

class ResizeObserver {
    constructor(callback) {
        this.callback = callback;
    }

    observe(target) {
        this.callback([{ target }], this);
    }

    unobserve() { }

    disconnect() { }
}

class DOMMatrixReadOnly {
    constructor(transform) {
        const scale = transform?.match(/scale\(([1-9.])\)/)?.[1];
        this.m22 = scale !== undefined ? +scale : 1;
    }
}

// Only run the shim once when requested
let init = false;

export const mockReactFlow = () => {
    if (init) return;
    init = true;

    global.ResizeObserver = ResizeObserver;

    global.DOMMatrixReadOnly = DOMMatrixReadOnly;

    Object.defineProperties(global.HTMLElement.prototype, {
        offsetHeight: {
            get() {
                return parseFloat(this.style.height) || 1;
            },
        },
        offsetWidth: {
            get() {
                return parseFloat(this.style.width) || 1;
            },
        },
    });

    global.SVGElement.prototype.getBBox = () => ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });
};


describe("New Diagram - Create nodes", () => {

    beforeEach(() => {
        mockReactFlow()
     })

    test("On initial Render no nodes should be present. Buttons 'Open Demo diagram' and 'Add node' should be present", () => {

        render(<Diagram socketOpen={false} testData={[]} envData={[]} selectedTestDataIndex={-1}/>)

        const createNodeBtn = screen.getByTestId("createNode")
        expect(screen.getByTestId("openDiagram")).toBeInTheDocument();
        expect(createNodeBtn).toBeInTheDocument();
        expect(screen.queryByTestId(/^rf__node-\d+$/)).toBeNull();

        fireEvent.click(createNodeBtn);
        expect(screen.getByTestId(/^rf__node-\d+$/)).toBeInTheDocument();
    })

    test("Node should be selected when clicking on it", async () => {

        render(<Diagram socketOpen={false} testData={[]} envData={[]} selectedTestDataIndex={-1}/>)

        const createNodeBtn = screen.getByTestId("createNode")
        expect(screen.getByTestId("openDiagram")).toBeInTheDocument();
        expect(createNodeBtn).toBeInTheDocument();
        expect(screen.queryByTestId(/^rf__node-\d+$/)).toBeNull();

        fireEvent.click(createNodeBtn);
        expect(screen.getByTestId('rf__node-1')).toBeInTheDocument();
        const node1 = screen.getByTestId('rf__node-1')
        fireEvent.click(node1);
        node1.focus()
        await userEvent.keyboard('{Enter}');
        expect(node1).toHaveClass('selected')

        // screen.debug()
    })

    test("On adding a new node with Description and ActivationEligibility it should persist the details", async () => {

        render(<Diagram socketOpen={false} testData={[]} envData={[]} selectedTestDataIndex={-1}/>)

        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument();
        fireEvent.click(node1);

        const nodeDescriptionTextboxNode1 = within(node1).getByLabelText("Node Description:")
        fireEvent.change(nodeDescriptionTextboxNode1, { target: { value: 'New Text' } });

        const eligibilityTextBoxIdNode1 = "activationEligibility-1";
        const activationTaskTextBoxIdNode1 = "activationTask-1";
        const eligibilityTextBoxValue = "return True";
        const taskTextBoxValue = 'print("Testing")'
        expect(screen.queryByTestId(eligibilityTextBoxIdNode1)).toBeNull();
        expect(screen.queryByTestId(activationTaskTextBoxIdNode1)).toBeNull();

        const expandNodeBtnNode1 = within(node1).getByTestId("expandNode-1")
        fireEvent.click(expandNodeBtnNode1)
        const eligibiltyTextBoxNode1 = within(node1).getByTestId(eligibilityTextBoxIdNode1)
        fireEvent.change(eligibiltyTextBoxNode1, { target: { value:  eligibilityTextBoxValue } });
        const activationTaskTextBoxNode1 = within(node1).getByTestId(activationTaskTextBoxIdNode1)
        fireEvent.change(activationTaskTextBoxNode1, { target: { value:  taskTextBoxValue} });
        fireEvent.click(expandNodeBtnNode1)
        expect(screen.queryByTestId(eligibilityTextBoxIdNode1)).toBeNull();
        expect(screen.queryByTestId(activationTaskTextBoxIdNode1)).toBeNull();


        fireEvent.click(createNodeBtn);
        const node2 = screen.getByTestId("rf__node-2")
        expect(node2).toBeInTheDocument();
        fireEvent.click(node2);
        node2.focus()
        await userEvent.keyboard('{Enter}');
        
        expect(node2).toHaveClass('selected')
        fireEvent.click(expandNodeBtnNode1)

        //Validate in the dom that the nodeDescriptionTextboxNode1 and eligibiltyTextBoxNode1 have the value entered
        expect(screen.queryByTestId(eligibilityTextBoxIdNode1).value).toEqual(eligibilityTextBoxValue)
        //Validate that activationTaskTextBoxIdNode1 value has not persisted since it is set by default initially and then from InputDetailComponent
        expect(screen.queryByTestId(activationTaskTextBoxIdNode1).value).toEqual("{\"taskType\":\"HttpAPI\",\"taskProps\":{\"httpMethod\":\"GET\",\"httpAddress\":\"\"}}")

        //Validate positions of node1 and node2
        expect(node1.style.transform).toEqual("translate(100px,150px)")
        expect(node2.style.transform).toEqual("translate(100px,200px)")
    })

    test("Nodes' ActivationTask should reflect their input details", async () => {
        render(<Diagram socketOpen={false} testData={[]} envData={[]} selectedTestDataIndex={-1}/>)

        const inputAreaBtn = screen.queryByText("Node Task ^")
        expect(inputAreaBtn).toBeNull()

        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument();
        const expandNodeBtnNode1 = within(node1).getByTestId("expandNode-1")

        fireEvent.click(createNodeBtn);
        const node2 = screen.getByTestId("rf__node-2")
        expect(node2).toBeInTheDocument();
        const expandNodeBtnNode2 = within(node2).getByTestId("expandNode-2")

        const inputAreaBtnAfterNodesAdded = screen.queryByText("Node Task ^")
        expect(inputAreaBtnAfterNodesAdded).toBeNull()

        fireEvent.click(expandNodeBtnNode2)

        const nodeDescriptionTextboxNode2 = within(node2).getByLabelText("Node Description:")
        fireEvent.change(nodeDescriptionTextboxNode2, { target: { value: 'New Text' } });

        fireEvent.click(node2);
        node2.focus()
        await userEvent.keyboard('{Enter}');

        const inputAreaBtnCollapsed = screen.getByText("Node Task ^")
        fireEvent.click(inputAreaBtnCollapsed);
        expect(screen.queryByText("Node Task ^")).toBeNull()
        const inputAreaBtnExpanded = screen.getByText("Node Task >")

        //Type "something" on the HTTPAddress input when node2 is selected
        const httpAddressTextBoxPreNodeValueSet = screen.getByTestId("httpAddress") 
        fireEvent.change(httpAddressTextBoxPreNodeValueSet, { target: { value: 'something' } });

        //Click on node1 and validate that inputDetailsOptimized is called with param SelectedNode as node1 and that the HttpAddress input is cleared
        await userEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');
        expect(node1).toHaveClass('selected')
        const httpAddressTextBoxNode1Selected = screen.getByTestId("httpAddress")
        console.log(`httpAddressTextBoxNode1Selected.value in test: ${httpAddressTextBoxNode1Selected.value}`)
        expect(httpAddressTextBoxNode1Selected.value).toEqual("")

        //Select "PythonCode" from the 'stepTypeSelector' combobox and enter 'somepythoncode' 
        const nodeInputTypeSelectorContainer = screen.getByText('selectStepType:');
        const nodeInputTypeSelector = nodeInputTypeSelectorContainer.querySelector('.Dropdown-control');
        await userEvent.click(nodeInputTypeSelector);
        const pythonCodeOption = screen.getByText('PythonCode');
        await userEvent.click(pythonCodeOption)
        const pythonCodeTextPreNodeValueSet = screen.getByTestId("pythonText")
        expect(pythonCodeTextPreNodeValueSet.value).toEqual("")
        fireEvent.change(pythonCodeTextPreNodeValueSet, { target: { value: 'testPythonCode' } });        

        //Click on node2 and validate that inputDetailsOptimized is called with param SelectedNode as node2 and that the HttpAddress input is cleared
        fireEvent.click(node2)
        node2.focus()
        await userEvent.keyboard('{Enter}');
        const httpAddressTextBoxPostNodeValueSet = screen.getByTestId("httpAddress") 
        expect(httpAddressTextBoxPostNodeValueSet.value).toEqual('something');

        //Select "Python" from stepType dropdown and enter "something" on PythonContentTextBox and save
        fireEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');
        const pythonCodeTextPostNodeValueSet = screen.getByTestId("pythonText")
        expect(pythonCodeTextPostNodeValueSet.value).toEqual('testPythonCode')

        screen.debug()
    })

})