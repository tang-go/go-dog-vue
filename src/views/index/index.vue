<template>
  <div style="height:auto;">
    <iframe
      style="width:100%;height:100%;"
      :src="bdTokenUrl"
      hight="auto"
      frameborder="0"
      id="bdIframe">
    </iframe>
  </div>
</template>

<script type="text/javascript">
export default {
  name: 'Turnoverfamily',
  data () {
    return {
      bdTokenUrl: 'http://127.0.0.1:8080/swagger/index.html'
    }
  },
  created () { },
  mounted () {
    const oIframe = document.getElementById('bdIframe')
    // const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    // oIframe.style.width = (Number(deviceWidth)) + 'px' // 数字是页面布局宽度差值
    oIframe.style.height = deviceHeight + 'px' // 数字是页面布局高度差
    console.log(oIframe)
  },
  methods: {}
}
</script>

<style>
</style>
