import "./App.css";
import * as React from "react";
import { useEffect, useState } from "react";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";
import { getPathAllFilesData, IFlieData } from "./util/getPath";

export default function App() {
  const [data, setData] = useState<IFlieData[] | []>([]);
  getPathAllFilesData("C:/Users/Zz/Desktop/monkey-editor").then((tempData) => {
    setData(tempData ? tempData : []);
  });
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      <Tree fileData={data} />
    </TreeView>
  );
}

interface TreeProps {
  fileData: IFlieData[];
}
function Tree({ fileData }: TreeProps) {
  return (
    <>
      {fileData.map((item, index) => {
        if (item.subFiles.length > 0) {
          return (
            <TreeItem nodeId={item.idx} key={item.idx} label={item.fileName}>
              <Tree fileData={item.subFiles} />
            </TreeItem>
          );
        } else {
          return (
            <TreeItem nodeId={item.idx} key={item.idx} label={item.fileName} />
          );
        }
      })}
    </>
  );
}
