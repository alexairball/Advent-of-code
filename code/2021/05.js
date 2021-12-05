const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.split("\n");
  const parseValidCoords = (content, withDiagonal = false) => {
    return _.compact(
      _.map(content, (c) => {
        const result = c.split("->").reduce((result, item, index) => {
          const coord = item.replace(" ", "").split(",");
          result[`x${index + 1}`] = parseInt(coord[0]);
          result[`y${index + 1}`] = parseInt(coord[1]);
          return result;
        }, {});
        return result.x1 === result.x2 ||
          result.y1 === result.y2 ||
          (withDiagonal
            ? Math.abs(result.x1 - result.x2) ===
              Math.abs(result.y1 - result.y2)
            : false)
          ? result
          : null;
      })
    );
  };

  const getMaxYX = (coords) => {
    const coordY = _.maxBy(coords, (coord) => coord.y1 || coord.y2);
    const coordX = _.maxBy(coords, (coord) => coord.x1 || coord.x2);
    return {
      y: coordY.y1 > coordY.y2 ? coordY.y1 : coordY.y2,
      x: coordX.x1 > coordX.x2 ? coordX.x1 : coordX.x2,
    };
  };

  const setupTable = (width, height, fillWith) => {
    return new Array(width)
      .fill(fillWith)
      .map((x) => Array(height).fill(fillWith));
  };

  const fillTableWithCoords = (table, coords, withDiagonal = false) => {
    _.each(coords, (coord) => {
      const isHorinzontal = coord.y1 - coord.y2 === 0;
      const isVertical = coord.x1 - coord.x2 === 0;
      const isDiagonal = withDiagonal
        ? Math.abs(coord.x1 - coord.x2) === Math.abs(coord.y1 - coord.y2)
        : false;
      if (isHorinzontal) {
        const lengthToFill = Math.abs(coord.x1 - coord.x2);
        const startingPos = coord.x1 > coord.x2 ? coord.x2 : coord.x1;
        _.times(lengthToFill + 1, (index) => {
          table[startingPos + index][coord.y1]++;
        });
      } else if (isVertical) {
        const lengthToFill = Math.abs(coord.y1 - coord.y2);
        const startingPos = coord.y1 > coord.y2 ? coord.y2 : coord.y1;
        _.times(lengthToFill + 1, (index) => {
          table[coord.x1][startingPos + index]++;
        });
      } else if (isDiagonal) {
        const lengthToFill = Math.abs(coord.y1 - coord.y2);
        const startingCoord =
          coord.y1 < coord.y2
            ? { x: coord.x1, y: coord.y1 }
            : { x: coord.x2, y: coord.y2 };
        const add =
          startingCoord.x === coord.x1
            ? startingCoord.x < coord.x2
            : startingCoord.x < coord.x1;
        _.times(lengthToFill + 1, (index) => {
          if (add) {
            table[startingCoord.x + index][startingCoord.y + index]++;
          } else {
            table[startingCoord.x - index][startingCoord.y + index]++;
          }
        });
      } else {
        console.log("hmm hmm");
      }
    });
  };

  const getNumberOfOverlaspe = (table) => {
    return _.reduce(
      table,
      (result, row) => {
        return (result += _.reduce(
          row,
          (r, row) => {
            return row >= 2 ? r + 1 : r;
          },
          0
        ));
      },
      0
    );
  };

  const validCoords = parseValidCoords(parseContent);
  const maxXY = getMaxYX(validCoords);
  const table = setupTable(maxXY.x + 1, maxXY.y + 1, 0);
  fillTableWithCoords(table, validCoords);
  const numberOfOverlapse = getNumberOfOverlaspe(table);
  console.log(numberOfOverlapse);

  const validCoordsWithDiag = parseValidCoords(parseContent, true);
  const maxXY2 = getMaxYX(validCoordsWithDiag);
  const table2 = setupTable(maxXY2.x + 1, maxXY2.y + 1, 0);
  fillTableWithCoords(table2, validCoordsWithDiag, true);
  const numberOfOverlapse2 = getNumberOfOverlaspe(table2);
  console.log(numberOfOverlapse2);
};
