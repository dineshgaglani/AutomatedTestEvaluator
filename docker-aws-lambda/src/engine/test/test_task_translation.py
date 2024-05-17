import requests
from .. import nodeParser

# Comment out 'from engine.engine import Node' from nodeParser to exec this
# Execute using command - /Library/Developer/CommandLineTools/usr/bin/python3 -m pytest test_task_translation.py 

def test_httpGetCall():
    httpGetTask = {
        "taskType": "HttpAPI",
        "taskProps": { "httpMethod": "GET", "httpAddress": "https://fakestoreapi.com/products/1" }
    }
    
    pythonCodeForGetCall = f'getCallResult = {nodeParser.translateTaskObjToTaskFn(httpGetTask)}'
    assert pythonCodeForGetCall == "getCallResult = requests.get('https://fakestoreapi.com/products/1').json()"

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

# TODO - Test with a variable (example { "httpMethod": "GET", "httpAddress": "context['baseUrl']/products/1" } ) in addition to the hardcoded { "httpMethod": "GET", "httpAddress": "https://fakestoreapi.com/products/1" }
# This should address the 2 issues seen on prod - One was because we use single quotes on both translation and input (resulting in function created like this - requests.get('context['baseUrl']/products').json()) (2 single quotes)
# Second issue - The context['baseUrl'] was being sent as string literal since the quote was covering the variable so it was not being evaluated (it was - 'context["baseUrl"]/products', instead of context["baseUrl"] + '/products')