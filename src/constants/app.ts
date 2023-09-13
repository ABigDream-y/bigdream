import { getValueByKeys } from "@/utils/utils";
import appPack from "../../package.json";
/**
 * app系统配置
 */
export default {
	/**
	 * 系统版本号，自动读取package.json中的version字段
	 */
	version: appPack.version,

	/**
	 * 系统默认语言
	 */
	defaultLang: "zh-CN",

	/**
	 * api请求地址，这里读取env环境变量中的VITE_APP_API，优先使用全局变量window.SITE_CONFIG.apiURL钩子，支持在index.html中配置
	 */
	api: getValueByKeys(window, "SITE_CONFIG.apiURL") || import.meta.env.VITE_APP_API,

	klyApi: getValueByKeys(window, "SITE_CONFIG.klyApiURL") || import.meta.env.VITE_APP_KLY_API,

	/**
	 * websocket 服务地址，这里读取env环境变量中的VITE_APP_SOCKET，优先使用全局变量window.SITE_CONFIG.socketURL钩子，支持在index.html中配置
	 */
	websocket: getValueByKeys(window, "SITE_CONFIG.socketURL") || import.meta.env.VITE_APP_SOCKET,

	/**
	 * 启用logo图标，logo尺寸32*32，存放路径@/assets/images/logo.png
	 */
	enabledLogo: false,

	/**
	 * 开启页面缓存
	 */
	enabledKeepAlive: true,

	/**
	 * 网络请求超时时间，单位毫秒
	 */
	requestTimeout: 30000,

	/**
	 * 全屏渲染的页面
	 */
	fullscreenPages: ["/login", "/help"],
	/*
	*固定的一个表单ID  90SCl表单
	*/
	$mainFormId: "167911937403472",
	$sasFormId:"168112418053886",
	$bdcFormId:"168122169231762",
	$sdsFormId:"168122173758835",
	$16pfFormId:"168673460096172",
	$epqFormId:"168673896273162",
};
