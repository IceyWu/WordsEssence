import { http } from '@/utils/http'

/** 列表获取 */
export const getWordsList = (params?: object) => {
	return http.request<any>('get', '/wordsessence', { params })
}

/** 保存 */
export const saveWords = (data?: object) => {
	return http.request<any>('post', '/wordsessence', { data })
}

/** 根据id获取详情 */
export const getWordsLDeById = (id: Number | String) => {
	return http.request<any>('get', `/wordsessence/${id}`, {})
}

/** 更新 */
export const updateWords = (data?: any) => {
	return http.request<any>('patch', `/wordsessence/${data?.id}`, { data })
}

/** 删除 */
export const deleteWords = (id: Number | String) => {
	return http.request<any>('delete', `/wordsessence/${id}`, {})
}
