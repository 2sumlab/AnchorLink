# AnchorLink

一个运行在 macOS 状态栏的轻量工具。在本地启动 HTTP 服务（端口 19283），让 Notion、浏览器书签等任意支持超链接的工具，能直接打开或自动创建本地文件/文件夹，并支持与 Obsidian Vault 联动。

## 工作原理

AnchorLink 在后台运行一个本地 HTTP 服务（`localhost:19283`）。通过访问特定 URL，可触发打开或新建本地文件的操作。在 Notion 等工具中将这些 URL 保存为超链接，点击即可直达本地文件。

关闭设置窗口后服务继续在后台运行，可通过状态栏图标随时唤起。

## URL 用法

| URL | 说明 |
|---|---|
| `http://localhost:19283/open-file?path=notes/todo.md` | 打开文件 |
| `http://localhost:19283/open-or-create?path=notes/todo.md` | 文件不存在则新建 |
| `http://localhost:19283/open-or-create?path=projects&type=folder` | 文件夹不存在则新建 |
| `http://localhost:19283/obsidian-open-or-create?file=Notes/todo.md` | Obsidian — 存在则打开，否则新建 |

`path` 支持绝对路径，也支持相对路径（基于设置中的「根目录」解析）。

## 安装

### 方式一：下载打包版（推荐）

从 [Releases](https://github.com/2sumlab/AnchorLink/releases) 下载最新的 `AnchorLink.app`，拖入 `/Applications` 即可。

### 方式二：从源码运行

```shell
npm install
npm start
```

### 打包为 .app

```shell
npm run make
```

打包结果在 `out/` 目录。

## 配置

首次启动后点击状态栏图标 → **设置**：

- **根目录** — 相对路径的解析基准。例如设置为 `/Users/dan/Notes`，则 `path=todo.md` 即指向 `/Users/dan/Notes/todo.md`
- **Obsidian Vault** — `obsidian-open-or-create` 接口所用的 Vault 路径，Vault 名称自动从路径末段派生

每个字段均有独立的「保存」按钮，修改后分别保存即可。

## 开机自启

1. 打开「系统设置」→「通用」→「登录项」
2. 点击 `+`，选择 `AnchorLink.app`

## 依赖

- [Electron](https://www.electronjs.org/) v34
- [Express](https://expressjs.com/) v4

## 关于

**二加实验室** · [2sumlab.notion.site](https://2sumlab.notion.site/)

Licensed under the [MIT License](./LICENSE.md)
