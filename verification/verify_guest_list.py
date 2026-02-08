from playwright.sync_api import sync_playwright, expect

def verify_guest_list():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to login page...")
        page.goto("http://localhost:3000")

        # Login
        print("Logging in...")
        page.fill('input[type="password"]', "haninge26")
        page.click('button:has-text("Unlock Platform")')

        # Wait for dashboard
        print("Waiting for dashboard...")
        page.wait_for_selector("text=Days To Go")

        # Navigate to Guest List
        print("Navigating to Guest List...")
        page.click("button:has-text('Guest List')") # Should work if text is visible

        # Verify Guest List View
        expect(page.locator("h2:has-text('Guest List')")).to_be_visible()
        expect(page.locator("text=Bride's Side")).to_be_visible()
        expect(page.locator("text=Groom's Side")).to_be_visible()

        # Add Guest to Bride's Side
        print("Adding guest to Bride's Side...")
        # Finding the first "Add Guest" button (which should be Bride's side due to order)
        # Or better, find the column first
        # Bride's side is first in the list
        page.locator("text=Bride's Side").locator("xpath=../..").get_by_role("button", name="Add Guest").click()

        # Fill in details for first guest
        # Inputs are generic, so we need to scope them
        # Wait for input to appear
        page.wait_for_selector("input[placeholder='First Name']")

        # Fill Alice
        page.locator("text=Bride's Side").locator("xpath=../..").locator("input[placeholder='First Name']").first.fill("Alice")
        page.locator("text=Bride's Side").locator("xpath=../..").locator("input[placeholder='Last Name']").first.fill("Wonderland")

        # Add Guest to Groom's Side
        print("Adding guest to Groom's Side...")
        page.locator("text=Groom's Side").locator("xpath=../..").get_by_role("button", name="Add Guest").click()

        # Fill Bob
        page.locator("text=Groom's Side").locator("xpath=../..").locator("input[placeholder='First Name']").first.fill("Bob")
        page.locator("text=Groom's Side").locator("xpath=../..").locator("input[placeholder='Last Name']").first.fill("Builder")

        # Verify Search
        print("Verifying Search...")
        page.fill("input[placeholder='Search...']", "Alice")

        # Alice should be visible, Bob should not
        # wait for filtering
        page.wait_for_timeout(500)

        if page.is_visible("input[value='Alice']"):
            print("Alice found!")
        else:
            print("Alice NOT found!")

        if not page.is_visible("input[value='Bob']"):
            print("Bob filtered out!")
        else:
            print("Bob NOT filtered out!")

        # Clear search to show both
        page.fill("input[placeholder='Search...']", "")
        page.wait_for_timeout(500)

        # Take screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/guest_list_verification.png")

        print("Verification complete!")
        browser.close()

if __name__ == "__main__":
    verify_guest_list()
