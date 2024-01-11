import os
import time
import subprocess

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service

from pyvirtualdisplay import Display

def handler(event, context):
    try:
        # set xvfb display since there is no GUI in docker container.
        display = Display(visible=False, extra_args=[':25'], size=(2560, 1440)) 
        display.start()
        print('Started Display')
        print('building session')
        recordingFileName = 'recording.mp4'
        recorder = subprocess.Popen(['/usr/bin/ffmpeg', '-f', 'x11grab', '-video_size',
        '2560x1440', '-framerate', '25', '-probesize',
        '10M', '-i', ':25', '-y', './' + recordingFileName])
        

        chrome_options = Options()
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--disable-dev-tools")
        chrome_options.add_argument("--no-zygote")
        chrome_options.add_argument("--single-process")
        chrome_options.add_argument("window-size=2560x1440")
        chrome_options.add_argument("--user-data-dir=/tmp/chrome-user-data")
        chrome_options.add_argument("--remote-debugging-port=9222")
        # Set the display port to the one created by pyvirtualdisplay
        chrome_options.add_argument('--display=:25')
        chrome_options.binary_location = '/opt/chrome/88.0.4324.150/chrome'
        service = Service(executable_path='/opt/chromedriver/88.0.4324.96/chromedriver')
        driver = webdriver.Chrome(service=service,
                                    options=chrome_options)

        ## DO STUFF
        driver.get('https://en.wikipedia.org/wiki/Main_Page')
        print('Opened Wikipedia')

        time.sleep(5)

        searchBox = lambda: WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, '//input[@name=\"search\"]')))
        searchBox().send_keys('BCCI')
        searchBox().send_keys(Keys.RETURN)
        print('Searched BCCI')

        headingElem = driver.find_element(By.ID, 'firstHeading')
        print('on page' + headingElem.text)
        driver.find_element(By.XPATH, '//a[@title = "Indian Premier League"]').click() 
        print('Clicked Indian Premier League')

        time.sleep(5)

        # close chromedriver and display
        print('closing browser')
        driver.quit()
        print('closing recorder')
        recorder.terminate()

        time.sleep(7)
        print('Closed recorder')

        recorder.wait(timeout=20)

        s3.upload_file('./recording.mp4', s3buck, s3prefix + recordingFileName)
        os.remove('./recording.mp4')
        return {"status": "success", "recording": s3prefix + recordingFileName}
    except:
        s3.upload_file('/tmp/chromedriver.log', s3buck, s3prefix + 'chromedriver.log')
        if recorder:
            recorder.terminate()
        return {"status": "Failed", "message": "Failed to execute TC0011. Check logs for details."}