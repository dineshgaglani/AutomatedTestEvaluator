import base64
import dill
import os
import sys

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
# Add the directory to sys.path
sys.path.append(script_dir)

from requestsTest import executeFlow

def handler(event, context):
    globalVisited = set()
    context = { 'baseUrl': 'https://fakestoreapi.com' }
    base64_data = event.get('pickedTree')
    testData = event.get('testData')
    pickled_flow = base64.b64decode(base64_data)
    flow = dill.loads(pickled_flow)

    try:
        executeFlow(flow, testData, context, globalVisited)
        return {'statusCode': 200, 'body': 'Execution completed successfully.'}
    except Exception as e:
        print(f'Error starting execution: {e}')
        return {'statusCode': 500, 'body': 'Error starting execution.'}

print("Should run!!")