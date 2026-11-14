export function formatCurrency(amount, currencyCode = 'LKR', lkrPerUsd = 300) {
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  if (currencyCode === 'USD') {
    const rate = Number(lkrPerUsd);
    const usdAmount = numericAmount / (Number.isFinite(rate) && rate > 0 ? rate : 300);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  }
  return `Rs. ${Math.round(numericAmount).toLocaleString('en-US')}`;
}

export function formatPrice(amount, currencyCode = 'LKR', lkrPerUsd = 300) {
  return formatCurrency(amount, currencyCode, lkrPerUsd);
}
