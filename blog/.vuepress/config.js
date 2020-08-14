module.exports = {
  title: '笔记',
  description: '日常学习笔记',
  theme: '@vuepress/theme-blog', // OR shortcut: @vuepress/blog
  head: [
    ['link', { rel: 'icon', href: '/bitbug_favicon.png' }]
  ],
  themeConfig: {
    lastUpdated: 'Last Updated',
    smoothScroll: true,
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#modifyblogpluginoptions
     */
    modifyBlogPluginOptions(blogPluginOptions) {
      return blogPluginOptions
    },
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#nav
     */
    nav: [
      {
        text: 'Blog',
        link: '/',
      },
      {
        text: 'Tags',
        link: '/tag/',
        tags: true
      },
    ],
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#footer
     */
    footer: {
      contact: [
        {
          type: 'github',
          link: 'https://github.com/yunpengGit',
        },
        {
          type: 'twitter',
          link: 'https://twitter.com/_ulivz',
        },
      ],
      copyright: [
        {
          text: 'Privacy Policy',
          link: 'https://policies.google.com/privacy?hl=en-US',
        },
        {
          text: 'MIT Licensed | Copyright © 2018-present Vue.js',
          link: '',
        },
      ],
    },
  },
  plugins: ['@vuepress/back-to-top', '@vuepress/nprogress']
}
