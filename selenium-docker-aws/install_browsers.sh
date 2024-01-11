#!/usr/bin/bash

# Downloaded from https://github.com/aws-samples/serverless-ui-testing-using-selenium/blob/main/install-browsers.sh
declare -A chrome_versions

# Enter the list of browsers to be downloaded
### Using Chromium as documented here - https://www.chromium.org/getting-involved/download-chromium
chrome_versions=( ['88.0.4324.150']='827102' ['89.0.4389.47']='843831' )
chrome_drivers=( "88.0.4324.96" "89.0.4389.23" )


# Download Chrome
for br in "${!chrome_versions[@]}"
do
    echo "Downloading Chrome version $br"
    mkdir -p "/opt/chrome/$br"
    curl -Lo "/opt/chrome/$br/chrome-linux.zip" "https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F${chrome_versions[$br]}%2Fchrome-linux.zip?alt=media"
    unzip -q "/opt/chrome/$br/chrome-linux.zip" -d "/opt/chrome/$br/"
    mv /opt/chrome/$br/chrome-linux/* /opt/chrome/$br/
    rm -rf /opt/chrome/$br/chrome-linux "/opt/chrome/$br/chrome-linux.zip"
done

# Download Chromedriver
for dr in ${chrome_drivers[@]}
do
    echo "Downloading Chromedriver version $dr"
    mkdir -p "/opt/chromedriver/$dr"
    curl -Lo "/opt/chromedriver/$dr/chromedriver_linux64.zip" "https://chromedriver.storage.googleapis.com/$dr/chromedriver_linux64.zip"
    unzip -q "/opt/chromedriver/$dr/chromedriver_linux64.zip" -d "/opt/chromedriver/$dr/"
    chmod +x "/opt/chromedriver/$dr/chromedriver"
    rm -rf "/opt/chromedriver/$dr/chromedriver_linux64.zip"
done