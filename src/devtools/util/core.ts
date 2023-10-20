import { INTERCEPTION_TARGET_API_PATH } from "../config";
import { disableCDNEscape, getDebuggingAppList, storeAppList } from "./index";

/**
 * 修改接口返回的 app 列表数据
 * @param response
 * @param debuggingAppList
 */
export function modifyAppList(response: string, debuggingAppList: ISubAppList) {
  if (!debuggingAppList?.length) {
    return response;
  }

  try {
    const res: IAppListResponse = JSON.parse(response);
    if (res?.code === 1 && res?.data?.microAppList?.length) {
      const newAppList = [...(res?.data?.microAppList ?? [])];
      debuggingAppList?.forEach((app) => {
        // 从接口返回的 app 列表中过滤出当前调试的 app 的信息
        const target = newAppList?.find((item) => item.name === app.name);
        if (target) {
          // 修改 app 的入口和 extras 配置信息
          target.entry = app.entry;
          target.extras = app.extras;
        } else {
          // 没有匹配的 app，则新增一个app
          newAppList.push(app);
        }
      });

      res.data.microAppList = newAppList;

      return JSON.stringify(res);
    }

    return response;
  } catch (error) {
    return response;
  }
}

export const modifyResponseBody: ModifyResponseBody = async (
  request: InterceptedData,
  responseBody?: string,
  tabId?: number
) => {
  if (request.method === "OPTIONS" || !responseBody || !tabId) {
    return null;
  }

  if (!request.url.includes(INTERCEPTION_TARGET_API_PATH)) {
    return null;
  }
  // 获取当前正在调试的子应用列表
  const debuggingAppList = await getDebuggingAppList();

  const modifiedBody = modifyAppList(responseBody, debuggingAppList);

  console.log(responseBody,'====');

  storeAppList({
    responseData: modifiedBody,
  });

  // 调试模式下禁用域名逃生
  disableCDNEscape(tabId);

  return modifiedBody;
};
