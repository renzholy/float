const numberFormat = Intl.NumberFormat()

export function formatNumber(num: number, precision = 6) {
  return Number.isNaN(num)
    ? '-'
    : numberFormat.format(parseFloat(num.toPrecision(precision)))
}
