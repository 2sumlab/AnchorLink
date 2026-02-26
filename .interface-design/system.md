# AnchorLink — Interface Design System

## Intent

**Who:** 开发者/power user，偶尔打开配置，30 秒内完成操作后离开。
**What:** 设置两个目录路径，保存。
**Feel:** macOS 系统工具感 — 精确、克制、属于 OS，不是 web app。

---

## Palette

| Token | Value | 用途 |
|---|---|---|
| `--bg-base` | `#f2f2f7` | 窗口背景（macOS 系统灰） |
| `--surface` | `#ffffff` | 卡片、输入框聚焦态 |
| `--surface-inset` | `rgba(0,0,0,0.03)` | 输入框默认背景（内凹感） |
| `--border` | `rgba(0,0,0,0.09)` | 卡片边框 |
| `--border-input` | `rgba(0,0,0,0.12)` | 输入框边框 |
| `--border-divider` | `rgba(0,0,0,0.07)` | 卡片内分隔线 |
| `--border-button` | `rgba(0,0,0,0.14)` | 次级按钮边框 |
| `--text-primary` | `#1d1d1f` | 主文字 |
| `--text-secondary` | `#6e6e73` | badge 文字 |
| `--text-tertiary` | `#8e8e93` | section label、url-op 描述 |
| `--text-placeholder` | `#c7c7cc` | 输入框 placeholder |
| `--accent` | `#0071e3` | 主按钮、focus ring |
| `--accent-hover` | `#0077ed` | 主按钮 hover |
| `--accent-active` | `#006ad0` | 主按钮 active |
| `--success` | `#34c759` | 保存成功状态、server 运行指示点 |

---

## Depth Strategy

**Borders-only** — 无阴影，用 rgba border 定义层次边界。适合精密工具类界面。

- 卡片：`border: 1px solid rgba(0,0,0,0.09)`
- 输入框：`border: 1px solid rgba(0,0,0,0.12)`
- 按钮：`border: 1px solid rgba(0,0,0,0.14)`
- 分隔线：`background: rgba(0,0,0,0.07)`

---

## Spacing

Base unit: **7px**

| 用途 | 值 |
|---|---|
| 窗口内边距 | `22px 28px 24px` |
| 卡片内边距 | `14px 16px` |
| 字段行间距（gap） | `7px` |
| 卡片内字段分隔线外边距 | `12px 0` |
| 卡片与保存按钮间距 | `10px` |
| 保存行与 URL 区间距 | `16px` |
| URL item 内边距 | `9px 14px` |

---

## Typography

字体栈：`-apple-system, BlinkMacSystemFont, sans-serif`
代码字体：`'SF Mono', Monaco, Menlo, monospace`

| 层级 | Size | Weight | Color |
|---|---|---|---|
| 页面标题 | 16px | 600 | `#1d1d1f` |
| 字段标签 | 12px | 500 | `#1d1d1f` |
| 正文 / 输入 | 13px | 400 | `#1d1d1f` |
| Section label | 11px | 600 | `#8e8e93`，uppercase，letter-spacing 0.5px |
| URL 操作描述 | 11px | 400 | `#8e8e93` |
| 代码块 | 10.5px | 400 | `#3a3a3c` |
| Badge 文字 | 11px | 400 | `#6e6e73` |

---

## Border Radius

| 元素 | 值 |
|---|---|
| 卡片 | `12px` |
| 输入框、按钮 | `7px` |
| 代码块 | `5px` |
| URL hint 容器 | `10px` |
| Server badge | `20px` |

---

## Components

### Settings Card
白色卡片包裹所有设置字段，字段间用 1px 分隔线分组。
```css
background: #fff;
border: 1px solid rgba(0,0,0,0.09);
border-radius: 12px;
padding: 14px 16px;
```

### Input
内凹背景暗示"可输入"，聚焦时变白 + 蓝色 focus ring。
```css
background: rgba(0,0,0,0.03);
border: 1px solid rgba(0,0,0,0.12);
border-radius: 7px;
height: 30px;
/* focus */
border-color: #0071e3;
box-shadow: 0 0 0 3px rgba(0,113,227,0.18);
background: #fff;
```

### Button（次级）
```css
background: #fff;
border: 1px solid rgba(0,0,0,0.14);
border-radius: 7px;
font-size: 12.5px;
font-weight: 500;
height: 30px;
/* hover */ background: #f5f5f7;
/* active */ background: #ebebf0;
```

### Button（主要）
```css
background: #0071e3;
border-color: transparent;
color: #fff;
/* hover */ background: #0077ed;
/* active */ background: #006ad0;
/* saved 状态 */ background: #34c759;
```

### Server Badge
显示服务运行状态，放在 Header 右侧。
```css
display: flex; align-items: center; gap: 5px;
background: rgba(0,0,0,0.06);
border-radius: 20px;
padding: 3px 9px 3px 7px;
font-size: 11px; color: #6e6e73;
/* dot */ width: 6px; height: 6px; border-radius: 50%; background: #34c759;
```

### URL Reference Section
Section label 在卡片外（上方），卡片内每条 URL 独立展示：操作描述（11px gray）+ 代码块。
```css
/* 容器 */
background: #fff;
border: 1px solid rgba(0,0,0,0.09);
border-radius: 10px;
overflow: hidden;

/* 每条 url-item */
padding: 9px 14px;
border-bottom: 1px solid rgba(0,0,0,0.06);

/* 代码块 */
background: #f2f2f7;
padding: 3px 8px;
border-radius: 5px;
font-size: 10.5px;
display: block;
word-break: break-all;
```

---

## Window

```js
width: 540,
height: 560,
resizable: false,
backgroundColor: '#f2f2f7',
```
