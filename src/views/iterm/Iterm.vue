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
      shellWs: '',
      term: '', // 保存terminal实例
      rows: 100,
      cols: 100
    } 
  },

  created() {
    //this.wsShell() 
  },

  mounted() {
    const _this = this 
    // 获取容器宽高/字号大小，定义行数和列数
    console.log(document.documentElement.clientHeight/16)
    this.rows = document.documentElement.clientHeight/16 

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
        lineHeight: 20
      }
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
      term.writeln('0x1B[32;40;1m4(f=32,b=30,d=1)0x1B[0m')
      term.writeln( `This is Web Terminal of pod\x1B[1 3 31m aaaa \x1B[0m in namespace\x1B[1 3 31m bbb \x1B[0m`) 
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
    wsShell() {
      const _this = this 
      const tag = this.urlParam.Tag 
      const name= this.urlParam.name 
      const pod= this.urlParam.pod 

      const query = `?tag=${tag}&name=${name}&pod=${pod}`
      const url = `xxxx/xxxx${query}`

      this.shellWs = this.base.WS({
        url,
        isInit: true,
        openFn() {
          //   _this.term.resize({ rows: _this.rows, cols: 100 })  //终端窗口重新设置大小 并触发term.on('resize')
        },
        messageFn(e) {
          console.log('message', e) 
          if (e) {
            const data = JSON.parse(e.data) 
            if (data.Data == '\n' || data.Data == '\r\nexit\r\n') {
              _this.$message('连接已关闭') 
            }
            // 打印后端返回数据
            _this.term.write(data.Data) 
          }
        },
        errorFn(e) {
          //出现错误关闭当前ws,并且提示
          console.log('error', e) 
          _this.$message.error({
            message: 'ws 请求失败,请刷新重试~',
            duration: 5000
          }) 
        }
      })
    },
    onSend(data) {
      data = this.base.isObject(data) ? JSON.stringify(data) : data
      data = this.base.isArray(data) ? data.toString() : data
      data = data.replace(/\\\\/, '\\')
      this.shellWs.onSend(data)
    },
    //删除左右两端的空格
    trim(str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    }
  }
}
</script>