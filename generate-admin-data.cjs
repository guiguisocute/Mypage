/**
 * 管理员隐藏链接加密工具
 * 
 * 使用方法：
 * 1. 编辑 admin-links.json 文件，设置用户名、密码和链接
 * 2. 运行: node generate-admin-data.cjs
 * 3. 将输出的加密字符串复制到 src/App.tsx 的 ENCRYPTED_ADMIN_DATA 常量中
 */

const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');

// 读取配置文件
const configPath = path.join(__dirname, 'admin-links.json');

if (!fs.existsSync(configPath)) {
    console.error('错误: 找不到 admin-links.json 配置文件！');
    process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const { username, password, links } = config;

if (!username || !password || !links || !Array.isArray(links)) {
    console.error('错误: 配置文件格式不正确！');
    process.exit(1);
}

console.log('管理员数据加密工具');
console.log('==================');
console.log('');
console.log('用户名:', username);
console.log('密码:', password);
console.log('');
console.log('链接列表:');
links.forEach((link, index) => {
    console.log(`  ${index + 1}. ${link.name} -> ${link.url}`);
});
console.log('');

// 使用 "用户名:密码" 组合作为加密密钥
const credentials = `${username}:${password}`;
const encrypted = CryptoJS.AES.encrypt(JSON.stringify(links), credentials);
const encryptedStr = encrypted.toString();

// 写入文件
fs.writeFileSync('encrypted_result.txt', encryptedStr);
console.log('加密结果已写入 encrypted_result.txt');

// 验证解密
const decrypted = CryptoJS.AES.decrypt(encryptedStr, credentials);
const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
console.log('');
console.log('解密验证:', decryptedStr === JSON.stringify(links) ? '成功' : '失败');
