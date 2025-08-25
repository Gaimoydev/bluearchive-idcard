const express = require('express');
const path = require('path');
const multer = require('multer');
const idcardGenerator = require('./idcard');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));

app.post('/idcard', upload.single('avatar'), async (req, res) => {
    try {
        const config = req.body;

        if (req.file && req.file.buffer) {
            config.avatarBuffer = req.file.buffer; // ✅ buffer 传进 config
        } else {
            config.avatar = './images/b.png';
        }

        const buffer = await idcardGenerator(config);

        res.set({
            'Content-Type': 'image/png',
            'Content-Disposition': 'attachment; filename=idcard.png'
        });
        res.send(buffer);

    } catch (err) {
        console.error("❌ API 生成失败:", err.message);
        res.status(500).send('生成失败: ' + err.message);
    }
});


const PORT = 1337;
app.listen(PORT, () => {
  console.log(`🚀 服务已启动: http://localhost:${PORT}`);
});
