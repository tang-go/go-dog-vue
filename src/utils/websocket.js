
var socket = null
var topics = {}
var ticker = null
export function connect (token) {
  if (!token) {
    return
  }
  if (socket !== null) {
    return
  }
  const path = process.env.VUE_APP_API_WS_URL + '?token=' + token
  console.log(path)
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

export function listTopic (topic, callback) {
  topics[topic] = callback
  console.log('listen', topic, callback)
}

function OnOpen () {
  console.log('socket连接成功')
  if (socket) {
    ticker = setInterval(function () {
      Send('ping')
    }, 2000)
  }
}

function OnError () {
  console.log('连接错误')
}

function OnMessage (msg) {
  const data = JSON.parse(msg.data)
  const func = topics[data.topic]
  if (func) {
    func(data.msg)
  }
}

function Send (msg) {
  socket.send(msg)
}

function OnClose () {
  console.log('socket已经关闭')
  clearInterval(ticker)
  socket = null
}
