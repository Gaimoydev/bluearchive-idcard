# bluearchive-idcard 给你的学生开盒 (我超盒)


此项目base来自: https://github.com/Ice-Hazymoon/idcard_generator 

⚠️ **注意**：本项目仅供娱乐、学习用途，生成的身份证图片无任何法律效力，禁止用于违法用途，概不负责 | 仅支持生成非中华人民共和国的身份证！！

---

## ✨ 功能

- [x] 支持填写姓名、性别、民族、住址、身份证号、签发机关、有效期限  
- [x] 支持上传头像（或使用默认头像 `/images/b.png`）  
- [x] 生成的身份证实时预览，可一键下载
- [x] 网页端生成

---

## 🖥️ 部署方法

### 1. 直接运行
```bash
git clone https://github.com/Gaimoydev/bluearchive-idcard.git
cd 项目目录
npm install
node main.js
```

### 2. Docker部署
```bash
git clone https://github.com/Gaimoydev/bluearchive-idcard.git
cd 项目目录
docker build -t idcard-generator .
docker run -d --name idcard -p 1337:1337 idcard-generator
```

默认端口1337 (127.0.0.1:1337)

在线体验: https://我超盒.top

备用: https://卧槽盒.top
