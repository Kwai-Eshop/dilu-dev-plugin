import { Button } from "antd";
import React from "react";

type TProps = {
  showSubAppInfo: boolean;
  back: () => void;
};
function Header(props: TProps) {
  const { showSubAppInfo, back } = props;
  return (
    <div className="dilu-banner">
      <div className="dilu-banner-title">
        <div className="left">
          <img
            className="icon"
            src="https://js-ec.static.yximgs.com/udata/pkg/ks-merchant/chrome-plugin-upload/2022-06-30/1656577826076.2e7a3d8db06ee077.png"
            alt=""
          />
          <div className="title">DILU DEBUGGER</div>
        </div>
        <div className="right">
          <div className="link">
            <Button
              type="link"
              href="https://github.com/Kwai-Eshop/dilu"
              target="_blank"
              rel="noreferrer"
            >
              使用文档
            </Button>
          </div>
        </div>
      </div>
      {showSubAppInfo ? (
        <div>
          <Button onClick={back} type="link">
            返回
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default Header;
