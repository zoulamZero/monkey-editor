const syncFs = require("fs");
const { extname } = require("path");
const fs = syncFs.promises;
export interface IFlieData {
  type: string;
  idx: string;
  path: string;
  fileName: string;
  hasParent: boolean;
  subFiles: Array<IFlieData>;
  depth: number;
}
// import { IFlieData } from '../interface/fileData';

export async function getPathAllFilesData(
  path: string,
  filter: string = "",
  isRoot = true,
  hasparent?: boolean,
  parentIdx?: string,
  subFiles?: Array<IFlieData>,
  data: Array<IFlieData> = []
): Promise<Array<IFlieData> | undefined> {
  if (data.length > 0 && isRoot) {
    return data;
  }
  const fileName = await fs.readdir(path);
  for (let i = 0; i < fileName.length; i++) {
    const item = fileName[i];
    const filePath = `${path}/${item}`;
    const stat = await fs.stat(filePath);
    const isDir = stat.isDirectory();
    const idx = parentIdx ? `${parentIdx}-${i}` : i.toString();

    const depth = idx.split("-").length;
    const extName = extname(item);
    const fileData = {
      type: isDir ? "dir" : "fld",
      idx: idx,
      path: filePath,
      fileName: item,
      hasParent: hasparent ? true : false,
      subFiles: [],
      depth: depth,
      extName: extName,
    };
    // 过滤掉指定文件名后缀
    if (
      filter == "" ||
      fileData.type == "dir" ||
      fileData.extName.toLocaleLowerCase() == `.${filter}`.toLocaleLowerCase()
    ) {
      if (hasparent) {
        subFiles?.push(fileData);
      } else {
        data.push(fileData);
      }
    }

    // 递归
    if (fileData.type == "dir") {
      await getPathAllFilesData(
        fileData.path,
        filter,
        false,
        true,
        fileData.idx,
        fileData.subFiles,
        data
      );
    }

    if (i == fileName.length - 1 && isRoot) {
      return data;
    }
  }
}
