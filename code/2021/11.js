const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.trim().split("\n");
  const height = parseContent.length;
  const width = parseContent[0].length;

  const createTable = (array) => {
    return _.map(array, (a, index) =>
      a
        .split("")
        .map((x, i) => ({ value: parseInt(x), j: index, i, glowed: false }))
    );
  };

  const canCheckTopLeft = (value) => {
    return canCheckTopMid(value) && canCheckLeft(value);
  };

  const canCheckTopRight = (value) => {
    return canCheckTopMid(value) && canCheckRight(value);
  };

  const canCheckTopMid = (value) => {
    return value.j - 1 >= 0;
  };

  const canCheckBotLeft = (value) => {
    return canCheckBotMid(value) && canCheckLeft(value);
  };

  const canCheckBotRight = (value) => {
    return canCheckBotMid(value) && canCheckRight(value);
  };

  const canCheckBotMid = (value) => {
    return value.j + 1 < height;
  };

  const canCheckRight = (value) => {
    return value.i + 1 < width;
  };

  const canCheckLeft = (value) => {
    return value.i - 1 >= 0;
  };

  const executeCurrentStep = (array, currentValue) => {
    let totalFlash = 0;
    if (!currentValue.glowed) {
      currentValue.value++;
    }
    if (currentValue.value > 9 && !currentValue.glowed) {
      currentValue.glowed = true;
      if (canCheckTopLeft(currentValue)) {
        totalFlash += executeCurrentStep(
          array,
          array[currentValue.j - 1][currentValue.i - 1]
        );
      }
      if (canCheckTopMid(currentValue)) {
        totalFlash += executeCurrentStep(
          array,
          array[currentValue.j - 1][currentValue.i]
        );
      }
      if (canCheckTopRight(currentValue)) {
        totalFlash += executeCurrentStep(
          array,
          array[currentValue.j - 1][currentValue.i + 1]
        );
      }
      if (canCheckRight(currentValue)) {
        totalFlash += executeCurrentStep(
          array,
          array[currentValue.j][currentValue.i + 1]
        );
      }
      if (canCheckBotRight(currentValue)) {
        totalFlash += executeCurrentStep(
          array,
          array[currentValue.j + 1][currentValue.i + 1]
        );
      }
      if (canCheckBotMid(currentValue)) {
        totalFlash += executeCurrentStep(
          array,
          array[currentValue.j + 1][currentValue.i]
        );
      }
      if (canCheckBotLeft(currentValue)) {
        totalFlash += executeCurrentStep(
          array,
          array[currentValue.j + 1][currentValue.i - 1]
        );
      }
      if (canCheckLeft(currentValue)) {
        totalFlash += executeCurrentStep(
          array,
          array[currentValue.j][currentValue.i - 1]
        );
      }
      currentValue.value = 0;
      return totalFlash + 1;
    }
    return totalFlash;
  };

  const resetState = (array) => {
    return _.map(array, (row) =>
      _.map(row, (r) => ({
        value: r.value,
        j: r.j,
        i: r.i,
        glowed: false,
      }))
    );
  };

  const executeStep = (array, n) => {
    let total = 0;
    _.times(n, () => {
      total += _.reduce(
        array,
        (result, row) => {
          return (
            result +
            _.reduce(
              row,
              (res, r) => {
                return res + executeCurrentStep(array, r);
              },
              0
            )
          );
        },
        0
      );
      array = resetState(array);
    });
    return total;
  };

  const isSynchronize = (array) => {
    return !_.some(array, (row) => _.some(row, (r) => r.value !== 0));
  };

  const getIndexWhenSynchrinuzed = (array) => {
    let step = 1;
    while (!isSynchronize(array)) {
      _.each(array, (row) => {
        _.each(row, (r) => {
          executeCurrentStep(array, r);
        });
      });
      array = resetState(array);
      step++;
    }
    return step;
  };

  const table = createTable(parseContent);
  const totalGlowed = executeStep(_.clone(table), 100);
  console.log(totalGlowed);
  console.log(getIndexWhenSynchrinuzed(_.clone(table)));
};
