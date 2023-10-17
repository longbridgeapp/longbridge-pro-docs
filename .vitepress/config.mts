import { DefaultTheme, defineConfig } from 'vitepress'
import docs from '../docs/docs.json';

/**
 * Convert feishu-pages's docs.json into VitePress's sidebar config
 * @param docs from `docs.json`
 * @param rootSlug if provided, will find and use this node as the root.
 * @returns
 */
const convertDocsToSidebars = (
  docs: Record<string, any>[],
  rootSlug?: string
) => {
  const sidebars: DefaultTheme.SidebarItem[] = [];

  docs = docs.find((doc) => doc.slug === rootSlug)?.children || docs;

  for (const doc of docs) {
    let sidebar: DefaultTheme.SidebarItem = {
      text: doc.title,
      link: '/' + doc.slug,
    };
    if (doc.children.length > 0) {
      sidebar.items = convertDocsToSidebars(doc.children);
    }
    sidebars.push(sidebar);
  }

  return sidebars;
};

const docsSidebarEN = convertDocsToSidebars(docs, 'en');
const docsSidebarZHCN = convertDocsToSidebars(docs, 'zh-CN');
const docsSidebarZHHK = convertDocsToSidebars(docs, 'zh-HK');

console.log('docsSidebarEN', JSON.stringify(docsSidebarEN, undefined, 2))
console.log('docsSidebarZHCN', JSON.stringify(docsSidebarZHCN, undefined, 2))
console.log('docsSidebarZHHK', JSON.stringify(docsSidebarZHHK, undefined, 2))

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: process.env.NODE_ENV === 'development' ? '/' :'/release-notes/longbridge-pro-docs/',
  title: "Longbridge Pro Releases",
  description: "Longbridge Pro Releases",
  ignoreDeadLinks: true,
  locales: {
    en: {
      label: 'English',
      lang: 'en'
    },
    'zh-CN': {
      label: '简体中文',
      lang: 'zh-CN',
    },
    'zh-HK': {
      label: '繁体中文',
      lang: 'zh-HK',
    },
  },
  // cleanUrl 配合 vx.x.x.html 在 dev 模式下有 bug ，会出现无法访问的情况，暂时关闭，等 vitepress 更新版本解决
  cleanUrls: true,
  srcExclude: ['SUMMARY.md'],
  srcDir: 'docs',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      // { text: 'Releases', link: '/markdown-examples' },
      { text: 'GitHub', link: 'https://github.com/longbridgeapp/longbridge-pro-docs' }
    ],

    sidebar: {
      en: docsSidebarEN,
      'zh-CN': docsSidebarZHCN,
      'zh-HK': docsSidebarZHHK,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/longbridgeapp/longbridge-pro-docs' }
    ]
  }
})
