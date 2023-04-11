// 调用接口
// export const host = "https://www.buygpt.shop"

export const getHost = () => {
  if (typeof document === 'undefined') {
    return ''
  }
  return document.location.origin.replace("chat", "www")
}
