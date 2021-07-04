import { mapValues } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import parser from 'fast-xml-parser'

export default async function rates(req: NextApiRequest, res: NextApiResponse) {
  const base = req.query.base as string | undefined
  const response = await fetch(
    'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
  )
  const xml = await response.text()
  const json = await parser.parse(xml, {
    attributeNamePrefix: '',
    ignoreAttributes: false,
  })
  const data = (
    json['gesmes:Envelope'].Cube.Cube.Cube.map(
      ({ currency, rate }: { currency: string; rate: string }) => ({
        currency,
        rate: parseFloat(rate),
      }),
    ) as { currency: string; rate: number }[]
  ).reduce((obj, { currency, rate }) => {
    // eslint-disable-next-line no-param-reassign
    obj[currency] = rate
    return obj
  }, {} as { [currency: string]: number })
  res.json(base ? mapValues(data, (rate) => rate / data[base]) : data)
}
