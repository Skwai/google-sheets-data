const GOOGLE_SHEETS_URL = 'https://spreadsheets.google.com/feeds/list/%s/od6/public/values?alt=json'
const PROP_PREFIX = 'gsx$'

/**
 * Class representing a Google Sheet
 */
class Sheet {
  sheetId = null

  /**
   * Create a Google Sheet
   * @param {String} sheetId 
   */
  constructor (sheetId) {
    if (!sheetId) {
      throw Error('You must pass a `sheetId` to `Sheet` class constructor')
    }
    Object.assign(this, { sheetId })
  }

  /**
   * @return {Promise}
   */
  async getData () {
    const data = await Sheet.fetchSheetData(this.sheetId)
    console.log(data)
    // const rows = Sheet.mapRows(data.feed.entry)
  }

  static mapRows(rows) {
    return rows.map(Sheet.mapRow)
  }

  static mapRow(row) {
    const keys = Object.keys(row).filter(k => k.includes(PROP_PREFIX))
  }

  /**
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

window.Sheet = Sheet

export default Sheet