from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
import csv
import time

# Function to fetch the number of visitors from multiple URLs
def fetch_visitors(urls):
    # Set up the Selenium WebDriver (ensure the correct path to your WebDriver)
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(10)

    try:
        results = []
        for url in urls:
            driver.get(url)
            WebDriverWait(driver, 20).until(
                lambda d: d.find_element(By.XPATH, '//div[@class="nav-item-visitors"]/span').text != "LOADING..."
            )
            # Locate the element containing the number of visitors using XPath
            visitor_element = driver.find_element(By.XPATH, '//div[@class="nav-item-visitors"]/span')
            # Extract the number of visitors
            visitors = visitor_element.text
            results.append(visitors)

        with open('visitors_data.csv', mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([time.strftime("%Y-%m-%d %H:%M:%S")] + results)

        print(f"Data fetched and saved for {url}: {results} visitors at {time.strftime('%Y-%m-%d %H:%M:%S')}")

    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        # Close the browser
        driver.quit()

# List of URLs to fetch data from
urls = [
    'https://www.fitnesspark.ch/fitnessparks/zuerich-stadelhofen/ueber-den-park/',
    'https://www.fitnesspark.ch/fitnessparks/zuerich-stockerhof/ueber-den-park/',
    'https://www.fitnesspark.ch/fitnessparks/zuerich-sihlcity/ueber-den-park/',
    'https://www.fitnesspark.ch/fitnessparks/puls-5-zuerich/ueber-den-park/'
]

fetch_visitors(urls)