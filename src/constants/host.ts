// 调用接口
// export const host = "https://www.buygpt.shop"

export const getHost = () => {
  if (typeof document === 'undefined') {
    return ''
  }
  if(document.location.origin.includes('chat')) {
    return document.location.origin.replace("chat", "www")
  }
  return 'https://www.buygpt.shop'
}
