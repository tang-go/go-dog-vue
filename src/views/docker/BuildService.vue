<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="buildServiceClick">{{ $t('menu.service.build.button.build') }}</a-button>
      <a-button v-if="router.select" type="dashed" icon="undo" @click="updateClick">{{ $t('menu.service.build.button.update') }}</a-button>
    </div>
    <s-table v-if="router.select" ref="table" size="default" :columns="columns" :data="data">
      <span slot="status" slot-scope="status" > 
        <div v-if="status"><a-badge status="success" />{{ $t('menu.service.build.table.status.success') }}</div>
        <div v-if="!status"><a-badge status="default" />{{ $t('menu.service.build.table.status.ing') }}</div>
      </span>
      <span v-if="router.select" slot="action" slot-scope="text, record">
        <a @click="seeLog(record.log)">{{ $t('menu.service.build.button.seelog') }}</a>
      </span>
    </s-table>
    <a-modal 
      style="overflow:auto" 
      :footer="null" 
      :width="800" 
      v-model="logModel" 
      @cancel="logcancel" 
      :title="$t('menu.service.build.title.seelog')">
      <div style="height: 500px; overflow-y: scroll;">
        <p v-html="log">{{ log }}</p>
      </div>
    </a-modal>
    <a-modal :footer="null" :width="800" v-model="buildModel" :title="$t('menu.service.build.title.build')">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item :label="$t('menu.service.build.form.git')">
          <a-input v-decorator="['git', { rules: [{ required: true, message: '请输入git仓库地址' }] }]"/>
        </a-form-item>
        <a-form-item :label="$t('menu.service.build.form.gitAccount')">
          <a-input v-decorator="['gitAccount', { rules: [{ required: false, message: '请输入git账号' }] }]"/>
        </a-form-item>
        <a-form-item :label="$t('menu.service.build.form.gitPwd')">
          <a-input v-decorator="['gitPwd', { rules: [{ required: false, message: '请输入git密码' }] }]"/>
        </a-form-item>
        <a-form-item :label="$t('menu.service.build.form.harbor')">
          <a-input v-decorator="['harbor', { rules: [{ required: true, message: '请输入镜像仓库地址' }] }]"/>
        </a-form-item>
        <a-form-item :label="$t('menu.service.build.form.name')">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入镜像名称' }] }]"/>
        </a-form-item>
        <a-form-item :label="$t('menu.service.build.form.account')">
          <a-input v-decorator="['account', { rules: [{ required: false, message: '请输入Harbor账号' }] }]"/>
        </a-form-item>
        <a-form-item :label="$t('menu.service.build.form.pwd')">
          <a-input v-decorator="['pwd', { rules: [{ required: false, message: '请输入Harbor密码' }] }]"/>
        </a-form-item>
        <a-form-item :label="$t('menu.service.build.form.path')">
          <a-input v-decorator="['path', { rules: [{ required: true, message: '请输入需要编译的目录' }] }]"/>
        </a-form-item>
        <a-form-item :label="$t('menu.service.build.form.version')">
          <a-input v-decorator="['version', { rules: [{ required: true, message: '镜像版本' }] }]"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button v-if="router.add" type="primary" html-type="submit">
            {{ $t('menu.service.build.form.button') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { STable } from '@/components'
import { listTopic } from '@/utils/websocket'

import { getBuildServiceList } from '@/api/service'
import { buildService } from '@/api/service'

export default {
  components: {
    STable
  },
  data () {
    return {
      logModel: false,
      log: '',
      // 查询条件参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      data: parameter => {
        return getBuildServiceList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.body
        })
      },
      buildModel: false,
      formLayout: 'horizontal',
      router:{},
      form: this.$form.createForm(this, {
        git: 'string',
        harbor: 'string',
        name: 'string',
        path: 'string',
        version: 'string',
      }),
    }
  },
  computed: {
    columns () {
      return [
        { title: this.$t('menu.service.build.table.id'), dataIndex: 'id', key: 'id' },
        { title: this.$t('menu.service.build.table.name'), dataIndex: 'image', key: 'image' },
        { title: this.$t('menu.service.build.table.status'), dataIndex: 'status', scopedSlots: { customRender: 'status' } },
        { title: this.$t('menu.service.build.table.time'), dataIndex: 'time', key: 'time' },
        { title: this.$t('menu.service.build.table.action'), dataIndex: 'action', scopedSlots: { customRender: 'action' } },
      ]
    }
  },
  created () {
    this.router = this.$route.meta
    console.log('当前权限',this.router)
    const _this = this
    listTopic('build-service-topic', function (res) {
      console.log(res)
      _this.log = _this.log + res + '</p>'
    })
  },
  methods: {
    logcancel (e) {
      this.$refs.table.refresh(true)
    },
    updateClick () {
      this.$refs.table.refresh(true)
    },
    buildServiceClick () {
      this.buildModel = true
    },
    seeLog (log) {
      this.log = log
      this.logModel = true
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(values)
        buildService(values).then(res => {
          if (res.code !== 10000) {
            this.$notification['error']({
              message: '错误提示',
              description:
                res.msg,
              duration: 3,
            })
            return
          }
          this.buildModel = false
          this.$refs.table.refresh(true)
          this.seeLog('正在加载执行日志....</p>')
        })
      })
    }
  }
}
</script>