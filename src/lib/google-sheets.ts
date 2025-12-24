import { google } from 'googleapis';

export const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    ['https://www.googleapis.com/auth/spreadsheets']
);

export const sheets = google.sheets({ version: 'v4', auth });

export async function getLeads() {
    try {
        console.log('Attempting to fetch leads from Google Sheets...');
        console.log('Service Account:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
        console.log('Sheet ID:', process.env.GOOGLE_SHEET_ID);

        // Try English default name first
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Form_Responses 1!A2:E',
            });
            console.log('Data fetched successfully (English sheet name). Rows:', response.data.values?.length || 0);
            return response.data.values || [];
        } catch (englishError: any) {
            console.warn('Failed to fetch from "Form_Responses 1". Trying Spanish name "Respuestas de formulario 1"...');

            // Try Spanish default name
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Respuestas de formulario 1!A2:E',
            });
            console.log('Data fetched successfully (Spanish sheet name). Rows:', response.data.values?.length || 0);
            return response.data.values || [];
        }

    } catch (error: any) {
        console.error('CRITICAL ERROR fetching leads:', error.message);
        if (error.code === 403) console.error('Hint: The Service Account might not have access to this Sheet. Share the sheet with:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
        if (error.code === 404) console.error('Hint: Spreadsheet ID might be wrong.');
        return [];
    }
}
