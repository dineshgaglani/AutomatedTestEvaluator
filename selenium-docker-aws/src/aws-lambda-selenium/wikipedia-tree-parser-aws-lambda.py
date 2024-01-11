# This file creates the nodes tree, pickles it and sends the pickled object to a 
# step function along with the test data that is to be executed on that step
from pyvirtualdisplay import Display
import json
import pickle
import base64
import boto3
import os

# from engine import Node
# from nodeParser import createTreeFromJson

def handler(event, context):
    # with open('./diagrams/wikipedia.json') as nodesJsonIOStr:

    files = [f for f in os.listdir('.')]
    for fi in files:
        print(fi)

    eventList = []
    eventList.append({'pickedTree': 'TestingTree', 'testData': ['Board of Control for Cricket in India', '']})
    eventList.append({'pickedTree': 'Testing Tree', 'testData': ['Google Chrome', '']})
    input_data = {"items": eventList}

    client = boto3.client('stepfunctions')

    try:
        response = client.start_execution(
            stateMachineArn = 'arn:aws:states:us-east-1:123456789012:stateMachine:MyStateMachine',
            input = json.dumps(input_data)
        )
        execution_arn = response['executionArn']
        print(f'Execution started: {execution_arn}')
        return {'statusCode': 200, 'body': 'Execution started successfully.'}
    except Exception as e:
        print(f'Error starting execution: {e}')
        return {'statusCode': 500, 'body': 'Error starting execution.'}

# def handler(event, context):
#     with open('../diagrams/wikipedia.json') as nodesJsonIOStr:
#         nodesJson = json.load(nodesJsonIOStr)
#         startNode = createTreeFromJson(nodesJson, nodesJson)
      
#         pickledTree = pickle.dumps(startNode)
#         b64Tree = base64.b64encode(pickledTree).decode('utf-8')
        
#         eventList = []
#         eventList.append({'pickedTree': b64Tree, 'testData': ['Board of Control for Cricket in India', '']})
#         eventList.append({'pickedTree': b64Tree, 'testData': ['Google Chrome', '']})
#         input_data = {"items": eventList}

#         client = boto3.client('stepfunctions')

#         try:
#             response = client.start_execution(
#                 stateMachineArn='MyStateMachine',
#                 input=json.dumps(input_data)
#             )
#             execution_arn = response['executionArn']
#             print(f'Execution started: {execution_arn}')
#             return {'statusCode': 200, 'body': 'Execution started successfully.'}
#         except Exception as e:
#             print(f'Error starting execution: {e}')
#             return {'statusCode': 500, 'body': 'Error starting execution.'}


    