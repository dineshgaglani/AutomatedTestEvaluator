import json
import requests

import os
import sys

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the path to the 'src' directory
engine_path = os.path.join(script_dir, '..', 'engine')

# Add the directory to sys.path
sys.path.append(engine_path)

# print the updated sys.path
print('Updated sys.path:', sys.path)

import nodeParser

 # This function uses a file to parse nodes and is just for testing
def parseFakeStoreApiNodes():
    diagrams_path = os.path.join(script_dir, '..', 'diagrams')
    with open(diagrams_path + '/fakestoreapi.json') as nodesJsonIOStr:
        nodesJson = json.load(nodesJsonIOStr)
        treeStartNode = nodeParser.createTreeFromJson(nodesJson, nodesJson)
        return treeStartNode

# This function uses the actual request to parse nodes and edges and is being used in the application
def parseFakeStoreNodesFromRequest(requestData):
    # nodesJson = json.load(nodesArr)
    # edgesJson = json.load(edgesArr)
    treeStartNode = nodeParser.createTreeFromJson(requestData, requestData)
    return treeStartNode

def getTreeWithTestData(testData):
    fakeStoreApiNodes = parseFakeStoreApiNodes()
    treeWithTestData = []
    for singleTestData in testData:
        treeWithTestData.append({ "flow": fakeStoreApiNodes, "testData": singleTestData } ) 
    
    return treeWithTestData

def executeFlow(flow, testData, context, globalVisited):
    flow.setPriorActionResults({})
    flow.isActivationEligible(testData, context)
    flow.activate(context, globalVisited)


# print('Start execution')
# globalVisited = set()
# context = { 'baseUrl': 'https://fakestoreapi.com' }
# testData = [1, 2]
# fakeApiTreeWithTestData = getTreeWithTestData(testData)
# for flowWithTestData in fakeApiTreeWithTestData:
#     print('flowWithTestData: ')
#     print(flowWithTestData)
#     executeFlow(flowWithTestData.get('flow'), flowWithTestData['testData'], context, globalVisited)
# print('Stop execution')