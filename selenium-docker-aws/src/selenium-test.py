# import external libraries.
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
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
time.sleep(10)

# close chromedriver and display
driver.quit()
display.stop()