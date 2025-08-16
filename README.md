# xweb - React + Capacitor 跨平台应用

一个基于 React + Vite + Capacitor 的现代跨平台应用，支持 Web 和 Android 平台。

## ✨ 特性

- 🚀 **现代技术栈**: React 18 + Vite + Capacitor
- 📱 **跨平台支持**: Web (H5) + Android APP
- 🎨 **移动端优化**: 使用 antd-mobile 组件库
- 📐 **响应式设计**: 适配移动端、PC端和大屏设备
- 🔄 **自动化构建**: GitHub Actions CI/CD
- 📦 **自动发布**: 自动构建和发布 Android APK

## 🛠️ 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **移动端框架**: Capacitor
- **UI组件库**: antd-mobile
- **路由**: React Router
- **代码规范**: ESLint
- **CI/CD**: GitHub Actions

## 📦 快速开始

### 环境要求

- Node.js >= 20
- npm >= 10
- Android Studio (用于Android开发)
- Java 17+ (用于Android构建)

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 启动Web开发服务器
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建项目

```bash
# 构建Web应用
npm run build

# 同步到Capacitor
npx cap sync android

# 在Android Studio中打开项目
npx cap open android
```

## 📱 Android 开发

### 首次设置

1. 安装 Android Studio
2. 配置 Android SDK
3. 创建虚拟设备或连接真机

### 构建 APK

```bash
# 构建Web应用
npm run build

# 同步到Android
npx cap sync android

# 在Android项目目录中构建APK
cd android
./gradlew assembleDebug
```

生成的APK位于: `android/app/build/outputs/apk/debug/app-debug.apk`

## 🚀 自动化部署

项目配置了完整的 GitHub Actions CI/CD 流程：

### CI 流程 (每次推送)

- ✅ 代码检查 (ESLint)
- 🏗️ 构建 Web 应用
- 📱 构建 Android APK (仅主分支)
- 📤 上传构建产物

### 发布流程 (创建 Tag)

- 🏗️ 自动构建 Web 和 Android
- 🔐 签名 APK (如果配置了密钥)
- 📋 创建 GitHub Release
- 📤 自动上传 APK 文件

### 创建发布

```bash
# 创建并推送标签
git tag v1.0.0
git push origin v1.0.0
```

或在 GitHub Actions 页面手动触发发布工作流。

## 🔐 APK 签名配置

要构建发布版本的 APK，需要配置签名密钥。详细步骤请参考：

📖 [APK 签名配置指南](.github/SIGNING_SETUP.md)

## 📁 项目结构

```
xweb/
├── .github/
│   ├── workflows/          # GitHub Actions 工作流
│   └── SIGNING_SETUP.md    # 签名配置指南
├── android/                # Android 项目文件
├── src/
│   ├── components/         # React 组件
│   ├── pages/             # 页面组件
│   ├── styles/            # 样式文件
│   ├── hooks/             # 自定义 Hooks
│   └── utils/             # 工具函数
├── public/                # 静态资源
├── capacitor.config.json  # Capacitor 配置
└── package.json           # 项目配置
```

## 🎯 开发指南

### 添加新页面

1. 在 `src/pages/` 创建新的页面组件
2. 在 `src/App.jsx` 中添加路由配置
3. 更新导航组件 (如需要)

### 添加新组件

1. 在 `src/components/` 创建组件文件
2. 在对应的 `src/styles/` 创建样式文件
3. 在需要的地方导入使用

### 移动端适配

- 使用 antd-mobile 组件库
- 遵循移动端设计规范
- 测试不同屏幕尺寸

## 🔧 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览构建结果
npm run lint             # 代码检查

# Capacitor
npx cap sync android     # 同步到Android
npx cap open android     # 打开Android Studio
npx cap run android      # 运行Android应用

# Git
git add .                # 添加所有更改
git commit -m "message"  # 提交更改
git push origin main     # 推送到远程仓库
git tag v1.0.0           # 创建标签
git push origin v1.0.0   # 推送标签（触发发布）
```

## 🐛 故障排除

### 常见问题

1. **Android 构建失败**
   - 检查 Java 版本 (需要 17+)
   - 确保 Android SDK 已正确安装
   - 清理并重新构建: `cd android && ./gradlew clean`

2. **Capacitor 同步失败**
   - 确保已运行 `npm run build`
   - 检查 `capacitor.config.json` 配置
   - 重新安装依赖: `npm ci`

3. **GitHub Actions 失败**
   - 检查工作流日志
   - 验证签名配置 (如果构建发布版本)
   - 确保所有依赖都在 `package.json` 中

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系

如有问题，请提交 Issue 或联系项目维护者。
