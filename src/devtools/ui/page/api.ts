import request from "./request";

export const requestSubAppVersions = async (
  requestDomain: string,
  appName: string
) => {
  const res = await request(`${requestDomain}/rest/api/getSubAppVersions`, {
    method: "post",
    data: {
      appName,
      pageSize: 20,
      pageNo: 1,
      versionType: "test",
    },
  });

  const response = res?.data?.result ?? {};
  if (response?.result === 1) {
    return response?.data?.list ?? [];
  }

  return [];
};
