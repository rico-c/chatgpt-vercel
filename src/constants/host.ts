// 调用接口
// export const host = "https://www.buygpt.shop"

export const getHost = () => {
  return document.location.origin.replace("chat", "www")
}
