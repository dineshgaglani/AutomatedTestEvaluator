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
        const node1PreEvalExpectedColor =  "rgb(255, 0, 114)"
        expect(node1.style.backgroundColor).toEqual(node1PreEvalExpectedColor)

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
        const node1PostEvalExpectedColor =  "rgb(59, 177, 67)"
        expect(node1.style.backgroundColor).toEqual(node1PostEvalExpectedColor)
        

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
        const node1PreEvalExpectedColor =  "rgb(255, 0, 114)"
        expect(node1.style.backgroundColor).toEqual(node1PreEvalExpectedColor)

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

        const node1PostEvalExpectedColor =  "rgb(59, 177, 67)"
        expect(node1.style.backgroundColor).toEqual(node1PostEvalExpectedColor)

        //click on nodeOutput to view rendered output
        fireEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');

        //Click on the first test data
        fireEvent.click(testDataIndex1)

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
    })

    //Multipe nodes single testdata
    it(`Multiple nodes for single testdata`, async () => {
        //Render App component
        render(<App />)

        const preEvalNodeBackground =  "rgb(255, 0, 114)"

        //Create the diagram with one single node
        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument();
        expect(node1.style.backgroundColor).toEqual(preEvalNodeBackground)

        fireEvent.click(createNodeBtn);
        const node2 = screen.getByTestId("rf__node-2")
        expect(node2).toBeInTheDocument();
        expect(node2.style.backgroundColor).toEqual(preEvalNodeBackground)

        fireEvent.click(createNodeBtn);
        const node3 = screen.getByTestId("rf__node-3")
        expect(node3).toBeInTheDocument();
        expect(node3.style.backgroundColor).toEqual(preEvalNodeBackground)

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

        const postEvalNodeBackground = "rgb(59, 177, 67)"

        await waitFor( () => {
            expect(node1.style.backgroundColor == postEvalNodeBackground && node2.style.backgroundColor == preEvalNodeBackground).toEqual(true) 
        }, {timeout: 20 * 1000})

        await waitFor( () => {
            expect(node1.style.backgroundColor == postEvalNodeBackground && node2.style.backgroundColor == postEvalNodeBackground).toEqual(true) 
        }, {timeout: 20 * 1000})

        //Node3 was not visited
        expect(node3.style.backgroundColor).toEqual(preEvalNodeBackground)

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

        const preEvalNodeBackground =  "rgb(255, 0, 114)"

        //Create the diagram with one single node
        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument();
        expect(node1.style.backgroundColor).toEqual(preEvalNodeBackground)

        fireEvent.click(createNodeBtn);
        const node2 = screen.getByTestId("rf__node-2")
        expect(node2).toBeInTheDocument();
        expect(node2.style.backgroundColor).toEqual(preEvalNodeBackground)

        fireEvent.click(createNodeBtn);
        const node3 = screen.getByTestId("rf__node-3")
        expect(node3).toBeInTheDocument();
        expect(node3.style.backgroundColor).toEqual(preEvalNodeBackground)

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
                    socket.send(JSON.stringify({ data: [{nodes_visited: ["1", "2"], test_data_to_node_output: { TestData1: { 1: 'TestData1Node1Response', 2: 'TestData1Node2Response' }, TestData2: {1: 'TestData2Node1Response', 2: 'TestData2Node2Response'} } }] }));
                }, .1 * 1000);
            });
        });

        const postEvalNodeBackground = "rgb(59, 177, 67)"

        await waitFor( () => {
            expect(node1.style.backgroundColor == postEvalNodeBackground && node2.style.backgroundColor == preEvalNodeBackground).toEqual(true) 
        }, {timeout: 20 * 1000})

        await waitFor( () => {
            expect(node1.style.backgroundColor == postEvalNodeBackground && node2.style.backgroundColor == postEvalNodeBackground).toEqual(true) 
        }, {timeout: 20 * 1000})

        //Node3 was not visited
        expect(node3.style.backgroundColor).toEqual(preEvalNodeBackground)

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
    })

})