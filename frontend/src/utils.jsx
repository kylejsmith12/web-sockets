import { diffWords } from "diff";
import { toast } from "react-toastify";

export const compareAndNotify = (paragraph1, paragraph2) => {
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

export const showToastWithDiff = (paragraph1, paragraph2) => {
  const diffOutput = compareAndNotify(paragraph1, paragraph2);
  console.log(diffOutput);
  toast(<div dangerouslySetInnerHTML={{ __html: diffOutput }} />, {
    type: "info",
  });
};
