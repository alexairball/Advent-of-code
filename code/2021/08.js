const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.split("\n");
  parseContent.pop();
  //  aaaa
  // b    c
  // b    c
  //  dddd
  // e    f
  // e    f
  //  gggg
  //array pos0 = a, po1 = b, pos2 = c pos3 = d, pos4 = e, pos5 = f, pos6 = g
  const numberPatern = {
    0: "0,1,2,4,5,6",
    1: "2,5",
    2: "0,2,3,4,6",
    3: "0,2,3,5,6",
    4: "1,2,3,5",
    5: "0,1,3,5,6",
    6: "0,1,3,4,5,6",
    7: "0,2,5",
    8: "0,1,2,3,4,5,6",
    9: "0,1,2,3,5,6",
  };
  const numberWidth = {
    6: [0, 6, 9],
    2: [1],
    5: [2, 3, 5],
    4: [4],
    3: [7],
    7: [8],
  };
  const countPotentialNumber = (content) => {
    return _.reduce(
      content,
      (result, c) => {
        const [temp, digitOutput] = c.split("|");
        return (
          result +
          _.reduce(
            digitOutput.split(" "),
            (r, dOutput) => {
              if (
                dOutput.length === 2 ||
                dOutput.length === 4 ||
                dOutput.length === 3 ||
                dOutput.length === 7
              ) {
                r++;
              }
              return r;
            },
            0
          )
        );
      },
      0
    );
  };

  const getUniqueNumber = (array) => {
    return _.sortBy(
      _.remove(array, (a) => _.includes([2, 3, 4, 7], a.length)),
      "length"
    );
  };

  const setUpUniqueNumber = (a) => {
    const numberPossibilities = numberWidth[a.length];
    const positionPosibilities = numberPatern[numberPossibilities[0]];
    const posToIterate = positionPosibilities
      .split(",")
      .map((x) => parseInt(x));
    const priorPos = _.filter(posToIterate, (pos) => {
      return possibleCombination[pos].length > 0;
    });
    return _.uniq([...priorPos, ...posToIterate]);
  };

  const handleUniqueNumber = (array) => {
    _.each(array, (a) => {
      if (a.length === 2) {
        realNumber[1] = a;
      } else if (a.length === 3) {
        realNumber[7] = a;
      } else if (a.length === 4) {
        realNumber[4] = a;
      } else if (a.length === 7) {
        realNumber[8] = a;
      }
      const valueToPush = a.split("");
      const orderPos = setUpUniqueNumber(a);
      _.each(orderPos, (pos) => {
        const arrayValue = possibleCombination[pos];
        if (arrayValue.length > 0) {
          _.remove(valueToPush, (v) => _.includes(arrayValue, v));
        } else {
          possibleCombination[pos].push(...valueToPush);
        }
      });
    });
  };

  const isInvalidHere = (array, index, usedLetter) => {
    if (usedLetter.length === 1) {
      let incorect = false;
      for (let i = index + 1; i < array.length; i++) {
        incorect = _.includes(possibleCombination[array[i]], usedLetter[0]);
        if (incorect) {
          return incorect;
        }
      }
      return incorect;
    } else {
      let count = 0;
      for (let i = index + 1; i < array.length; i++) {
        if (
          _.every(usedLetter, (ul) =>
            _.includes(possibleCombination[array[i]], ul)
          )
        ) {
          count++;
        }
      }
      return count > 1;
    }
  };

  const checkNumberPossibility = (array, valueToPush) => {
    return _.some(array, (pos, index) => {
      const arrayValue = possibleCombination[pos];
      if (arrayValue.length === 1) {
        _.remove(valueToPush, (v) => _.includes(arrayValue, v));
      } else if (arrayValue.length > 0) {
        const usedLetter = _.filter(valueToPush, (v) =>
          _.includes(arrayValue, v)
        );
        if (index + 1 < array.length) {
          if (isInvalidHere(array, index, usedLetter)) {
            return true;
          }
        }
      }
    });
  };

  const handleNoneUniqueNumber = (array) => {
    _.each(array, (a) => {
      const valueToPush = a.split("");
      const numberPossibilities = numberWidth[a.length];
      _.some(numberPossibilities, (np) => {
        const posToIterate = numberPatern[np]
          .split(",")
          .map((x) => parseInt(x));
        const lookForAnotherOne = checkNumberPossibility(
          posToIterate,
          _.clone(valueToPush)
        );
        if (!lookForAnotherOne) {
          realNumber[np] = a;
          return true;
        }
      });
    });
  };

  const findRealNumber = (array) => {
    let total = "";
    _.each(array, (a) => {
      const possibleNumber = numberWidth[a.length];
      _.some(possibleNumber, (pn) => {
        const signal = realNumber[pn];
        //todo: sort your string then ==
        if (signal.split("").sort().join("") === a.split("").sort().join("")) {
          total += pn;
        }
      });
    });
    return parseInt(total);
  };

  let possibleCombination = [[], [], [], [], [], [], []];
  let realNumber = {};
  const outputValue = (content) => {
    return _.reduce(
      content,
      (result, c) => {
        possibleCombination = [[], [], [], [], [], [], []];
        realNumber = {};
        const [allUniqueSignal, digitOutput] = c.split("|");
        const allUniqueSignals = allUniqueSignal.trim().split(" ");
        const finalNumber = digitOutput.trim().split(" ");
        const uniqueSignal = getUniqueNumber(allUniqueSignals);
        handleUniqueNumber(uniqueSignal);
        handleNoneUniqueNumber(allUniqueSignals);
        result += findRealNumber(finalNumber);
        return result;
      },
      0
    );
  };

  console.log(countPotentialNumber(parseContent));
  console.log(outputValue(parseContent));
};
