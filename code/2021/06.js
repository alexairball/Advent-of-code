const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.replace("\n", "");
  const lanternFishs = parseContent.split(",").map((x) => parseInt(x));
  const calculateLanterFish = (time, lanternFishs) => {
    let compactLanternFishs = _.countBy(lanternFishs, (lantern) => lantern);
    _.times(time, () => {
      let tempCopy = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
      _.each(Object.keys(compactLanternFishs), (key) => {
        switch (key) {
          case "0":
            tempCopy[8] = compactLanternFishs[key];
            tempCopy[6] = compactLanternFishs[key];
            break;
          default:
            tempCopy[parseInt(key) - 1] += compactLanternFishs[key];
            break;
        }
      });
      compactLanternFishs = _.clone(tempCopy);
    });
    return _.reduce(
      Object.keys(compactLanternFishs),
      (result, key) => result + compactLanternFishs[key],
      0
    );
  };

  console.log(calculateLanterFish(80, _.clone(lanternFishs)));

  console.log(calculateLanterFish(256, _.clone(lanternFishs)));
};
