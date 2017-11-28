const GOOGLE_SHEETS_URL = 'https://spreadsheets.google.com/feeds/list/%s/od6/public/values?alt=json'
const COL_PREFIX = 'gsx$'

/**
 * Class representing a Google Sheet
 */
export default class GoogleSheetsData {
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
  async getData () {
    const data = await GoogleSheetsData.fetchSheetData(this.sheetId)
    return GoogleSheetsData.mapRows(data.feed.entry)
  }

  /**
   * Format an array of rows
   * @param {Array} rows The raw rows from the sheet
   * @return {Array} The formatted row data
   */
  static mapRows(rows) {
    return rows.map(GoogleSheetsData.mapRow)
  }

  /**
   * Format a single sheet row
   * @param {Object} row A single raw row from the sheet
   * @return {Object} The formatted array with the sheet column name of each property as the key
   */
  static mapRow(row) {
    const keys = GoogleSheetsData.getRowKeys(row)
    return keys.reduce((obj, k) => {
        const key = GoogleSheetsData.stripColumnPrefix(k)
        return Object.assign({
          ...obj,
          [key]: row[k].$t
        })
      }, {})
  }

  /**
   * Sanitize a column name by stripping the Google Sheets prefix
   * @param {String} str
   * @return {String}
   */
  static stripColumnPrefix(str) {
    return str.replace(COL_PREFIX, '')
  }

  /**
   * Get the column keys of a sheet row
   * @return {Array} Array of column keys
   */
  static getRowKeys(row) {
    return Object.keys(row)
      .filter(k => k.includes(COL_PREFIX))
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
