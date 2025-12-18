import { http } from '@/utils/http'

/** 列表获取 */
export function getWordsList(params?: object) {
	return http.request<any>('get', '/v1/essays', { params })
}

/** 保存 */
export function saveWords(data?: object) {
	return http.request<any>('post', '/v1/essays', { data })
}

/** 根据id获取详情 */
export function getWordsLDeById(id: number | string) {
	return http.request<any>('get', `/v1/essays/${id}`, {})
}

/** 更新 */
export function updateWords(data?: any) {
	return http.request<any>('patch', `/v1/essays/${data?.id}`, { data })
}

/** 删除 */
export function deleteWords(id: number | string) {
	return http.request<any>('delete', `/v1/essays/${id}`, {})
}
