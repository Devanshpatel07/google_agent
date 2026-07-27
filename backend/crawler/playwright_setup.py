import asyncio
import sys
from playwright.async_api import async_playwright
import logging

logger = logging.getLogger(__name__)

# THE CRITICAL WINDOWS FIX
def setup_windows_event_loop():
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        logger.info("Windows Proactor Event Loop Policy set for Playwright compatibility.")

async def fetch_html(url: str) -> str:
    # Ensure policy is set before we create Playwright subprocesses
    setup_windows_event_loop()
    
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=30000)
            html = await page.content()
            await browser.close()
            return html
    except Exception as e:
        logger.error(f"Error fetching HTML for {url}: {str(e)}")
        raise
