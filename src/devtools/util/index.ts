type GetDebuggingAppList = () => Promise<ISubAppInfo[]>;
/**
 * 获取正在调试的子应用列表
 */
export const getDebuggingAppList: GetDebuggingAppList = () =>
  new Promise((resolve) => {
    try {
      chrome.storage.local.get("DILU_APP_LIST", (storageData) => {
        let appList = storageData.DILU_APP_LIST;
        try {
          appList = JSON.parse(appList);
        } catch (error) {
          appList = [];
        }
        resolve(appList);
      });
    } catch (e) {
      resolve([]);
    }
  });

export const clearAppListCache = () => {
  window?.chrome?.storage?.local.set({ DILU_APP_LIST: JSON.stringify([]) });
};
/**
 * 禁用域名逃生
 */
export const disableCDNEscape = (tabId: number) => {
  chrome.tabs.sendMessage(tabId, "DISABLE_CDN_ESCAPE");
};

/**
 * 存储接口里的子应用列表
 * @param payload
 */
export const storeAppList = (payload: IStorgedAppInfo) => {
  window.chrome.runtime.sendMessage({
    type: "STORE_APP_LIST",
    data: payload,
  });
};

export const sendAttachMessage = () => {
  window.postMessage(
    {
      action: "DILU_ATTACH_DEBUGGER",
    },
    "*"
  );
};

export const reloadCurrentTab = () => {
  window.postMessage(
    {
      action: "DILU_RELOAD_CURRENT_TAB",
    },
    "*"
  );
};
