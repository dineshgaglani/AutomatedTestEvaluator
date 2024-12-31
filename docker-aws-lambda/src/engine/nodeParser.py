import os
import time
import requests
import boto3
import random
import string

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Uncomment below for unit tests
# from .engine import Node

# Comment below for unit tests
from engine.engine import Node

def parseNodes(json):
    nodesIdMap = {}
    for nodeJson in json['nodes']:
        node = Node(nodeJson['data']['label'])
        node.setId(nodeJson['id'])
        
        activation_fn_name = "".join(ch for ch in node.description if ch.isalnum()) + "ActivationFunction"
        activation_eligibility_multiline = nodeJson['data']['activationEligibility'].replace(';', '\n   ')
        #TODO - create a string instead of function, pass to a setActivationEligibilityStr member function
        exec(f'def {activation_fn_name}(priorActionResults, currTestData, context):\n    ' + activation_eligibility_multiline)
        print(f'def {activation_fn_name}(priorActionResults, currTestData, context):\n    ' + activation_eligibility_multiline)
        node.setActivationEligibility(locals()[activation_fn_name], nodeJson['data']['activationEligibilityDescription'])
        
        task_fn_name = "".join(ch for ch in node.description if ch.isalnum()) + "ActivationTask"
        # activation_task_multiline = nodeJson['data']['activationTask'].replace(';', '\n   ')
        activation_task_multiline = translateTaskObjToTaskFn(nodeJson['data']['activationTask']).replace(';', '\n   ')
        #TODO - create a string instead of function, pass to a setActivationEligibilityStr member function
        print(f'def {task_fn_name}(priorActionResults, currTestData, context):\n    ' + activation_task_multiline)
        exec(f'def {task_fn_name}(priorActionResults, currTestData, context):\n    ' + activation_task_multiline)
        node.assignActivationTask(locals()[task_fn_name])
        nodesIdMap[nodeJson['id']] = node
    
    return nodesIdMap

def joinNodes(json, nodesIdMap):
    for edgeJson in json['edges']:
        nodesIdMap[edgeJson['source']].addChild(nodesIdMap[edgeJson['target']])
    
    
def createTreeFromJson(nodesJson, edgesJson):
    nodesIdMap = parseNodes(nodesJson)
    joinNodes(edgesJson, nodesIdMap)

    #Assumption - Lowest Id node is the root node - Fix give special un-editable description to root node
    return nodesIdMap[min(list(nodesIdMap.keys()))]

def translateTaskObjToTaskFn(taskObj):
    print('taskObj["taskType"] is ' + str(taskObj["taskType"]))
    if taskObj["taskType"] == "HttpAPI":
        return "return " + translateHttpTaskFn(taskObj["taskProps"])
    
    elif taskObj["taskType"] == "PythonCode":
        return translatePythonTaskFn(taskObj["taskProps"])

    elif taskObj["taskType"] == "SeleniumUI":
        return translateSeleniumUITaskFn(taskObj["taskProps"])

def translateHttpTaskFn(httpTaskProps):
    # { "httpMethod": "GET", "httpAddress": "context['baseUrl']/products" } becomes "return requests.get(f'{context['baseUrl']}/products\").json()"
    if httpTaskProps["httpMethod"] == "GET" or httpTaskProps["httpMethod"] == "DELETE":
        return f'requests.{httpTaskProps["httpMethod"].lower()}(f\'{httpTaskProps["httpAddress"]}\').json()'
    elif httpTaskProps["httpMethod"] == "POST" or httpTaskProps["httpMethod"] == "PUT":
        return f'requests.{httpTaskProps["httpMethod"].lower()}(f\'{httpTaskProps["httpAddress"]}\', data={httpTaskProps["httpData"]}).json()'

def translatePythonTaskFn(pythonTaskProps): 
    return pythonTaskProps["pythonText"]

def translateSeleniumUITaskFn(seleniumUITaskProps):
    # example seleniumTaskProps: 
    #{
    #        "steps": [{ "locator": "", "action": "navigate", "param": "http://google.com" }, 
    #                  { "locator": "div[name=\"selected\"]", "action": "click", "param": "" }, 
    #                  { "locator": "input[name=\"active\"]", "action": "send_keys", "param": "abc" }],
    #        "returns": [{"locator": "input[name=\"return\"]", "name": "val"}]
    #}
    print("SeleniumUI Task translation invoked")
    filledFn = "rand = ''.join(random.choices(string.ascii_letters, k=6)); "
    # boto3 s3 connection
    filledFn += "s3 = boto3.client('s3'); bucket_name = 'selenium-task-screenshots'; "
    # screenshots array initialization
    filledFn += "s3Locations = []; "
    filledFn += "results = {}; "
    for idx, seleniumTaskModelSteps in enumerate(seleniumUITaskProps["steps"]):
        if seleniumTaskModelSteps["action"] == "navigate" : 
            filledFn += f'context["webUiDriver"].get(f\'{seleniumTaskModelSteps["param"]}\')'
        elif seleniumTaskModelSteps["action"] == "click":
            filledFn += f'context["webUiDriver"].find_element(By.CSS_SELECTOR, f\'{seleniumTaskModelSteps["locator"]}\').click()'
        elif seleniumTaskModelSteps["action"] == "send_keys":
            filledFn += f'context["webUiDriver"].find_element(By.CSS_SELECTOR, f\'{seleniumTaskModelSteps["locator"]}\').send_keys(f\'{seleniumTaskModelSteps["param"]}\')'
        filledFn += f'; time.sleep(5); '
        # TODO - save screenshot to s3 per step per node per testdata
        filledFn += f'screenshot_name = f\'screenshot{{rand}}_{idx}.png\'; screenshot_path = "/tmp/" + screenshot_name; context["webUiDriver"].save_screenshot(screenshot_path); s3.upload_file(screenshot_path, bucket_name, screenshot_name); url = s3.generate_presigned_url(ClientMethod=\'get_object\',Params={{\'Bucket\': bucket_name, \'Key\': screenshot_name}}, ExpiresIn=3600); s3Locations.append(url); '

    for idx, seleniumTaskModelResults in enumerate(seleniumUITaskProps["returns"]):
        filledFn += f'results[f\'{seleniumTaskModelResults["name"]}\'] = context["webUiDriver"].find_element(By.CSS_SELECTOR, f\'{seleniumTaskModelResults["locator"]}\').text; '
    
    # Return the screenshots s3 addresses merged with results
    filledFn += "res = {\"s3Locations\": s3Locations} | results; "
    filledFn += "return res"

    return filledFn
