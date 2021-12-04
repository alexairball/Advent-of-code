const _ = require("lodash");

module.exports = (fileContent) => {
  const parseContent = fileContent.split("\n");
  const randomNumber = parseContent.shift().split(",");
  parseContent.shift();

  //build board games
  const buildGame = (game) => {
    let buildGame = [];
    _.each(game, (numbers) => {
      const n = _.compact(
        numbers
          .split(" ")
          .map((number) =>
            !_.isEmpty(number) ? { value: number, checked: false } : null
          )
      );
      buildGame.push(n);
    });
    return buildGame;
  };

  //parse board games
  const parseBoardGames = (parseContent) => {
    let games = [];
    let game = [];
    _.each(parseContent, (content) => {
      if (_.isEmpty(content)) {
        games.push(buildGame(game));
        game = [];
      } else {
        game.push(content);
      }
    });
    return games;
  };

  const validateWinner = (board) => {
    return (
      _.find(board, (row) => _.every(row, (r) => r.checked)) ||
      _.find(board, (b, index) => {
        const column = _.map(board, (row) => row[index]);
        return _.every(column, (c) => c.checked);
      })
    );
  };

  const getWinnnerBoard = (boardGames) => {
    let winner = {};
    _.find(randomNumber, (rn) => {
      const board = _.find(boardGames, (board) => {
        return _.find(board, (row) => {
          let checked = false;
          _.each(row, (r) => {
            if (r.value === rn && !r.checked) {
              checked = true;
              r.checked = true;
            }
          });
          return checked ? validateWinner(board) : checked;
        });
      });
      if (board) {
        winner.board = board;
        winner.number = parseInt(rn);
        return board;
      }
    });
    return winner;
  };

  const calculateTotal = (board, finalNumber) => {
    const totalBoard = _.reduce(
      board,
      (resultB, row) =>
        (resultB += _.reduce(
          row,
          (resultR, r) => (resultR += r.checked ? 0 : parseInt(r.value)),
          0
        )),
      0
    );
    return totalBoard * finalNumber;
  };

  const boardGames = parseBoardGames(parseContent);
  const winner = getWinnnerBoard(boardGames);
  const total1 = calculateTotal(winner.board, winner.number);
  console.log(total1);

  let removableBoardGame = _.clone(boardGames);
  let removeBoard;
  while (removableBoardGame.length !== 1) {
    removeBoard = getWinnnerBoard(removableBoardGame);
    removableBoardGame = _.reject(removableBoardGame, (board) =>
      _.isEqual(board, removeBoard.board)
    );
  }
  const lastWiningBoard = getWinnnerBoard(removableBoardGame);
  const total2 = calculateTotal(lastWiningBoard.board, lastWiningBoard.number);
  console.log(total2);
};
