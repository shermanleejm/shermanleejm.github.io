import { Boring } from '@/components/AssetTracker/BoringTracker';
import { round } from 'lodash';

export function calculatePortfolioValue(boring: Boring[]) {
  let totalMarketValue = boring.reduce(
    (total, b) => (total += parseFloat(b.quantity) * parseFloat(b.price)),
    0
  );

  return boring.reduce((total, item) => {
    let price = parseFloat(item.price);
    let quantity = parseFloat(item.quantity);
    let weight = (price * quantity) / totalMarketValue;
    let delta = (item.open || price) - price;
    return round(total + weight * delta, 2);
  }, 0);
}
