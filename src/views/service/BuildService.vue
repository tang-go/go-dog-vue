<template>
  <div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="buildServiceClick">编译发布服务</a-button>
    </div>
    <s-table ref="table" size="default" :columns="columns" :data="data">
      <span slot="status" slot-scope="status" > 
        <div v-if="status"><a-badge status="success" />执行成功</div>
        <div v-if="!status"><a-badge status="default" />执行中</div>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="seeLog(record.log)">查看执行日志</a>
      </span>
    </s-table>
    <a-modal style="overflow:auto" :footer="null" :width="800" v-model="logModel" title="执行日志">
      <div>
        <p v-html="log">{{ log }}</p>
      </div>
    </a-modal>
    <a-modal :footer="null" :width="800" v-model="buildModel" title="发布服务">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
        <a-form-item label="Git地址">
          <a-input v-decorator="['git', { rules: [{ required: true, message: '请输入git仓库地址' }] }]"/>
        </a-form-item>
        <a-form-item label="镜像仓库地址">
          <a-input v-decorator="['harbor', { rules: [{ required: true, message: '请输入镜像仓库地址' }] }]"/>
        </a-form-item>
        <a-form-item label="镜像名称">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入镜像名称' }] }]"/>
        </a-form-item>
        <a-form-item label="需要编译的相对目录">
          <a-input v-decorator="['path', { rules: [{ required: true, message: '请输入需要编译的目录' }] }]"/>
        </a-form-item>
        <a-form-item label="镜像版本">
          <a-input v-decorator="['version', { rules: [{ required: true, message: '镜像版本' }] }]"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit">
            确定
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
      columns: [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: '名称', dataIndex: 'image', key: 'image' },
        { title: '执行状态', dataIndex: 'status', scopedSlots: { customRender: 'status' } },
        { title: '时间', dataIndex: 'time', key: 'time' },
        { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' } },
      ],
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
      form: this.$form.createForm(this, {
        git: 'string',
        harbor: 'string',
        name: 'string',
        path: 'string',
        version: 'string',
      }),
    }
  },
  created () {
    const _this = this
    listTopic('build-service-topic', function (res) {
      console.log(res)
      _this.log = _this.log + res + '</p>'
    })
  },
  methods: {
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
        if (!err) {
          buildService(values).then(res => {
            this.buildModel = false
            this.seeLog('正在记载执行日志....</p>')
          })
        }
      })
    },
  },
}
</script>