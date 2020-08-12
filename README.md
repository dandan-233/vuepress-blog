# vuepress-blog

> 

## Development

```bash
yarn dev
yarn build
# 部署到dandan-233
sh deploy.sh
```
## 提交 github
```bash
git init
git add .
git commit -m "提交描述"
# git remote add origin git@github.com:dandan-233/vuepress-blog.git
git remote add origin git@dan:dandan-233/vuepress-blog.git
git push -u origin master
```
## 关联到远程库报错

fatal: remote origin already exists.
```bash
# 删除关联
git remote rm origin
# 重新创建
git remote add origin git@dan:dandan-233/vuepress-blog.git
# 最后push到远端master
git push -u origin master
```

For more details, please head VuePress's [documentation](https://v1.vuepress.vuejs.org/).

