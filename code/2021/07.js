const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent
    .replace("\n")
    .split(",")
    .map((x) => parseInt(x));
  const getLeastExpensiveCost = (content) => {
    let bestCost = {};
    _.each(content, (value, index) => {
      const cost = _.reduce(
        content,
        (result, c) => result + Math.abs(value - c),
        0
      );
      if (index === 0 || bestCost.cost > cost) {
        bestCost = {
          value,
          cost,
        };
      }
    });
    return bestCost.cost;
  };

  const getLeastExpensiveCost2 = (content) => {
    let bestCost = {};
    const max = _.max(content);
    _.times(max + 1, (index) => {
      const cost = _.reduce(
        content,
        (result, c) => {
          const diff = Math.abs(index - c);
          _.times(diff, (i) => {
            result += i + 1;
          });
          return result;
        },
        0
      );

      if (index === 0 || bestCost.cost > cost) {
        bestCost = {
          index,
          cost,
        };
      }
    });

    return bestCost.cost;
  };

  console.log(getLeastExpensiveCost(parseContent));
  console.log(getLeastExpensiveCost2(parseContent));
};
