<template>
  <div style="height:auto;">
    <div class="container">
      <div id="terminal-container"></div>
    </div>
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
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'Turnoverfamily',
  data () {
    return {
      bdTokenUrl:''
    }
  },
  created () {
    this.bdTokenUrl = process.env.VUE_APP_API_BASE_URL+'/swagger/index.html?token='+ storage.get(ACCESS_TOKEN)
    console.log('bdTokenUrl',this.bdTokenUrl)
  },
  mounted () {
    const oIframe = document.getElementById('bdIframe')
    // const deviceWidth = document.documentElement.clientWidth
    const deviceHeight = document.documentElement.clientHeight
    // oIframe.style.width = (Number(deviceWidth)) + 'px' // 数字是页面布局宽度差值
    oIframe.style.height = deviceHeight + 'px' // 数字是页面布局高度差
    console.log(oIframe)
  },
  methods: {
  }
}
</script>

<style>
</style>
