// utils/getSampleFiles.ts
import fs from "fs";
import path from "path";

export type SampleFile = {
  label: string;
  path: string;
};

export const getSampleFiles = (basePath: string): SampleFile[] => {
  const sampleFiles: SampleFile[] = [];

  const traverseDirectory = (currentPath: string) => {
    const files = fs.readdirSync(currentPath);
    files.forEach((file) => {
      const filePath = path.join(currentPath, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        traverseDirectory(filePath);
      } else if (file.endsWith(".xml")) {
        // public klasöründen göreceli yol oluşturuyoruz
        const publicPath = path.join(process.cwd(), "public");
        let relativePath = filePath.replace(publicPath, "");
        // Windows'ta oluşan ters eğik çizgileri ileri eğik çizgiye çevirin:
        relativePath = relativePath.replace(/\\/g, "/");
        if (!relativePath.startsWith("/")) {
          relativePath = "/" + relativePath;
        }
        sampleFiles.push({
          label: file,
          path: relativePath,
        });
      }
    });
  };

  traverseDirectory(basePath);
  return sampleFiles;
};
