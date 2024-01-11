StandAlone Selenium:
Docker container steps (CHATGPT generated):
Installed x11vnc and xvfb:
You installed x11vnc and xvfb in your Docker container to set up a virtual X server and provide a VNC interface for viewing the graphical output.

Configured xinitrc:
Created a .xinitrc file to specify the initial setup of the X server. Initially, you used xterm in your .xinitrc file, but since xterm was not installed, you encountered issues.

Installed xterm:
Installed the xterm package to resolve the "xterm: not found" issue in the .xinitrc script.

Adjusted Dockerfile:
Modified your Dockerfile to include the necessary package installations and configurations.

Tested with xterm:
Successfully tested the configuration by starting the xterm terminal in the .xinitrc file. This allowed you to see the terminal output when connecting via VNC.

Customized xinitrc:
You can further customize the .xinitrc file to start different applications or a graphical desktop environment based on your requirements.

Process:
Build docker container using:
```docker build -t standalone-seleniuim-xvfb -f DockerFileStandaloneSelenium .```

Start the container using:
```docker run -p 5800:5900 standalone-seleniuim-xvfb```
The password to be entered is 'vncpass' (set in DockerFileStandaloneSelenium)

Then use any vnc client (pre-installed on mac with finder --> Go --> connect to server)
and connect to the docker UI using - vnc://localhost:5800 

Execute the test file using:
Get container id using:
```docker ps``` 

Access shell in container using:
```docker exec -it <container_id> sh```
```cd app/stand-alone-selenium```
```python3 selenium-test.py```

Make sure to change the chrome driver version (119.0.6045.105) if any errors occur on executing the selenium-test.py script

Wikipedia tree test:
The wikipedia tree test has nodes that will access wikipedia which branch into 2 scenarios, the file that has the config is diagrams/wikipedia.json. 
These flows can be executed by running:
```cd app/stand-alone-selenium```
```python3 wikipedia-tree-selenium-test.py```

FOR LOCAL EXECUTION OF AWS LAMBDA SELENIUM

1. Install the aws cli
2. Install SAM cli
3. Install step functions local
```docker pull amazon/aws-stepfunctions-local```
4. Create the docker image from the DockerFileAWS file (be sure to name the image selenium-tree-aws-lambda since this is the name used on the template file)
```docker build -t selenium-tree-aws-lambda -f DockerFileAWS .```
5. Start the aws-step-function-local passing in the step-function json (The json is only for local invocation of step function, the aws cloud uses the yml step function implementation)
```docker run -p 8083:8083 amazon/aws-stepfunctions-local```
```aws stepfunctions --endpoint http://localhost:8083 create-state-machine --name MyStateMachine --definition file://stepFunction.json --role-arn arn:aws:iam::012345678901:role/DummyRole```
6. Run the template file with sam local (make sure that the current folder is the one with the template.yml file)
```sam local invoke NodeParserFunction```