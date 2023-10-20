// eslint-disable-next-line import/no-unresolved

import fontPickerHTML from "url:./ui/index.html";
import pinTab from "./setupDebugger";

chrome.devtools.panels.create(
  "DILU Debugger",
  "",
  // See: https://github.com/PlasmoHQ/plasmo/issues/106#issuecomment-1188539625
  fontPickerHTML.split("/").pop() as string,
  (panel) => {
    panel.onShown.addListener(pinTab);
  }
);
