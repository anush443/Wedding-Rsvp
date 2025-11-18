# Google Sheets Integration Setup

This guide will help you connect your RSVP form to a Google Sheet using Google Apps Script.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Wedding RSVPs"
4. Copy the Sheet ID from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit`
   - Copy the `YOUR_SHEET_ID` part

## Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default `myFunction` code
4. Copy the code from `google-apps-script.js` in this project
5. Paste it into the Apps Script editor
6. Replace `YOUR_SHEET_ID` with your actual Google Sheet ID (from Step 1)

## Step 3: Deploy as Web App

1. In the Apps Script editor, click **"Deploy"** > **"New deployment"**
2. Click the gear icon (⚙️) next to "Select type" and choose **"Web app"**
3. Configure the deployment:
   - **Description**: "Wedding RSVP Form Handler" (or any description)
   - **Execute as**: **"Me"** (your account)
   - **Who has access**: **"Anyone"** (this allows your form to submit data)
4. Click **"Deploy"**
5. You may need to authorize the script:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" > "Go to [Project Name] (unsafe)" if you see a warning
   - Click "Allow"
6. Copy the **Web App URL** - you'll need this for your React app

## Step 4: Configure Your React App

### Option 1: Using Environment Variable (Recommended)

1. Create a `.env` file in the root of your project:

   ```
   VITE_GOOGLE_SHEET_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

2. Replace `YOUR_SCRIPT_ID` with the ID from your Web App URL

3. Restart your development server:
   ```bash
   npm run dev
   ```

### Option 2: Direct Configuration

Update `src/App.tsx`:

```typescript
const googleSheetScriptUrl =
  "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
```

## Step 5: Test Your Integration

1. Start your development server: `npm run dev`
2. Fill out the RSVP form and submit
3. Check your Google Sheet - you should see a new row with the submitted data

## Sheet Structure

The script will automatically create a sheet with the following columns:

| Column               | Description                 |
| -------------------- | --------------------------- |
| Timestamp            | When the RSVP was submitted |
| Name                 | Guest's full name           |
| Email                | Guest's email address       |
| Attending            | "yes" or "no"               |
| Number of Guests     | Total number of guests      |
| Dietary Restrictions | Any dietary requirements    |
| Message              | Optional message from guest |

## Troubleshooting

### "Script function not found" error

- Make sure you've deployed the script as a Web App (not just saved it)
- Verify the Web App URL is correct

### "Access denied" error

- Make sure "Who has access" is set to "Anyone" in the deployment settings
- Re-deploy the script if you changed the access settings

### Data not appearing in sheet

- Check that the Sheet ID is correct in the script
- Verify the sheet name matches (default is "RSVPs")
- Check the Apps Script execution log for errors:
  - In Apps Script editor, go to "Executions" (clock icon) to see logs

### CORS errors

- Google Apps Script Web Apps handle CORS automatically, so this shouldn't be an issue
- If you see CORS errors, make sure you're using the correct Web App URL

## Security Notes

- The Web App URL is public, but only your specific script can write to your sheet
- Consider adding rate limiting or authentication if you're concerned about spam
- You can restrict the script to only accept requests from your domain by modifying the script

## Advanced: Adding Authentication

If you want to add basic authentication, you can modify the script to check for a secret token:

```javascript
const SECRET_TOKEN = "your-secret-token-here"

function doPost(e) {
  const data = JSON.parse(e.postData.contents)

  // Check for authentication token
  if (data.token !== SECRET_TOKEN) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: "Unauthorized" })
    ).setMimeType(ContentService.MimeType.JSON)
  }

  // ... rest of the code
}
```

Then include the token in your React app's fetch request.
