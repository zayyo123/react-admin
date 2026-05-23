/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useState } from 'react';
import { useCommonStore } from '@/hooks/useCommonStore';
import { checkPermission } from '@/utils/permissions';
import WangEditor from '@/components/WangEditor';
import BaseContent from '@/components/Content/BaseContent';

function MyEditor() {
  const { permissions } = useCommonStore();
  // 编辑器内容
  const [html, setHtml] = useState('<p>hello</p>');
  const isPermission = checkPermission('/demo/editor', permissions);

  return (
    <BaseContent isPermission={isPermission}>
      <div className="m-10px p-5 rounded-3 bg">
        <WangEditor value={html} onChange={(content) => setHtml(content)} />
      </div>
    </BaseContent>
  );
}

export default MyEditor;
