# Google Sheets Data

A library to read data out of a public Google Sheet Document

## Installation

```
$ yarn add google-sheets-data
```

## Usage

```javascript
import GoogleSheetsData from 'google-sheets-data'

const sheetId = '1jNWarfCxUCnjby0fKPViY9j5h2XTB4k0InK9OWdd1-s'
const sheet = new Sheet(sheetId)
const data = await sheet.getData()
```
