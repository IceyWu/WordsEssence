import { http } from '@/utils/http'

/** 列表获取 */
export const getWordsList = (params?: object) => {
	return http.request<any>('get', '/words', { params })
}

/** 列表获取 */
export const saveWords = (data?: object) => {
	return http.request<any>('post', '/words', { data })
}
