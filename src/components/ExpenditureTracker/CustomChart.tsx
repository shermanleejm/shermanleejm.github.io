import { useLiveQuery } from "dexie-react-hooks";
import { useSelector } from "react-redux";
import { State } from "../../state/reducers";
import { ResponsiveSunburst } from "@nivo/sunburst";

interface Inner {
  name: string;
  amount: number;
}

const CustomChart = () => {
  const db = useSelector((state: State) => state.database);
  const data = useLiveQuery(async () => {
    let _data = await db.expenditure.toArray();
    let res = [
      ...new Set(
        _data.filter((item) => !item.is_credit).map((item) => item.category)
      ),
    ].map((val) => ({
      name: val,
      children: _data
        .filter((item) => item.category === val)
        .map((item) => {
          return {
            name: item.name,
            amount: item.amount,
          };
        })
        .reduce((a: any[], c) => {
          let existing: Inner | undefined = a.find(
            (n: Inner) => n.name?.toLowerCase() === c.name.toLowerCase()
          );
          if (existing) {
            existing.amount += Number(c.amount);
          } else {
            a.push(c);
          }
          return a;
        }, []),
    }));

    return res;
  });

  return (
    <div style={{ height: 100 }}>
      <ResponsiveSunburst
        data={{
          name: "nivo",
          color: "hsl(26, 70%, 50%)",
          children: [
            {
              name: "viz",
              color: "hsl(71, 70%, 50%)",
              children: [
                {
                  name: "stack",
                  color: "hsl(34, 70%, 50%)",
                  children: [
                    {
                      name: "cchart",
                      color: "hsl(197, 70%, 50%)",
                      loc: 114925,
                    },
                    {
                      name: "xAxis",
                      color: "hsl(123, 70%, 50%)",
                      loc: 198790,
                    },
                    {
                      name: "yAxis",
                      color: "hsl(23, 70%, 50%)",
                      loc: 172278,
                    },
                    {
                      name: "layers",
                      color: "hsl(355, 70%, 50%)",
                      loc: 103910,
                    },
                  ],
                },
                {
                  name: "ppie",
                  color: "hsl(169, 70%, 50%)",
                  children: [
                    {
                      name: "chart",
                      color: "hsl(202, 70%, 50%)",
                      children: [
                        {
                          name: "pie",
                          color: "hsl(262, 70%, 50%)",
                          children: [
                            {
                              name: "outline",
                              color: "hsl(136, 70%, 50%)",
                              loc: 156128,
                            },
                            {
                              name: "slices",
                              color: "hsl(204, 70%, 50%)",
                              loc: 47713,
                            },
                            {
                              name: "bbox",
                              color: "hsl(101, 70%, 50%)",
                              loc: 14319,
                            },
                          ],
                        },
                        {
                          name: "donut",
                          color: "hsl(107, 70%, 50%)",
                          loc: 2825,
                        },
                        {
                          name: "gauge",
                          color: "hsl(16, 70%, 50%)",
                          loc: 158716,
                        },
                      ],
                    },
                    {
                      name: "legends",
                      color: "hsl(61, 70%, 50%)",
                      loc: 94904,
                    },
                  ],
                },
              ],
            },
            {
              name: "colors",
              color: "hsl(295, 70%, 50%)",
              children: [
                {
                  name: "rgb",
                  color: "hsl(4, 70%, 50%)",
                  loc: 80997,
                },
                {
                  name: "hsl",
                  color: "hsl(291, 70%, 50%)",
                  loc: 34268,
                },
              ],
            },
            {
              name: "utils",
              color: "hsl(164, 70%, 50%)",
              children: [
                {
                  name: "randomize",
                  color: "hsl(97, 70%, 50%)",
                  loc: 137090,
                },
                {
                  name: "resetClock",
                  color: "hsl(10, 70%, 50%)",
                  loc: 3559,
                },
                {
                  name: "noop",
                  color: "hsl(208, 70%, 50%)",
                  loc: 138873,
                },
                {
                  name: "tick",
                  color: "hsl(70, 70%, 50%)",
                  loc: 164492,
                },
                {
                  name: "forceGC",
                  color: "hsl(298, 70%, 50%)",
                  loc: 54399,
                },
                {
                  name: "stackTrace",
                  color: "hsl(315, 70%, 50%)",
                  loc: 31148,
                },
                {
                  name: "dbg",
                  color: "hsl(223, 70%, 50%)",
                  loc: 17836,
                },
              ],
            },
            {
              name: "generators",
              color: "hsl(167, 70%, 50%)",
              children: [
                {
                  name: "address",
                  color: "hsl(72, 70%, 50%)",
                  loc: 18175,
                },
                {
                  name: "city",
                  color: "hsl(39, 70%, 50%)",
                  loc: 6450,
                },
                {
                  name: "animal",
                  color: "hsl(329, 70%, 50%)",
                  loc: 88994,
                },
                {
                  name: "movie",
                  color: "hsl(33, 70%, 50%)",
                  loc: 168439,
                },
                {
                  name: "user",
                  color: "hsl(136, 70%, 50%)",
                  loc: 153892,
                },
              ],
            },
            {
              name: "set",
              color: "hsl(337, 70%, 50%)",
              children: [
                {
                  name: "clone",
                  color: "hsl(355, 70%, 50%)",
                  loc: 27499,
                },
                {
                  name: "intersect",
                  color: "hsl(201, 70%, 50%)",
                  loc: 48798,
                },
                {
                  name: "merge",
                  color: "hsl(255, 70%, 50%)",
                  loc: 86387,
                },
                {
                  name: "reverse",
                  color: "hsl(317, 70%, 50%)",
                  loc: 104306,
                },
                {
                  name: "toArray",
                  color: "hsl(234, 70%, 50%)",
                  loc: 191497,
                },
                {
                  name: "toObject",
                  color: "hsl(0, 70%, 50%)",
                  loc: 154527,
                },
                {
                  name: "fromCSV",
                  color: "hsl(262, 70%, 50%)",
                  loc: 85896,
                },
                {
                  name: "slice",
                  color: "hsl(194, 70%, 50%)",
                  loc: 198967,
                },
                {
                  name: "append",
                  color: "hsl(46, 70%, 50%)",
                  loc: 75315,
                },
                {
                  name: "prepend",
                  color: "hsl(31, 70%, 50%)",
                  loc: 15651,
                },
                {
                  name: "shuffle",
                  color: "hsl(106, 70%, 50%)",
                  loc: 195671,
                },
                {
                  name: "pick",
                  color: "hsl(276, 70%, 50%)",
                  loc: 76186,
                },
                {
                  name: "plouc",
                  color: "hsl(121, 70%, 50%)",
                  loc: 124052,
                },
              ],
            },
            {
              name: "text",
              color: "hsl(89, 70%, 50%)",
              children: [
                {
                  name: "trim",
                  color: "hsl(359, 70%, 50%)",
                  loc: 108839,
                },
                {
                  name: "slugify",
                  color: "hsl(194, 70%, 50%)",
                  loc: 108153,
                },
                {
                  name: "snakeCase",
                  color: "hsl(321, 70%, 50%)",
                  loc: 71544,
                },
                {
                  name: "camelCase",
                  color: "hsl(22, 70%, 50%)",
                  loc: 4145,
                },
                {
                  name: "repeat",
                  color: "hsl(159, 70%, 50%)",
                  loc: 34748,
                },
                {
                  name: "padLeft",
                  color: "hsl(109, 70%, 50%)",
                  loc: 55418,
                },
                {
                  name: "padRight",
                  color: "hsl(279, 70%, 50%)",
                  loc: 148614,
                },
                {
                  name: "sanitize",
                  color: "hsl(358, 70%, 50%)",
                  loc: 109848,
                },
                {
                  name: "ploucify",
                  color: "hsl(209, 70%, 50%)",
                  loc: 196419,
                },
              ],
            },
            {
              name: "misc",
              color: "hsl(19, 70%, 50%)",
              children: [
                {
                  name: "greetings",
                  color: "hsl(308, 70%, 50%)",
                  children: [
                    {
                      name: "hey",
                      color: "hsl(353, 70%, 50%)",
                      loc: 169119,
                    },
                    {
                      name: "HOWDY",
                      color: "hsl(44, 70%, 50%)",
                      loc: 35693,
                    },
                    {
                      name: "aloha",
                      color: "hsl(36, 70%, 50%)",
                      loc: 186857,
                    },
                    {
                      name: "AHOY",
                      color: "hsl(299, 70%, 50%)",
                      loc: 83223,
                    },
                  ],
                },
                {
                  name: "other",
                  color: "hsl(220, 70%, 50%)",
                  loc: 32565,
                },
                {
                  name: "path",
                  color: "hsl(60, 70%, 50%)",
                  children: [
                    {
                      name: "pathA",
                      color: "hsl(7, 70%, 50%)",
                      loc: 111155,
                    },
                    {
                      name: "pathB",
                      color: "hsl(135, 70%, 50%)",
                      children: [
                        {
                          name: "pathB1",
                          color: "hsl(61, 70%, 50%)",
                          loc: 144106,
                        },
                        {
                          name: "pathB2",
                          color: "hsl(146, 70%, 50%)",
                          loc: 46572,
                        },
                        {
                          name: "pathB3",
                          color: "hsl(125, 70%, 50%)",
                          loc: 70779,
                        },
                        {
                          name: "pathB4",
                          color: "hsl(99, 70%, 50%)",
                          loc: 133134,
                        },
                      ],
                    },
                    {
                      name: "pathC",
                      color: "hsl(186, 70%, 50%)",
                      children: [
                        {
                          name: "pathC1",
                          color: "hsl(302, 70%, 50%)",
                          loc: 98220,
                        },
                        {
                          name: "pathC2",
                          color: "hsl(338, 70%, 50%)",
                          loc: 104680,
                        },
                        {
                          name: "pathC3",
                          color: "hsl(246, 70%, 50%)",
                          loc: 142950,
                        },
                        {
                          name: "pathC4",
                          color: "hsl(194, 70%, 50%)",
                          loc: 176098,
                        },
                        {
                          name: "pathC5",
                          color: "hsl(249, 70%, 50%)",
                          loc: 22090,
                        },
                        {
                          name: "pathC6",
                          color: "hsl(268, 70%, 50%)",
                          loc: 185230,
                        },
                        {
                          name: "pathC7",
                          color: "hsl(260, 70%, 50%)",
                          loc: 122144,
                        },
                        {
                          name: "pathC8",
                          color: "hsl(78, 70%, 50%)",
                          loc: 182621,
                        },
                        {
                          name: "pathC9",
                          color: "hsl(184, 70%, 50%)",
                          loc: 193302,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }}
        id="name"
        value="loc"
        cornerRadius={2}
        borderColor={{ theme: 'background' }}
        colors={{ scheme: 'nivo' }}
        childColor={{
            from: 'color',
            modifiers: [
                [
                    'brighter',
                    0.1
                ]
            ]
        }}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1.4
                ]
            ]
        }}
      />
    </div>
  );
};

export default CustomChart;
