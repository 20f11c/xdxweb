# Android APK 签名配置指南

本文档说明如何为GitHub Actions配置Android APK签名，以便自动构建发布版本的APK。

## 📋 前提条件

1. 拥有Android签名密钥文件（.jks或.keystore）
2. 知道密钥库密码、密钥别名和密钥密码
3. 拥有GitHub仓库的管理员权限

## 🔐 创建签名密钥（如果没有）

如果您还没有Android签名密钥，可以使用以下命令创建：

```bash
# 使用keytool创建新的密钥库
keytool -genkey -v -keystore xweb-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias xweb
```

按提示输入以下信息：
- 密钥库密码（请记住此密码）
- 密钥密码（可以与密钥库密码相同）
- 您的姓名、组织等信息

## ⚙️ 配置GitHub Secrets

### 1. 转换密钥文件为Base64

首先，将您的密钥文件转换为Base64编码：

**Linux/macOS:**
```bash
base64 -i xweb-release-key.jks | tr -d '\n' > keystore.base64
cat keystore.base64
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("xweb-release-key.jks")) | Out-File -Encoding ASCII keystore.base64
Get-Content keystore.base64
```

### 2. 在GitHub中添加Secrets

1. 进入您的GitHub仓库
2. 点击 `Settings` > `Secrets and variables` > `Actions`
3. 点击 `New repository secret` 添加以下secrets：

| Secret名称 | 值 | 说明 |
|-----------|----|---------|
| `KEYSTORE_BASE64` | 步骤1中生成的Base64字符串 | 密钥文件的Base64编码 |
| `KEYSTORE_PASSWORD` | 您的密钥库密码 | 创建密钥时设置的密钥库密码 |
| `KEY_ALIAS` | 您的密钥别名 | 创建密钥时设置的别名（如：xweb） |
| `KEY_PASSWORD` | 您的密钥密码 | 创建密钥时设置的密钥密码 |

### 3. 验证配置

配置完成后，当您创建新的release或推送tag时，GitHub Actions将自动：

1. 构建Web应用
2. 同步到Capacitor
3. 构建签名的Release APK
4. 将APK上传到GitHub Releases

## 🚀 使用方法

### 自动发布（推荐）

1. 创建并推送tag：
```bash
git tag v1.0.0
git push origin v1.0.0
```

2. GitHub Actions将自动构建并创建release

### 手动发布

1. 进入GitHub仓库的 `Actions` 页面
2. 选择 `Release` workflow
3. 点击 `Run workflow`
4. 输入版本号（如：v1.0.0）
5. 点击 `Run workflow`

## 📱 APK文件说明

构建完成后，您将获得以下文件：

- `xweb-v1.0.0-debug.apk`: 调试版本，用于测试
- `xweb-v1.0.0-release.apk`: 发布版本，已签名，可发布到应用商店

## 🔧 故障排除

### 常见问题

1. **构建失败："Keystore was tampered with"**
   - 检查KEYSTORE_PASSWORD是否正确
   - 确保Base64编码没有换行符

2. **构建失败："Alias does not exist"**
   - 检查KEY_ALIAS是否正确
   - 使用 `keytool -list -keystore your-key.jks` 查看可用别名

3. **构建失败："Wrong key password"**
   - 检查KEY_PASSWORD是否正确

### 调试步骤

1. 检查GitHub Actions日志中的错误信息
2. 验证所有Secrets是否正确设置
3. 确保密钥文件没有损坏

## 🔒 安全注意事项

1. **永远不要**将密钥文件直接提交到Git仓库
2. **定期更换**密钥库密码
3. **限制访问**GitHub Secrets的权限
4. **备份**您的密钥文件到安全位置

## 📚 相关资源

- [Android官方签名指南](https://developer.android.com/studio/publish/app-signing)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [Capacitor Android部署指南](https://capacitorjs.com/docs/android/deploying)

---

如有问题，请查看GitHub Actions的构建日志或提交Issue。