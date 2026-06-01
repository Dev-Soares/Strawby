import axios from 'axios'
import XLSX from 'xlsx'

const CIQUAL_URL = 'https://ciqual.anses.fr/cms/sites/default/files/inline-files/Table%20Ciqual%202020_ENG_2020%2007%2007.xls'

async function main() {
console.log('Downloading...')
const resp = await axios.get(CIQUAL_URL, { responseType: 'arraybuffer', timeout: 120000 })
console.log('Downloaded', resp.data.byteLength, 'bytes')

const wb = XLSX.read(Buffer.from(resp.data), { type: 'buffer' })
console.log('Sheets:', wb.SheetNames)

for (const sn of wb.SheetNames) {
  const rows: Record<string,any>[] = XLSX.utils.sheet_to_json(wb.Sheets[sn], { defval: '' })
  console.log(`\nSheet "${sn}": ${rows.length} rows`)
  if (rows.length === 0) continue
  const headers = Object.keys(rows[0])
  console.log('Headers:', headers.join(' | '))
  console.log('Row[1]:', JSON.stringify(rows[1]).slice(0, 600))
}
}
main().catch(console.error)
