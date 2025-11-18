/**
 * Google Apps Script for Wedding RSVP Form
 *
 * NOTE: This must be JavaScript (.js), not TypeScript, because Google Apps Script
 * only supports JavaScript. Copy this code as-is into the Google Apps Script editor.
 *
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Replace 'YOUR_SHEET_ID' with your Google Sheet ID
 * 5. Deploy as a web app:
 *    - Click "Deploy" > "New deployment"
 *    - Choose "Web app" as the type
 *    - Set "Execute as" to "Me"
 *    - Set "Who has access" to "Anyone"
 *    - Click "Deploy"
 * 6. Copy the Web App URL and use it in your React app
 */

// Replace this with your Google Sheet ID
// You can find it in the URL: https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
/** @type {string} */
const SHEET_ID = "YOUR_SHEET_ID"

// Sheet name (tab name) where data will be written
/** @type {string} */
const SHEET_NAME = "RSVPs"

/**
 * Handles GET requests - useful for testing if the script is deployed correctly
 * @param {GoogleAppsScript.Events.DoGet} e - The event object
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response
 */
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      success: true,
      message: "Google Apps Script is deployed and accessible",
      timestamp: new Date().toISOString(),
    })
  ).setMimeType(ContentService.MimeType.JSON)
}

/**
 * Handles POST requests from the RSVP form
 * @param {GoogleAppsScript.Events.DoPost} e - The event object containing POST data
 * @returns {GoogleAppsScript.Content.TextOutput} JSON response with success/error status
 */
function doPost(e) {
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents)

    // Validate required fields
    if (!data.name || !data.email) {
      return ContentService.createTextOutput(
        JSON.stringify({ success: false, error: "Name and email are required" })
      ).setMimeType(ContentService.MimeType.JSON)
    }

    // Open the spreadsheet
    let sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)

    // If the sheet doesn't exist, create it with headers
    if (!sheet) {
      sheet = SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME)
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Attending",
        "Number of Guests",
        "Dietary Restrictions",
        "Message",
      ])
    }

    // Append the new row
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name,
      data.email,
      data.attending,
      data.guests,
      data.dietaryRestrictions || "",
      data.message || "",
    ])

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "RSVP submitted successfully" })
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

/**
 * Optional: Test function to verify the script works
 * Run this from the Apps Script editor to test the doPost function
 * @returns {void}
 */
function test() {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    attending: "yes",
    guests: 2,
    dietaryRestrictions: "Vegetarian",
    message: "Test message",
    timestamp: new Date().toISOString(),
  }

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData),
    },
  }

  const result = doPost(mockEvent)
  Logger.log(result.getContent())
}
