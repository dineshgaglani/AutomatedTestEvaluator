# Include boto3, the Python SDK's main package:
import time

import boto3, pytest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options


# in your tests:
# Set up the Device Farm client, get a driver URL:
# class myTestSuite:
#   def setup_method(self, method):
#     try:
#       devicefarm_client = boto3.client("devicefarm", region_name="us-west-2")
#       testgrid_url_response = devicefarm_client.create_test_grid_url(
#         projectArn="arn:aws:devicefarm:us-west-2:660023757134:testgrid-project:4952174f-ef60-4997-b376-dc01f037abf6",
#         expiresInSeconds=300)
#       self.driver = selenium.webdriver.Remote(testgrid_url_response["url"], selenium.webdriver.DesiredCapabilities.FIREFOX)
#       self.driver.get("https://wikipedia.org")

#       time.sleep(5)
#     except:
#       print("error")
    
    
#     def test_openBrowser():
#       # searchBox = driver.find_element(By.NAME, "search")
#       searchBox = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.NAME, "search")))
#       searchBox.send_keys('BCCI')
#       searchBox.send_keys(Keys.RETURN)
#       print('Searched BCCI')

#       headingElem = driver.find_element(By.ID, 'firstHeading')
#       print('on page' + headingElem.text)
#       self.driver.find_element(By.XPATH, '//a[@title = "Indian Premier League"]').click() 
#       print('Clicked Indian Premier League')


#     # later, make sure to end your WebDriver session:
#     def teardown_method(self, method):
#       self.driver.quit()

def test_openBrowser():
    # Create a Device Farm client
    devicefarm_client = boto3.client("devicefarm", region_name="us-west-2")
    
    # Generate a TestGrid URL
    testgrid_url_response = devicefarm_client.create_test_grid_url(
        projectArn="arn:aws:devicefarm:us-west-2:660023757134:testgrid-project:4952174f-ef60-4997-b376-dc01f037abf6",
        expiresInSeconds=300
    )
    
    # Set up Firefox options
    options = Options()
    
    # Create a new remote WebDriver session with options
    driver = webdriver.Remote(
        command_executor=testgrid_url_response["url"],
        options=options
    )

    # Open a website
    driver.get("https://wikipedia.org")

    # Wait for 5 seconds
    time.sleep(5)

    # Quit the browser session
    driver.quit()

test_openBrowser()