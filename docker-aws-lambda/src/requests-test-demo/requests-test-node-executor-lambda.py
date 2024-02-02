import base64
import dill
import os
import sys
import boto3
import json

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
# Add the directory to sys.path
sys.path.append(script_dir)

from requestsTest import executeFlow

class GlobalVisitedDDBRecorder:
    def setWebsocketConnection(self, connectionId, endpointUrl): 
        self.api_gateway = boto3.client('apigatewaymanagementapi', endpoint_url=endpointUrl)
        self.connectionId = connectionId

    def add(self, nodeToRecord):
        print(f'nodeDescription: {str(nodeToRecord.description)}, nodeTestData: {str(nodeToRecord.currTestData)}, nodeActionResults: {str(nodeToRecord.priorActionResults)}')

        valToRecord = nodeToRecord.id
        print('Recording ' + str(valToRecord) + ' to global visited ')
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('visited_nodes')

        # The below should look like this { testData --> "1": { nodeId --> "1": nodeOutput --> { "products": ["LorenIpsum"] } }, {nodeId --> "2": nodeOutput --> {"product1": "lorenIpsum"} } }
        testDataToNodeOutput = { str(nodeToRecord.currTestData) : { 
                valToRecord: json.dumps(nodeToRecord.priorActionResults[nodeToRecord.description])
            } 
        }

        # Get the existing item from DynamoDB
        response = table.get_item(Key={'run_id': 'run1'})
        existing_item = response.get('Item', {})
        existing_test_data = existing_item.get('test_data_to_node_output', {})

        # Merge new data with existing data based on the common key
        merged_test_data_output = {key: {**existing_test_data.get(key, {}), **testDataToNodeOutput.get(key, {}) } for key in set(existing_test_data) | set(testDataToNodeOutput)}

        print(f'testDataToNodeOutput: {str(testDataToNodeOutput)}')

        ddbWriteResponse = table.update_item(
            Key={
                'run_id': 'run1'
            },
            UpdateExpression='SET nodes_visited = list_append(if_not_exists(nodes_visited, :empty_list), :value), test_data_to_node_output = :new_data',
            ExpressionAttributeValues={
                ':empty_list': [],
                ':value': [valToRecord],
                ':new_data': merged_test_data_output
            }
        )

        print(ddbWriteResponse)

        self.sendWsResponse()

    def sendWsResponse(self):
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('visited_nodes')
        
        result = table.query(
            KeyConditionExpression='run_id = :value',
            ExpressionAttributeValues={':value': 'run1'}
        )

        print(f'dynamodb call result {json.dumps(result)}')
        items = result.get('Items', [])
        response_data = {
            'data': items
        }
        print(f'sending response data {json.dumps(response_data)}')

        self.api_gateway.post_to_connection(
            ConnectionId=self.connectionId,
            Data=json.dumps(response_data)
        )


def handler(event, context):
    globalVisited = GlobalVisitedDDBRecorder()
    # appContext = { 'baseUrl': 'https://fakestoreapi.com' }
    base64_data = event.get('pickedTree')
    testData = event.get('testData')

    pickled_flow = base64.b64decode(base64_data)
    flow = dill.loads(pickled_flow)

    envData = event.get('envData')
    print(f'envData: envData[0]["key"] {envData[0]["key"]}, envData[0]["value"] {envData[0]["value"]}')
    appContext = {}
    for keyVal in envData:
        print(f'envData: keyVal["key"] {keyVal["key"]}, keyVal["value"] {keyVal["value"]}')
        appContext[keyVal['key']] = keyVal['value']
    print(f'appContext: {json.dumps(appContext)}')

    connectionId = event.get('connectionId')
    domain = event.get('domain')
    stage = event.get('stage')
    endpoint_url = f'https://{domain}/{stage}'
    globalVisited.setWebsocketConnection(connectionId, endpoint_url)
    
    try:
        executeFlow(flow, testData, appContext, globalVisited)
        return {'statusCode': 200, 'body': 'Execution completed successfully.'}
    except Exception as e:
        print(f'Error starting execution: {e}')
        return {'statusCode': 500, 'body': 'Error starting execution.'}

print("Should run!!")