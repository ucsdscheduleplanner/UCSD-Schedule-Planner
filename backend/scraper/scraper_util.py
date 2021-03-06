from selenium import webdriver

from settings import TIMEOUT, DRIVER_PATH


def get_browser():
    # Set up Chrome options for the Selenium webdriver
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    # Directing Python to browser to chrome executable file
    browser = webdriver.Chrome(chrome_options=options, executable_path=DRIVER_PATH)
    browser.set_page_load_timeout(TIMEOUT)
    browser.implicitly_wait(1)
    return browser


class Browser:
    def __init__(self):
        self.browser = None

    def __enter__(self):
        self.browser = get_browser()
        return self.browser

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.browser.quit()
