<template>
  <div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="buildServiceClick">{{ $t('menu.service.docker.button.build') }}</a-button>
    </div>
    <s-table ref="table" size="default" :columns="columns" :data="data">
      <span slot="action" slot-scope="text, record">
        <a @click="seeLog(record.log)">{{ $t('menu.service.docker.button.see') }}</a>
      </span>
    </s-table>
    <a-modal style="overflow:auto" :footer="null" :width="800" v-model="logModel" :title="$t('menu.service.docker.title.see')">
      <div style="height: 500px; overflow-y: scroll;">
        <p v-html="log">{{ log }}</p>
      </div>
    </a-modal>
    <a-modal :footer="null" :width="800" v-model="buildModel" :title="$t('menu.service.docker.title.build')">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol" @submit="handleSubmit">
        <a-form-item :label="$t('menu.service.docker.form.images')" v-bind="formItemLayout">
          <a-input v-decorator="['images', { rules: [{ required: true, message: '请输入镜像地址' }] }]"/>
        </a-form-item>
        <a-form-item :label="$t('menu.service.docker.form.name')" v-bind="formItemLayout">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入服务名称' }] }]"/>
        </a-form-item>
        <a-form-item 
          v-for="(k, index) in form.getFieldValue('keys')"
          :key="k"
          :value="index"
          :label="$t('menu.service.docker.form.port')"
          v-bind="formItemLayout" 
          style="margin-bottom:0;"
        >
          <a-form-item :style="{ display: 'inline-block', width: 'calc(40% - 12px)' }">
            <a-input type="number" placeholder="对外端口" v-decorator="[`ports[${k}].externalPort`, { rules: [{ required: true, message: '请输入对外端口' }] }]"/>
          </a-form-item>
          <span :style="{ display: 'inline-block', width: '24px', textAlign: 'center' }">
            -
          </span>
          <a-form-item :style="{ display: 'inline-block', width: 'calc(40% - 12px)' }">
            <a-input type="number" v-decorator="[`ports[${k}].insidePort.number`, { rules: [{ required: true, message: '请输入容器端口' }] }]" placeholder="容器端口"/>
          </a-form-item>
          <a-icon
            v-if="form.getFieldValue('keys').length >= 1"
            class="dynamic-delete-button"
            type="minus-circle-o"
            :disabled="false"
            @click="() => remove(k)"
          />
        </a-form-item>
        <a-form-item v-bind="formItemLayoutWithOutLabel">
          <a-button type="dashed" style="width: 60%" @click="add">
            <a-icon type="plus" /> {{ $t('menu.service.docker.form.port.button') }}
          </a-button>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary" html-type="submit">
            {{ $t('menu.service.docker.form.button') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { STable } from '@/components'
import { listTopic } from '@/utils/websocket'

import { getDockerList } from '@/api/service'
import { startDocker } from '@/api/service'
import { thistle } from 'color-name'

let id = 0
export default {
  components: {
    STable
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 },
        },
      },
      logModel: false,
      log: '',
      // 查询条件参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      data: parameter => {
        return getDockerList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.body
        })
      },
      buildModel: false,
      formLayout: 'horizontal',
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this, { images: 'string', name: 'dynamic_form_item' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  computed: {
    columns () {
      return [
        { title: this.$t('menu.service.docker.table.name'), dataIndex: 'name', key: 'name' },
        { title: this.$t('menu.service.docker.table.image'), dataIndex: 'image', key: 'image' },
        { title: this.$t('menu.service.docker.table.status'), dataIndex: 'status', key: 'status' },
        { title: this.$t('menu.service.docker.table.time'), dataIndex: 'time', key: 'time' },
        { title: this.$t('menu.service.docker.table.action'), dataIndex: 'action', scopedSlots: { customRender: 'action' } },
      ]
    }
  },
  created () {
    console.log(this.form)
    const _this = this
    listTopic('build-service-topic', function (res) {
      console.log(res)
      _this.log = _this.log + res + '</p>'
    })
  },
  methods: {
    remove (k) {
      const { form } = this
      const keys = form.getFieldValue('keys')
      if (keys.length <= 0) {
        return
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      })
    },
    add () {
      const { form } = this
      const keys = this.form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      this.form.setFieldsValue({
        keys: nextKeys,
      })
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
        var images = values.images
        var name = values.name
        var ports = values.ports
        if (!ports) {
          ports = []
        }
        console.log(images, name, ports)
        this.form = this.$form.createForm(this, { images: 'string', name: 'dynamic_form_item' })
        this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
        if (!err) {
          startDocker({ images: images, name: name, ports: ports }).then(res => {
            this.buildModel = false
            this.seeLog('正在记载执行日志....</p>')
          })
        }
      })
    },
  },
}
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
