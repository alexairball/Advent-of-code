const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.trim().split("\n");
  const errorValue = { ")": 3, "]": 57, "}": 1197, ">": 25137 };
  const addValue = { ")": 1, "]": 2, "}": 3, ">": 4 };

  const isSignOpen = (value) => {
    return _.includes(["(", "[", "{", "<"], value);
  };

  const getOppositeSign = (value) => {
    if (value === "<") return ">";
    if (value === "(") return ")";
    if (value === "[") return "]";
    if (value === "{") return "}";
  };

  const canCheckRight = (i, length) => {
    return i + 1 < length;
  };

  const canCheckLeft = (i) => {
    return i - 1 > 0;
  };

  const removeSign = (value) => {
    while (
      _.some(["()", "[]", "{}", "<>"], (sign) => value.indexOf(sign) !== -1)
    ) {
      value = value.replace(/\(\)/g, "");
      value = value.replace(/\[\]/g, "");
      value = value.replace(/\{\}/g, "");
      value = value.replace(/\<\>/g, "");
    }
    return value;
  };

  const isValideSign = (previousSign, currentSign) => {
    if (
      isSignOpen(previousSign) &&
      getOppositeSign(previousSign) === currentSign
    ) {
      return true;
    } else if (isSignOpen(previousSign)) {
      return false;
    }
    return true;
  };

  const findAndDestroy = (array) => {
    let error = null;
    _.eachRight(array, (a, index) => {
      if (isSignOpen(a)) {
        a = a.substring(0, a.length - 1);
      } else if (canCheckLeft(index)) {
        if (isValideSign(array[index - 1], a)) {
          removeSign(a);
        } else {
          error = a;
        }
      }
    });
    return error;
  };

  const getErrorPoint = (array) => {
    const error = { ")": 0, "]": 0, "}": 0, ">": 0 };
    _.each(array, (a) => {
      const cleanedUpValue = removeSign(a);
      const errorFound = findAndDestroy(cleanedUpValue);
      if (errorFound) {
        error[errorFound] += errorValue[errorFound];
      }
    });
    return _.sumBy(Object.keys(error), (v) => error[v]);
  };

  const removeErrorLine = (array) => {
    const cleanArray = [];
    _.each(array, (a) => {
      const cleanedUpValue = removeSign(a);
      const errorFound = findAndDestroy(cleanedUpValue);
      if (!errorFound) {
        cleanArray.push(a);
      }
    });
    return cleanArray;
  };

  const getOppositeSigns = (array) => {
    let opposite = "";
    _.eachRight(array, (a) => {
      opposite += getOppositeSign(a);
    });
    return opposite;
  };

  const getFindMissingSign = (array) => {
    const total = [];
    _.each(array, (a) => {
      const cleanedUpValue = removeSign(a);
      const oppositeSigns = getOppositeSigns(cleanedUpValue);
      const t = _.reduce(
        oppositeSigns,
        (result, o) => result * 5 + addValue[o],
        0
      );
      total.push(t);
    });
    const ordered = _.orderBy(total, (t) => t, "desc");
    return ordered[Math.floor(ordered.length / 2)];
  };

  console.log(getErrorPoint(_.clone(parseContent)));

  const cleanArray = removeErrorLine(_.clone(parseContent));
  console.log(getFindMissingSign(cleanArray));
  //<{([
};
