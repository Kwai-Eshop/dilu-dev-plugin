export const getAppListInfo = (responseData: string) => {
  try {
    const response: IAppListResponse = JSON.parse(responseData ?? "{}");
    return {
      appList: response?.data?.microAppList ?? [],
      env: response?.data?.env,
    };
  } catch (e) {
    return {
      appList: [],
      env: "",
    };
  }
};
