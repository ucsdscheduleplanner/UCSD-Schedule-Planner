from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


from settings import TIMEOUT, DRIVER_PATH


def get_browser():
    # Make it so that don't have to load full page for html
    caps = DesiredCapabilities().FIREFOX.copy()
    caps["pageLoadStrategy"] = "eager"

    profile = webdriver.FirefoxProfile()
    profile.set_preference("permissions.default.stylesheet", 2)
    profile.set_preference("permissions.default.image", 2)
    profile.set_preference("javascript.enabled", False)

    # Set up options for the Selenium webdriver
    options = webdriver.FirefoxOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    # Directing Python to browser to chrome executable file
    browser = webdriver.Firefox(firefox_profile=profile, capabilities=caps, firefox_options=options, executable_path=DRIVER_PATH)
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
