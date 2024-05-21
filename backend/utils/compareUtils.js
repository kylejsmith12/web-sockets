const diff = require("diff");

const compareAndNotify = (paragraph1, paragraph2) => {
  const changes = diff.diffWords(paragraph1, paragraph2);
  let diffHtml = "";

  changes.forEach((part) => {
    const color = part.added ? "green" : part.removed ? "red" : "grey";
    diffHtml += `<span style="color:${color}">${part.value}</span>`;
  });

  return diffHtml;
};

module.exports = { compareAndNotify };
