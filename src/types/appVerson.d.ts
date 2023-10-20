interface IBuildRecord {
  buildBranch: string;
  builder: string;
  commitId: string;
  flashId: string;
  id: number;
  laneId: string;
}

interface ISubAppVersionReplenish {
  effectScale: string;
  id: number;
  laneId: string;
}

interface IVersionStatusModel {
  id: string;
  releaseDesc: string;
  approveUrl: string;
  entityId: string;
  status: EVersionStatus;
  updatedAt: string;
}

interface ISubApp {
  id: string;
  subName: string;
  principal: IPrincipal[];
  creator: string;
  subDesc: string;
}

interface IEnvInfo {
  key: string;
  name: string;
}

interface IAppVersion {
  id?: string;
  subApp?: ISubApp;
  env?: IEnvInfo;
  buildRecord?: IBuildRecord;
  entry: string;
  replenish?: ISubAppVersionReplenish;
  versionStatus?: IVersionStatusModel;
  updatedAt?: string;
  manualAdd?: boolean;
}

type IAppVersionList = IAppVersion[];
