<template>
  <div style="height: 100%">
    <div id="terminal" ref="terminal"></div>
  </div>
</template>

<script>
// 引入xterm，请注意这里和3.x版本的引入路径不一样
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import 'xterm/lib/xterm.js'
import { FitAddon } from 'xterm-addon-fit'

export default {
  name: 'Shell',
  data() {
    return {
      id:'',
      token:'',
      method:'',
      shellWs: '',
      term: '',
      rows: 100,
      cols: 100,
      socket : null,
      topics : {},
      ticker :null
    }
  },

  created() {
    this.token=this.$route.query.token
    this.method=this.$route.query.method
    this.id=this.$route.query.id
    if (this.token&&this.method){
        console.log('token', this.token)
        console.log('method', this.method)
        console.log('id', this.id)
        this.connect()
    }
    //this.wsShell()
  },

  mounted() {
    const _this = this
    // 获取容器宽高/字号大小，定义行数和列数
    console.log(document.documentElement.clientHeight / 16)
    this.rows = document.documentElement.clientHeight / 16

    const term = new Terminal({
      rendererType: 'canvas', //渲染类型
      rows: parseInt(_this.rows), //行数
      //cols: parseInt(_this.cols), // 不指定行数，自动回车后光标从下一行开始
      convertEol: true, //启用时，光标将设置为下一行的开头
      //   scrollback: 50, //终端中的回滚量
      disableStdin: true, //是否应禁用输入。
      cursorStyle: 'underline', //光标样式
      cursorBlink: true, //光标闪烁
      theme: {
        foreground: '#7e9192', //字体
        //background: '#002833', //背景色
        cursor: 'help', //设置光标
        lineHeight: 20,
      },
    })
    // 创建terminal实例
    term.open(this.$refs['terminal'])
    // 换行并输入起始符“$”
    // term.prompt = () => {
    //   term.write('\r\n$ ')
    // }
    // term.prompt()
    // // canvas背景全屏
    var fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    fitAddon.fit()
    window.addEventListener('resize', resizeScreen)
    // 内容全屏显示
    function resizeScreen() {
      // 不传size
      //try {
      fitAddon.fit()
      // 窗口大小改变时触发xterm的resize方法，向后端发送行列数，格式由后端决定
      // 这里不使用size默认参数，因为改变窗口大小只会改变size中的列数而不能改变行数，所以这里不使用size.clos,而直接使用获取我们根据窗口大小计算出来的行列数
      // term.onResize(() => {
      //   _this.onSend({ Op: 'resize', Cols: term.cols, Rows: term.rows })
      // })
      //   } catch (e) {
      //     console.log('e', e.message)
      //   }
    }
    function runFakeTerminal(_this) {
      if (term._initialized) {
        return
      }
      // 初始化
      term._initialized = true
      term.writeln('开始输出执行日志')
      //term.prompt()
      // / **
      //     *添加事件监听器，用于按下键时的事件。事件值包含
      //     *将在data事件以及DOM事件中发送的字符串
      //     *触发了它。
      //     * @返回一个IDisposable停止监听。
      //  * /
      //   / ** 更新：xterm 4.x（新增）
      //  *为数据事件触发时添加事件侦听器。发生这种情况
      //  *用户输入或粘贴到终端时的示例。事件值
      //  *是`string`结果的结果，在典型的设置中，应该通过
      //  *到支持pty。
      //  * @返回一个IDisposable停止监听。
      //  * /
      // 支持输入与粘贴方法
      //   term.onData(function(key) {
      //     const order = {
      //       Data: key,
      //       Op: 'stdin'
      //     }
      //     console.log(key)
      //     // _this.onSend(order)
      //     // // 为解决窗体resize方法才会向后端发送列数和行数，所以页面加载时也要触发此方法
      //     // _this.onSend({
      //     //   Op: 'resize',
      //     //   Cols: parseInt(term.cols),
      //     //   Rows: parseInt(term.rows)
      //     // })
      //     term.writeln(key)
      //   })
      _this.term = term
    }
    runFakeTerminal(_this)
  },
  methods: {
    connect () {
        if (this.socket !== null) {
            return
        }
        const _this = this
        const token = this.token
        const method = this.method
        const id = this.id

        const query = `?token=${token}&method=${method}&id=${id}`
        const url = process.env.VUE_APP_API_WS_URL+'/xtermws'+query
        console.log(url)
        if (typeof (WebSocket) === 'undefined') {
            alert('您的浏览器不支持socket')
        } else {
            // 实例化socket
            this.socket = new WebSocket(url)
            // 监听socket连接
            this.socket.onopen = this.OnOpen
            // 监听socket错误信息
            this.socket.onerror = this.OnError
            // 监听socket消息
            this.socket.onmessage = this.OnMessage
            // 监听socket销毁信息
            this.socket.onclose = this.OnClose
        }
        },
    close(){
        if (this.socket!==null){
            this.socket.close()
        }
    },
    OnOpen () {
    console.log('socket连接成功')
    if (this.socket) {
        const _this = this
        this.ticker = setInterval(function () {
            _this.Send('ping')
            console.log('ping')
        }, 2000)
    }
    },
    OnError () {
        console.log('连接错误')
    },
    OnMessage (msg) {
        const data = JSON.parse(msg.data)
        console.log('ws recv : ',this.trim(data))
        this.term.writeln(this.trim(data))
    },
    Send (msg) {
        this.socket.send(msg)
    },
    OnClose () {
        console.log('socket已经关闭')
        //掉线
        clearInterval(this.ticker)
        this.socket = null
    },
    //删除左右两端的空格
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
  },
}
</script>