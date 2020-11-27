<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="buildServiceClick">{{ $t('menu.service.docker.button.build') }}</a-button>
      <a-button v-if="router.select" type="dashed" icon="undo" @click="updateClick">{{ $t('menu.service.docker.button.update') }}</a-button>
    </div>
    <s-table v-if="router.select" ref="table" size="default" :columns="columns" :data="data">
      <span slot="runStatus" slot-scope="runStatus" > 
        <div v-if="runStatus"><a-badge status="success" />{{ $t('menu.service.docker.table.status.run') }}</div>
        <div v-if="!runStatus"><a-badge status="default" />{{ $t('menu.service.docker.table.status.close') }}</div>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-divider v-if="record.runStatus&&router.select" type="vertical" />
        <a v-if="record.runStatus&&router.select" @click="seeDetails(record)">{{ $t('menu.service.docker.button.see') }}</a>
        <a-divider v-if="!record.runStatus&&router.update" type="vertical" />
        <a v-if="!record.runStatus&&router.update" @click="restart(record)">{{ $t('menu.service.docker.button.run') }}</a>
        <a-divider v-if="record.runStatus&&router.select" type="vertical" />
        <a v-if="record.runStatus&&router.select" @click="seelog(record)">{{ $t('menu.service.docker.button.seelog') }}</a>
        <a-divider v-if="record.runStatus&&router.update" type="vertical" />
        <a v-if="record.runStatus&&router.update" @click="close(record)">{{ $t('menu.service.docker.button.close') }}</a>
        <a-divider v-if="!record.runStatus&&router.del" type="vertical" />
        <a v-if="!record.runStatus&&router.del" @click="del(record)">{{ $t('menu.service.docker.button.del') }}</a>
      </span>
    </s-table>
    <a-modal style="overflow:auto" :footer="null" :width="800" v-model="detailsModel" :title="$t('menu.service.docker.title.see')">
      <div style="height: 500px; overflow-y: scroll;">
        <json-viewer :value="details"></json-viewer>
      </div>
    </a-modal>
    <a-modal :footer="null" :width="800" v-model="buildModel" :title="$t('menu.service.docker.title.build')">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item 
          v-bind="formItemLayout" 
          :label="$t('menu.service.build.form.harbor')">
          <a-select
            :placeholder="$t('menu.service.build.form.harbor')"
            v-decorator="['image', { rules: [{required: true, message: '镜像仓库必须选择'}] }]">ibu
            <a-select-option v-for="(item,index) in images" :key="index" :value="item.id">{{ item.address }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item 
          v-bind="formItemLayout" 
          :label="$t('menu.service.build.form.name')">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入镜像名称' }] }]"/>
        </a-form-item>
        <a-form-item  
          v-bind="formItemLayout" 
          :label="$t('menu.service.build.form.version')">
          <a-input v-decorator="['version', { rules: [{ required: true, message: '镜像版本' }] }]"/>
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
            <a-input type="number" v-decorator="[`ports[${k}].insidePort`, { rules: [{ required: true, message: '请输入容器端口' }] }]" placeholder="容器端口"/>
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
          <a-button v-if="router.add" type="primary" html-type="submit">
            {{ $t('menu.service.docker.form.button') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal 
      @cancel="logcancel" 
      style="overflow:auto" 
      :footer="null" 
      :width="800" 
      v-model="logModel" 
      :title="$t('menu.service.build.title.seelog')">
      <div style="height: 500px; overflow-y: scroll;">
        <p v-html="log">{{ log }}</p>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { STable } from '@/components'
import { listTopic } from '@/utils/websocket'
import JsonViewer from 'vue-json-viewer'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getDockerList, startDocker, closeDocker,restartDocker,delDocker } from '@/api/service'
import { thistle } from 'color-name'
import { getGitList,getImageList } from '@/api/storage'

let id = 0
export default {
  components: {
    STable,
    JsonViewer
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
      images:[],
      logModel: false,
      log: {},
      router:{},
      detailsModel: false,
      details: {},
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
    this.form = this.$form.createForm(this, { images: 'string', name: '', ports: [] })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  computed: {
    columns () {
      return [
        { title: this.$t('menu.service.docker.table.dockerid'), dataIndex: 'dockerId', key: 'dockerId' },
        { title: this.$t('menu.service.docker.table.name'), dataIndex: 'name', key: 'name' },
        { title: this.$t('menu.service.docker.table.image'), dataIndex: 'image', key: 'image' },
        { title: this.$t('menu.service.docker.table.status'), dataIndex: 'runStatus', scopedSlots: { customRender: 'runStatus' } },
        { title: this.$t('menu.service.docker.table.time'), dataIndex: 'time', key: 'time' },
        { title: this.$t('menu.service.docker.table.action'), dataIndex: 'action', scopedSlots: { customRender: 'action' } },
      ]
    }
  },
  created () {
    this.router = this.$route.meta
    console.log('当前权限',this.router)
    console.log(this.form)
    const _this = this
    this.initImage()
    listTopic('run-docker-topic', function (res) {
      console.log(res)
      _this.log = _this.log + res + '</p>'
    })
  },
  methods: {
    initImage(){
      getImageList().then(res => {
        this.images = []
        if (res.code === 10000) {
          const body = res.body
          console.log(body.images)
          for (let i = 0; i < body.images.length; ++i) {
            const data = {
              key:body.images[i].id,
              id:body.images[i].id,
              address:body.images[i].address,
              account:body.images[i].account,
              pwd:body.images[i].pwd,
              time:body.images[i].time,
            }
            this.images.push(data)
          }
        }
      })
    },
    seelog(record){
      const token = storage.get(ACCESS_TOKEN)
      const url = '/iterm?token='+token+'&method=StartListDockerLog&id='+record.id
      console.log('seelog',url)
      window.open(url, '_blank')
    },
    restart(info){
      console.log('restart',info)
      const _this = this
      this.$confirm({
        title: '提示',
        content: '是否重启服务',
        onOk () {
          restartDocker({ dockerId: info.dockerId }).then(res => {
            if (res.code !== 10000) {
              _this.$notification['error']({
                message: '错误提示',
                description: res.msg,
                duration: 3,
              })
              return
            }
            _this.buildModel = false
            _this.$refs.table.refresh(true)
            _this.seeLog('正在加载执行日志....</p>')
          })
        },
        onCancel () { },
      })
    },
    del(info){
      console.log('del',info)
      const _this = this
      this.$confirm({
        title: '提示',
        content: '删除服务将无法找回是否继续',
        onOk () {
          delDocker({ dockerId: info.dockerId }).then(res => {
            if (res.code !== 10000) {
              _this.$notification['error']({
                message: '错误提示',
                description: res.msg,
                duration: 3,
              })
              return
            }
            _this.$notification['success']({
              message: '提示',
              description: '删除成功',
              duration: 3,
            })
            setTimeout(() => {
              _this.$refs.table.refresh(true)
              console.log('刷新')
            }, 1000)
          })
        },
        onCancel () { },
      })
    },
    close (info) {
      const _this = this
      this.$confirm({
        title: '提示',
        content: '是否关闭服务',
        onOk () {
          closeDocker({ id: info.id }).then(res => {
            if (res.code !== 10000) {
              _this.$notification['error']({
                message: '错误提示',
                description: res.msg,
                duration: 3,
              })
              return
            }
            _this.$notification['success']({
              message: '提示',
              description: '关闭成功',
              duration: 3,
            })
            setTimeout(() => {
              _this.$refs.table.refresh(true)
              console.log('刷新')
            }, 1000)
          })
        },
        onCancel () { },
      })
    },
    logcancel (e) {
      this.$refs.table.refresh(true)
    },
    seeLog (log) {
      this.log = log
      this.logModel = true
    },
    updateClick () {
      this.$refs.table.refresh(true)
    },
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
      this.form = this.$form.createForm(this, { images: 'string', name: '', ports: [] })
      this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
      this.buildModel = true
    },
    seeDetails (msg) {
      this.details = {
        id: msg.id,
        name: msg.name,
        image: msg.image,
        ports: msg.ports,
        status: msg.status,
        command: msg.command,
        time: msg.time,
      }
      this.detailsModel = true
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (err) {
           return
        }
        if (!values.ports) {
          values.ports = []
        }
        var ports = values.ports.filter(function (s) {
          console.log(s)
          if (s) {
            return true
          }
          return false
        })
        var param = { image: values.image, name: values.name,version: values.version, ports: ports }
        console.log(param)
        if (!err) {
          startDocker(param).then(res => {
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
