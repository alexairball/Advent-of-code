const axios = require("axios");
const fs = require("fs");
const moment = require("moment");

const hardCodeDay = null;
const hardCodeYear = null;

const today = moment(Date.now());
const adventOfCodeYear = hardCodeYear || today.format("yyyy");
const adventOfCodeDay = hardCodeDay || today.format("DD");

const setup = async () => {
  let inputExist;
  let codeExist;
  try {
    inputExist = await fs.promises.stat(
      `./input/${adventOfCodeYear}/${adventOfCodeDay}.txt`
    );
  } catch (err) {}
  try {
    codeExist = await fs.promises.stat(
      `./code/${adventOfCodeYear}/${adventOfCodeDay}.js`
    );
  } catch (err) {}

  //download input file
  if (!inputExist) {
    try {
      const response = await axios({
        method: "GET",
        url: `https://adventofcode.com/${adventOfCodeYear}/day/${parseInt(
          adventOfCodeDay
        )}/input`,
        headers: {
          cookie:
            "session=53616c7465645f5f5b83b254aa15b199164a41f2c936e477101ee2f5c0436ee2c585ce7c8c5064cc7b47a7e3d5acae8d",
        },
      });
      fs.writeFileSync(
        `./input/${adventOfCodeYear}/${adventOfCodeDay}.txt`,
        response.data
      );
    } catch (err) {
      console.log(err);
    }
  }

  //create new js for the day
  if (!codeExist) {
    const data = fs.readFileSync("./template.js", "utf-8");
    const importData = fs.readFileSync("./import.js", "utf-8");
    fs.writeFileSync(`./code/${adventOfCodeYear}/${adventOfCodeDay}.js`, data);
    let newImport = importData.replace(
      '("REQUIRE_REPLACE");',
      `const code_${adventOfCodeYear}_${adventOfCodeDay} = require("./code/${adventOfCodeYear}/${adventOfCodeDay}.js");\n("REQUIRE_REPLACE");`
    );
    newImport = newImport.replace(
      "undefined,",
      `code_${adventOfCodeYear}_${adventOfCodeDay},\nundefined,`
    );
    fs.writeFileSync("./import.js", newImport);
  }

  const all = require("./import.js");
  const prog = all[`code_${adventOfCodeYear}_${adventOfCodeDay}`];
  const content = fs.readFileSync(
    `./input/${adventOfCodeYear}/${adventOfCodeDay}.txt`,
    "utf-8"
  );
  prog(content);
};
setup();
