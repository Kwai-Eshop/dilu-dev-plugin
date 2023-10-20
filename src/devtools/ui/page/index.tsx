import { Button, Empty } from "antd";
import React, { useEffect, useState, useRef } from "react";
import {
  getDebuggingAppList,
  clearAppListCache,
  sendAttachMessage,
  reloadCurrentTab,
} from "~devtools/util";
import SubAppList from "./Components/SubAppList";
import Header from "./Components/Header";
import SubAppInfo from "./Components/SubAppInfo";
import { getAppListInfo } from "./util";
import { DATA_LOAD_TIMEOUT } from './constant';

function Micro() {
  const [mainAppInfo, setMainAppInfo] = useState<IMainAppInfo | undefined>(
    undefined
  );

  const [subAppList, setSubAppList] = useState<ISubAppInfo[]>( [] );

  const [currentAppInfo, setCurrentAppInfo] = useState<ISubAppInfo | undefined>();

  const [dataLoaded, setDataLoaded] = useState<boolean>( false );

  const [debuggingAppList, setDebuggingAppList] = useState<ISubAppList | ICreatedSubAppList>( [] );

  const [debugMode, setDebugMode] = useState( false );

  const [dataLoadTimeout, setDataLoadTimeout] = useState( false );

  const [showSubAppInfo, setShowSubAppInfo] = useState( false );

  const debugModeRef = useRef( debugMode );

  const dataLoadedRef = useRef( dataLoaded );

  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect( () => {
    debugModeRef.current = debugMode;
  }, [debugMode] )

  useEffect( () => {
    dataLoadedRef.current = dataLoaded;
  }, [dataLoaded] )

  useEffect( () => {
    clearAppListCache();
    return () => {
      clearAppListCache();
    };
  }, [] );

  const updateDebuggingAppList = async () => {
    const list = await getDebuggingAppList();
    setDebuggingAppList( list );
  };

  useEffect( () => {
    window?.chrome?.runtime?.onMessage?.addListener( (message) => {
      if ( message?.type === "STORE_APP_LIST" ) {
        const { responseData } = message?.data ?? {};
        const { env, appList } = getAppListInfo( responseData );
        setMainAppInfo( {
          env: env as MainEnv,
        } );
        setSubAppList( appList );
        setDataLoaded( true );
      }

      if ( message?.type === "DETACH_DEBUGGER" ) {
        setDebugMode( false );
        setDataLoaded( false );
        reloadCurrentTab();
        setSubAppList( [] );
        setCurrentAppInfo( undefined );
      }

      if ( message?.type === "ATTACH_DEBUGGER" ) {
        setDebugMode( true );
      }
    } );

    updateDebuggingAppList();
  }, [] );

  const back = () => {
    setCurrentAppInfo( undefined );
    setShowSubAppInfo( false );
    updateDebuggingAppList();
  };

  const startDebugMode = () => {
    setDataLoadTimeout(false)
    if ( !debugMode ) {
      sendAttachMessage();
    }

    setTimeout( () => {
      reloadCurrentTab();
    }, 100 );

    if(timerRef.current){
      clearTimeout( timerRef.current );
    }

    timerRef.current = setTimeout( () => {
      if ( debugModeRef.current && !dataLoadedRef.current ) {
        setDataLoadTimeout( true );
      }
    }, DATA_LOAD_TIMEOUT );
  };

  const getContent = () => {
    if ( !debugMode && !dataLoaded ) {
      return (
        <div className="empty-wrap">
          <Empty description="开启调试模式后需要重新加载当前页面来获取页面的微前端应用信息以开启此应用的调试">
            <Button type="primary" onClick={startDebugMode}>
              开启调试模式
            </Button>
          </Empty>
        </div>
      );
    }

    if ( dataLoadTimeout ) {
      return <div className="empty-wrap">
        <Empty description="获取应用列表超时，请检查当前页面是否为DILU微前端主应用或者点击重试">
          <Button type="primary" onClick={startDebugMode}>
            开启调试模式
          </Button>
        </Empty></div>;
    }

    if ( showSubAppInfo ) {
      return (
        <SubAppInfo
          currentAppInfo={currentAppInfo as ISubAppInfo}
          debuggingAppList={debuggingAppList}
        />
      );
    }

    return <SubAppList
      subAppList={subAppList}
      mainAppInfo={mainAppInfo}
      setCurrentAppInfo={setCurrentAppInfo}
      debuggingAppList={debuggingAppList}
    />;
  };

  return (
    <div style={{ height: "100%" }}>
      <Header showSubAppInfo={showSubAppInfo} back={back}/>
      <div className="dilu-toolbar">{getContent()}</div>
    </div>
  );
}

export default Micro;
