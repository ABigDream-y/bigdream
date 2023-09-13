#index.html
全局钩子
klyApiURL: "<%=klyApiURL%>",

#vite.config.ts
klyApiURL: loadEnv(mode, process.cwd()).VITE_APP_KLY_API,

#.env.development等
VITE_APP_KLY_API=http://192.168.3.32:8084/security-admin

#@/constants/app.ts
klyApi: getValueByKeys(window, "SITE_CONFIG.klyApiURL") || import.meta.env.VITE_APP_KLY_API,

#@/utils/klyhttp.ts  复制http.ts
修改 baseURL: app.klyApi,

#/service/klyBaseService.ts  复制baseService.ts
修改 import http from "../utils/klyhttp";

#@/hooks/klyUseView    复制useView.ts
修改 import baseService from "@/service/klyBaseService";
修改 exportHandle() 中 app.api 为app.klyApi

#课路云静态资源文件存放位置 @/assets/kly
修改 main.ts 引入图标 
import '@/assets/kly/fonticon/iconfont.css';
import '@/assets/kly/fonticon/iconfont.js';

# utils文件夹下新增了 klyutils.ts
