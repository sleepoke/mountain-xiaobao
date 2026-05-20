# Mountain 小宝部署说明

## 推荐流程

1. 把本目录推送到 GitHub 仓库。
2. 在 Netlify 选择 `Add new site` -> `Import an existing project`。
3. 授权 GitHub，然后选择这个仓库。
4. Build command 留空，Publish directory 使用 `.`。
5. 部署完成后，用 Netlify 给出的 HTTPS 地址在手机 Safari/Chrome 打开。

## iPhone 添加到主屏幕

1. 用 Safari 打开 Netlify 的 HTTPS 地址。
2. 点击分享按钮。
3. 选择“添加到主屏幕”。
4. 之后从桌面图标打开，会以接近 App 的方式运行。

## 后续更新

每次修改游戏后，把改动提交并推送到 GitHub。Netlify 会自动重新部署，同一个网址会更新到最新版。

如果更新后手机仍显示旧版，先关闭页面重新打开；必要时在浏览器设置里清理该网站缓存。
