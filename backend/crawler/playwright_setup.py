import asyncio
import sys
import logging
import aiohttp
from playwright.async_api import async_playwright

logger = logging.getLogger(__name__)

def setup_windows_event_loop():
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
        logger.info("Windows Proactor Event Loop Policy set for Playwright compatibility.")

async def fetch_html(url: str) -> str:
    setup_windows_event_loop()
    
    # Try Playwright first with a fast 8-second domcontentloaded timeout
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(url, wait_until="domcontentloaded", timeout=8000)
            html = await page.content()
            await browser.close()
            return html
    except Exception as e:
        logger.warning(f"Playwright timed out or failed for {url}, using fast HTTP fallback: {e}")
        # Fast fallback via aiohttp
        try:
            async with aiohttp.ClientSession() as session:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
                async with session.get(url, timeout=5, headers=headers) as resp:
                    return await resp.text()
        except Exception as http_err:
            logger.error(f"HTTP fallback error for {url}: {http_err}")
            raise Exception(f"Failed to fetch webpage content: {http_err}")
