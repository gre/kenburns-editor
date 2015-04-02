import KenburnsEditorRaw from "./KenburnsEditor";
import KenburnsViewer from "./KenburnsViewer";
import uncontrollable from "uncontrollable";

const KenburnsEditor = uncontrollable(KenburnsEditorRaw, {
  value: "onChange"
});

export {KenburnsEditor, KenburnsViewer};
