import { fireEvent } from "@testing-library/react"

describe(`Setting expected nodes for a testdata should highlight nodes when testdata is selected`, () => {

    const preExpectationNodeBackground = "rgb(255, 0, 114)"
    const expectationNodeBackground = "lightGreen"
    const preExpectationCanvasBackground = "rgb(0, 0, 0)"
    const onExpectationModeCanvasBackground = "rgb(135, 206, 235)"


    it(`Set expectation with single node and single testdata, expect node color to change when test data is selected`, async () => {

        render(<App />)

        //Create the node
        const createNodeBtn = screen.getByTestId("createNode")
        fireEvent.click(createNodeBtn);
        const node1 = screen.getByTestId("rf__node-1")
        expect(node1).toBeInTheDocument();
        expect(node1.style.backgroundColor).toEqual(preExpectationNodeBackground)

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

        //Right click on data should result in expectation menu
        await userEvent.click(testDataIndex0, { button: 2 });
        const menuItem = screen.getByText('Set expectation for test data');
        expect(menuItem).toBeVisible();
        fireEvent.click(menuItem)

        expect(container).toHaveStyle(`background-color: ${onExpectationModeCanvasBackground}`);

        fireEvent.click(node1)
        node1.focus()
        await userEvent.keyboard('{Enter}');

        const stopSettingExpectedNodesBtn = screen.getByText('Stop Setting Expectations for test data')
        fireEvent.click(stopSettingExpectedNodesBtn)

        expect(container).toHaveStyle(`background-color: ${preExpectationCanvasBackground}`);

        fireEvent.click(testDataIndex1);
        expect(node1.style.backgroundColor).toEqual(preExpectationNodeBackground)

        fireEvent.click(testDataIndex0)
        expect(node1.style.backgroundColor).toEqual(expectationNodeBackground)

        fireEvent.click(testDataIndex1);
        expect(node1.style.backgroundColor).toEqual(preExpectationNodeBackground)
    })

})