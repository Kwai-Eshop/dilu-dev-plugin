import { SyncOutlined } from "@ant-design/icons";
import {
  Button,
  Spin,
  List,
  Tag,
  Input,
  Space,
  Divider,
} from "antd";
import _ from "lodash";
import React, { useEffect, useState, useMemo } from "react";
import AddNewSubAppModal from "../AddNewSubAppModal";
import {
  clearAppListCache,
} from "~devtools/util";

type TProps = {
  subAppList: ISubAppInfo[];
  debuggingAppList:ISubAppList | ICreatedSubAppList;
  mainAppInfo?:IMainAppInfo;
  setCurrentAppInfo: React.Dispatch<React.SetStateAction<ISubAppInfo | undefined>>
};

function SubAppList(props: TProps) {
  const { subAppList,mainAppInfo,setCurrentAppInfo,debuggingAppList } = props;
  const [visible, setVisible] = useState(false);
  const [createdAppList, setCreatedAppList] = useState<ICreatedSubAppList>([]);
  const [subAppNameFilter, setSubAppNameFilter] = useState<string>();
  const [inputValue, setInputValue] = useState<string>();

  useEffect(() => {
    clearAppListCache();
    return () => {
      clearAppListCache();
    };
  }, []);

  const handleCreateApp = () => {
    setVisible(true);
  };

  const handleConfirm = (app: { name: string; activeRule: string }) => {
    setCreatedAppList([
      ...createdAppList,
      {
        ...app,
        mock: true,
        container: "#micro-viewport",
        type: "route",
        entry: "",
      },
    ]);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const startDebugSubApp = (appInfo: ISubAppInfo | ICreatedSubAppInfo) => {
    setCurrentAppInfo(appInfo);
  };

  const debounceSetFilter = useMemo(
    () =>
      _.debounce((value: string) => {
        setSubAppNameFilter(value);
      }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e?.target ?? {};
    setInputValue(value);
    debounceSetFilter(value);
  };

  const path = window.location.pathname;


  const sortedFullList: (ISubAppInfo | ICreatedSubAppInfo)[] = [
    ...createdAppList,
    ...subAppList,
  ].sort((a, b) => {
    if (!a.entry) {
      return -1;
    }

    if (!b.entry) {
      return -1;
    }
    const aMathResult = path.includes(a.entry) ? 1 : 0;
    const bMathResult = path.includes(b.entry) ? 1 : 0;
    return aMathResult - bMathResult;
  });

  const debuggingAppNameList = debuggingAppList.map((item) => item.name);

  const mainDetailInfo = (
    <span style={{ fontSize: "14px" }}>
      （
      <Space split={<Divider type="vertical" />}>
        <span>
          环境：
          {mainAppInfo?.env}
        </span>
        <span>
          子应用数量：
          {sortedFullList?.length ?? 0}
        </span>
        <span>
          调试中：
          {debuggingAppNameList?.length ?? 0}
        </span>
      </Space>
      )
    </span>
  );

  return (
    <Spin spinning={!mainAppInfo}>
      <List
        className="sub-app-list"
        itemLayout="horizontal"
        dataSource={sortedFullList.filter((item) =>
          subAppNameFilter ? item.name.includes(subAppNameFilter) : true
        )}
        header={
          <div className="app-list-header">
            <div>
              <div className="main-app-name">{mainDetailInfo}</div>
              <br />
              <div>
                <Input
                  placeholder="输入子应用名称筛选"
                  onChange={handleInputChange}
                  value={inputValue}
                  allowClear
                />
              </div>
            </div>
            <div>
              <Button type="default" onClick={handleCreateApp}>
                新增子应用调试
              </Button>
            </div>
          </div>
        }
        renderItem={(app) => {
          const match = app.entry && path.includes(app.entry);
          const debugging = debuggingAppNameList.includes(app.name);

          // @ts-ignore
          const isMock = app?.mock;
          return (
            <List.Item
              actions={[
                <Button
                  type="link"
                  onClick={() => {
                    startDebugSubApp(app);
                  }}
                >
                  调试子应用
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <p>
                    {match ? <Tag color="success">当前激活的应用 </Tag> : null}
                    <Tag color={isMock ? "#fba1a1" : "#6cc4a1"}>
                      {isMock ? "新增" : ""}
                      子应用
                    </Tag>
                    {debugging ? (
                      <Tag icon={<SyncOutlined spin />} color="processing">
                        调试中
                      </Tag>
                    ) : null}
                    {app.name}
                  </p>
                }
                description={
                  <p>
                    <Tag color="#4CACBC">子应用入口文件</Tag>
                    {app.entry ?? "未配置"}
                  </p>
                }
              />
            </List.Item>
          );
        }}
      />
      {visible ? (
        <AddNewSubAppModal
          visible={visible}
          onConfirm={handleConfirm}
          onClose={handleCancel}
        />
      ) : null}
    </Spin>
  );
}

export default SubAppList;
