const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.trim().split("\n");
  const width = parseContent[0].length;
  const height = parseContent.length;

  const createTable = (content) => {
    let array = [];
    _.each(content, (c, index) => {
      array.push(
        c.split("").map((x, i) => ({
          value: parseInt(x),
          checked: false,
          j: index,
          i,
        }))
      );
    });
    return array;
  };

  const canCheckTop = (j) => {
    return j - 1 >= 0;
  };

  const canCheckBot = (j) => {
    return j + 1 < height;
  };

  const canCheckRight = (i) => {
    return i + 1 < width;
  };

  const canCheckLeft = (i) => {
    return i - 1 >= 0;
  };

  const checkTop = (array, value, j, i) => {
    if (canCheckTop(j)) {
      return value < array[j - 1][i].value;
    }
    return true;
  };

  const checkBot = (array, value, j, i) => {
    if (canCheckBot(j)) {
      return value < array[j + 1][i].value;
    }
    return true;
  };

  const checkLeft = (array, value, j, i) => {
    if (canCheckLeft(i)) {
      return value < array[j][i - 1].value;
    }
    return true;
  };

  const checkRight = (array, value, j, i) => {
    if (canCheckRight(i)) {
      return value < array[j][i + 1].value;
    }
    return true;
  };

  const isLowestPoint = (array, value, j, i) => {
    return (
      checkTop(array, value, j, i) &&
      checkBot(array, value, j, i) &&
      checkLeft(array, value, j, i) &&
      checkRight(array, value, j, i)
    );
  };

  const findLowestPoint = (array) => {
    const lowestPoint = [];
    for (let j = 0; j < height; ++j) {
      for (let i = 0; i < width; ++i) {
        if (isLowestPoint(array, array[j][i].value, j, i)) {
          lowestPoint.push(array[j][i]);
        }
      }
    }
    return lowestPoint;
  };

  const findBasinSize = (array, currentVal, from) => {
    let total = 0;
    if (currentVal.value === 9 || currentVal.checked) {
      return total;
    }
    currentVal.checked = true;
    if (from !== "top" && canCheckTop(currentVal.j)) {
      total += findBasinSize(
        array,
        array[currentVal.j - 1][currentVal.i],
        "bot"
      );
    }
    if (from !== "right" && canCheckRight(currentVal.i)) {
      total += findBasinSize(
        array,
        array[currentVal.j][currentVal.i + 1],
        "left"
      );
    }
    if (from !== "bot" && canCheckBot(currentVal.j)) {
      total += findBasinSize(
        array,
        array[currentVal.j + 1][currentVal.i],
        "top"
      );
    }
    if (from !== "left" && canCheckLeft(currentVal.i)) {
      total += findBasinSize(
        array,
        array[currentVal.j][currentVal.i - 1],
        "right"
      );
    }
    return total + 1;
  };

  const getThreeLargestBassins = (array, lowestPoint) => {
    const bassinSizes = [];
    _.each(lowestPoint, (lp) => {
      const size = findBasinSize(array, lp, null);
      bassinSizes.push(size);
    });
    return _.sortBy(bassinSizes).slice(-3);
  };

  const table = createTable(parseContent);
  const lowestPoint = findLowestPoint(table);
  console.log(
    _.reduce(lowestPoint, (result, lp) => result + (lp.value + 1), 0)
  );

  const bassins = getThreeLargestBassins(table, lowestPoint);
  console.log(_.reduce(bassins, (result, b) => result * b, 1));
};
