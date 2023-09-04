import { CentPrecisionMoney, HighPrecisionMoney } from '@commercetools/platform-sdk';
import { getPrice } from '../../../app/utils/price/price';

describe('Money formatting tests', () => {
  test('CentPrecisionMoney formatting test', () => {
    const money: CentPrecisionMoney = {
      type: 'centPrecision',
      centAmount: 20000,
      currencyCode: 'USD',
      fractionDigits: 2,
    };

    expect(getPrice(money)).toEqual('$200.00');
  });
  test('HighPrecisionMoney formatting test', () => {
    const money: HighPrecisionMoney = {
      type: 'highPrecision',
      centAmount: 20000,
      preciseAmount: 123456789,
      currencyCode: 'USD',
      fractionDigits: 4,
    };

    expect(getPrice(money)).toEqual('$12,345.6789');
  });
});
