import React, { useEffect } from 'react';
import ReactFlow, { addEdge, applyEdgeChanges, applyNodeChanges, createSelectionChange } from 'reactflow';
import { useCallback, useState, useMemo } from 'react';
import { ChatAPIcall } from '../api/chatGPT_API'

// import axios from 'axios';

import 'reactflow/dist/style.css';
import '../App.css'

import TextUpdaterNode from '../nodes/TextNode.js';
import SavedDiagramsModal from '../components/savedDiagramsModal.js';
import OutputDetail from '../components/outputDetail.js'
import InputDetailOptimized from '../components/inputDetailOptimized';


function convertToNodeIdToTestDataResult(testDataToNodeId) {
  // Convert FROM {testData1: {node1: 'testData1Node1Result', node2: 'testData1Node2Result'}, testData2: {node1: 'testData2Node1Result', node2: 'testData2Node2Result'}} to 
  // TO  { node1: {testData1: 'testData1Node1Result', testData2: 'testData2Node1Result'}, node2: {testData1: 'testData1Node2Result', testData2: 'testData2Node2Result'} }
  const result = Object.entries(testDataToNodeId).reduce((acc, [testDataKey, nodes]) => {
    Object.entries(nodes).forEach(([nodeKey, resultValue]) => {
      // Initialize the node key in the accumulator if it doesn't exist
      if (!acc[nodeKey]) {
        acc[nodeKey] = {};
      }
      // Assign the value to the correct position in the transformed object
      acc[nodeKey][testDataKey] = resultValue;
    });
    return acc;
  }, {});

  return result
}

