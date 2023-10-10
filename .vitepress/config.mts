import { DefaultTheme, defineConfig } from 'vitepress'
import docs from '../docs.json';

/**
 * Convert feishu-pages's docs.json into VitePress's sidebar config
 * @param docs from `docs.json`
 * @returns
 */
const convertDocsToSidebars = (docs: any) => {
  const sidebars: DefaultTheme.SidebarItem[] = [];
  for (const doc of docs) {
    let sidebar: DefaultTheme.SidebarItem = {
      text: doc.title,
      link: 'docs/' + doc.slug,
    };
    if (doc.children.length > 0) {
      sidebar.items = convertDocsToSidebars(doc.children);
    }
    sidebars.push(sidebar);
  }

  return sidebars;
};

const docsSidebar = convertDocsToSidebars(docs);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/longbridge-pro-docs/',
  title: "Longbridge Pro Releases",
  description: "Longbridge Pro Releases",
  ignoreDeadLinks: true,
  cleanUrls: true,
  srcExclude: ['SUMMARY.md'],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      // { text: 'Releases', link: '/markdown-examples' },
      { text: 'GitHub', link: 'https://github.com/longbridgeapp/longbridge-pro-docs' }
    ],

    sidebar: [
      {
        text: 'All Releases',
        items: docsSidebar
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/longbridgeapp/longbridge-pro-docs' }
    ]
  }
})
