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
```cd app```
```python3 selenium-test.py```

Make sure to change the chrome driver version (119.0.6045.105) if any errors occur on executing the selenium-test.py script

Wikipedia tree test:
The wikipedia tree test has nodes that will access wikipedia which branch into 2 scenarios, the file that has the config is diagrams/wikipedia.json. 
These flows can be executed by running:
```cd app```
```python3 wikipedia-tree-selenium-test.py```