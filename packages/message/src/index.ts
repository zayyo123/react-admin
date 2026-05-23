/**
 * 学习提示：内部消息包：封装 Ant Design 静态消息能力，方便在非组件代码中调用提示。
 * 作为 React 初学者，可以先看本文件导出的组件/函数名称，再顺着 props、state、useEffect 和事件处理函数理解数据流。
 */
import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import {
  message as antdMessage,
  notification as antdNotification,
  Modal as antdModal,
  App,
} from 'antd';

let message: MessageInstance = antdMessage;
let notification: NotificationInstance = antdNotification;

const { ...resetFns } = antdModal;
let modal: Omit<ModalStaticFunctions, 'warn'> = resetFns;

/**
 * 该组件提供静态方法
 * 作用：跨页面message显示
 */
function StaticMessage() {
  const staticFunctions = App.useApp();

  message = staticFunctions.message;
  notification = staticFunctions.notification;
  modal = staticFunctions.modal;

  return null;
}

export { message, notification, modal };

export default StaticMessage;
