import { TypedMoney } from '@commercetools/platform-sdk';
import { Store } from '../../enums/store';

export function getPrice(money: TypedMoney): string {
  const value = money.type === 'centPrecision' ? money.centAmount : money.preciseAmount;

  return new Intl.NumberFormat(Store.Language, {
    style: 'currency',
    currency: money.currencyCode,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: money.fractionDigits,
  }).format(value / 10 ** money.fractionDigits);
}
