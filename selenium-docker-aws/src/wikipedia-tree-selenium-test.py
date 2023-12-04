import json
# import os
# import time

from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC

from pyvirtualdisplay import Display

from engine import Node
from nodeParser import createTreeFromJson

testData = [['Board of Control for Cricket in India', ''],
['Google Chrome', '']]

# nodesJsonText = """{
#     "nodes": [
#         {
#             "id": "1",
#             "type": "input",
#             "data": {
#                 "label": "Open Wikipedia",
#                 "activationEligibility": "return True",
#                 "activationEligibilityDescription": "Start of Test!!",
#                 "activationTask": "context['driver'].get('https://en.wikipedia.org/wiki/Main_Page'); time.sleep(5); return 'Opened Wikipedia'"
#             },
#             "position": {
#                 "x": 100,
#                 "y": 125
#             }
#         },
#         {
#             "id": "2",
#             "type": "input",
#             "data": {
#                 "label": "Search",
#                 "activationEligibility": "return True",
#                 "activationEligibilityDescription": "Always true",
#                 "activationTask": "searchBox = context['driver'].find_element(By.NAME, 'search'); searchBox.send_keys(currTestData[0]); searchBox.send_keys(Keys.RETURN); return context['driver'].find_element(By.ID, 'firstHeading').text"
#             },
#             "position": {
#                 "x": 100,
#                 "y": 125
#             }
#         },
#         {
#             "id": "3",
#             "type": "input",
#             "data": {
#                 "label": "Click on 'Indian Premier League'",
#                 "activationEligibility": "return priorActionResults['Search'] == 'Board of Control for Cricket in India'",
#                 "activationEligibilityDescription": "BCCI workflow",
#                 "activationTask": "context['driver'].find_element(By.XPATH, '//a[@title = \"Indian Premier League\"]').click(); time.sleep(5); return context['driver'].find_element(By.ID, 'firstHeading').text"
#             },
#             "position": {
#                 "x": 100,
#                 "y": 125
#             }
#         },
#         {
#             "id": "4",
#             "type": "input",
#             "data": {
#                 "label": "Click on 'History of Google'",
#                 "activationEligibility": "return priorActionResults['Search'] == 'Google Chrome'",
#                 "activationEligibilityDescription": "Google workflow",
#                 "activationTask": "context['driver'].findElement(By.XPATH('//a[@title = \\"History of Google\\"]')).click(); time.sleep(5); return context['driver'].find_element(By.ID, 'firstHeading').text"
#             },
#             "position": {
#                 "x": 100,
#                 "y": 125
#             }
#         }
#     ]
# } """

# edgesJsonText = """{ "edges": [
#         {
#             "id": "e1-2",
#             "source": "1",
#             "target": "2"
#         },
#         {
#             "id": "e2-3",
#             "source": "2",
#             "target": "3"
#         },
#         {
#             "id": "e2-4",
#             "source": "2",
#             "target": "4"
#         }
#     ] }"""

# set xvfb display since there is no GUI in docker container.
display = Display(visible=0, size=(800, 600))
display.start()

chrome_options = Options()
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

# Set the display port to the one created by pyvirtualdisplay
chrome_options.add_argument('--display=:20')

context = {}
globalVisited = set()
print('building session')
driver = webdriver.Chrome(options=chrome_options)
context['driver'] = driver

# nodesJson = json.loads(nodesJsonText)
# edgesJson = json.loads(edgesJsonText)
# startNode = createTreeFromJson(nodesJson, edgesJson)

# for singleTestData in testData:
#         startNode.setPriorActionResults({})
#         startNode.isActivationEligible(singleTestData, context)
#         startNode.activate(context, globalVisited)

with open('./diagrams/wikipedia.json') as nodesJsonIOStr:
    nodesJson = json.load(nodesJsonIOStr)
    startNode = createTreeFromJson(nodesJson, nodesJson)

    for singleTestData in testData:
        startNode.setPriorActionResults({})
        startNode.isActivationEligible(singleTestData, context)
        startNode.activate(context, globalVisited)