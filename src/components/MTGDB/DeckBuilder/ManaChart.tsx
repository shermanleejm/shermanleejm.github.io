import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { MTGTypesEnum } from '../interfaces';
import { ManaDataInterface } from './DeckList';

const CREATURE_COLOR = '#70ae98';
const INSTANT_COLOR = '#6eb5ff';
const SORCERY_COLOR = '#a02c2d';
const ARTIFACT_COLOR = '#9e6b55';
const ENCHANTMENT_COLOR = '#f2cf59';

const TypeColors = [
  { dataKey: MTGTypesEnum.CREATURE, color: CREATURE_COLOR },
  { dataKey: MTGTypesEnum.INSTANT, color: INSTANT_COLOR },
  { dataKey: MTGTypesEnum.SORCERY, color: SORCERY_COLOR },
  { dataKey: MTGTypesEnum.ARTIFACT, color: ARTIFACT_COLOR },
  { dataKey: MTGTypesEnum.ENCHANTMENT, color: ENCHANTMENT_COLOR },
];

interface ManaChartInterface {
  data: ManaDataInterface[];
}

const ManaChart = (props: ManaChartInterface) => {
  return (
    <div style={{ margin: '0 auto', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={props.data}>
          <XAxis dataKey="cmc" />
          <Tooltip />
          <Legend height={40} />
          {TypeColors.map((t) => (
            <Bar dataKey={t.dataKey} stackId={'a'} fill={t.color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ManaChart;
