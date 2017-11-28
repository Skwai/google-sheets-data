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
const sheet = new GoogleSheetsData(sheetId)
const data = await sheet.getData()
```

## How to make a Google Sheet public

### 1. Publish your Google Sheet: `File -> Publish to the Web`

### 2. Get the ID from the share URL for your Google Sheet: `Share -> Get shareable link`

For example this shareable link:

```
https://docs.google.com/spreadsheets/d/1jNWarfCxUCnjby0fKPViY9j5h2XTB4k0InK9OWdd1-s/edit?usp=sharing
```

Would have the ID of:

```
1jNWarfCxUCnjby0fKPViY9j5h2XTB4k0InK9OWdd1-s
```
