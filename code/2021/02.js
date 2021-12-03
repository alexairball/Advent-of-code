import _ from "lodash";

export const code_2021_02 = (fileContent) => {
  const position = {
    horizontal: 0,
    depth: 0,
  };
  const parseContent = fileContent.split("\n");
  _.each(parseContent, (content) => {
    if (content.indexOf("forward") !== -1) {
        const x = parseInt(content.split(" ")[1]);
        position.horizontal += x;
    } else if (content.indexOf("down") !== -1) {
        const x = parseInt(content.split(" ")[1]);
        position.depth += x;
    } else if (content.indexOf("up") !== -1){
        const x = parseInt(content.split(" ")[1]);
        position.depth -= x;
    }
  });
  console.log(position.horizontal * position.depth);

  const position1 = {
    horizontal: 0,
    depth: 0,
    aim: 0,
  };
  _.each(parseContent, (content) => {
    if (content.indexOf("forward") !== -1) {
        const x = parseInt(content.split(" ")[1]);
        position1.horizontal += x;
        position1.depth += position1.aim * x;
    } else if (content.indexOf("down") !== -1) {
        const x = parseInt(content.split(" ")[1]);
        position1.aim += x;
    } else if (content.indexOf("up") !== -1){
        const x = parseInt(content.split(" ")[1]);
        position1.aim -= x;
    }
  });
  console.log(position1.horizontal * position1.depth);
};
