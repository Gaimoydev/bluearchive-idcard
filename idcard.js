const sharp = require('sharp');
const TextToSVG = require('text-to-svg');
const path = require('path');

function getFontImg(_path, text, fontSize, letterSpacing) {
    try {
        const svg = TextToSVG.loadSync(path.resolve(__dirname, _path)).getSVG(text || '', {
            fontSize: fontSize,
            anchor: 'left top',
            letterSpacing: letterSpacing ? letterSpacing : 0
        });
        return Buffer.from(svg);
    } catch (err) {
        console.error(`⚠️ 加载字体失败 ${_path}:`, err.message);
        return Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>');
    }
}

function getAddrText(text) {
    if (!text) return [];
    let brnum = 0;
    let textArr = [];
    text.split('').forEach(t => {
        brnum += isNaN(parseInt(t)) ? 1 : 0.5;
    });
    let n = Math.ceil(brnum / 11);
    for (let i = 0; i < n; i++) {
        textArr[i] = text.slice(i * 11, 11 * (i + 1));
    }
    return textArr.map((t, i) => {
        return {
            input: getFontImg('./fonts/hei.ttf', t, 33),
            left: 335,
            top: 535 + 48 * i
        };
    });
}

function validateConfig(config){
    const required = [
        'name','sex','nation','year','mon','day',
        'org','validTerm','addr','idn'
    ];
    for (const field of required) {
        if (!config[field] || config[field].trim() === '') {
            return field;
        }
    }
    if (!config.avatar && !config.avatarBuffer) {
        config.avatar = './images/b.png';
    }

    return null;
}

async function getAvatar(config) {
  try {
    if (config.avatarBuffer) {
      return await sharp(config.avatarBuffer)
        .resize({ width: 270, height: 330 })
        .png()
        .toBuffer();
    }

    if (config.avatar) {
      return await sharp(path.resolve(process.cwd(), config.avatar))
        .resize({ width: 270, height: 330 })
        .png()
        .toBuffer();
    }

    throw new Error('没有提供头像');
  } catch (err) {
    console.error("⚠️ 加载头像失败，使用默认头像 ./images/b.png");
    const fallbackPath = path.resolve(process.cwd(), './images/b.png');
    return await sharp(fallbackPath)
      .resize({ width: 270, height: 330 })
      .png()
      .toBuffer();
  }
}

function composite(config) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!config) {
                return reject(new Error('缺少配置对象 config'));
            }

            const errorMsg = validateConfig(config);
            if (errorMsg) {
                return reject(new Error(errorMsg));
            }

            const baseImg = path.resolve(__dirname, './images/empty.png');
            sharp(baseImg)
                .composite(
                    [
                        { input: getFontImg('./fonts/hei.ttf', config.org, 33), left: 525, top: 1365 },
                        { input: getFontImg('./fonts/fzzdxjw-gb1-0.ttf', config.validTerm, 33), left: 525, top: 1448 },
                        { input: getFontImg('./fonts/ocrb10bt.ttf', config.idn, 44, 0.025), left: 475, top: 720 },
                        { input: getFontImg('./fonts/hei.ttf', config.name, 36), left: 340, top: 325 },
                        { input: getFontImg('./fonts/hei.ttf', config.sex, 33), left: 340, top: 395 },
                        { input: getFontImg('./fonts/hei.ttf', config.nation, 33), left: 523, top: 395 },
                        { input: getFontImg('./fonts/fzzdxjw-gb1-0.ttf', config.year, 33), left: 340, top: 473 },
                        { input: getFontImg('./fonts/fzzdxjw-gb1-0.ttf', config.mon, 33), left: config.mon.length === 2 ? 475 : 485, top: 473 },
                        { input: getFontImg('./fonts/fzzdxjw-gb1-0.ttf', config.day, 33), left: config.mon.length === 2 ? 580 : 585, top: 473 },
                        { input: await getAvatar(config), left: 750, top: 335 }
                    ].concat(getAddrText(config.addr))
                )
                .png()
                .toBuffer()
                .then(resolve)
                .catch(err => {
                    console.error("⚠️ 图像合成失败:", err.message);
                    reject(err);
                });

        } catch (err) {
            console.error("❌ composite 捕获错误:", err.message);
            reject(err);
        }
    });
}

module.exports = composite;
