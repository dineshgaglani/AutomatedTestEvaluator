The functions here are a demo of being able to execute an aws lambda using a docker container

The Dockerfile needs to be built and tagged with the repository info for aws, instructions for which can be found on aws management console's ECR section.

Once the Docker container is built and pushed to AWS, create the respective aws lambda functions (the functions are on requests-test-node-parser-lambda.py and requests-test-node-executor-lambda.py in this repo). In this case the requests-test-node-parser-lambda.py calls a step function which then calls the requests-test-node-executor-lambda.py, the permissions were set for these invocations on aws management console.

The ```CMD override - requests-test-demo/requests-test-node-parser-lambda.handler``` lambda config then is to used to override the lambda function to invoke the appropriate function (requests-test-node-parser-lambda for the lambda that invokes the step function and the requests-test-node-executor-lambda for the lambda that is invoked by the step function)

TODO - Add the template file that will connect everything in the form of code.