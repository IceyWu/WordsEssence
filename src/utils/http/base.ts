/**
 * 接口域名的管理
 * @param {string} apiServer [api服务器]
 * @param {string} knobbleServer [小节内容上传服务器]
 */
const baseLsit = [
	{
		apiServer: 'https://test.wktest.cn:3001/api',
		knobbleServer: 'http://10.0.30.117/section',
	},
	{
		apiServer: 'https://test.wktest.cn:3001/api',
		knobbleServer: 'http://10.0.30.109/section',
	},
]

const ServerNumber = 1
// const ServerNumber = 1;
const baseUrl = baseLsit[ServerNumber]

export default baseUrl
