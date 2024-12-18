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

# --- Helper Functions ---

def init_driver():
    """Initialize the Selenium WebDriver."""
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

        # Enter login credentials
        driver.find_element(By.ID, "username").send_keys(username)
        driver.find_element(By.ID, "password").send_keys(password)
        driver.find_element(By.ID, "password").send_keys(Keys.RETURN)
        logging.info("Login successful.")
    except NoSuchElementException as e:
        logging.error(f"Login failed: {e}")
        driver.quit()
        raise
    except TimeoutException as e:
        logging.error(f"Page took too long to load: {e}")
        driver.quit()
        raise

def scroll_down(driver, scroll_pause_time=0.1, step=100):
    logging.info("Smoothly scrolling down the page to load more content.")
    try:
        # Get the total height of the document
        total_height = driver.execute_script("return document.body.scrollHeight")
        current_position = 0

        # Scroll incrementally
        while current_position < total_height:
            current_position += step
            driver.execute_script(f"window.scrollTo(0, {current_position});")
            time.sleep(scroll_pause_time)
        
        # Ensure the final scroll to the bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    except Exception as e:
        logging.error(f"Error during smooth scrolling: {e}")

def scrape_profile_skills(driver, profile_url: str) -> list[str]:
    try:
        # Navigate to the skills section of the profile
        skill_url = f"{profile_url}details/skills"
        logging.info(f"Navigating to profile skills section: {skill_url}")
        driver.get(skill_url)
        time.sleep(1)
        # Scroll to ensure full page load
        scroll_down(driver)


        soup = BeautifulSoup(driver.page_source, 'html.parser')
        time.sleep(1)
        # Find all skill anchors
        skill_anchors = soup.find_all('a', {'data-field': 'skill_page_skill_topic'})
        logging.info(f"Found {len(skill_anchors)} skill anchors.")

        # Extract skills from spans within anchors
        skills = []
        for anchor in skill_anchors:
            spans = anchor.find_all('span')
            if spans:
                skill = spans[0].get_text(strip=True)
                if skill:
                    skills.append(skill)

        logging.info(f"Extracted {len(skills)} skills: {skills}")
        return skills
    except NoSuchElementException as e:
        logging.error(f"No such element found: {e}")
        return []
    except Exception as e:
        logging.exception(f"An error occurred during skill scraping: {e}")
        return []


def scrape_profile_education(driver, profile_url: str):
    try:
        # Navigate to the skills section of the profile
        education_url = f"{profile_url}details/education"
        logging.info(f"Navigating to profile Education section: {education_url}")
        driver.get(education_url)
        time.sleep(1)
        # Scroll to ensure full page load
        scroll_down(driver)

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        time.sleep(1)
        # Find all education anchors
        main_section = soup.find('main')
        education_anchors = main_section.find_all('a', {'class': 'optional-action-target-wrapper display-flex flex-column full-width'})
        logging.info(f"Found {len(education_anchors)} skill anchors.")

        # Extract educations from spans within anchors
        education_details = []
        for anchor in education_anchors:
            # Find all relevant <span> tags
            spans = anchor.find_all('span', {'aria-hidden': 'true'})

            # Skip if no relevant spans are found
            if not spans or len(spans) < 3:
                continue

            # Extract information from the spans
            school = spans[0].get_text(strip=True) if len(spans) > 0 else None
            degree = spans[1].get_text(strip=True) if len(spans) > 1 else None
            duration = spans[2].get_text(strip=True) if len(spans) > 2 else None

            if (" - " not in duration) and duration:
                duration += " - Present"

            # Create a dictionary for the current entry
            education_entry = {
                "School": school,
                "Degree": degree,
                "Duration": duration,
            }

            # Add to the education details list
            education_details.append(education_entry)
        return education_details
    except NoSuchElementException as e:
        logging.error(f"No such element found: {e}")
        return []
    except Exception as e:
        logging.exception(f"An error occurred during skill scraping: {e}")
        return []


def scrape_profile_experiences(driver, profile_url: str):
    try:
        # Navigate to the experience section of the profile
        experience_url = f"{profile_url}details/experience"
        logging.info(f"Navigating to profile Education section: {experience_url}")
        driver.get(experience_url)
        time.sleep(1)
        # Scroll to ensure full page load
        scroll_down(driver)

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        time.sleep(1)
        main_section = soup.find('main')
        # Find all experience divs
        experience_divs = main_section.find_all('div', {'data-view-name': 'profile-component-entity'})
        logging.info(f"Found {len(experience_divs)} skill anchors.")

        experiences = []

        # Extract experience from spans within anchors
        for parent_div in experience_divs:
            child_divs = parent_div.find_all('div')
            child_div = child_divs[3]
            
            experience_title = child_div.find("div", class_="display-flex align-items-center mr1 t-bold").find("span").text.strip()
            experience_company = (
                child_div.find('span', {'class': 't-14 t-normal'})
                .find('span', {'aria-hidden': 'true'}) 
                .text.strip() if child_div.find('span', {'class': 't-14 t-normal'}) else ''
            )

            experience_details = [
                span.find('span', {'aria-hidden': 'true'}).text.strip()
                for span in child_div.find_all('span', {'class': 't-14 t-normal t-black--light'})
                if span.find('span', {'aria-hidden': 'true'})
            ]

            experience_duration = experience_details[0]
            experience_place = experience_details[1]

            if (" - " not in experience_duration) and experience_duration:
                experience_duration += " - Present"

            experience_entry = {
                "Title": experience_title,
                "Company": experience_company,
                "Duration": experience_duration,
                "Location": experience_place
            }
            experiences.append(experience_entry)
        return experiences
    except NoSuchElementException as e:
        logging.error(f"No such element found: {e}")
        return []
    except Exception as e:
        logging.exception(f"An error occurred during skill scraping: {e}")
        return []


