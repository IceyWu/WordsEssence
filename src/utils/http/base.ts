/**
 * 接口域名的管理
 * @param {string} apiServer [api服务器]
 * @param {string} knobbleServer [小节内容上传服务器]
 */
const baseLsit = [
  {
    apiServer: "https://wd.wktest.cn/api",
    knobbleServer: "http://10.0.30.117/section",
  },
  {
    apiServer: "https://wd.wktest.cn/api",
    knobbleServer: "http://10.0.30.109/section",
  },
];

const ServerNumber = import.meta.env.VITE_APP_SERVER_ID ? import.meta.env.VITE_APP_SERVER_ID : 0;
// const ServerNumber = 1;
const baseUrl: Record<string, string> = baseLsit[ServerNumber];
console.log("🎁-----baseUrl-----", baseUrl);

export default baseUrl;
console.log("🍭-----baseUrl-----", baseUrl);
