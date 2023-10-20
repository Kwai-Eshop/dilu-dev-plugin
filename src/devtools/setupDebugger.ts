import { INTERCEPTION_TARGET_API_PATH } from "./config";
import { Debuggee } from "./debuggee";
import { Interception } from "./interception";
import type { Intercepted } from "./request";
import { modifyResponseBody } from "./util/core";

let CURRENT_TARGET: chrome.tabs.Tab | null = null;

/**
 * 启动调试
 * @param tab
 */
async function setupDebugger(tab: chrome.tabs.Tab) {
  const dbg: Debuggee = new Debuggee(tab);

  try {
    await dbg.attach();
  } catch (e) {
    console.error(e);
    alert(
      `Failed to attach to ${tab.url} - probably because of enterprise policies.`
    );
    return;
  }

  // 通知 UI 开始拦截
  window.chrome.runtime.sendMessage({
    type: "ATTACH_DEBUGGER",
  });

  const interception: Interception = Interception.build(dbg);

  await interception.capture([
    {
      urlPattern: `*${INTERCEPTION_TARGET_API_PATH}`,
      requestStage: "Response",
    },
  ]);

  await interception.onResponse(async (res: Intercepted) => {
    if (res.status && [301, 302].includes(res.status)) {
      await res.continueResponse(res);
      return;
    }

    const body = await res.getResponseBody();

    const modifiedBody = await modifyResponseBody(
      res,
      body,
      CURRENT_TARGET?.id
    );

    if (!modifiedBody) {
      await res.continueResponse(res);
      return;
    }

    await res.continueResponse({
      ...res,
      responseBody: modifiedBody,
    });
  });

  chrome.debugger.onDetach.addListener(() => {
    window.chrome.runtime.sendMessage({
      type: "DETACH_DEBUGGER",
    });
  });

  await dbg.waitForDetach();
}

/**
 * 开始调试
 */
function startDebug() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (tab) {
      CURRENT_TARGET = tab;
      setupDebugger(tab);
    }
  });
}

const reloadCurrentTab = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.reload(tabs?.[0].id as number);
  });
}
/**
 * 创建 devtools 面板
 * @param panelWindow
 */
export default function pinTab(panelWindow: Window) {
  panelWindow.addEventListener("message", (event) => {
    if (event.source !== panelWindow) {
      return;
    }
    const message = event.data;

    switch (message.action) {
      case "DILU_ATTACH_DEBUGGER":
        startDebug();
        break;
      case "DILU_RELOAD_CURRENT_TAB":
        reloadCurrentTab();
        break;
      default:
       break;
    }
  });
}
