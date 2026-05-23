/**
 * 学习提示：页面模块：每个文件通常对应一个后台页面或页面私有组件，是学习业务 CRUD 的重点。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import { useTranslation } from 'react-i18next';
import { useCommonStore } from '@/hooks/useCommonStore';
import { checkPermission } from '@/utils/permissions';
import CopyInput from '@/components/Copy/CopyInput';
import CopyBtn from '@/components/Copy/CopyBtn';
import BaseContent from '@/components/Content/BaseContent';

function CopyPage() {
  const { t } = useTranslation();
  const { permissions } = useCommonStore();
  const isPermission = checkPermission('/demo/copy', permissions);

  return (
    <BaseContent isPermission={isPermission}>
      <div className="max-w-350px m-10px p-5 rounded-3 bg">
        <h1>{t('content.clipboard')}：</h1>
        <CopyInput className="w-350px" />

        <div className="flex items-center mt-50px">
          <span className="text-lg">{t('content.clipboardMessage')}：</span>
          <CopyBtn text={t('public.copy')} value="admin" />
        </div>
      </div>
    </BaseContent>
  );
}

export default CopyPage;
