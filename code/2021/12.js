const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.trim().split("\n");
  const isBigCave = (value) => {
    return /[A-Z]+$/.test(value);
  };

  const addNode = (pathing, n1, n2) => {
    if (pathing[n1]) {
      pathing[n1].accessibleNodes.push(n2);
    } else {
      pathing[n1] = {
        value: n1,
        accessibleNodes: [n2],
        isBig: isBigCave(n1),
        timeVisited: 0,
      };
    }
  };
  const createPathing = (array) => {
    let pathing = {};
    _.each(array, (a) => {
      const [n1, n2] = a.split("-");
      addNode(pathing, n1, n2);
      addNode(pathing, n2, n1);
    });
    return pathing;
  };

  const smallCaveVisitedTwice = (array) => {
    const allSmallCave = _.filter(array, (a) => !a.isBig);
    return _.some(allSmallCave, (s) => s.timeVisited === 2);
  };

  const findAllPath = (pathing, currentValue) => {
    let total = 0;
    if (currentValue.timeVisited === 1 && !currentValue.isBig) return 0;
    if (currentValue.value === "end") return 1;
    currentValue.timeVisited++;
    _.each(currentValue.accessibleNodes, (accN) => {
      const node = pathing[accN];
      if (node.value !== "start" && (node.timeVisited < 1 || node.isBig)) {
        total += findAllPath(pathing, node);
        node.timeVisited--;
      }
    });
    return total;
  };

  const findAllPath2 = (pathing, currentValue) => {
    let total = 0;
    if (
      currentValue.timeVisited >= 1 &&
      !currentValue.isBig &&
      smallCaveVisitedTwice(pathing)
    ) {
      return 0;
    }
    if (currentValue.value === "end") return 1;
    currentValue.timeVisited++;
    _.each(currentValue.accessibleNodes, (accN) => {
      const node = pathing[accN];
      if (
        node.value !== "start" &&
        (!smallCaveVisitedTwice(pathing) || node.timeVisited < 1 || node.isBig)
      ) {
        total += findAllPath2(pathing, node);
        node.timeVisited--;
      }
    });
    return total;
  };

  const pathing = _.clone(createPathing(parseContent));
  const totalOfPath = findAllPath(pathing, pathing.start);
  console.log(totalOfPath);

  const pathing2 = _.clone(createPathing(parseContent));
  const totalOfPath2 = findAllPath2(pathing2, pathing2.start);
  console.log(totalOfPath2);
};
