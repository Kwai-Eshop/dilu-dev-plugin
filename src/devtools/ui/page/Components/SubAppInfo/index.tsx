import { SyncOutlined } from "@ant-design/icons";
import JSONInput from "react-json-editor-ajrm/index";
import { Tag, Select, Card, message, Button } from "antd";
import { debounce } from "lodash";
import React, { useEffect, useState, useRef } from "react";
import {
  reloadCurrentTab,
} from "~devtools/util";
import { requestSubAppVersions } from "../../api";
import { REQUEST_DOMAIN } from "../../constant";
import Editor from "../Editor";
import QuestionTooltip from "../QuestionTooltip";
import AddEntry from "./AddEntry";
import ModifyDomain from "./ModifyDomain";

const { Option } = Select;

type TProps = {
  currentAppInfo: ISubAppInfo;
  debuggingAppList: ISubAppList;
};
function SubAppInfo(props: TProps) {
  const { currentAppInfo, debuggingAppList } = props;

  const [appVersionList, setAppVersionList] = useState<IAppVersionList>([]);

  const [visible, setVisible] = useState(false);
  const [modifyDomainVisible, setModifyDomainVisible] = useState(false);

  const [selectedEntry, setSelectedEntry] = useState(currentAppInfo.entry);

  const [subDebugStatus, setSubDebugStatus] = useState(
    debuggingAppList.some((item) => item.name === currentAppInfo.name)
  );

  const [activeConfig, setActiveConfig] = useState<
    Partial<ISubAppInfo> | undefined
  >(debuggingAppList.find((item) => item.name === currentAppInfo.name));

  const [narrowMode, setNarrowMode] = useState(false);

  const editorRef = useRef<JSONInput>(null);

  const [requestDomain, setRequestDomain] = useState(REQUEST_DOMAIN);

  useEffect(() => {
    setActiveConfig(
      debuggingAppList.find((item) => item.name === currentAppInfo.name)
    );
    setSubDebugStatus(
      debuggingAppList.some((item) => item.name === currentAppInfo.name)
    );
  }, [debuggingAppList, currentAppInfo]);

  useEffect(() => {
    const getSubAppVersions = async () => {
      const appVersions = await requestSubAppVersions(
        requestDomain,
        currentAppInfo.name
      );

      setAppVersionList(appVersions);
    };

    getSubAppVersions();
  }, [currentAppInfo.name, requestDomain]);

  useEffect(() => {
    const { innerWidth } = window;

    setNarrowMode(innerWidth <= 1200);

    const handler = debounce(() => {
      setNarrowMode(window.innerWidth <= 1200);
    }, 500);
    window.addEventListener("resize", handler);

    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  const storeAppListStorage = (appList: ISubAppList) => {
    window?.chrome?.storage?.local.set({
      DILU_APP_LIST: JSON.stringify(appList),
    });
  };

  const debugEntry = (
    entry = selectedEntry,
    extraInfo = currentAppInfo.extras
  ) => {
    if (!entry) {
      message.warning("请先选择或者新增子应用入口");
      return;
    }

    // @ts-ignore
    const { error, jsObject = extraInfo } = editorRef?.current?.state ?? {};

    if (error) {
      message.warning("当前子应用配置信息有误，不是合法的 JSON 格式");
      return;
    }

    const otherList = debuggingAppList.filter(
      (item) => item.name !== currentAppInfo?.name
    );

    const newestDebugingAppList = [
      ...otherList,
      {
        ...currentAppInfo,
        name: currentAppInfo?.name,
        entry,
        extras: jsObject,
      },
    ];

    storeAppListStorage(newestDebugingAppList);

    setActiveConfig({
      name: currentAppInfo?.name,
      entry,
      extras: jsObject,
    });

    reloadCurrentTab();
    message.info(`${currentAppInfo?.name}的入口文件开始变更为${entry}`);

    setSubDebugStatus(true);
  };

  const handleEditEntry = () => {
    setVisible(true);
  };

  const onConfirm = (entry: string) => {
    setAppVersionList([
      {
        entry,
        manualAdd: true,
      },
      ...appVersionList,
    ]);

    setSelectedEntry(entry);

    if (subDebugStatus) {
      debugEntry(entry);
    }

    setVisible(false);
  };

  const modifyDomain = (domain: string) => {
    setRequestDomain(domain);
    message.success(`子应用版本请求域名更新为${domain}，数据已更新`);
    setModifyDomainVisible(false);
  };

  const handleSelectChange = (value: string) => {
    setSelectedEntry(value);
    if (subDebugStatus) {
      debugEntry(value);
    }
  };

  const debugSubAppConfig = () => {
    debugEntry();
  };

  const appInfoCombine = {
    ...currentAppInfo,
    ...activeConfig,
  };
  return (
    <div>
      <Card
        className="sub-app-content"
        bordered={false}
        title={
          <div className="title">
            <span className="sub-app-name">
              配置子应用：
              {appInfoCombine?.name}
              {subDebugStatus ? (
                <Tag
                  icon={<SyncOutlined spin />}
                  color="processing"
                  style={{ marginLeft: "10px" }}
                >
                  调试中
                </Tag>
              ) : null}
            </span>
            <Button type="primary" onClick={debugSubAppConfig}>
              应用此子应用配置
            </Button>
          </div>
        }
      >
        <div className="debug-info-container">
          <div className="app-version-container">
            <div
              className={`sub-app-config-box ${
                narrowMode ? "narrow-mode-box" : ""
              }`}
            >
              <div className="desc">
                <div>
                  <span className="desc-label">当前入口文件:</span>
                  <span className="desc-value">
                    {appInfoCombine?.entry ?? "未配置"}
                  </span>
                </div>
                <div>
                  <span className="desc-label">路由激活规则:</span>
                  <span className="desc-value">
                    {appInfoCombine?.activeRule}
                  </span>
                </div>
                <div>
                  <span className="desc-label">挂载DOM节点:</span>
                  <span className="desc-value">
                    {appInfoCombine?.container}
                  </span>
                </div>
              </div>
              <div className="main-config">
                <div className="app-info-item">
                  <span className="label">
                    入口文件
                    <QuestionTooltip content="默认获取当前环境最新20条记录" />:
                  </span>
                  <div className="app-info-content">
                    <Select
                      style={{ width: "80%", minWidth: "400px" }}
                      defaultValue={currentAppInfo?.entry}
                      onChange={handleSelectChange}
                      value={selectedEntry}
                    >
                      {appVersionList?.map((item) => (
                        <Option value={item.entry}>
                          <div className="entry-item">
                            <div className="entry-title">
                              {item.manualAdd ? (
                                <Tag color="cyan">手动添加</Tag>
                              ) : null}
                              {item.entry}
                            </div>
                            {item.manualAdd ? null : (
                              <div className="entry-desc">
                                <span>
                                  构建人：
                                  {item?.buildRecord?.builder}
                                </span>
                                <span>
                                  构建时间：
                                  {item.updatedAt}
                                </span>
                                <span>
                                  构建分支：
                                  {item?.buildRecord?.buildBranch}
                                </span>
                              </div>
                            )}
                          </div>
                        </Option>
                      ))}
                    </Select>
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleEditEntry}
                      className="edit-entry-btn"
                    >
                      添加入口
                    </Button>
                    <div>
                      <a
                        onClick={() => {
                          setModifyDomainVisible(true);
                        }}
                      >
                        修改子应用版本请求域名
                      </a>
                    </div>
                  </div>
                </div>
                <div className="app-info-item">
                  <span className="label">子应用配置信息:</span>
                  <div className="app-info-content">
                    <Editor
                      json={currentAppInfo.extras ?? {}}
                      editorRef={editorRef}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {visible ? (
        <AddEntry
          visible={visible}
          onConfirm={onConfirm}
          onCancel={() => {
            setVisible(false);
          }}
        />
      ) : null}
      {modifyDomainVisible ? (
        <ModifyDomain
          visible={modifyDomainVisible}
          onConfirm={modifyDomain}
          onCancel={() => {
            setModifyDomainVisible(false);
          }}
          initialValues={{ domain: requestDomain }}
        />
      ) : null}
    </div>
  );
}

export default SubAppInfo;
