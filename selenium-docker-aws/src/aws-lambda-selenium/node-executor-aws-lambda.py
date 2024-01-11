def handler(event, context):
    print('Started Display')
    print('building session')

    response = repr(event)
    return {'statusCode': 200, 'body': response, 'message': 'returned from node-executor-aws-lambda'}