import type { MessageInstance } from "antd/es/message/interface";
import type { NotificationInstance } from "antd/es/notification/interface";
import type { ModalStaticFunctions } from "antd/es/modal/confirm";
import {
  message as antdMessage,
  notification as antdNotification,
  Modal as antdModal,
  App,
} from "antd";

// 声明message、notification、modal变量
let message: MessageInstance = antdMessage;
let notification: NotificationInstance = antdNotification;

// 获取antdModal中的所有静态方法，并去掉warn方法
const { ...resetFns } = antdModal;
let modal: Omit<ModalStaticFunctions, "warn"> = resetFns;

/**
 * 该组件提供静态方法
 * 把antd的message、notification、modal静态方法挂载到App上
 */
function StaticMessage() {
  // 使用App.useApp()获取静态方法
  const staticFunctions = App.useApp();

  // 将获取到的静态方法赋值给message、notification、modal变量
  message = staticFunctions.message;
  notification = staticFunctions.notification;
  modal = staticFunctions.modal;

  return null;
}

// 导出message、notification、modal变量
export { message, notification, modal };

// 导出StaticMessage组件
export default StaticMessage;
