import { boringAtom } from '@/components/AssetTracker/BoringTracker';
import { useAtom } from 'jotai';
import { round } from 'lodash';

export function calculatePortfolioValue() {
  const [boring] = useAtom(boringAtom);

  let totalMarketValue = boring.equities.reduce(
    (total, b) => (total += parseFloat(b.quantity) * parseFloat(b.price)),
    0
  );

  const equitiesValue =
    boring.equities.reduce((total, item) => {
      let price = parseFloat(item.price);
      let quantity = parseFloat(item.quantity);
      let weight = (price * quantity) / totalMarketValue;
      let delta = (item.open || price) - price;
      return total + weight * delta;
    }, 0) / boring.equities.length;

  const bondsValue = boring.bonds.reduce((total, curr) => total + curr.interestRate, 0);

  return round(equitiesValue + bondsValue, 2);
}

export function totalPortfolioValue() {
  const [boring] = useAtom(boringAtom);

  const equitiesValue = boring.equities.reduce(
    (total, b) => (total += parseFloat(b.quantity) * (b.open || parseFloat(b.price))),
    0
  );

  const bondsValue = boring.bonds.reduce(
    (total, curr) => (total += curr.amount * (curr.interestRate / 100 + 1)),
    0
  );

  return round(equitiesValue * 1.35 + bondsValue, 2);
}
