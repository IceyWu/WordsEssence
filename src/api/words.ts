import { http } from '@/utils/http'

/** 列表获取 */
export function getWordsList(params?: object) {
	return http.request<any>('get', '/wordsessence', { params })
}

/** 保存 */
export function saveWords(data?: object) {
	return http.request<any>('post', '/wordsessence', { data })
}

/** 根据id获取详情 */
export function getWordsLDeById(id: number | string) {
	return http.request<any>('get', `/wordsessence/${id}`, {})
}

/** 更新 */
export function updateWords(data?: any) {
	return http.request<any>('patch', `/wordsessence/${data?.id}`, { data })
}

/** 删除 */
export function deleteWords(id: number | string) {
	return http.request<any>('delete', `/wordsessence/${id}`, {})
}
