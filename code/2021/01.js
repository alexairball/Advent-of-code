import _ from 'lodash';

export const code_2021_01 = (fileContent) => {
    const parseContent = fileContent.split('\n').map((item) => parseInt(item, 10));
    const result1 = _.reduce(parseContent, (result, value, index) => index > 0 && parseContent[index-1] < value ? result + 1 : result, 0);
    
    const windowsTotal = [];
    _.each(parseContent, (content, index) => {
        if(index + 2 < parseContent.length){
            const subArray = _.slice(parseContent, index, index + 3);
            windowsTotal.push(_.reduce(subArray, (result, value) => result + value,0) );
        }
    });
    const result2 = _.reduce(windowsTotal, (result, value, index) => index > 0 && windowsTotal[index-1] < value ? result + 1 : result, 0);
    console.log(result1);
    console.log(result2);
};