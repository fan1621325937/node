/**
 * Node.js Crypto 模块学习案例
 * crypto 模块提供了加密功能，包括对 OpenSSL 的哈希、HMAC、加密、解密、签名、验证功能的一整套封装
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

/**
 * 哈希函数演示
 */
function hashingDemo() {
  console.log("===  ===");
  const data = "这是要进行哈希的数据";
  const algorithms = ["md5", "sha1", "sha256", "sha512"];

  algorithms.forEach((algorithm) => {
    const hash = crypto.createHash(algorithm);
    hash.update(data, "utf8");
    const digest = hash.digest("hex"); // 将哈希值转换为十六进制字符串
    console.log(`${algorithm.toUpperCase()}: ${digest}`);
  });

  // 流式哈希
  console.log("\n流式哈希演示:");
  const streamHash = crypto.createHash("sha256");
  streamHash.update("第一部分数据");
  streamHash.update("第二部分数据");
  streamHash.update("第三部分数据");
  console.log("流式 SHA256:", streamHash.digest("hex"));
  console.log("");
}

/**
 * HMAC (Hash-based Message Authentication Code) 演示
 */
function hmacDemo() {
  console.log("=== HMAC 演示 ===");

  const secret = "这是密钥";
  const message = "这是要验证的消息";

  // 创建 HMAC
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  const signature = hmac.digest("hex");

  console.log("消息:", message);
  console.log("密钥:", secret);
  console.log("HMAC 签名:", signature);

  // 验证 HMAC
  const verifyHmac = crypto.createHmac("sha256", secret);
  verifyHmac.update(message);
  const verifySignature = verifyHmac.digest("hex");

  console.log(
    "验证结果:",
    signature === verifySignature ? "✓ 验证成功" : "✗ 验证失败"
  );
  console.log("");
}

/**
 * 对称加密演示 (AES)
 */
function symmetricEncryptionDemo() {
  console.log("=== 对称加密演示 (AES) ===");

  const algorithm = "aes-256-cbc"; // 使用 AES-256-CBC 算法
  const key = crypto.randomBytes(32); // 256 位密钥
  const iv = crypto.randomBytes(16); // 初始化向量
  const plaintext = "这是要加密的敏感数据";

  console.log("原始数据:", plaintext);
  console.log("密钥 (hex):", key.toString("hex"));
  console.log("IV (hex):", iv.toString("hex"));

  // 加密
  const cipher = crypto.createCipher(algorithm, key);
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");

  console.log("加密后 (hex):", encrypted);

  // 解密
  const decipher = crypto.createDecipher(algorithm, key);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  console.log("解密后:", decrypted);
  console.log("解密成功:", plaintext === decrypted ? "✓" : "✗");
  console.log("");
}

/**
 * 更安全的对称加密演示 (使用 IV)
 */
