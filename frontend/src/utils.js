import React from "react";
import { diffWords } from "diff";

export const diffAndNotify = (paragraph1, paragraph2) => {
  const diffResult = diffWords(paragraph1, paragraph2);
  let diffOutput = "";
  diffResult.forEach((part) => {
    if (part.added) {
      diffOutput += `<span style="background-color: #d4edda;">${part.value}</span>`;
    } else if (part.removed) {
      diffOutput += `<span style="text-decoration: line-through; color: #f8d7da;">${part.value}</span>`;
    } else {
      diffOutput += `<span>${part.value}</span>`;
    }
  });
  return diffOutput;
};

export const showToastWithDiff = (paragraph1, paragraph2) => {
  const diffOutput = diffAndNotify(paragraph1, paragraph2);
  return <div dangerouslySetInnerHTML={{ __html: diffOutput }} />;
};
