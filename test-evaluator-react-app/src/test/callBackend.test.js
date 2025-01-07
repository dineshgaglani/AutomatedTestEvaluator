import React from 'react';
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { mockReactFlow } from './initializer';
import App from "../App"
import { WebSocket } from 'mock-socket';
import { Server } from 'mock-socket';

global.WebSocket = WebSocket
jest.setTimeout(60 * 1000)

describe(`For a diagram that is being evaluated the output and the nodes colors should change accordingly`, () => {

    let mockServer;
    const UNEXECUTED_NODE_COLOR = "rgb(255, 0, 114)"
    const EXECUTED_NODE_COLOR = "rgb(59, 177, 67)"
    const TEST_DATA_EXECUTED_NODE_COLOR = "rgb(92, 214, 214)"

    beforeEach(() => {
        mockServer = new Server('wss://0ig7g8kowd.execute-api.us-east-1.amazonaws.com/test/');
        mockReactFlow()
    })

    afterEach(() => {
        mockServer.stop(); // Cleanup after each test
    });

    it(`Single Node and Single test data should show correct output and change color on response recieved`, async () => {
        //Render App component
        render(<App />)

        //Create the testData
        const testDataIndex0 = screen.getByTestId("testData_1")
        const testData0EditBtn = within(testDataIndex0).getByText('*')
        fireEvent.click(testData0EditBtn)
        const testData0Input = within(testDataIndex0).getByRole('textbox');
        fireEvent.change(testData0Input, { target: { value: 'TestData1' } });
        await userEvent.keyboard('{Enter}');

        //Create the diagram with one single node
        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument(); 
        expect(node1.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        //click on evaluate on diagram
        const evaluateBtn = screen.getByTestId("evaluateBtn")
        fireEvent.click(evaluateBtn)

        mockServer.on('connection', socket => {
            console.log(`Connection data on mock server: ${JSON.stringify(socket)}`)
            socket.on('message', data => {
                // Handle or verify received messages here
                console.log(`Message data to mock server: ${JSON.stringify(data)}`)
                setTimeout(() => {
                    socket.send(JSON.stringify({ data: [{nodes_visited: ["1"], test_data_to_node_output: { TestData1: { 1: 'TestData1Node1Response' } } }] }));
                }, 50);
            });
        });

        //Validate the node's color 
        await new Promise(resolve => setTimeout(resolve, 10000));
        expect(node1.style.backgroundColor).toEqual(EXECUTED_NODE_COLOR)
        

        //click on nodeOutput to view rendered output
        fireEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');

        const outputAreaBtnCollapsed = screen.getByText("Node Output ^")
        fireEvent.click(outputAreaBtnCollapsed);
        expect(screen.queryByText("Node Output ^")).toBeNull()
        const outputAreaBtnExpanded = screen.getByText("Node Output >")
        const outputAreaTxtArea = screen.getByTestId("nodeOutput")

        expect(outputAreaTxtArea.value).toEqual('TestData1Node1Response')
    })

    it(`Multiple testdata for single node`, async () => {
        //Render App component
        render(<App />)

        //Create the diagram with one single node
        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument();
        expect(node1.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        //Create the testData
        const testDataIndex0 = screen.getByTestId("testData_1")
        const testData0EditBtn = within(testDataIndex0).getByText('*')
        fireEvent.click(testData0EditBtn)
        const testData0Input = within(testDataIndex0).getByRole('textbox');
        fireEvent.change(testData0Input, { target: { value: 'TestData1' } });
        await userEvent.keyboard('{Enter}');

        const testDataIndex1 = screen.getByTestId("testData_2")
        const testData1EditBtn = within(testDataIndex1).getByText('*')
        fireEvent.click(testData1EditBtn)
        const testData1Input = within(testDataIndex1).getByRole('textbox');
        fireEvent.change(testData1Input, { target: { value: 'TestData2' } });
        await userEvent.keyboard('{Enter}');

        const testDataIndex2 = screen.getByTestId("testData_3")
        const testData2EditBtn = within(testDataIndex2).getByText('*')
        fireEvent.click(testData2EditBtn)
        const testData2Input = within(testDataIndex2).getByRole('textbox');
        fireEvent.change(testData2Input, { target: { value: 'TestData3' } });
        await userEvent.keyboard('{Enter}');

        //click on evaluate on diagram
        const evaluateBtn = screen.getByTestId("evaluateBtn")
        fireEvent.click(evaluateBtn)

        mockServer.on('connection', socket => {
            console.log(`Connection data on mock server: ${JSON.stringify(socket)}`)
            socket.on('message', data => {
                // Handle or verify received messages here
                console.log(`Message data to mock server: ${JSON.stringify(data)}`)
                setTimeout(() => {
                    socket.send(JSON.stringify({ data: [{nodes_visited: ["1"], test_data_to_node_output: { TestData1: { 1: 'TestData1Node1Response' } } }] }));
                }, .05 * 1000);

                setTimeout(() => {
                    socket.send(JSON.stringify({ data: [{nodes_visited: ["1", "2"], test_data_to_node_output: { TestData1: { 1: 'TestData1Node1Response' }, TestData2: {1: 'TestData2Node1Response'} } }] }));
                }, .1 * 1000);
            });
        });

        //Validate the node's color 
        await new Promise(resolve => setTimeout(resolve, 10000));

        expect(node1.style.backgroundColor).toEqual(EXECUTED_NODE_COLOR)

        //click on nodeOutput to view rendered output
        fireEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');

        //Click on the first test data
        fireEvent.click(testDataIndex1)
        expect(node1.style.backgroundColor).toEqual(TEST_DATA_EXECUTED_NODE_COLOR)

        //Open output section
        const outputAreaBtnCollapsed = screen.getByText("Node Output ^")
        fireEvent.click(outputAreaBtnCollapsed);
        expect(screen.queryByText("Node Output ^")).toBeNull()
        const outputAreaBtnExpanded = screen.getByText("Node Output >")
        const outputAreaTxtArea = screen.getByTestId("nodeOutput")

        expect(outputAreaTxtArea.value).toEqual('TestData2Node1Response')

        fireEvent.click(testDataIndex0)
        expect(outputAreaTxtArea.value).toEqual('TestData1Node1Response')

        fireEvent.click(testDataIndex2)
        expect(outputAreaTxtArea.value).toEqual('')
        expect(node1.style.backgroundColor).toEqual(EXECUTED_NODE_COLOR)
    })

    //Multipe nodes single testdata
    it(`Multiple nodes for single testdata`, async () => {
        //Render App component
        render(<App />)

        //Create the diagram with one single node
        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument();
        expect(node1.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        fireEvent.click(createNodeBtn);
        const node2 = screen.getByTestId("rf__node-2")
        expect(node2).toBeInTheDocument();
        expect(node2.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        fireEvent.click(createNodeBtn);
        const node3 = screen.getByTestId("rf__node-3")
        expect(node3).toBeInTheDocument();
        expect(node3.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        //Create the testData
        const testDataIndex0 = screen.getByTestId("testData_1")
        const testData0EditBtn = within(testDataIndex0).getByText('*')
        fireEvent.click(testData0EditBtn)
        const testData0Input = within(testDataIndex0).getByRole('textbox');
        fireEvent.change(testData0Input, { target: { value: 'TestData1' } });
        await userEvent.keyboard('{Enter}');

        //click on evaluate on diagram
        const evaluateBtn = screen.getByTestId("evaluateBtn")
        fireEvent.click(evaluateBtn)

        mockServer.on('connection', socket => {
            console.log(`Connection data on mock server: ${JSON.stringify(socket)}`)
            socket.on('message', data => {
                // Handle or verify received messages here
                console.log(`Message data to mock server: ${JSON.stringify(data)}`)
                setTimeout(() => {
                    socket.send(JSON.stringify({ data: [{nodes_visited: ["1"], test_data_to_node_output: { TestData1: { 1: 'TestData1Node1Response' } } }] }));
                }, .5 * 1000);

                setTimeout(() => {
                    socket.send(JSON.stringify({ data: [{nodes_visited: ["1", "2"], test_data_to_node_output: { TestData1: { 1: 'TestData1Node1Response', 2: 'TestData1Node2Response' } } }] }));
                }, 1 * 1000);
            });
        });

        await waitFor( () => {
            expect(node1.style.backgroundColor == EXECUTED_NODE_COLOR && node2.style.backgroundColor == UNEXECUTED_NODE_COLOR).toEqual(true) 
        }, {timeout: 20 * 1000})

        await waitFor( () => {
            expect(node1.style.backgroundColor == EXECUTED_NODE_COLOR && node2.style.backgroundColor == EXECUTED_NODE_COLOR).toEqual(true) 
        }, {timeout: 20 * 1000})

        //Node3 was not visited
        expect(node3.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        fireEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');

        //Open output section
        const outputAreaBtnCollapsed = screen.getByText("Node Output ^")
        fireEvent.click(outputAreaBtnCollapsed);
        expect(screen.queryByText("Node Output ^")).toBeNull()
        const outputAreaBtnExpanded = screen.getByText("Node Output >")
        const outputAreaTxtArea = screen.getByTestId("nodeOutput")

        expect(outputAreaTxtArea.value).toEqual('TestData1Node1Response')

        fireEvent.click(node2)
        node2.focus()
        await userEvent.keyboard('{Enter}');

        expect(outputAreaTxtArea.value).toEqual('TestData1Node2Response')

        fireEvent.click(node3)
        node3.focus()
        await userEvent.keyboard('{Enter}');

        expect(outputAreaTxtArea.value).toEqual('')
    })


    //Multiple nodes multiple testdata
    it(`Multiple testdata and multiple nodes`, async () => {
        //Render App component
        render(<App />)

        //Create the diagram with one single node
        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument();
        expect(node1.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        fireEvent.click(createNodeBtn);
        const node2 = screen.getByTestId("rf__node-2")
        expect(node2).toBeInTheDocument();
        expect(node2.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        fireEvent.click(createNodeBtn);
        const node3 = screen.getByTestId("rf__node-3")
        expect(node3).toBeInTheDocument();
        expect(node3.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        fireEvent.click(createNodeBtn);
        const node4 = screen.getByTestId("rf__node-4")
        expect(node3).toBeInTheDocument();
        expect(node3.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        //Create the testData
        const testDataIndex0 = screen.getByTestId("testData_1")
        const testData0EditBtn = within(testDataIndex0).getByText('*')
        fireEvent.click(testData0EditBtn)
        const testData0Input = within(testDataIndex0).getByRole('textbox');
        fireEvent.change(testData0Input, { target: { value: 'TestData1' } });
        await userEvent.keyboard('{Enter}');

        const testDataIndex1 = screen.getByTestId("testData_2")
        const testData1EditBtn = within(testDataIndex1).getByText('*')
        fireEvent.click(testData1EditBtn)
        const testData1Input = within(testDataIndex1).getByRole('textbox');
        fireEvent.change(testData1Input, { target: { value: 'TestData2' } });
        await userEvent.keyboard('{Enter}');

        const testDataIndex2 = screen.getByTestId("testData_3")
        const testData2EditBtn = within(testDataIndex2).getByText('*')
        fireEvent.click(testData2EditBtn)
        const testData2Input = within(testDataIndex2).getByRole('textbox');
        fireEvent.change(testData2Input, { target: { value: 'TestData3' } });
        await userEvent.keyboard('{Enter}');

        //click on evaluate on diagram
        const evaluateBtn = screen.getByTestId("evaluateBtn")
        fireEvent.click(evaluateBtn)

        mockServer.on('connection', socket => {
            console.log(`Connection data on mock server: ${JSON.stringify(socket)}`)
            socket.on('message', data => {
                // Handle or verify received messages here
                console.log(`Message data to mock server: ${JSON.stringify(data)}`)
                setTimeout(() => {
                    socket.send(JSON.stringify({ data: [{nodes_visited: ["1"], test_data_to_node_output: { TestData1: { 1: 'TestData1Node1Response' } } }] }));
                }, .05 * 1000);

                setTimeout(() => {
                    socket.send(JSON.stringify({ data: [{nodes_visited: ["1", "2", "3"], test_data_to_node_output: { TestData1: { 1: 'TestData1Node1Response', 2: 'TestData1Node2Response' }, TestData2: {1: 'TestData2Node1Response', 2: 'TestData2Node2Response'}, TestData3: {3: 'TestData3Node3Response'} } }] }));
                }, .1 * 1000);
            });
        });

        await waitFor( () => {
            expect(node1.style.backgroundColor == EXECUTED_NODE_COLOR && node2.style.backgroundColor == UNEXECUTED_NODE_COLOR).toEqual(true) 
        }, {timeout: 20 * 1000})

        await waitFor( () => {
            expect(node1.style.backgroundColor == EXECUTED_NODE_COLOR && node2.style.backgroundColor == EXECUTED_NODE_COLOR && node3.style.backgroundColor == EXECUTED_NODE_COLOR).toEqual(true) 
        }, {timeout: 20 * 1000})

        //Node4 was not visited
        expect(node4.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        //Click on the first test data
        fireEvent.click(testDataIndex0)

        fireEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');

        //Open output section
        const outputAreaBtnCollapsed = screen.getByText("Node Output ^")
        fireEvent.click(outputAreaBtnCollapsed);
        expect(screen.queryByText("Node Output ^")).toBeNull()
        const outputAreaBtnExpanded = screen.getByText("Node Output >")
        const outputAreaTxtArea = screen.getByTestId("nodeOutput")

        expect(outputAreaTxtArea.value).toEqual('TestData1Node1Response')

        fireEvent.click(node2)
        node2.focus()
        await userEvent.keyboard('{Enter}');

        expect(outputAreaTxtArea.value).toEqual('TestData1Node2Response')

        expect(node1.style.backgroundColor).toEqual(TEST_DATA_EXECUTED_NODE_COLOR)
        expect(node2.style.backgroundColor).toEqual(TEST_DATA_EXECUTED_NODE_COLOR)
        expect(node3.style.backgroundColor).toEqual(EXECUTED_NODE_COLOR)
        expect(node4.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        fireEvent.click(node3)
        node3.focus()
        await userEvent.keyboard('{Enter}');

        expect(outputAreaTxtArea.value).toEqual('')

        //Click on the first test data
        fireEvent.click(testDataIndex1)

        expect(outputAreaTxtArea.value).toEqual('')

        fireEvent.click(node2)
        node2.focus()
        await userEvent.keyboard('{Enter}');

        expect(outputAreaTxtArea.value).toEqual('TestData2Node2Response')

        fireEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');

        expect(outputAreaTxtArea.value).toEqual('TestData2Node1Response')

        expect(node1.style.backgroundColor).toEqual(TEST_DATA_EXECUTED_NODE_COLOR)
        expect(node2.style.backgroundColor).toEqual(TEST_DATA_EXECUTED_NODE_COLOR)
        expect(node3.style.backgroundColor).toEqual(EXECUTED_NODE_COLOR)
        expect(node4.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        fireEvent.click(testDataIndex2)

        expect(node1.style.backgroundColor).toEqual(EXECUTED_NODE_COLOR)
        expect(node2.style.backgroundColor).toEqual(EXECUTED_NODE_COLOR)
        expect(node3.style.backgroundColor).toEqual(TEST_DATA_EXECUTED_NODE_COLOR)
        expect(node4.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)
    })

    it(`Selenium Input and Output Render`, async () => {
        render(<App />)

        //Create the diagram with one single node
        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument();
        expect(node1.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)

        const inputAreaBtn = screen.queryByText("Node Task ^")
        expect(inputAreaBtn).toBeNull()

        fireEvent.click(createNodeBtn);
        const node2 = screen.getByTestId("rf__node-2")
        expect(node2).toBeInTheDocument();
        const expandNodeBtnNode2 = within(node2).getByTestId("expandNode-2")

        const nodeDescriptionTextboxNode2 = within(node2).getByLabelText("Node Description:")
        fireEvent.change(nodeDescriptionTextboxNode2, { target: { value: 'New Text' } });

        fireEvent.click(node2);
        node2.focus()
        await userEvent.keyboard('{Enter}');

        const inputAreaBtnCollapsed = screen.getByText("Node Task ^")
        fireEvent.click(inputAreaBtnCollapsed);
        expect(screen.queryByText("Node Task ^")).toBeNull()
        const inputAreaBtnExpanded = screen.getByText("Node Task >")

        //Select "SeleniumUI" from the 'stepTypeSelector' combobox and enter some values for locator, action and param 
        const nodeInputTypeSelectorContainer = screen.getByText('selectStepType:');
        const nodeInputTypeSelector = nodeInputTypeSelectorContainer.querySelector('.Dropdown-control');
        await userEvent.click(nodeInputTypeSelector);
        const seleniumUIOption = screen.getByText('SeleniumUI');
        await userEvent.click(seleniumUIOption)
        
        const locator1TextBox = screen.getByTestId("locatorInput0")
        expect(locator1TextBox.value).toEqual("")
        fireEvent.change(locator1TextBox, { target: { value: 'testLocator0' } });
        const action1TextBox = screen.getByTestId("actionInput0")
        expect(action1TextBox.value).toEqual("")
        fireEvent.change(action1TextBox, { target: { value: 'testAction0' } });
        const param1TextBox = screen.getByTestId("paramInput0")
        expect(param1TextBox.value).toEqual("")
        fireEvent.change(param1TextBox, { target: { value: 'testParam0' } });

        const returnsLocator1TextBox = screen.getByTestId("returnsLocatorInput0")
        expect(returnsLocator1TextBox.value).toEqual("")
        fireEvent.change(returnsLocator1TextBox, { target: { value: 'returnsLocator0' } });
        const returnsName1TextBox = screen.getByTestId("returnsNameInput0")
        expect(returnsName1TextBox.value).toEqual("")
        fireEvent.change(returnsName1TextBox, { target: { value: 'returnsName0' } });

        fireEvent.click(node1);
        node1.focus()
        await userEvent.keyboard('{Enter}');

        fireEvent.click(node2);
        node2.focus()
        await userEvent.keyboard('{Enter}');

        //Create the testData
        const testDataIndex0 = screen.getByTestId("testData_1")
        const testData0EditBtn = within(testDataIndex0).getByText('*')
        fireEvent.click(testData0EditBtn)
        const testData0Input = within(testDataIndex0).getByRole('textbox');
        fireEvent.change(testData0Input, { target: { value: JSON.stringify({"user": "student", "titleLocator": "h1.post-title"}) } });
        await userEvent.keyboard('{Enter}');

        //Create the testData
        const testDataIndex1 = screen.getByTestId("testData_2")
        const testData1EditBtn = within(testDataIndex1).getByText('*')
        fireEvent.click(testData1EditBtn)
        const testData1Input = within(testDataIndex1).getByRole('textbox');
        fireEvent.change(testData1Input, { target: { value: JSON.stringify({"user": "abc", "titleLocator": "#error"}) } });
        await userEvent.keyboard('{Enter}');
        
        //click on evaluate on diagram
        const evaluateBtn = screen.getByTestId("evaluateBtn")
        fireEvent.click(evaluateBtn)

        mockServer.on('connection', socket => {
            console.log(`Connection data on mock server: ${JSON.stringify(socket)}`)
            socket.on('message', data => {
                // Handle or verify received messages here
                console.log(`Message data to mock server: ${JSON.stringify(data)}`)
                setTimeout(() => {
                    socket.send(JSON.stringify({ data: [{nodes_visited: ["2"], test_data_to_node_output: { "{'user': 'student', 'titleLocator': 'h1.post-title'}": { 2: '{"s3Locations": ["img1", "img2", "img3"], "title": "testValue"}' } } }] }));
                }, .05 * 1000);
            });
        });

        await waitFor( () => {
            expect(node2.style.backgroundColor == EXECUTED_NODE_COLOR).toEqual(true) 
        }, {timeout: 20 * 1000})

        //Changing nodes to force invoke output render
        fireEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');

        fireEvent.click(node2)
        node2.focus()
        await userEvent.keyboard('{Enter}');

        //Change and Click on the first test data
        fireEvent.click(testDataIndex1)
        fireEvent.click(testDataIndex0)

        expect(node1.style.backgroundColor).toEqual(UNEXECUTED_NODE_COLOR)
        expect(node2.style.backgroundColor).toEqual(TEST_DATA_EXECUTED_NODE_COLOR)

        //Open output section
        const outputAreaBtnCollapsed = screen.getByText("Node Output ^")
        fireEvent.click(outputAreaBtnCollapsed);
        expect(screen.queryByText("Node Output ^")).toBeNull()
        const outputAreaBtnExpanded = screen.getByText("Node Output >")
        const outputAreaTxtArea = screen.getByTestId("nodeOutput")

        expect(outputAreaTxtArea.value).toEqual("{\"title\":\"testValue\"}")

        const outputAreaImage1 = screen.getByTestId("outputScr0")
        const outputAreaImage2 = screen.getByTestId("outputScr1")
        const outputAreaImage3 = screen.getByTestId("outputScr2")

        expect(outputAreaImage1.getAttribute("src")).toEqual("img1")
        expect(outputAreaImage2.getAttribute("src")).toEqual("img2")
        expect(outputAreaImage3.getAttribute("src")).toEqual("img3")
    })

})