import os
import time
import logging
import json
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from bs4 import BeautifulSoup
from dotenv import load_dotenv


# --- Configuration and Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load environment variables from the .env file
load_dotenv()

# LinkedIn credentials from environment variables
LINKEDIN_USERNAME = os.getenv('LINKEDIN_USERNAME')
LINKEDIN_PASSWORD = os.getenv('LINKEDIN_PASSWORD')
CHROME_DRIVER_PATH = os.getenv('CHROME_DRIVER_PATH')

if not LINKEDIN_USERNAME or not LINKEDIN_PASSWORD:
    raise EnvironmentError("LinkedIn credentials not found. Set LINKEDIN_USERNAME and LINKEDIN_PASSWORD in the .env file.")


def init_driver():
    try:
        driver = webdriver.Chrome()
        logging.info("WebDriver initialized successfully.")
        return driver
    except Exception as e:
        logging.error(f"Failed to initialize WebDriver: {e}")
        raise

def login_to_linkedin(driver, username: str, password: str):
    try:
        logging.info("Opening LinkedIn login page.")
        driver.get("https://www.linkedin.com/login")
        time.sleep(2)

        # Enter login credentials
        driver.find_element(By.ID, "username").send_keys(username)
        driver.find_element(By.ID, "password").send_keys(password)
        driver.find_element(By.ID, "password").send_keys(Keys.RETURN)

        time.sleep(3)  # Allow time for login to complete
        logging.info("Login successful.")
    except NoSuchElementException as e:
        logging.error(f"Login failed: {e}")
        driver.quit()
        raise
    except TimeoutException as e:
        logging.error(f"Page took too long to load: {e}")
        driver.quit()
        raise


def scrape_profile(driver, profile_url: str):
    """Scrape LinkedIn profile data and return extracted information."""
    try:
        logging.info(f"Navigating to profile URL: {profile_url}")
        driver.get(profile_url)
        time.sleep(3)  # Adjust for page load time

        # Parse the page source with BeautifulSoup
        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Extract user's name
        name = soup.find('h1', {'class': 'text-heading-xlarge'}).get_text(strip=True)

        # Extract job title
        job_title = soup.find('div', {'class': 'text-body-medium'}).get_text(strip=True)

        logging.info(f"Extracted data - Name: {name}, Job Title: {job_title}")
        return {
            "name": name,
            "job_title": job_title
        }
    except NoSuchElementException as e:
        logging.error(f"Failed to extract profile data: {e}")
        return None
    except Exception as e:
        logging.error(f"An error occurred during scraping: {e}")
        return None
    
def save_data_to_file(data, filename='linkedin_profile.json'):
    try:
        with open(filename, 'w') as file:
            json.dump(data, file, indent=4)
        logging.info(f"Data saved to {filename}")
    except Exception as e:
        logging.error(f"Failed to save data: {e}")


def scroll_down(driver):
    logging.info("Scrolling down the page to load more content.")
    try:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)  # Adjust to match page load speed
    except Exception as e:
        logging.error(f"Error during scrolling: {e}")


def main():
    driver = None
    try:
        dirver = init_driver()
        login_to_linkedin(driver, LINKEDIN_USERNAME, LINKEDIN_PASSWORD)

        profile_url = "" # put any profile url
        profile_data = scrape_profile(driver, profile_url)

        print(profile_data)

    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
    finally:
        if driver:
            driver.quit()
            logging.info("WebDriver session closed.")


if __name__ == "__main__":
    main()