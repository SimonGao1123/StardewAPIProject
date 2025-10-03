const fertilizerData = [
  {
    id:1,
    type: "fertilizer",
    name: "basic_fertilizer",
    multiplier: 1.028
  },
  {
    id:2,
    type: "fertilizer",
    name: "quality_fertilizer",
    multiplier: 1.071
  },
  {
    id:3,
    type: "fertilizer",
    name: "deluxe_fertilizer",
    multiplier: 1.184
  },

  {
    id:4,
    type: "speed_grow",
    name: "speed_gro",
    multiplier: 0.9
  },
  {
    id:5,
    type: "speed_grow",
    name: "delux_speed_grow",
    multiplier: 0.75
  },
  {
    id:6,
    type: "speed_grow",
    name: "hyper_speed_grow",
    multiplier: 0.66
  },
];
// for type="fertilizer", multiplier will multiply the sell price of the crop by that amount
// for type="speed_grow", multiplier will multiply the # of days by that amount (ROUNDED DOWN)
export default fertilizerData;