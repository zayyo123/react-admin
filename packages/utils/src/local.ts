/**
 * local.ts
 *
 * 这个文件提供了对浏览器 localStorage 的封装，增强了以下功能：
 * 1. 数据加密存储 - 使用 crypto.ts 中的加密/解密函数保护数据安全
 * 2. 过期时间控制 - 可以为存储的数据设置过期时间
 * 3. 类型安全 - 使用泛型支持类型推断
 * 4. 自动清理 - 获取过期数据时自动清理
 */

// 导入消息提示组件，用于在解密失败时显示错误信息
import { message } from "@south/message";
// 导入加密和解密函数，用于数据的安全存储和读取
import { encryption, decryption } from "./crypto";

/**
 * @description: localStorage封装，提供加密存储和过期控制
 */

// 默认缓存期限为2天（单位：秒）
// 60秒 * 60分钟 * 24小时 * 2天 = 172800秒
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 2;

/**
 * 定义存储数据的接口结构
 * 实际存储在localStorage中的是这个结构经过加密后的字符串
 */
interface StorageData {
  value: unknown; // 存储的实际数据，类型不确定，由使用者决定
  expire: number | null; // 过期时间戳（毫秒级）或null（表示永不过期）
}

/**
 * 设置本地缓存
 * 将数据加密后存储到localStorage中，并可设置过期时间
 *
 * @param key - 存储的键名，作为唯一标识
 * @param value - 要存储的数据，可以是任意类型
 * @param expire - 过期时间（单位：秒），默认为2天，传入null表示永不过期
 */
export function setLocalInfo(
  key: string,
  value: unknown,
  expire: number | null = DEFAULT_CACHE_TIME
) {
  // 计算过期时间戳（毫秒级）
  // 如果expire为null，则time也为null，表示永不过期
  // 否则，将当前时间加上过期秒数*1000得到过期时间戳
  const time = expire !== null ? new Date().getTime() + expire * 1000 : null;

  // 构造存储数据对象
  const data: StorageData = { value, expire: time };

  // 对数据进行加密，得到加密后的JSON字符串
  const json = encryption(data);

  // 将加密后的字符串存储到localStorage中
  localStorage.setItem(key, json);
}

/**
 * 获取本地缓存数据
 * 从localStorage中获取数据，解密并检查是否过期
 *
 * @param key - 存储的键名
 * @returns T类型的数据或null（如果数据不存在、已过期或解密失败）
 * @template T - 返回数据的类型，由调用者指定
 */
export function getLocalInfo<T>(key: string) {
  // 从localStorage中获取加密的JSON字符串
  const json = localStorage.getItem(key);

  // 如果找到了数据
  if (json) {
    let data: StorageData | null = null;
    try {
      // 尝试解密数据
      data = decryption(json);
    } catch {
      // 解密失败，显示错误消息
      // key: 'decryption' 确保相同错误只显示一次
      message.error({ content: "数据解密失败", key: "decryption" });
    }

    // 如果成功解密出数据
    if (data) {
      // 解构出值和过期时间
      const { value, expire } = data;

      // 检查是否在有效期内：
      // 1. expire为null表示永不过期
      // 2. 或者当前时间小于过期时间
      if (expire === null || expire >= Date.now()) {
        // 在有效期内，将值转换为指定的类型T并返回
        return value as T;
      }
    }

    // 如果数据已过期或解密后无数据，清除此缓存项
    removeLocalInfo(key);
    return null;
  }
  // 如果localStorage中没有找到对应的键，返回null
  return null;
}

/**
 * 移除指定本地缓存
 * 删除localStorage中指定键的数据
 *
 * @param key - 要删除的缓存项的键名
 */
export function removeLocalInfo(key: string) {
  localStorage.removeItem(key);
}

/**
 * 清空本地缓存
 * 删除localStorage中的所有数据
 */
export function clearLocalInfo() {
  localStorage.clear();
}
