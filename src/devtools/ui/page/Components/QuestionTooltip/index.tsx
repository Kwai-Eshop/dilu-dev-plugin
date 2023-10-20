import { QuestionCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React from "react";

type TProps = {
  title?: string | React.ReactElement | null;
  content?: string | React.ReactElement | null;
  theme?: "black" | "white";
};
function QuestionTooltip(props: TProps) {
  const { title, content, theme } = props;

  const styleProps =
    theme === "black"
      ? {}
      : {
          color: "#fff",
          overlayInnerStyle: { color: "#000" },
        };

  return (
    <Tooltip
      title={
        <span>
          {title ? <div className="question-tooltip-title">{title}</div> : null}
          <span>{content}</span>
        </span>
      }
      {...styleProps}
    >
      <QuestionCircleOutlined style={{ marginLeft: "5px" }} />
    </Tooltip>
  );
}
export default QuestionTooltip;
