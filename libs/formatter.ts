const numberFormat = Intl.NumberFormat()

export function formatNumber(num: number) {
  return Number.isNaN(num)
    ? '-'
    : numberFormat.format(parseFloat(num.toPrecision(6)))
}