function secureSymmetricEncryption() {
  console.log("=== 安全对称加密演示 ===");

  const algorithm = "aes-256-gcm";
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const plaintext = "这是要加密的机密信息";

  console.log("原始数据:", plaintext);

  // 加密
  const cipher = crypto.createCipherGCM(algorithm, key, iv);
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag();

  console.log("加密后:", encrypted);
  console.log("认证标签:", authTag.toString("hex"));

  // 解密
  const decipher = crypto.createDecipherGCM(algorithm, key, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  console.log("解密后:", decrypted);
  console.log("");
}

/**
 * 非对称加密演示 (RSA)
 */
function asymmetricEncryptionDemo() {
  console.log("=== 非对称加密演示 (RSA) ===");

  // 生成 RSA 密钥对
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  console.log("公钥:");
  console.log(publicKey);
  console.log("私钥:");
  console.log(privateKey.substring(0, 100) + "...(已截断)");

  const plaintext = "这是要用 RSA 加密的数据";
  console.log("原始数据:", plaintext);

  // 使用公钥加密
  const encrypted = crypto.publicEncrypt(
    publicKey,
    Buffer.from(plaintext, "utf8")
  );
  console.log("加密后 (base64):", encrypted.toString("base64"));

  // 使用私钥解密
  const decrypted = crypto.privateDecrypt(privateKey, encrypted);
  console.log("解密后:", decrypted.toString("utf8"));
  console.log("");
}

/**
 * 数字签名演示
 */
function digitalSignatureDemo() {
  console.log("=== 数字签名演示 ===");

  // 生成密钥对
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  const message = "这是要签名的重要文档内容";
  console.log("原始消息:", message);

  // 创建签名
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(message);
  const signature = sign.sign(privateKey, "base64");

  console.log("数字签名:", signature);

  // 验证签名
  const verify = crypto.createVerify("RSA-SHA256");
  verify.update(message);
  const isValid = verify.verify(publicKey, signature, "base64");

  console.log("签名验证:", isValid ? "✓ 有效" : "✗ 无效");

  // 测试篡改检测
  const tamperedMessage = message + "被篡改的内容";
  const verifyTampered = crypto.createVerify("RSA-SHA256");
  verifyTampered.update(tamperedMessage);
  const isTamperedValid = verifyTampered.verify(publicKey, signature, "base64");

  console.log(
    "篡改后验证:",
    isTamperedValid ? "✓ 有效" : "✗ 无效 (检测到篡改)"
  );
  console.log("");
}

/**
 * 随机数生成演示
 */
function randomGenerationDemo() {
  console.log("=== 随机数生成演示 ===");

  // 生成随机字节
  const randomBytes = crypto.randomBytes(16);
  console.log("随机字节 (hex):", randomBytes.toString("hex"));
  console.log("随机字节 (base64):", randomBytes.toString("base64"));

  // 生成随机整数
  const randomInt = crypto.randomInt(1, 101); // 1-100 之间的随机整数
  console.log("随机整数 (1-100):", randomInt);

  // 生成随机 UUID
  const uuid = crypto.randomUUID();
  console.log("随机 UUID:", uuid);

  // 生成安全的随机密码
  const passwordLength = 16;
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  console.log("随机密码:", password);
  console.log("");
}

/**
 * 密钥派生函数演示 (PBKDF2)
 */
function keyDerivationDemo() {
  console.log("=== 密钥派生函数演示 (PBKDF2) ===");

  const password = "用户密码123";
  const salt = crypto.randomBytes(16);
  const iterations = 100000;
  const keyLength = 32;

  console.log("原始密码:", password);
  console.log("盐值 (hex):", salt.toString("hex"));
  console.log("迭代次数:", iterations);

  // 同步方式
  const derivedKey = crypto.pbkdf2Sync(
    password,
    salt,
    iterations,
    keyLength,
    "sha256"
  );
  console.log("派生密钥 (hex):", derivedKey.toString("hex"));

  // 异步方式
  crypto.pbkdf2(
    password,
    salt,
    iterations,
    keyLength,
    "sha256",
    (err, derivedKey) => {
      if (err) throw err;
      console.log("异步派生密钥 (hex):", derivedKey.toString("hex"));
    }
  );
  console.log("");
}

/**
 * 文件哈希计算
 */
function fileHashDemo() {
  console.log("=== 文件哈希计算演示 ===");

  // 创建一个测试文件
  const testFilePath = path.join(__dirname, "test-file.txt");
  const testContent = "这是测试文件的内容\n包含多行文本\n用于演示文件哈希计算";

  try {
    fs.writeFileSync(testFilePath, testContent, "utf8");
    console.log("创建测试文件:", testFilePath);

    // 计算文件哈希
    const fileContent = fs.readFileSync(testFilePath);
    const hash = crypto.createHash("sha256");
    hash.update(fileContent);
    const fileHash = hash.digest("hex");

    console.log("文件内容:", testContent.replace(/\n/g, "\\n"));
    console.log("文件 SHA256:", fileHash);

    // 流式计算大文件哈希
    const streamHash = crypto.createHash("sha256");
    const readStream = fs.createReadStream(testFilePath);

    readStream.on("data", (chunk) => {
      streamHash.update(chunk);
    });

    readStream.on("end", () => {
      const streamFileHash = streamHash.digest("hex");
      console.log("流式计算 SHA256:", streamFileHash);
      console.log("哈希一致性:", fileHash === streamFileHash ? "✓" : "✗");

      // 清理测试文件
      fs.unlinkSync(testFilePath);
      console.log("清理测试文件完成");
    });
  } catch (error) {
    console.error("文件操作错误:", error.message);
  }
  console.log("");
}

/**
 * 密码学实用工具函数
 */
function cryptoUtilities() {
  console.log("=== 密码学实用工具函数 ===");

  /**
   * 生成安全的随机令牌
   * @param {number} length - 令牌长度
   * @returns {string} 随机令牌
   */
  function generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString("hex");
  }

  /**
   * 简单的密码哈希函数
   * @param {string} password - 原始密码
   * @param {string} salt - 盐值
   * @returns {string} 哈希后的密码
   */
  function hashPassword(password, salt = null) {
    if (!salt) {
      salt = crypto.randomBytes(16).toString("hex");
    }
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256");
    return salt + ":" + hash.toString("hex");
  }

  /**
   * 验证密码
   * @param {string} password - 输入的密码
   * @param {string} hashedPassword - 存储的哈希密码
   * @returns {boolean} 验证结果
   */
  function verifyPassword(password, hashedPassword) {
    const [salt, hash] = hashedPassword.split(":");
    const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha256");
    return hash === verifyHash.toString("hex");
  }

  /**
   * 简单的数据加密函数
   * @param {string} text - 要加密的文本
   * @param {string} password - 加密密码
   * @returns {string} 加密后的数据
   */
  function encryptData(text, password) {
    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(password, "salt", 32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;
  }

  /**
   * 简单的数据解密函数
   * @param {string} encryptedData - 加密的数据
   * @param {string} password - 解密密码
   * @returns {string} 解密后的文本
   */
  function decryptData(encryptedData, password) {
    const algorithm = "aes-256-cbc";
    const key = crypto.scryptSync(password, "salt", 32);
    const [ivHex, encrypted] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  // 演示工具函数
  console.log("生成安全令牌:", generateSecureToken(16));

  const password = "mySecretPassword";
  const hashedPwd = hashPassword(password);
  console.log("密码哈希:", hashedPwd);
  console.log("密码验证:", verifyPassword(password, hashedPwd) ? "✓" : "✗");
  console.log(
    "错误密码验证:",
    verifyPassword("wrongPassword", hashedPwd) ? "✓" : "✗"
  );

  const plaintext = "这是要加密的敏感数据";
  const encryptionPassword = "encryptionKey123";
  const encrypted = encryptData(plaintext, encryptionPassword);
  console.log("加密数据:", encrypted);

  const decrypted = decryptData(encrypted, encryptionPassword);
  console.log("解密数据:", decrypted);
  console.log("加解密一致性:", plaintext === decrypted ? "✓" : "✗");
  console.log("");
}

// 主函数：执行所有演示
function main() {
  console.log("Node.js Crypto 模块学习案例\n");

  hashingDemo();
  hmacDemo();
  symmetricEncryptionDemo();
  secureSymmetricEncryption();
  asymmetricEncryptionDemo();
  digitalSignatureDemo();
  randomGenerationDemo();
  keyDerivationDemo();

  // 异步操作需要延迟
  setTimeout(() => {
    fileHashDemo();
    cryptoUtilities();
  }, 100);
}

// 如果直接运行此文件，则执行主函数
// if (require.main === module) {
//   main();
// }

// 导出函数供其他模块使用
module.exports = {
  hashingDemo,
  hmacDemo,
  symmetricEncryptionDemo,
  secureSymmetricEncryption,
  asymmetricEncryptionDemo,
  digitalSignatureDemo,
  randomGenerationDemo,
  keyDerivationDemo,
  fileHashDemo,
  cryptoUtilities,
};
