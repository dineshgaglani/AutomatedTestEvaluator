# import external libraries.
import os
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from pyvirtualdisplay import Display

# set xvfb display since there is no GUI in docker container.
display = Display(visible=0, size=(800, 600))
display.start()

chrome_options = Options()
chrome_options.add_argument('--no-sandbox')
chrome_options.add_argument('--disable-dev-shm-usage')

# Set the display port to the one created by pyvirtualdisplay
chrome_options.add_argument('--display=:20')

print('building session')
driver = webdriver.Chrome(options=chrome_options)

## DO STUFF
driver.get(os.environ["URL"])
print('Opened Wikipedia')

time.sleep(5)
# searchBox = driver.find_element(By.NAME, "search")
searchBox = WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.NAME, "search")))
searchBox.send_keys('BCCI')
searchBox.send_keys(Keys.RETURN)
print('Searched BCCI')

headingElem = driver.find_element(By.ID, 'firstHeading')
print('on page' + headingElem.text)
driver.find_element(By.XPATH, '//a[@title = "Indian Premier League"]').click() 
print('Clicked Indian Premier League')

time.sleep(5)

# close chromedriver and display
driver.quit()
display.stop()