/**
 * 学习提示：内部工具包：封装本地存储、加密解密等可跨项目复用的工具。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { encrypt, decrypt } from 'crypto-js/aes';
import UTF8 from 'crypto-js/enc-utf8';
import md5 from 'crypto-js/md5';

/**
 * @description: 加密/解密封装，secret值建议从后台接口获取
 */
const secretKey = '__Vite_Admin_Secret__';

/**
 * 加密
 * @param data - 加密数据
 * @param secret - 加密密钥
 */
export function encryption(data: object, secret: string = secretKey) {
  const code = JSON.stringify(data);
  return encrypt(code, secret).toString();
}

/**
 * 解密
 * @param data - 解密数据
 * @param secret - 解密密钥
 */
export function decryption(data: string, secret: string = secretKey) {
  const bytes = decrypt(data, secret);
  const originalText = bytes.toString(UTF8);
  if (originalText) {
    return JSON.parse(originalText);
  }
  return null;
}

/**
 * md5加密
 * @param data - 加密数据
 */
export function encryptMd5(data: string) {
  return md5(data).toString();
}
