const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.split("\n");
  const data = parseContent[0];
  const instructions = parseContent.slice(2, parseContent.length - 1);
  const startingLetter = data[0];

  const createTable = (value) => {
    let table = {};
    _.each(value, (v, index) => {
      if (index + 1 < value.length) {
        table[`${v}${value[index + 1]}`] = 1;
      }
    });
    return table;
  };

  const getNewCombination = (toFind, toAdd) => {
    const split = toFind.split("");
    return { cb1: `${split[0]}${toAdd}`, cb2: `${toAdd}${split[1]}` };
  };

  const getResults = (values) => {
    const groups = _.groupBy(Object.keys(values), (key) => key.split("")[1]);
    let total = [];
    _.each(groups, (group, key) => {
      const count = _.reduce(
        group,
        (result, g) => {
          return result + values[g];
        },
        0
      );
      total.push({
        value: key,
        count: startingLetter === key ? count + 1 : count,
      });
    });
    const sortedTotal = _.sortBy(total, (t) => t.count);
    return sortedTotal[sortedTotal.length - 1].count - sortedTotal[0].count;
  };

  const updatePolymerTemplate = (values, array) => {
    let nValues = {};
    _.each(array, (a) => {
      const [toFind, toAdd] = a.replace(/\s/g, "").split("->");
      if (values[toFind]) {
        const { cb1, cb2 } = getNewCombination(toFind, toAdd);
        const nb = values[toFind];
        delete values[toFind];
        if (nValues[cb1]) {
          nValues[cb1] += nb;
        } else {
          nValues[cb1] = nb;
        }
        if (nValues[cb2]) {
          nValues[cb2] += nb;
        } else {
          nValues[cb2] = nb;
        }
      }
    });
    return nValues;
  };

  const executeXTime = (n, values, array) => {
    let nValues = _.clone(values);
    _.times(n, () => {
      nValues = updatePolymerTemplate(nValues, array);
    });
    return getResults(nValues);
  };

  const table = createTable(data);
  console.log(executeXTime(10, table, instructions));
  console.log(executeXTime(40, table, instructions));
};
