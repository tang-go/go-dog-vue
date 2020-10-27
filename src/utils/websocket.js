
let socket = null

export function Connect (path) {
  if (socket !== null) {
    return
  }
  if (typeof (WebSocket) === 'undefined') {
    alert('您的浏览器不支持socket')
  } else {
    // 实例化socket
    socket = new WebSocket(path)
    // 监听socket连接
    socket.onopen = OnOpen
    // 监听socket错误信息
    socket.onerror = OnError
    // 监听socket消息
    socket.onmessage = OnMessage
    // 监听socket销毁信息
    socket.onclose = OnClose
  }
}

function OnOpen () {
  console.log('socket连接成功')
  setInterval(function () {
    Send('ping')
  }, 2000)
}

function OnError () {
  console.log('连接错误')
}

function OnMessage (msg) {
  console.log(msg)
}

function Send (msg) {
  socket.send(msg)
}

function OnClose () {
  console.log('socket已经关闭')
  socket = null
}
