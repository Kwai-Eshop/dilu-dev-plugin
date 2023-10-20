declare module "react-json-editor-ajrm/locale/zh-cn";

interface Extra {
  basename?: string;
  rules: Record<string, any>;
}

interface ISubAppInfo {
  name: string;
  activeRule?: string;
  container: string;
  extras?: Extra;
  entry?: string;
  type: string;
}

interface ICreatedSubAppInfo {
  name: string;
  activeRule?: string;
  extras?: Extra;
  container: string;
  entry: string;
  type: string;
  mock: true;
}

type ISubAppList = ISubAppInfo[];
type ICreatedSubAppList = ICreatedSubAppInfo[];

type MainEnv = "test" | "prt" | "prod" | "";

interface IMainAppInfo {
  env: MainEnv;
}

interface InterceptedData {
  id: string;
  method: string;
  url: string;
  requestHeaders: { name: string; value: string }[];
  requestBody?: string | null;
  status?: number;
  responseHeaders?: { name: string; value: string }[];
  responseBody?: string | null;
}

interface IAppListResponse {
  code: number;
  msg: string;
  data: {
    env: MainEnv;
    microAppList: ISubAppInfo[];
  };
}

interface IStorgedAppInfo {
  responseData: any;
}

type ModifyResponseBody = (
  request: InterceptedData,
  responseBody?: string,
  tabId?: number
) => Promise<string | null | undefined>;
