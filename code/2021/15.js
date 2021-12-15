const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.trim().split("\n");
  const startPos = { x: 0, y: 0 };
  let endPos = { x: parseContent[0].length - 1, y: parseContent.length - 1 };
  let height = parseContent.length;
  let width = parseContent[0].length;

  const createTable = (array) => {
    return _.map(array, (a, index) =>
      a.split("").map((x, i) => {
        if (index === endPos.y && i === endPos.x) {
          return {
            value: parseInt(x),
            x: i,
            y: index,
            hasBeen: false,
            costToEnd: parseInt(x),
            nextStep: null,
          };
        } else {
          return {
            value: parseInt(x),
            x: i,
            y: index,
            hasBeen: false,
            costToEnd: Infinity,
            nextStep: null,
          };
        }
      })
    );
  };

  const canCheckTopMid = (value) => {
    return value.y - 1 >= 0;
  };

  const canCheckBotMid = (value) => {
    return value.y + 1 < height;
  };

  const canCheckRight = (value) => {
    return value.x + 1 < width;
  };

  const canCheckLeft = (value) => {
    return value.x - 1 >= 0;
  };

  const updateBestPath = (nextVal, val) => {
    if (
      nextVal.x === endPos.x &&
      nextVal.y === endPos.y &&
      val.costToEnd === Infinity
    ) {
      val.nextStep = nextVal;
      val.costToEnd = nextVal.costToEnd + val.value;
      return true;
    } else if (
      val.x === startPos.x &&
      val.y === startPos.y &&
      val.costToEnd > nextVal.costToEnd
    ) {
      val.nextStep = nextVal;
      val.costToEnd = nextVal.costToEnd;
    } else if (val.costToEnd > nextVal.costToEnd + val.value) {
      val.nextStep = nextVal;
      val.costToEnd = nextVal.costToEnd + val.value;
      return true;
    }
    return false;
  };

  const findLowestWay = (array) => {
    let hasChanged = true;
    let nArray = _.clone(array);
    while (hasChanged) {
      hasChanged = false;
      _.each(nArray, (row) => {
        _.each(row, (r) => {
          if (canCheckTopMid(r)) {
            const nextVal = nArray[r.y - 1][r.x];
            if (updateBestPath(nextVal, r)) hasChanged = true;
          }
          if (canCheckRight(r)) {
            const nextVal = nArray[r.y][r.x + 1];
            if (updateBestPath(nextVal, r)) hasChanged = true;
          }
          if (canCheckBotMid(r)) {
            const nextVal = nArray[r.y + 1][r.x];
            if (updateBestPath(nextVal, r)) hasChanged = true;
          }
          if (canCheckLeft(r)) {
            const nextVal = nArray[r.y][r.x - 1];
            if (updateBestPath(nextVal, r)) hasChanged = true;
          }
        });
      });
    }
    return nArray;
  };

  const getFullMap = (array) => {
    const miniMap = _.map(array, (a) => a.split("").map((x) => parseInt(x)));
    let bigMap = new Array(height)
      .fill(null)
      .map((x) => Array(width).fill(null));
    _.times(5, (index) => {
      _.times(5, (i) => {
        const increasedMap = _.map(miniMap, (mm) =>
          _.map(mm, (m) => {
            const inc = m + index + i;
            if (inc % 9 === 0) {
              return inc;
            }
            return inc % 9 === 0 ? inc : inc % 9;
          })
        );
        _.each(increasedMap, (incrMap, y) => {
          _.each(incrMap, (m, x) => {
            bigMap[y + miniMap.length * index][x + miniMap[0].length * i] = m;
          });
        });
      });
    });
    return _.map(bigMap, (row, index) =>
      _.map(row, (x, i) => {
        if (index === endPos.y && i === endPos.x) {
          return {
            value: parseInt(x),
            x: i,
            y: index,
            hasBeen: false,
            costToEnd: parseInt(x),
            nextStep: null,
          };
        } else {
          return {
            value: parseInt(x),
            x: i,
            y: index,
            hasBeen: false,
            costToEnd: Infinity,
            nextStep: null,
          };
        }
      })
    );
  };

  const table = createTable(parseContent);
  const tableWithBestWay = findLowestWay(table);
  console.log(tableWithBestWay[startPos.x][startPos.y].costToEnd);

  width = width * 5;
  height = height * 5;
  endPos.x = width - 1;
  endPos.y = height - 1;
  const bigTable = getFullMap(parseContent);
  const bigTableWithBestWay = findLowestWay(bigTable);
  console.log(bigTableWithBestWay[startPos.x][startPos.y].costToEnd);
};
