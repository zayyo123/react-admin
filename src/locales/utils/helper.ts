/**
 * 学习提示：国际化模块：维护中文、英文等多语言文案，页面通过 t(key) 读取。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
type FileModule = Record<string, string>;
type FileParams = Record<string, FileModule>;

/** 获取中文翻译文件 */
export const getZhLang = () => {
  const langFiles = import.meta.glob('../zh/*.ts', {
    import: 'default',
    eager: true,
  }) as FileParams;
  const result = handleFileList(langFiles);
  return result;
};

/** 获取英文翻译文件 */
export const getEnLang = () => {
  const langFiles = import.meta.glob('../en/*.ts', {
    import: 'default',
    eager: true,
  }) as FileParams;
  const result = handleFileList(langFiles);
  return result;
};

/** 获取中文翻译文件命名空间数据 */
export const getZhLangNamespaces = () => {
  const langFiles = import.meta.glob('../zh/**/*.ts', {
    import: 'default',
    eager: true,
  }) as FileParams;
  const namespace = filterNamespaceData(langFiles);
  const result = handleFileNamespaceList(namespace);
  return result;
};

/** 获取中文翻译文件命名空间数据 */
export const getEnLangNamespaces = () => {
  const langFiles = import.meta.glob('../en/**/*.ts', {
    import: 'default',
    eager: true,
  }) as FileParams;
  const namespace = filterNamespaceData(langFiles);
  const result = handleFileNamespaceList(namespace);
  return result;
};

/**
 * 处理文件转为对应格式
 * @param files - 文件集
 */
const handleFileList = (files: FileParams) => {
  const result: Record<string, unknown> = {};

  for (const key in files) {
    const data = files[key];
    const fileArr = key?.split('/');
    const fileName = fileArr?.[fileArr?.length - 1] || '';
    if (!fileName) continue;
    const name = fileName?.split('.ts')?.[0];
    if (name) result[name] = data;
  }

  return result;
};

/**
 * 过滤命名空间数据，过滤文件夹数小于2的数据
 * @param fileList - 文件列表
 */
const filterNamespaceData = (fileList: FileParams) => {
  const result: FileParams = {};

  for (const key in fileList) {
    const list = key?.split('/');
    if (list?.length > 3) {
      result[key] = fileList[key];
    }
  }

  return result;
};

/**
 * 处理文件转为对应格式
 * @param files - 文件集
 */
const handleFileNamespaceList = (files: FileParams) => {
  const result: Record<string, Record<string, unknown>> = {};

  for (const key in files) {
    const data = files[key];
    const fileArr = key?.split('/');
    // 获取命名空间
    const namespace = fileArr?.[fileArr?.length - 2] || '';
    if (!namespace) continue;
    // 获取文件名
    const fileName = fileArr?.[fileArr?.length - 1] || '';
    if (!fileName) continue;
    const name = fileName?.split('.ts')?.[0];
    if (!name) continue;

    if (!result?.[namespace]) {
      result[namespace] = {};
    }

    result[namespace][name] = data;
  }

  return result;
};
