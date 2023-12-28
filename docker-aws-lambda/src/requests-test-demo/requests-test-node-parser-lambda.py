import dill
import json
import base64
import boto3
import os
import sys

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
# Add the directory to sys.path
sys.path.append(script_dir)

from requestsTest import parseFakeStoreApiNodes

def handler(event, context):
    fakeStoreApiTree = parseFakeStoreApiNodes()
    testData = [1, 2]
    pickledTreeWithTestData = []
    for singleTestData in testData:
        pickledTree = dill.dumps(fakeStoreApiTree)
        b64Tree = base64.b64encode(pickledTree).decode('utf-8')
        print(b64Tree)
        pickledTreeWithTestData.append({ 'pickedTree': b64Tree, 'testData': singleTestData })
    
    client = boto3.client('stepfunctions')

    try:
        response = client.start_execution(
            stateMachineArn = 'arn:aws:states:us-east-1:660023757134:stateMachine:DiagramStateMachine',
            input = json.dumps(pickledTreeWithTestData)
        )
        execution_arn = response['executionArn']
        print(f'Execution started: {execution_arn}')
        return {'statusCode': 200, 'body': 'Execution started successfully.'}
    except Exception as e:
        print(f'Error starting execution: {e}')
        return {'statusCode': 500, 'body': 'Error starting execution.'}

print("Should run requests-test-node-parser-lambda!!")