def scrape_profile_contacts(driver, profile_url: str):
    try:
        # Navigate to the skills section of the profile
        contact_url = f"{profile_url}overlay/contact-info/"
        logging.info(f"Navigating to profile contact section: {contact_url}")
        driver.get(contact_url)
        time.sleep(1)
        # Scroll to ensure full page load
        scroll_down(driver)

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        time.sleep(1)

        sections = soup.find_all('section', {'class': 'pv-contact-info__contact-type'})

        email, phone, birth_date = None, None, None
        for section in sections:
            # Check for email (looking for mail icon)
            email_svg = section.find('svg', {'class': 'pv-contact-info__contact-icon', 'data-test-icon': 'envelope-medium'})
            if email_svg:
                email_link = section.find('a', href=True)
                if email_link:
                    email = email_link['href'].replace('mailto:', '')

            # Check for phone (looking for phone icon)
            phone_svg = section.find('svg', {'class': 'pv-contact-info__contact-icon', 'data-test-icon': 'phone-handset-medium'})
            if phone_svg:
                phone_span = section.find('span', {'class': 't-14 t-black t-normal'})
                if phone_span:
                    phone = phone_span.text.strip()
            # Check for birth date (looking for calendar icon)
            calendar_svg = section.find('svg', {'class': 'pv-contact-info__contact-icon', 'data-test-icon': 'calendar-medium'})
            if calendar_svg:
                birth_date_span = section.find('span', {'class': 't-14 t-black t-normal'})
                if birth_date_span:
                    birth_date = birth_date_span.text.strip()

        return email, phone, birth_date
    except NoSuchElementException as e:
        logging.error(f"No such element found: {e}")
        return []
    except Exception as e:
        logging.exception(f"An error occurred during skill scraping: {e}")
        return []
    

def scrape_profile(profile_url: str):
    """Scrape LinkedIn profile data and return extracted information."""
    profile_data = {
        "name": None,
        "email": None,
        "phone": None,
        "birth_date": None,
        "headline": None,
        "about": None,
        "skills": [],
        "education": [],
        "experiences": []
    }

    try:
        driver = init_driver()
        login_to_linkedin(driver, LINKEDIN_USERNAME, LINKEDIN_PASSWORD)
        logging.info(f"Navigating to profile URL: {profile_url}")
        driver.get(profile_url)
        scroll_down(driver)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        time.sleep(3)

        # Extract user's name
        try:
            profile_data["name"] = soup.find('h1', {'class': 'break-words'}).get_text(strip=True)
            logging.info("User name extracted")
        except Exception as e:
            logging.warning(f"Failed to extract name: {e}")

        # Extract job title
        try:
            profile_data["headline"] = soup.find('div', {'class': 'text-body-medium break-words'}).get_text(strip=True)
            logging.info("User headline extracted")
        except Exception as e:
            logging.warning(f"Failed to extract headline: {e}")

        # Extract abstract
        try:
            about_section = soup.find_all('section', {'class': 'pv-profile-card'})
            if about_section:
                filtered_sections = [
                    section for section in about_section
                    if section.find('div', class_='pv-profile-card__anchor', id='about')
                ]

                spans = []
                for section in filtered_sections:
                    spans.extend(section.find_all('span'))

                profile_data["about"] = spans[2].text.strip() if spans else ""
            logging.info("User about section extracted")
        except Exception as e:
            logging.warning(f"Failed to extract about section: {e}")

        # Extract skills
        try:
            profile_data["skills"] = scrape_profile_skills(driver, profile_url)
            logging.info("User skills extracted")
        except Exception as e:
            logging.warning(f"Failed to extract skills: {e}")

        # Extract education
        try:
            profile_data["education"] = scrape_profile_education(driver, profile_url)
            logging.info("User education extracted")
        except Exception as e:
            logging.warning(f"Failed to extract education: {e}")

        # Extract experiences
        try:
            profile_data["experiences"] = scrape_profile_experiences(driver, profile_url)
            logging.info("User experiences extracted")
        except Exception as e:
            logging.warning(f"Failed to extract experiences: {e}")

        # Extract contacts
        try:
            profile_data["email"], profile_data["phone"], profile_data["birth_date"] = scrape_profile_contacts(driver, profile_url)
            logging.info("User contact information extracted")
        except Exception as e:
            logging.warning(f"Failed to extract contact information: {e}")

    except Exception as e:
        logging.error(f"An error occurred during profile scraping: {e}")

    return profile_data
