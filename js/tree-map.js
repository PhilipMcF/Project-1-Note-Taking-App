const { AgCharts } = agCharts;

const formatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
  maximumFractionDigits: 0,
});

const fillColors = [
  "#E64A19",
  "#F57C00",
  "#FFA000",
  "#FBC02D",
  "#AFB42B",
  "#689F38",
  "#388E3C",
  "#00796B",
  "#0097A7",
  "#0288D1",
];

const strokeColors = [
  "#D84315",
  "#EF6C00",
  "#FF8F00",
  "#F9A825",
  "#9E9D24",
  "#558B2F",
  "#2E7D32",
  "#00695C",
  "#00838F",
  "#0277BD",
];

const options = {
  container: document.getElementById("myChart"),
  data,
  series: [
    {
      type: "treemap",
      labelKey: "name",
      secondaryLabelKey: "chr_count",
      sizeKey: "chr_count",
      fills: [
        selectRandomColor(fillColors)
      ],
      strokes: [
        selectRandomColor(strokeColors)
      ],
      tile: {
        label: {
          minimumFontSize: 9,
        },
        secondaryLabel: {
          minimumFontSize: 6,
          formatter: ({ value }) =>
            value != null ? `${formatter.format(value)}` : undefined,
        },
        padding: 6,
      },
    },
  ],
  title: {
    text: "Note Density Indicator Map",
  },
};

function selectRandomColor(colors) {
  // get random index value
  const randomIndex = Math.floor(Math.random() * colors.length);
  // get random item
  const item = colors[randomIndex];
  return item;
}

AgCharts.create(options);
