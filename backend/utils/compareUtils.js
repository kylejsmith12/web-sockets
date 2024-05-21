// utils/compareUtils.js
const { diffWords } = require("diff");

const compareAndNotify = (paragraph1, paragraph2) => {
  const diffResult = diffWords(paragraph1, paragraph2);
  let diffOutput = "";
  diffResult.forEach((part) => {
    if (part.added) {
      diffOutput += `<span style="background-color: #d4edda;">${part.value}</span>`;
    } else if (part.removed) {
      diffOutput += `<span style="text-decoration: line-through">${part.value}</span>`;
    } else {
      diffOutput += `<span>${part.value}</span>`;
    }
  });
  return diffOutput;
};

module.exports = { compareAndNotify };
