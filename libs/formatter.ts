const numberFormat = Intl.NumberFormat([], {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatNumber(num: number) {
  return Number.isNaN(num) ? '-' : numberFormat.format(num)
}
