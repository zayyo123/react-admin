/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useParams } from 'react-router-dom';
import { useCommonStore } from '@/hooks/useCommonStore';
import { checkPermission } from '@/utils/permissions';
import BaseCard from '@/components/Card/BaseCard';
import BaseContent from '@/components/Content/BaseContent';

function Dynamic() {
  const { id } = useParams();
  const { permissions } = useCommonStore();
  const isPermission = checkPermission('/demo/dynamic', permissions);

  return (
    <BaseContent isPermission={isPermission}>
      <BaseCard className="mt-10px mx-5px">
        <div>/demo/123/dynamic中的123为动态参数，可自由修改，文件路径为：/demo/[id]/dynamic。</div>
        <div>
          id: <span className="font-bold">{id}</span>
        </div>
      </BaseCard>
    </BaseContent>
  );
}

export default Dynamic;
