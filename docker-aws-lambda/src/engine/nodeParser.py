import os
import time
import requests

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

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
        activation_task_multiline = nodeJson['data']['activationTask'].replace(';', '\n   ')
        #TODO - create a string instead of function, pass to a setActivationEligibilityStr member function
        exec(f'def {task_fn_name}(priorActionResults, currTestData, context):\n    ' + activation_task_multiline)
        print(f'def {task_fn_name}(priorActionResults, currTestData, context):\n    ' + activation_task_multiline)
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