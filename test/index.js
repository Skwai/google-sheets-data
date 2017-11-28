import { expect } from 'chai'
import fetchMock from 'fetch-mock'
import GoogleSheetsData from '../src'

describe('GoogleSheetsData', () => {
  describe('#constructor', () => {
    it('sets the sheetId on the class instance', () => {
      const sheet = new GoogleSheetsData('foo')
      expect(sheet.sheetId).to.equal('foo')
    })

    it('throws an error if no sheetId is passed to class instance', () => {
      expect(() => new GoogleSheetsData()).to.throw(Error)
    })
  })

  describe('#getRowKeys', () => {
    it('returns the matched keys of a sheet row', () => {
      const row = {
        state: 'Should not be returned',
        gsx$state: 'Should be returned'
      }
      expect(GoogleSheetsData.getRowKeys(row)).to.deep.equal(['gsx$state'])
    })
  })

  describe('#stripColumnPrefix', () => {
    it('returns a string with the prefix removed if there is one', () => {
      expect(GoogleSheetsData.stripColumnPrefix('gsx$foo')).to.equal('foo')
      expect(GoogleSheetsData.stripColumnPrefix('foo')).to.equal('foo')
    })
  })

  describe('#stripColumnPrefix', () => {
    it('returns a string with the prefix removed if there is one', () => {
      expect(GoogleSheetsData.stripColumnPrefix('gsx$foo')).to.equal('foo')
      expect(GoogleSheetsData.stripColumnPrefix('foo')).to.equal('foo')
    })
  })

  describe('#mapRow', () => {
    it('returns a an object with the sheet columns as property names', () => {
      const row = {
        id: {
          $t: 'test'
        },
        gsx$state: {
          $t: 'Tasmania'
        },
        gsx$population: {
          $t: '519,800'
        },
        gsx$percent: {
          $t: '2.15%'
        },
        gsx$capital: {
          $t: 'Hobart'
        }
      }

      expect(GoogleSheetsData.mapRow(row)).to.deep.equal({
        state: 'Tasmania',
        population: '519,800',
        percent: '2.15%',
        capital: 'Hobart'
      })
    })
  })

  describe('#fetchSheetData', () => {
    fetchMock.get('*', { feed: { foo: 'bar' } })

    it('returns a promise with the data from the Google API', async () => {
      const data = await GoogleSheetsData.fetchSheetData('test')
      expect(data).to.deep.equal({ feed: { foo: 'bar' } })
      fetchMock.restore()
    })
  })

  describe('#getData', () => {
    const data = {
      feed: {
        entry: [{
          id: {
            $t: 'test'
          },
          gsx$state: {
            $t: 'Tasmania'
          },
          gsx$population: {
            $t: '519,800'
          },
          gsx$percent: {
            $t: '2.15%'
          },
          gsx$capital: {
            $t: 'Hobart'
          }
        },
        {
          id: {
            $t: 'test'
          },
          gsx$state: {
            $t: 'Victoria'
          },
          gsx$population: {
            $t: '6,039,100'
          },
          gsx$percent: {
            $t: '25.19%'
          },
          gsx$capital: {
            $t: 'Melbourne'
          }
        }]
      }
    }

    beforeEach(() => fetchMock.get('*', data))
    afterEach(() => fetchMock.restore())

    it('returns a promise with the formatted rows', async () => {
      const sheet = new GoogleSheetsData('test')
      const rows = await sheet.getData()
      expect(rows).to.have.lengthOf(2)
    })
  })
})
