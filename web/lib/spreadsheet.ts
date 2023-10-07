import { google } from 'googleapis'
import { Awaitable } from 'next-auth'


async function _getAuth() {
    const auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        keyFile: 'service-account.json'
    })
    return auth
}

let auth: Awaited<ReturnType<typeof _getAuth>> | null = null

export async function getAuth() {
    if (auth === null) {
        auth = await _getAuth()
    }
    return auth
}

export async function getSpreedsheet() {
    const auth = await getAuth()
    const sheets = google.sheets({
        version: 'v4', auth: auth
    });

    return sheets
}

export function getSheetId() {
    return process.env.SHEET_ID!
}

export async function getRange(range: string) {
    const sheets = await getSpreedsheet()
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: getSheetId(),
        range: range
    })
    return res.data
}