const GOOGLE_SHEETS_URL = 'https://spreadsheets.google.com/feeds/list/%s/od6/public/values?alt=json'
const COL_PREFIX = 'gsx$'

/**
 * Class representing a Google Sheet
 */
class GoogleSheetData {
  sheetId = null

  /**
   * Create a Google Sheet
   * @param {String} sheetId 
   */
  constructor (sheetId) {
    if (!sheetId) throw Error('You must supply a `sheetId` to the constructor')
    Object.assign(this, { sheetId })
  }

  /**
   * Get the sheet data and return the rows from it
   * @return {Promise.<Array>} The rows in the sheet
   */
  static async getData () {
    const data = await Sheet.fetchSheetData(this.sheetId)
    return Sheet.mapRows(data.feed.entry)
  }

  /**
   * Format an array of rows
   * @param {Array} rows The raw rows from the sheet
   * @return {Array} The formatted row data
   */
  static mapRows(rows) {
    return rows.map(Sheet.mapRow)
  }

  /**
   * Format a single sheet row
   * @param {Object} row A single raw row from the sheet
   * @return {Object} The formatted array with the sheet column name of each property as the key
   */
  static mapRow(row) {
    return Object.keys(row)
      .filter(k => k.includes(COL_PREFIX))
      .reduce((obj, k) => {
        // strip prefix from key
        const key = k.replace(COL_PREFIX, '')
        return Object.assign({
          ...obj,
          [key]: row[k].$t
        })
      }, {})
  }

  /**
   * Fetch the JSON data from the sheet
   * @param {String} sheetId The ID of the Google Sheet
   * @return {Promise.<Object>} The Google Sheet data
   */
  static async fetchSheetData (sheetId) {
    const url = GOOGLE_SHEETS_URL.replace('%s', sheetId);
    const response = await fetch(url, {
      mode: 'cors'
    })
    return await response.json()
  }
}

window.GoogleSheetData = GoogleSheetData

export default GoogleSheetData