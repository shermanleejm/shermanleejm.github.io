import { useSelector } from 'react-redux';
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { State } from '../../../state/reducers';
import { MTGTypesEnum } from '../interfaces';
import { ManaDataInterface } from './DeckList';

const CREATURE_COLOR = '#70ae98';
const INSTANT_COLOR = '#6eb5ff';
const SORCERY_COLOR = '#a02c2d';
const ARTIFACT_COLOR = '#9e6b55';
const ENCHANTMENT_COLOR = '#f2cf59';
const PLANESWALKER_COLOR = '#7B6688';
const LAND_COLOR = '#E98125';

const TypeColors = [
  { dataKey: MTGTypesEnum.CREATURE, color: CREATURE_COLOR },
  { dataKey: MTGTypesEnum.INSTANT, color: INSTANT_COLOR },
  { dataKey: MTGTypesEnum.SORCERY, color: SORCERY_COLOR },
  { dataKey: MTGTypesEnum.ARTIFACT, color: ARTIFACT_COLOR },
  { dataKey: MTGTypesEnum.ENCHANTMENT, color: ENCHANTMENT_COLOR },
  { dataKey: MTGTypesEnum.PLANESWALKER, color: PLANESWALKER_COLOR },
  { dataKey: MTGTypesEnum.LAND, color: LAND_COLOR },
];

interface ManaChartInterface {
  data: ManaDataInterface[];
}

const ManaChart = (props: ManaChartInterface) => {
  const dm = useSelector((state: State) => state.darkMode);
  return (
    <div style={{ margin: 'auto', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={props.data} margin={{ top: 30, bottom: 30 }}>
          <XAxis dataKey="cmc" />
          <Tooltip />
          <Legend height={40} />
          {TypeColors.map((t, i) => (
            <Bar
              dataKey={t.dataKey}
              stackId={'a'}
              fill={t.color}
              key={i}
              label={{ position: 'top', offset: 1, fill: dm ? 'white' : 'black' }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ManaChart;
