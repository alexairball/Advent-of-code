const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.trim().split("\n");
  let index = 0;
  _.some(parseContent, (c, i) => {
    if (c === "") {
      index = i;
      return true;
    }
  });
  const data = parseContent.splice(0, index);
  const fold = parseContent
    .splice(1, parseContent.length)
    .map((x) => x.replace("fold along ", ""));
  let width = 0;
  let height = 0;
  _.each(data, (d) => {
    const x = parseInt(d.split(",")[0]);
    if (width < x) {
      width = x;
    }
  });

  _.each(data, (d) => {
    const y = parseInt(d.split(",")[1]);
    if (height < y) {
      height = y;
    }
  });

  const foldX = (arr1, arr2) => {
    const offset = arr1[0].length - arr2[0].length;
    _.each(arr1, (row1, j) => {
      _.each(row1, (r1, i) => {
        const pos = arr2[0].length - 1 - i;
        if (pos >= 0 && arr2[j][pos] === "#") {
          arr1[j][i + offset] = arr2[j][pos];
        }
      });
    });
    return arr1;
  };

  const foldY = (arr1, arr2) => {
    const offset = arr1.length - arr2.length;
    _.each(arr1, (row1, j) => {
      _.each(row1, (r1, i) => {
        const pos = arr2.length - 1 - j;
        if (pos >= 0 && arr2[pos][i] === "#") {
          arr1[j + offset][i] = arr2[pos][i];
        }
      });
    });
    return arr1;
  };

  const handleFolds = (data, folds) => {
    _.each(folds, (f) => {
      const [xorY, index] = f.split("=");
      if (xorY === "x") {
        data = foldX(
          _.map(data, (d) => d.slice(0, parseInt(index))),
          _.map(data, (d) => d.slice(parseInt(index) + 1, d.length))
        );
      } else if (xorY == "y") {
        data = foldY(
          data.slice(0, parseInt(index)),
          data.slice(parseInt(index) + 1, data.length)
        );
      }
    });
    return data;
  };

  const createTable = (array, fillWith) => {
    const nArray = new Array(height + 1)
      .fill(fillWith)
      .map((x) => Array(width + 1).fill(fillWith));
    _.each(array, (a) => {
      const [x, y] = a.split(",").map((x) => parseInt(x));
      nArray[y][x] = "#";
    });
    return nArray;
  };
  const table = createTable(data, ".");
  const foldedArray = handleFolds(_.clone(table), [fold[0]]);
  console.log(
    _.reduce(
      foldedArray,
      (result, row) =>
        result + _.reduce(row, (res, r) => (r === "#" ? ++res : res), 0),
      0
    )
  );

  const prettyPrint = (array) => {
    let stringToPrint = "";
    _.each(array, (row) => {
      _.each(row, (r, index) => {
        if (r === ".") {
          stringToPrint += " ";
        } else if (r === "#") {
          stringToPrint += "#";
        }
        if ((index + 1) % 5 === 0) {
          stringToPrint += "    ";
        }
      });
      stringToPrint += "\n";
    });
    console.log(stringToPrint);
  };

  const foldedArray2 = handleFolds(_.clone(table), fold);
  prettyPrint(foldedArray2);
};
