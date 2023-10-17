// Iter *.md in docs/zh-CN/**/*.md and use OpenCC to convert to docs/zh-HK/**/*.md
// Usage: node scripts/cn2hk.js

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const OpenCC = require('opencc-js');

const converter = OpenCC.Converter({ from: 'cn', to: 'hk' });

/**
 * Iterator all .md file in docs/zh-CN/ and convert to docs/zh-HK/
 */
const convert = () => {

  let content = fs.readFileSync('docs/zh-CN.md', 'utf8');
  let newContent = converter(content);
  fs.writeFileSync('docs/zh-HK.md', newContent);


  const sourceFolder = 'docs/zh-CN'; // 源文件夹
  const destinationFolder = 'docs/zh-HK'; // 目标文件夹 
  fs.ensureDirSync(destinationFolder);
  const files = fs.readdirSync(sourceFolder)
  files.forEach((file) => {
    const sourcePath = `${sourceFolder}/${file}`;
    const destinationPath = `${destinationFolder}/${file}`;
    // 复制文件
    fs.copySync(sourcePath, destinationPath);
    console.log(`复制文件：${file}`);
  })
  console.log(`所有文件从 ${sourceFolder} 到 ${destinationFolder} 复制完成。`);


  let filesHK = glob.sync('docs/zh-HK/**/*.md');
  filesHK.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = converter(content);
    fs.writeFileSync(file, newContent, 'utf8');
  });
};

const deepConvertDocIntoZhHK = (doc) => {
  let newDoc = Object.assign({}, doc);

  newDoc.title = converter(newDoc.title);
  newDoc.slug = newDoc.slug.replace('zh-CN', 'zh-HK');
  newDoc.filename = newDoc.filename.replace('zh-CN', 'zh-HK');

  if (newDoc.children) {
    newDoc.children = newDoc.children.map((child) => {
      return deepConvertDocIntoZhHK(child);
    });
  }

  return newDoc;
};

/**
 * Parse docs.json and duplicate zh-CN to zh-HK by use OpenCC to convert
 */
const convertDocsJSON = () => {
  let docs = require('../docs/docs.json');
  let newDocs = [];
  let found = false;

  docs.forEach((doc) => {
    if (doc.slug === 'zh-CN' && !found) {
      newDocs.push(doc);
      let newDoc = Object.assign({}, doc);

      newDoc.title = '繁體中文';

      newDoc = deepConvertDocIntoZhHK(newDoc);

      newDocs.push(newDoc);
      found = true;
    } else {
      newDocs.push(doc);
    }
  });

  fs.writeFileSync('docs/docs.json', JSON.stringify(newDocs, null, 2));
};

convert();
convertDocsJSON();