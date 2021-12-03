import _ from "lodash";

export const code_2021_03 = (fileContent) => {
  const bin = [0,0,0,0,0,0,0,0,0,0,0,0];
  const parseContent = fileContent.split("\n");
  _.each(parseContent, (content) => {
    const chars = content.split('');
    _.each(chars,(char, index) => {
      bin[index] += char === '1' ? 1 : -1;
    });
  });
  let gammaRateBin = "";
  let epslionBin = "";
  _.each(bin, (b) => gammaRateBin += b > 0 ? "1" : "0");
  _.each(gammaRateBin.split(''), (b) => epslionBin += b === '0' ? "1" : "0");
  const gammaRateDec = parseInt(gammaRateBin, 2);
  const epsilonDec = parseInt(epslionBin, 2);
  console.log(gammaRateDec * epsilonDec);

  let oxyPos = 0;
  let oxygenGeneratorRating = _.clone(parseContent);
  oxygenGeneratorRating.pop();
  while(oxygenGeneratorRating.length !== 1)
  {
    let acc = 0;
    _.each(oxygenGeneratorRating, (content) => {
      const chars = content.split('');
      acc += chars[oxyPos] === '1' ? 1 : -1;
    });
    if(acc === 0 || acc > 0){
      oxygenGeneratorRating = _.filter(oxygenGeneratorRating, (o) => o.split('')[oxyPos] === '1');
    } else {
      oxygenGeneratorRating = _.filter(oxygenGeneratorRating, (o) =>  o.split('')[oxyPos] === '0');
    }
    oxyPos++;
  }
 
  let c02Pos = 0;
  let c02ScrubberRating = _.clone(parseContent);
  c02ScrubberRating.pop();
  while(c02ScrubberRating.length !== 1)
  {
    let acc = 0;
    _.each(c02ScrubberRating, (content) => {
      const chars = content.split('');
      acc += chars[c02Pos] === '1' ? 1 : -1;
    });
    if(acc === 0 || acc > 0){
      c02ScrubberRating = _.filter(c02ScrubberRating, (o) => o.split('')[c02Pos] === '0');
    } else {
      c02ScrubberRating = _.filter(c02ScrubberRating, (o) =>  o.split('')[c02Pos] === '1');
    }
    c02Pos++;
  }
  const oxygen = parseInt(oxygenGeneratorRating[0], 2);
  const c02 = parseInt(c02ScrubberRating[0], 2);
  console.log(oxygen * c02);

};
