'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const GOOGLE_SHEETS_URL = 'https://spreadsheets.google.com/feeds/list/%s/od6/public/values?alt=json';
const COL_PREFIX = 'gsx$';

/**
 * Class representing a Google Sheet
 */
class Sheet {

  /**
   * Create a Google Sheet
   * @param {String} sheetId 
   */
  constructor(sheetId) {
    this.sheetId = null;

    if (!sheetId) {
      throw Error('You must pass a `sheetId` to `Sheet` class constructor');
    }
    Object.assign(this, { sheetId });
  }

  /**
   * @return {Promise}
   */
  getData() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const data = yield Sheet.fetchSheetData(_this.sheetId);
      return Sheet.mapRows(data.feed.entry);
    })();
  }

  static mapRows(rows) {
    return rows.map(Sheet.mapRow);
  }

  static mapRow(row) {
    return Object.keys(row).filter(k => k.includes(COL_PREFIX)).reduce((obj, k) => {
      // strip prefix from key
      const key = k.replace(COL_PREFIX, '');
      return Object.assign(_extends({}, obj, {
        [key]: row[k].$t
      }));
    }, {});
  }

  /**
   * @param {String} sheetId The ID of the Google Sheet
   * @return {Promise.<Object>} The Google Sheet data
   */
  static fetchSheetData(sheetId) {
    return _asyncToGenerator(function* () {
      const url = GOOGLE_SHEETS_URL.replace('%s', sheetId);
      const response = yield fetch(url, {
        mode: 'cors'
      });
      return yield response.json();
    })();
  }
}

window.Sheet = Sheet;

exports.default = Sheet;

//# sourceMappingURL=index.js.map