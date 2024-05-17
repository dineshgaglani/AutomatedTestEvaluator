import requests
from .. import nodeParser

# Comment out 'from engine.engine import Node' from nodeParser to exec this
# Execute using command - /Library/Developer/CommandLineTools/usr/bin/python3 -m pytest test_task_translation.py 

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