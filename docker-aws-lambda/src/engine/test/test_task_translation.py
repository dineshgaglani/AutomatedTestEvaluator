import requests
import os
import sys

# All imports for mocking nodeParser selenium task function
import random
import string
import time
from selenium.webdriver.common.by import By

import unittest
from unittest.mock import MagicMock, patch

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the 'src' directory
src_path = os.path.join(script_dir, '../../..', 'src')

# Add the directory to sys.path
sys.path.append(src_path)
import engine.nodeParser as nodeParser

# Comment out 'from engine.engine import Node' from nodeParser to exec this
# Execute using command - /Library/Developer/CommandLineTools/usr/bin/python3 -m pytest test_task_translation.py 
# Execute using command - C:\Users\<username>\AppData\Local\Microsoft\WindowsApps\python3.12.exe -m pytest -s test_task_translation.py on windows

def test_httpGetCall():
    httpGetTask = {
        "taskType": "HttpAPI",
        "taskProps": { "httpMethod": "GET", "httpAddress": "https://fakestoreapi.com/products/1" }
    }
    
    pythonCodeForGetCall = f'getCallResult = {nodeParser.translateTaskObjToTaskFn(httpGetTask)[len("return "):]}' # The len("return ") means give me everything after return
    assert pythonCodeForGetCall == "getCallResult = requests.get(f'https://fakestoreapi.com/products/1').json()" 

    globals_dict = {'requests': requests}
    exec(pythonCodeForGetCall, globals_dict)
    
    getCallResult = globals_dict['getCallResult']
    assert getCallResult['id'] == 1
    assert getCallResult['title'] == "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops"


def test_httpPostCall():
    httpPostTask = {
        "taskType": "HttpAPI",
        "taskProps": { "httpMethod": "POST", 
            "httpAddress": "https://fakestoreapi.com/products", 
            "httpData": { 
                "title": 'test product',
                "price": 13.5,
                "description": 'lorem ipsum set',
                "image": 'https://i.pravatar.cc',
                "category": 'electronic'
            } 
        }
    }
    pythonCodeForGetCall = nodeParser.translateTaskObjToTaskFn(httpPostTask)
    # assert pythonCodeForGetCall == f'requests.post(\'https://fakestoreapi.com/products/1\', data={httpPostTask["taskProps"]["httpData"]}).json()'

    # getCallResult = exec(pythonCodeForGetCall)
    # assert getCallResult['id'] == 31


def testPythonRequestsGetCall():
    pythonRequestsCall = {
        "taskType": "PythonCode",
        "taskProps": { "pythonText": "productsIdResp = requests.get('https://fakestoreapi.com/' + \"products/\" + str(1)).json()" }
    }
    pythonCodeForGetCall = nodeParser.translateTaskObjToTaskFn(pythonRequestsCall)
    assert pythonCodeForGetCall == "productsIdResp = requests.get('https://fakestoreapi.com/' + \"products/\" + str(1)).json()"
    
    globals_dict = {'requests': requests}
    exec(pythonCodeForGetCall, globals_dict)

    getCallResult = globals_dict['productsIdResp']

    assert getCallResult['id'] == 1
    assert getCallResult['title'] == "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops"

def test_httpGetCallWithContextVars():
    # we want { "httpMethod": "GET", "httpAddress": "{context['baseUrl']}/products/1" }  to be converted to "return requests.get(f'{context[\'baseUrl\']}/products/1)"
    httpGetTask = {
        "taskType": "HttpAPI",
        "taskProps": { "httpMethod": "GET", "httpAddress": "{context[\"baseUrl\"]}/products/1" }
    }
    
    pythonCodeForGetCall = f'getCallResult = {nodeParser.translateTaskObjToTaskFn(httpGetTask)[len("return "):]}'# The len("return ") means give me everything after return
    assert pythonCodeForGetCall == "getCallResult = requests.get(f'{context[\"baseUrl\"]}/products/1').json()"

    context = {'baseUrl': 'https://fakestoreapi.com'}
    globals_dict = {'requests': requests, 'context': context}
    exec(pythonCodeForGetCall, globals_dict)
    # exec("getCallResult = f'{context[\"baseUrl\"]}/products/1'", globals_dict)
    
    getCallResult = globals_dict['getCallResult']
    # print(f'getCallResult: {getCallResult}')
    assert getCallResult['id'] == 1
    assert getCallResult['title'] == "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops"

