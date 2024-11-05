import React, { useState, useEffect, useRef } from 'react';

function TestDataPane({ setTestData, setSelectedTestDataIndex }) {
    const [currentItem, setCurrentItem] = useState('');
    const [currentTestDataId, setCurrentTestDataId] = useState(1)
    const [list, setList] = useState([{ 'id': currentTestDataId, 'value': '', 'output': '' }]);
    const [showCursor, setShowCursor] = useState(false);
    const [cursorIndex, setCursorIndex] = useState(0);
    const [isItemSelected, setItemSelected] = useState(false)
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1)

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            setCurrentTestDataId(prevId => prevId + 1)
            const newItem = {
                id: currentTestDataId + 1,
                value: currentItem,
            };

            setList([...list, newItem]);
            setCurrentItem('');
            setShowCursor(true);
            setCursorIndex(list.length);

            //This sets the test data on the diagram component
            console.log(`Setting test data: ${JSON.stringify(list)}`)
            setTestData(list)
        }
    };

    const handleEditClick = (index) => {
        setShowCursor(true);
        setCursorIndex(index);
    };

    const handleItemChange = (event, index) => {
        const updatedList = [...list];
        updatedList[index].value = event.target.value;
        setList(updatedList);
    };

    const selectItem = (index) => {
        setItemSelected(true)
        setSelectedItemIndex(index)
        setSelectedTestDataIndex(index)
    }

    const handleItemBlur = () => {
        setShowCursor(false);
    };

    return (
        <div style={{ border: '1px solid black', padding: '10px', marginTop: '20px' }}>
            <p>TestData</p>
            <ul>
                {list.map((item, index) => (
                    <li style={isItemSelected && selectedItemIndex === index ? { backgroundColor: "skyblue" } : { backgroundColor: "white" }}
                        key={item.id}
                        data-testid={`testData_${item.id}`}
                        onClick={() => selectItem(index)}
                    >
                        <button style={{backgroundColor: "grey", float: "right"}} onClick={() => handleEditClick(index)}>*</button>
                        {showCursor && cursorIndex === index ? (
                            <input
                                type="text"
                                value={item.value}
                                onChange={(event) => handleItemChange(event, index)}
                                onBlur={handleItemBlur}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        ) : (
                            <div id={`testDataOutput_${item.id}`}>
                                <label>{item.value}</label>
                                {/* {socketOpen && item.output ? (<h4>{item.output}</h4>) : (<h4></h4>)} */}
                            </div>
                        )}
                    </li>
                ))}
                {/* {list.map((item, index) => (
                    <li
                        key={item.id}
                        onClick={() => handleEditClick(index)}
                        style={{ cursor: 'pointer' }}
                    >
                        {showCursor && cursorIndex === index ? (
                            <input
                                type="text"
                                value={item.value}
                                onChange={(event) => handleItemChange(event, index)}
                                onBlur={handleItemBlur}
                                onKeyDown={handleKeyDown}
                                autoFocus
                            />
                        ) : (
                            <div id={'testData_' + index}>
                                <label>{item.value}</label>
                                {socketOpen && item.output? (<h4>{item.output}</h4>) : (<h4></h4>)}
                            </div>
                        )}
                    </li>
                ))} */}
            </ul>

        </div>
    );
}

export default TestDataPane