function Diagram({ socketOpen, testData, envData, selectedTestDataIndex, isExpectationInProgress }) {

  const allDiagrams = {
    "FakerApiProducts": {
      "nodes": [
        {
          "id": "1",
          "type": "textUpdater",
          "data": {
            "label": "Call Products endpoint",
            "activationEligibilityDescription": "Call Products endpoint",
            "activationEligibility": "return True",
            "activationTask": {
              "taskType": "HttpAPI",
              "taskProps": { "httpMethod": "GET", "httpAddress": "{context[\"baseUrl\"]}/products" }
            }
          },
          "position": {
            "x": 350.7954178483643,
            "y": 48.41060557131152
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": true,
          "positionAbsolute": {
            "x": 350.7954178483643,
            "y": 48.41060557131152
          },
          "dragging": false
        },
        {
          "id": "2",
          "type": "textUpdater",
          "data": {
            "nodeId": 2,
            "label": "Call Products Id endpoint",
            "activationEligibilityDescription": "Call Products Id endpoint",
            "activationEligibility": "return True",
            "activationTask": {
              "taskType": "PythonCode",
              "taskProps": { "pythonText": "productsIdResp = requests.get(context[\"baseUrl\"] + \"/products/\" + str(currTestData)); return productsIdResp.json()" }
            }
          },
          "position": {
            "x": 351.41132620533153,
            "y": 168.02651392827883
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 351.41132620533153,
            "y": 168.02651392827883
          },
          "dragging": false
        },
        {
          "id": "3",
          "type": "textUpdater",
          "data": {
            "nodeId": 3,
            "label": "Product 1 Called",
            "activationEligibilityDescription": "Product 1 Called",
            "activationEligibility": "return priorActionResults['Call Products Id endpoint']['id'] == 1",
            "activationTask": {
              "taskType": "PythonCode",
              "taskProps": { "pythonText": "print(\"Case 1 complete\"); return \"Case 1 complete!\"" }
            }
          },
          "position": {
            "x": 63,
            "y": 294
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 63,
            "y": 294
          },
          "dragging": false
        },
        {
          "id": "4",
          "type": "textUpdater",
          "data": {
            "nodeId": 4,
            "label": "Product 2 Called",
            "activationEligibilityDescription": "Product 2 Called",
            "activationEligibility": "return priorActionResults['Call Products Id endpoint']['id'] == 2",
            "activationTask": {
              "taskType": "PythonCode",
              "taskProps": { "pythonText": "print(\"Case 2 complete\"); return \"Case 2 complete!\"" }
            }
          },
          "position": {
            "x": 356.33106378647517,
            "y": 293.5893944286885
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 356.33106378647517,
            "y": 293.5893944286885
          },
          "dragging": false
        },
        {
          "id": "5",
          "type": "textUpdater",
          "data": {
            "nodeId": 5,
            "label": "Product 3 called",
            "activationEligibilityDescription": "Product 3 called",
            "activationEligibility": "return priorActionResults['Call Products Id endpoint']['id'] == 3",
            "activationTask": {
              "taskType": "PythonCode",
              "taskProps": { "pythonText": "print(\"Case 3 complete\"); return \"Case 3 complete!\"" }
            }
          },
          "position": {
            "x": 640.478602643852,
            "y": 292.3840916430327
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 640.478602643852,
            "y": 292.3840916430327
          },
          "dragging": false
        }
      ],
      "edges": [
        {
          "source": "1",
          "sourceHandle": "a",
          "target": "2",
          "targetHandle": null,
          "id": "reactflow__edge-1a-2"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "3",
          "targetHandle": null,
          "id": "reactflow__edge-2a-3"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "4",
          "targetHandle": null,
          "id": "reactflow__edge-2a-4"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "5",
          "targetHandle": null,
          "id": "reactflow__edge-2a-5"
        }
      ]
    },
    "Login": {
      "nodes": [
        {
          "id": "1",
          "type": "textUpdater",
          "data": {
            "nodeId": 1,
            "label": "Enter Username",
            "activationEligibilityDescription": "Enter Username",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 326.5493494679022,
            "y": 71.44797862474114
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 326.5493494679022,
            "y": 71.44797862474114
          },
          "dragging": false
        },
        {
          "id": "2",
          "type": "textUpdater",
          "data": {
            "nodeId": 2,
            "label": "Enter Password",
            "activationEligibilityDescription": "Enter Password",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 323.1013708431609,
            "y": 183.1040427505177
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 323.1013708431609,
            "y": 183.1040427505177
          },
          "dragging": false
        },
        {
          "id": "3",
          "type": "textUpdater",
          "data": {
            "nodeId": 3,
            "label": "Validate admin Login",
            "activationEligibilityDescription": "Validate admin Login",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": -9.511593870081754,
            "y": 280.2803206288828
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": -9.511593870081754,
            "y": 280.2803206288828
          },
          "dragging": false
        },
        {
          "id": "4",
          "type": "textUpdater",
          "data": {
            "nodeId": 4,
            "label": "Validate NonAdminLogin",
            "activationEligibilityDescription": "Validate NonAdminLogin",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 635.9310409399458,
            "y": 288.9681923773297
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 635.9310409399458,
            "y": 288.9681923773297
          },
          "dragging": false
        },
        {
          "id": "5",
          "type": "textUpdater",
          "data": {
            "nodeId": 5,
            "label": "Validate Wrong Credentials",
            "activationEligibilityDescription": "Validate Wrong Credentials",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 443.89000927433233,
            "y": 419.28626860403284
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 443.89000927433233,
            "y": 419.28626860403284
          },
          "dragging": false
        },
        {
          "id": "6",
          "type": "textUpdater",
          "data": {
            "nodeId": 6,
            "label": "Validate Blank Credentials",
            "activationEligibilityDescription": "Validate Blank Credentials",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 100,
            "y": 400
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66
        },
        {
          "id": "7",
          "type": "textUpdater",
          "data": {
            "nodeId": 7,
            "label": "Validate Blank Username",
            "activationEligibilityDescription": "Validate Blank Username",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": -65.06956322049058,
            "y": 580.3180762267032
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": -65.06956322049058,
            "y": 580.3180762267032
          },
          "dragging": false
        },
        {
          "id": "8",
          "type": "textUpdater",
          "data": {
            "nodeId": 8,
            "label": "Vaiidate Blank Password",
            "activationEligibilityDescription": "Vaiidate Blank Password",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 223.0781831029974,
            "y": 576.7428671112807
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 223.0781831029974,
            "y": 576.7428671112807
          },
          "dragging": false
        },
        {
          "id": "9",
          "type": "textUpdater",
          "data": {
            "nodeId": 9,
            "label": "Validate Wrong username",
            "activationEligibilityDescription": "Validate Wrong username",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 362.0841310781475,
            "y": 707.829670096785
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 362.0841310781475,
            "y": 707.829670096785
          },
          "dragging": false
        },
        {
          "id": "10",
          "type": "textUpdater",
          "data": {
            "nodeId": 10,
            "label": "Validate wrong password",
            "activationEligibilityDescription": "Validate wrong password",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 660.3677277748234,
            "y": 701.3585037318802
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 660.3677277748234,
            "y": 701.3585037318802
          },
          "dragging": false
        }
      ],
      "edges": [
        {
          "source": "1",
          "sourceHandle": "a",
          "target": "2",
          "targetHandle": null,
          "id": "reactflow__edge-1a-2"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "3",
          "targetHandle": null,
          "id": "reactflow__edge-2a-3"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "4",
          "targetHandle": null,
          "id": "reactflow__edge-2a-4"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "5",
          "targetHandle": null,
          "id": "reactflow__edge-2a-5"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "6",
          "targetHandle": null,
          "id": "reactflow__edge-2a-6"
        },
        {
          "source": "6",
          "sourceHandle": "a",
          "target": "7",
          "targetHandle": null,
          "id": "reactflow__edge-6a-7"
        },
        {
          "source": "6",
          "sourceHandle": "a",
          "target": "8",
          "targetHandle": null,
          "id": "reactflow__edge-6a-8"
        },
        {
          "source": "5",
          "sourceHandle": "a",
          "target": "9",
          "targetHandle": null,
          "id": "reactflow__edge-5a-9"
        },
        {
          "source": "5",
          "sourceHandle": "a",
          "target": "10",
          "targetHandle": null,
          "id": "reactflow__edge-5a-10"
        }
      ]
    },
    "MealOrder_ChatGPTGenerated": {
      "nodes": [
        {
          "id": "1",
          "type": "textUpdater",
          "data": {
            "nodeId": 1,
            "label": "Select Meal",
            "activationEligibilityDescription": "Select Meal",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 100,
            "y": 50
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66
        },
        {
          "id": "2",
          "type": "textUpdater",
          "data": {
            "nodeId": 2,
            "label": "Customize Meal",
            "activationEligibilityDescription": "Customize Meal",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 300,
            "y": 150
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66
        },
        {
          "id": "3",
          "type": "textUpdater",
          "data": {
            "nodeId": 3,
            "label": "Add to Cart",
            "activationEligibilityDescription": "Add to Cart",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 500,
            "y": 250
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66
        },
        {
          "id": "4",
          "type": "textUpdater",
          "data": {
            "nodeId": 4,
            "label": "Proceed to Checkout",
            "activationEligibilityDescription": "Proceed to Checkout",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 700,
            "y": 350
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66
        },
        {
          "id": "5",
          "type": "textUpdater",
          "data": {
            "nodeId": 5,
            "label": "Place Order",
            "activationEligibilityDescription": "Place Order",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 900,
            "y": 450
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66
        }
      ],
      "edges": [
        {
          "source": "1",
          "sourceHandle": "a",
          "target": "2",
          "targetHandle": null,
          "id": "reactflow__edge-1a-2"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "3",
          "targetHandle": null,
          "id": "reactflow__edge-2a-3"
        },
        {
          "source": "3",
          "sourceHandle": "a",
          "target": "4",
          "targetHandle": null,
          "id": "reactflow__edge-3a-4"
        },
        {
          "source": "4",
          "sourceHandle": "a",
          "target": "5",
          "targetHandle": null,
          "id": "reactflow__edge-4a-5"
        }
      ]
    },
    "Checkout_ChatGPTGenerated": {
      "nodes": [
        {
          "id": "1",
          "type": "textUpdater",
          "data": {
            "nodeId": 1,
            "label": "Add Item to Cart",
            "activationEligibilityDescription": "Add Item to Cart",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 323.5493494679022,
            "y": 67.44797862474114
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 323.5493494679022,
            "y": 67.44797862474114
          },
          "dragging": false
        },
        {
          "id": "2",
          "type": "textUpdater",
          "data": {
            "nodeId": 2,
            "label": "Proceed to Checkout",
            "activationEligibilityDescription": "Proceed to Checkout",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 323.1013708431609,
            "y": 183.1040427505177
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66
        },
        {
          "id": "3",
          "type": "textUpdater",
          "data": {
            "nodeId": 3,
            "label": "Enter Shipping Details",
            "activationEligibilityDescription": "Enter Shipping Details",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": -0.5115938700817537,
            "y": 277.2803206288828
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": -0.5115938700817537,
            "y": 277.2803206288828
          },
          "dragging": false
        },
        {
          "id": "4",
          "type": "textUpdater",
          "data": {
            "nodeId": 4,
            "label": "Select Payment Method",
            "activationEligibilityDescription": "Select Payment Method",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 326.9310409399458,
            "y": 409.9681923773297
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 326.9310409399458,
            "y": 409.9681923773297
          },
          "dragging": false
        },
        {
          "id": "5",
          "type": "textUpdater",
          "data": {
            "nodeId": 5,
            "label": "Place Order",
            "activationEligibilityDescription": "Place Order",
            "activationEligibility": "",
            "activationTask": ""
          },
          "position": {
            "x": 326.89000927433233,
            "y": 554.2862686040328
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": false,
          "positionAbsolute": {
            "x": 326.89000927433233,
            "y": 554.2862686040328
          },
          "dragging": false
        },
        {
          "id": "6",
          "type": "textUpdater",
          "data": {
            "nodeId": 6,
            "label": "Enter Discount Coupon",
            "activationEligibilityDescription": "Enter Discount Coupon"
          },
          "position": {
            "x": 540.1384177177154,
            "y": 288.3632966267072
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 278,
          "height": 66,
          "selected": true,
          "positionAbsolute": {
            "x": 540.1384177177154,
            "y": 288.3632966267072
          },
          "dragging": false
        }
      ],
      "edges": [
        {
          "source": "1",
          "sourceHandle": "a",
          "target": "2",
          "targetHandle": null,
          "id": "reactflow__edge-1a-2"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "3",
          "targetHandle": null,
          "id": "reactflow__edge-2a-3"
        },
        {
          "source": "3",
          "sourceHandle": "a",
          "target": "4",
          "targetHandle": null,
          "id": "reactflow__edge-3a-4"
        },
        {
          "source": "4",
          "sourceHandle": "a",
          "target": "5",
          "targetHandle": null,
          "id": "reactflow__edge-4a-5"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "4",
          "targetHandle": null,
          "id": "reactflow__edge-2a-4"
        },
        {
          "source": "2",
          "sourceHandle": "a",
          "target": "6",
          "targetHandle": null,
          "id": "reactflow__edge-2a-6"
        },
        {
          "source": "6",
          "sourceHandle": "a",
          "target": "4",
          "targetHandle": null,
          "id": "reactflow__edge-6a-4"
        }
      ]
    },
    "UIAPIMix": {
      "nodes": [
        {
          "id": "1",
          "type": "textUpdater",
          "data": {
            "nodeId": 1,
            "label": "Api Call",
            "activationEligibilityDescription": "",
            "activationEligibility": "return True",
            "activationTask": {
              "taskType": "HttpAPI",
              "taskProps": {
                "httpMethod": "GET",
                "httpAddress": "{context[\"baseUrl\"]}/products"
              }
            }
          },
          "position": {
            "x": 364,
            "y": 44
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 328,
          "height": 147,
          "selected": false,
          "positionAbsolute": {
            "x": 364,
            "y": 44
          },
          "dragging": false
        },
        {
          "id": "2",
          "type": "textUpdater",
          "data": {
            "nodeId": 2,
            "label": "UI Call to wikipeda",
            "activationEligibilityDescription": "",
            "activationEligibility": "return True",
            "activationTask": {
              "taskType": "PythonCode",
              "taskProps": {
                "pythonText": "context[\"webUiDriver\"].get(\"https://wikipedia.org\"); time.sleep(5)"
              }
            }
          },
          "position": {
            "x": 208,
            "y": 256
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 328,
          "height": 147,
          "selected": false,
          "positionAbsolute": {
            "x": 208,
            "y": 256
          },
          "dragging": false
        },
        {
          "id": "3",
          "type": "textUpdater",
          "data": {
            "nodeId": 3,
            "label": "UI call to google",
            "activationEligibilityDescription": "",
            "activationEligibility": "return True",
            "activationTask": {
              "taskType": "PythonCode",
              "taskProps": {
                "pythonText": "context[\"webUiDriver\"].get(\"https://google.com\"); time.sleep(5)"
              }
            }
          },
          "position": {
            "x": 582,
            "y": 252
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 328,
          "height": 147,
          "selected": false,
          "positionAbsolute": {
            "x": 582,
            "y": 252
          },
          "dragging": false
        }
      ],
      "edges": [
        {
          "source": "1",
          "sourceHandle": "a",
          "target": "2",
          "targetHandle": null,
          "id": "reactflow__edge-1a-2"
        },
        {
          "source": "1",
          "sourceHandle": "a",
          "target": "3",
          "targetHandle": null,
          "id": "reactflow__edge-1a-3"
        }
      ]
    },
    "UITest": {
      "nodes": [
        {
          "id": "1",
          "type": "textUpdater",
          "data": {
            "nodeId": 1,
            "label": "open google",
            "activationEligibilityDescription": "",
            "activationEligibility": "return True",
            "activationTask": {
              "taskType": "PythonCode",
              "taskProps": {
                "pythonText": "context[\"webUiDriver\"].get(context[\"baseUrl\"]); time.sleep(5)"
              }
            }
          },
          "position": {
            "x": 256,
            "y": 35
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 328,
          "height": 147,
          "selected": false,
          "positionAbsolute": {
            "x": 256,
            "y": 35
          },
          "dragging": false
        },
        {
          "id": "2",
          "type": "textUpdater",
          "data": {
            "nodeId": 2,
            "label": "search for searchString",
            "activationEligibilityDescription": "",
            "activationEligibility": "return True",
            "activationTask": {
              "taskType": "PythonCode",
              "taskProps": {
                "pythonText": "context[\"webUiDriver\"].find_element(By.ID, \"APjFqb\").send_keys(currTestData[\"searchString\"]); time.sleep(5)"
              }
            }
          },
          "position": {
            "x": 251,
            "y": 248
          },
          "style": {
            "backgroundColor": "#ff0072",
            "color": "white"
          },
          "width": 328,
          "height": 147,
          "selected": true,
          "positionAbsolute": {
            "x": 251,
            "y": 248
          },
          "dragging": false
        }
      ],
      "edges": [
        {
          "source": "1",
          "sourceHandle": "a",
          "target": "2",
          "targetHandle": null,
          "id": "reactflow__edge-1a-2"
        }
      ]
    },
    "UIWithSeleniumSteps": {
      "nodes": [{ "id": "1", "type": "textUpdater", "data": { "nodeId": 1, "activationTask": { "taskType": "SeleniumUI", "taskProps": { "steps": [{ "locator": "", "action": "navigate", "param": "https://practicetestautomation.com/practice-test-login/" }, { "locator": "input[name=\\\"username\\\"]", "action": "send_keys", "param": "{currTestData[\"user\"]}" }, { "locator": "input[name=\\\"password\\\"]", "action": "send_keys", "param": "Password123" }, { "locator": "#submit", "action": "click", "param": "" }], "returns": [{ "name": "", "locator": "{currTestData[\"titleLocator\"]}" }] } }, "label": "Navigate to test site", "activationEligibilityDescription": "", "activationEligibility": "return True" }, "position": { "x": 204, "y": 30 }, "style": { "backgroundColor": "#ff0072", "color": "white" }, "width": 297, "height": 72, "selected": true, "dragging": false, "positionAbsolute": { "x": 204, "y": 30 } }], "edges": []
    }
  }

  const initPosition = { 'x': 100, 'y': 150 }
  const [nodes, setNodes] = useState([]);
  const [currSelectedNode, setCurrSelectedNode] = useState(null)
  const [edges, setEdges] = useState([]);
  const [nodePosition, setPosition] = useState(initPosition)

  const [diagPaneHeight, setDiagPaneHeight] = useState(90)

  const [diagramsModalOpen, setDiagramsModalOpen] = useState(false)

  const [expectedTestDataToNodeMap, setExpectedTestDataToNodeMap] = useState({})
  // const [evaluationResponse, setEvaluationResponse] = useState({})

  useEffect(() => {
    if (socketOpen) {
      console.log('Socket open on Diagram')
      // HTTP Example
      // const request = { action: 'evaluateDiagram', nodes: nodes, edges: edges, testData: `[${testData.map(td => td.value)}]`, envData: `${JSON.stringify(envData)}` }
      // console.log(`request: ${JSON.stringify(request)}`)

      // axios.post('https://1mw6gy3fj2.execute-api.us-east-1.amazonaws.com/evaluatediagram', request)
      //   .then(function (response) {
      //     console.log(response);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });

      // Ws Example
      const ws = new WebSocket('wss://0ig7g8kowd.execute-api.us-east-1.amazonaws.com/test/'); // For dev
      // const ws = new WebSocket('ws://localhost:1234'); // For testing
      console.log(`ws Object: ${JSON.stringify(ws)}`)

      const request = { action: 'evaluateDiagram', nodes: nodes, edges: edges, testData: `[${testData.map(td => td.value)}]`, envData: `${JSON.stringify(envData)}` }
      console.log(`request: ${JSON.stringify(request)}`)
      ws.onopen = () => {
        console.log('WebSocket connection established in Diagram.')

        ws.send(JSON.stringify(request))
      };

      ws.onmessage = (event) => {
        console.log(`event: ${JSON.stringify(event)} in Diagram`)
        const eventDataResponse = JSON.parse(event.data)
        const eventData = eventDataResponse.data[0]
        console.log(`Evaluation response: ${JSON.stringify(eventData)}`)

        const nodeOutputToTestData = convertToNodeIdToTestDataResult(eventData['test_data_to_node_output'])

        // setEvaluationResponse(eventData)
        setNodes((prevNodes) => {
          const newNodes = prevNodes.map(node => {
            if (eventData['nodes_visited'].includes(node.id)) {
              const changedStyle = { ...node.style, 'backgroundColor': '#3bb143' }
              node.data.output = nodeOutputToTestData[node.id] //Get all testdata outputs for this nodeId
              console.log(`updated node: ${JSON.stringify(node)}`)
              return { ...node, 'style': changedStyle }
            }
            return node
          })

          return newNodes
        })
      };

      ws.addEventListener('close', (event) => {
        console.log('WebSocket connection closed:', event);
      });

      // Clean up the WebSocket connection on component unmount
      return () => {
        ws.close();
        socketOpen = false
      };

      // const request = { action: 'evaluateDiagram', nodes: nodes, edges: edges, testData: `[${testData.map(td => td.value)}]`, envData: `${JSON.stringify(envData)}` }
      // console.log(`request to send: ${JSON.stringify(request)}`)


    }
  }, [socketOpen])

  useEffect(() => {
    if (isExpectationInProgress && currSelectedNode) {
      const selectedNodeFullObject = currSelectedNode
      // console.log(`typeOf(selectedTestDataIndex): ${typeof(selectedTestDataIndex)}`)
      // console.log(`Adding ${selectedNodeFullObject.id} to ${selectedTestDataIndex} expectation in ${JSON.stringify(expectedTestDataToNodeMap)}`)
      setExpectedTestDataToNodeMap((prevExpectedTestDataToNodeMap) => {
        // console.log(`Before adding to prevExpectedTestDataToNodeMap: ${JSON.stringify(prevExpectedTestDataToNodeMap)}`)
        if (!prevExpectedTestDataToNodeMap.hasOwnProperty(selectedTestDataIndex)) {
          // console.log(`${JSON.stringify(prevExpectedTestDataToNodeMap)} doesn't contain key for testdata: ${selectedTestDataIndex}, so adding`)
          prevExpectedTestDataToNodeMap[selectedTestDataIndex] = []
        }
        // console.log(`After adding key ${selectedTestDataIndex} to ${JSON.stringify(prevExpectedTestDataToNodeMap)}`)
        if (!prevExpectedTestDataToNodeMap[selectedTestDataIndex].includes(selectedNodeFullObject.id)) {
          prevExpectedTestDataToNodeMap[selectedTestDataIndex] = prevExpectedTestDataToNodeMap[selectedTestDataIndex].concat(selectedNodeFullObject.id)
        }
        console.log(`After adding to prevExpectedTestDataToNodeMap: ${JSON.stringify(prevExpectedTestDataToNodeMap)}`)
        return prevExpectedTestDataToNodeMap
      })
    }
  }, [isExpectationInProgress, currSelectedNode])

  // useEffect(() => {
  //   console.log(`On useEffect for testDataToNodeMap coloring, testData[selectedTestDataIndex] for selectedTestDataIndex: ${selectedTestDataIndex} is ${JSON.stringify(expectedTestDataToNodeMap[selectedTestDataIndex])}`)
  //   if (selectedTestDataIndex >= 0 && testData[selectedTestDataIndex] && expectedTestDataToNodeMap[selectedTestDataIndex]) {
  //     setNodes((prevNodes) => {
  //       const newNodes = prevNodes.map(node => {
  //         if (expectedTestDataToNodeMap[selectedTestDataIndex].includes(node.id)) {
  //           const changedStyleOnNodeForTestData = { ...node.style, 'backgroundColor': 'lightGreen' }
  //           return { ...node, 'style': changedStyleOnNodeForTestData }
  //         } else {
  //           const changedStyleOnNodeForTestData = { ...node.style, 'backgroundColor': '#ff0072' }
  //           return { ...node, 'style': changedStyleOnNodeForTestData }
  //         }
  //         return node
  //       })

  //       return newNodes
  //     })
  //   } else {
  //     setNodes((prevNodes) => {
  //       const newNodes = prevNodes.map(node => {
  //         const changedStyleOnNodeForTestData = { ...node.style, 'backgroundColor': '#ff0072' }
  //         return { ...node, 'style': changedStyleOnNodeForTestData }
  //       })

  //       return newNodes
  //     })
  //   }
  // }, [selectedTestDataIndex])

  function performNodeSelectionTasks(selectedNodeFullObject) {
    setCurrSelectedNode(selectedNodeFullObject)

    // When to use this?
    // if (selectedTestDataIndex >= 0 && Object.keys(expectedTestDataToNodeMap).includes(selectedTestDataIndex) && expectedTestDataToNodeMap[selectedTestDataIndex].includes(selectedNodeFullObject.id)) {
    //   selectedNodeFullObject.style.backgroundColor = "skyblue"
    // }
  }

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => {
      const selectedNode = changes.find(item => item.selected)
      if (selectedNode) {
        const selectedNodeFullObject = nds.find(node => node.id == selectedNode.id)
        // console.log(`Selected Node full: ${JSON.stringify(selectedNodeFullObject)}`)
        if (selectedNodeFullObject) {
          performNodeSelectionTasks(selectedNodeFullObject)
        }
      }
      return applyNodeChanges(changes, nds)
    }),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

  function addNodeClicked(evt) {
    setPosition((prevPosition) => {
      // console.log(`set position called! Prev Position is: ${JSON.stringify(prevPosition)}`)
      if (prevPosition.x && prevPosition.y) {
        return { x: prevPosition["x"], y: prevPosition["y"] + 50 }
      }
    })

    setNodes((prevNodes) => {
      return [...prevNodes, {
        id: `${prevNodes.length + 1}`,
        type: 'textUpdater',
        data: { nodeId: prevNodes.length + 1, activationTask: { taskType: "HttpAPI", taskProps: { httpMethod: "GET", httpAddress: "" } } },
        position: nodePosition,
        style: { backgroundColor: '#ff0072', color: 'white' }
      }]
    })
  }

  const openDiagram = useCallback((diagramIndex) => {
    console.log(`Diagram: ${diagramIndex} clicked!`)
    const diagramKey = Object.keys(allDiagrams)[diagramIndex]
    setNodes(allDiagrams[diagramKey]['nodes'])
    setEdges(allDiagrams[diagramKey]['edges'])
    setDiagramsModalOpen(false)
  }, [setNodes, setEdges])

  function generateWithChatGpt(prompt) {
    console.log(`prompt: ${prompt}`)
  }

  return (
    <>
      <div style={{ float: "left" }}>
        <button style={{ display: 'left', height: '60px' }} onClick={() => setDiagramsModalOpen(true)} id='openDiagram' data-testid='openDiagram'>Open Demo Diagram</button>
        {diagramsModalOpen && <SavedDiagramsModal generateWithApi={generateWithChatGpt} renderDiagram={openDiagram} diagramsList={Object.keys(allDiagrams)} modalOpen={setDiagramsModalOpen} />}
        <button style={{ display: 'bottom', height: '70px', marginTop: '10px', marginRight: '5px' }} onClick={addNodeClicked} id='createNode' data-testid='createNode'>Add Node</button>
      </div>
      {/* <button style={{ display: 'top', height: '300px' }} onClick={ChatAPIcall}>Display Chat</button> */}
      {socketOpen ? (<h4>Evaluate Diagram</h4>) : (<h4></h4>)}
      <div style={{ width: '90vw', height: `${diagPaneHeight}vh` }}>
        <ReactFlow nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes} />
        <div id="outputArea" style={{ float: "bottom", border: "black" }}>
          {currSelectedNode ? (<InputDetailOptimized id="nodeText" diagPaneHeight={diagPaneHeight} setDiagPaneHeight={setDiagPaneHeight} heightDifferential={10} textAreaHeight={100} infoText="Node Task" selectedNode={currSelectedNode}></InputDetailOptimized>) : (<div></div>)}
          {(currSelectedNode && selectedTestDataIndex >= 0 && testData[selectedTestDataIndex]) ? (<OutputDetail id="resultText" diagPaneHeight={diagPaneHeight} setDiagPaneHeight={setDiagPaneHeight} heightDifferential={30} textAreaHeight={300} infoText="Node Output" selectedNode={currSelectedNode} selectedTestData={testData[selectedTestDataIndex].value}></OutputDetail>) : <div></div>}
        </div>
      </div>
    </>
  );
}

export default Diagram;