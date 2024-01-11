# AutomatedTestEvaluator
Automatically validates test data

Run Jupyter notebooks on lorenzomartino/graphviz-jupyter docker image

Install requests on the container using 

`docker exec <container> /bin/bash -c 'pip install requests --user'`

Notes on process (not useful to run application but provides information on challenges resolved and may be used as a process to follow to build such an application):
1. Python based graph backend to model nodes and connections
    1. Built an engine to model the nodes and connections, tested the engine on Jupyter notebooks and visualized using graphviz python library
    2. Additional details and code on Jupyter notebooks available in this project

2. Executing selenium on aws lambda 
    1. AWS Lambda has its own runtime, this can be changed by having it run on a docker container.
    2. The Docker container needs a browser to be installed on it and also a virtual display so the browser can run on the virtual display
    3. The virtual display that was installed was xvfb, xvfb is a virtual display which runs as a server but needed x11vnc to connect to it
    4. Used xterm as a start program to test xvfb (the start program needs to be configured on .xinitrc file)
    5. The browser was then installed on the docker container and was started on the port the xvfb display was running on in the python code (which contains selenium code).
    6. The port running the xvfb on the docker container is forwarded to a different port on the host machine
    7. The browser was viewed running the selenium commands by connecting to the forwarded port on my mac using finder --> Go --> Connect to server --> vnc://localhost:{forwarded port on host}
    8. Additional details available on folder - selenium-docker-aws

3. AWS Backends
    1. The plan is to have 1 lambda (NodeParserFunction) receive the request from the front end as nodes and edges and test-data and then convert the nodes and edges to python code and call a step function (NodeExecutorForwarderStateMachine) passing the python code (serialized as 'dill pickle') and test data to the step function
    2. The step function then calls another lambda (NodeExecutorFunction) per test data passing the current test data and dill pickle serialized python code
    3. The NodeExecutorFunction lambda executes the test per test data and saves the visited nodes to ddb and the recording video to s3
    4. The lambdas that were created needed to use the browser-installed and xvfb installed docker container and needs permissions for every task that they do (ddb PUT, step function execute etc.)
    5. Rendering the recorded video link and the visited nodes is done by react app connecting to aws api gateway websocket API (yet to be resolved)

4. React graph animations
    1. Understanding react notes: React splits every section on the web UI into components
    2. These components have states and the react component is refreshed when the state changes.
    3. The state connot be changed simply by assigning values to it, but rather it needs to be changed by using the function returned from the useState() hook.
    4. Every state that changes has its own useState() hook.


5. AWS API Gateway web-sockets
    1. The AWS API gateway websocket API needs to save every connection to ddb since the downstream lambda function needs to know which connection should receive which response
    2. The AWS API gateway management API is needed to correctly respond to each connected client on the websocket API
    