def test_httpGetCallWithContextAndTestDataVars():
    # and { "httpMethod": "GET", "httpAddress": "{context['baseUrl']}/products/{currTestData}" } to be converted to "return requests.get(f'{context[\'baseUrl\']}/products/{currTestData}')"
    httpGetTask = {
        "taskType": "HttpAPI",
        "taskProps": { "httpMethod": "GET", "httpAddress": "{context[\"baseUrl\"]}/products/{currTestData}" }
    }
    
    pythonCodeForGetCall = f'getCallResult = {nodeParser.translateTaskObjToTaskFn(httpGetTask)[len("return "):]}' # The len("return ") means give me everything after return
    assert pythonCodeForGetCall == "getCallResult = requests.get(f'{context[\"baseUrl\"]}/products/{currTestData}').json()"

    context = {'baseUrl': 'https://fakestoreapi.com'}
    currTestData = '1'
    globals_dict = {'requests': requests, 'context': context, 'currTestData': currTestData}
    exec(pythonCodeForGetCall, globals_dict)
    
    getCallResult = globals_dict['getCallResult']
    assert getCallResult['id'] == 1
    assert getCallResult['title'] == "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops"

@patch('engine.nodeParser.webdriver')
@patch('engine.nodeParser.boto3')
def test_seleniumMultiStepsWithContextAndTestData(mock_webdriver, mock_boto3):
    seleniumTask = {
        "taskType": "SeleniumUI",
        "taskProps":  {
            "steps": [{ "locator": "", "action": "navigate", "param": "{context[\"baseUrl\"]}" }, 
                      { "locator": "{currTestData[\"clickParam\"]}", "action": "click", "param": "" }, 
                      { "locator": "input[name=\"active\"]", "action": "send_keys", "param": '{currTestData[\"sendKeysParam\"]}' }],
            "returns": [{"locator": "input[name=\"return\"]", "name": "val"},
                        {"locator": '{currTestData[\"testDataReturnParam\"]}', "name": "valWithTestData"},
                        {"locator": '{context[\"contextReturnParam\"]}', "name": "valWithContext"}]
        }
    }

    # Create context["webUiDriver"] with mocked
        # from selenium import webdriver
        # from selenium.webdriver.common.by import By
        # from selenium.webdriver.common.keys import Keys
        # from selenium.webdriver.chrome.options import Options
        # from selenium.webdriver.support.ui import WebDriverWait
        # from selenium.webdriver.support import expected_conditions as EC
    # Objects

    mock_driver = MagicMock()
    # Mock behaviors
    mock_driver.get = MagicMock()
    mock_driver.find_element.return_value.click = MagicMock()
    mock_driver.find_element.return_value.send_keys = MagicMock()
    mock_driver.find_element.return_value.submit = MagicMock()
    mock_driver.save_screenshot = MagicMock()
    mock_driver.find_element.return_value.text = MagicMock()

    mock_s3 = MagicMock()
    mock_boto3 = MagicMock()
    mock_boto3.client.return_value = mock_s3
    
    mock_s3.upload_file = MagicMock()
    mock_s3.generate_presigned_url = MagicMock()

    context = {'baseUrl': 'https://testuisite.com', 'contextReturnParam': 'testContextReturnParam', 'webUiDriver': mock_driver}
    currTestData = {'clickParam': 'testClickParamLocator', 'sendKeysParam': 'testSendKeysParam', 'testDataReturnParam': 'testTestDataReturnParam'}

    seleniumCodeForSeleniumTask = nodeParser.translateTaskObjToTaskFn(seleniumTask)

    # Add function definition line (def something():) prior to lines returned from seleniumCodeForSeleniumTask
    seleniumCodeForSeleniumTask = seleniumCodeForSeleniumTask.replace(';', '\n   ')
    seleniumCodeForSeleniumTask = f'def testFn():\n    {seleniumCodeForSeleniumTask}'
    print(seleniumCodeForSeleniumTask)
    print("\n\n\n")

    # Execute the function that has seleniumCodeForSeleniumTask lines
    globals_dict = {'webdriver': mock_driver, 'context': context, 'currTestData': currTestData, 'boto3': mock_boto3, 'random': random, 'string': string, 'time': time, 'By': By}
    exec(seleniumCodeForSeleniumTask, globals_dict)

    # Validate that the mocks were invoked correctly

    # Validate function returns correct values with correct structure
    testFnResult = globals_dict['testFn']()
    print(testFnResult)
