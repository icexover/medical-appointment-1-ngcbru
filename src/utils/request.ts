import axios, { AxiosError } from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误，请检查输入',
  401: '登录已过期，请重新登录',
  403: '您没有权限访问该资源',
  404: '请求的资源不存在',
  405: '请求方法不允许',
  408: '请求超时，请检查网络',
  409: '数据冲突，请刷新后重试',
  413: '请求内容过大，请压缩后再试',
  429: '操作过于频繁，请稍后再试',
  500: '服务器内部错误，请稍后重试',
  502: '网关错误，请稍后重试',
  503: '服务暂不可用，请稍后重试',
  504: '网关超时，请稍后重试',
}

function showError(message: string, duration = 3500) {
  ElMessage.closeAll()
  ElMessage.error({
    message,
    duration,
    showClose: true,
  })
}

request.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(
  (response) => {
    const data = response.data as any
    if (data && typeof data === 'object' && 'code' in data) {
      if (data.code === 0 || data.code === 200) {
        return data.data !== undefined ? data.data : data
      }
      const msg = data.message || data.msg || '请求失败'
      showError(msg)
      return Promise.reject(new Error(msg))
    }
    return response.data
  },
  (error: AxiosError) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    if (!error.response) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        showError('网络请求超时，请检查网络后重试')
      } else if (error.message.includes('Network Error')) {
        showError('网络连接失败，请检查网络设置')
      } else {
        showError('网络异常，请稍后重试')
      }
      return Promise.reject(error)
    }

    const status = error.response.status
    const backendMsg = (error.response.data as any)?.message
      || (error.response.data as any)?.msg

    const message = backendMsg || ERROR_MESSAGES[status] || `请求失败（状态码：${status}）`

    if (status === 401) {
      showError(message, 4500)
    } else if (status === 429) {
      showError(message, 4000)
    } else if (status >= 500) {
      showError(message, 5000)
    } else {
      showError(message)
    }

    return Promise.reject(error)
  }
)

export default request
