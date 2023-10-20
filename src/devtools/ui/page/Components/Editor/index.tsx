import React from "react";
import JSONInput from "react-json-editor-ajrm/index";
import locale from "react-json-editor-ajrm/locale/zh-cn";

type TProps = {
  json: Record<string, any>;
  editorRef?: React.LegacyRef<JSONInput> | undefined;
};
function Editor(props: TProps) {
  const { json, editorRef } = props;

  return (
    <div>
      <JSONInput
        ref={editorRef}
        // @ts-ignore
        value={json}
        placeholder={json}
        theme="light_mitsuketa_tribute"
        locale={locale}
        height="100%"
        width="100%"
      />
    </div>
  );
}

export default Editor;
