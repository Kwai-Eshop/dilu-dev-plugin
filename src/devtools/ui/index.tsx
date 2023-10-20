import ConfigProvider from "antd/es/config-provider";
import zhCN from "antd/locale/zh_CN";
import React from "react";
import { createRoot } from 'react-dom/client';
import MainPage from "./page";
import "./index.less";

function App() {
  return (
    <ConfigProvider
      {...{
        locale: zhCN,
        className: "devtool-config-provider",
      }}
    >
      <div className="devtool-wrapper">
        <MainPage />
      </div>
    </ConfigProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container as Element);
root.render(<App />);
