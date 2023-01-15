import { boringAtom } from '@/components/AssetTracker/BoringTracker';
import { useAtom } from 'jotai';
import { round } from 'lodash';

export function calculatePortfolioValue() {
  const [boring] = useAtom(boringAtom);

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

export function totalPortfolioValue() {
  const [boring] = useAtom(boringAtom);

  return round(
    boring.reduce(
      (total, b) => (total += parseFloat(b.quantity) * (b.open || parseFloat(b.price))),
      0
    ) * 1.35,
    2
  );
}
