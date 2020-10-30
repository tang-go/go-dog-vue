<template>
  <div class="table-page-search-wrapper">
    <div class="table-operator">
      <a-button type="dashed" icon="undo" @click="updateClick">{{ $t('menu.service.build.button.update') }}</a-button>
    </div>
    <a-table ref="table" :columns="columns" :data-source="data" class="components-table-demo-nested">
      <a-table
        class="components-table-demo-nested"
        slot-scope="record"
        slot="expandedRowRender"
        :columns="innerColumns"
        :data-source="record.info"
        :pagination="false">
        <span slot="status" > <a-badge status="success" />运行中 </span>
        <a-table
          slot-scope="row"
          slot="expandedRowRender"
          :columns="methods"
          :data-source="row.methods"
          :pagination="false">
          <span slot="isAuth" slot-scope="method" > 
            <div v-if="method.isAuth"><a-badge status="success" />需要验证</div>
            <div v-if="!method.isAuth"><a-badge status="default" />不需要验证</div>
          </span>
          <p slot="expandedRowRender" slot-scope="response" style="margin: 0">
            <span>请求参数:<json-viewer :value="response.request"></json-viewer></span>
            <span>返回参数:<json-viewer :value="response.response"></json-viewer></span>
          </p>
        </a-table>
      </a-table>
    </a-table>
  </div>
</template>
<script>
import { getServiceList } from '@/api/service'
import JsonViewer from 'vue-json-viewer'

const columns = [
  { title: '服务名称', dataIndex: 'name', key: 'name' },
  { title: '说明', dataIndex: 'explain', key: 'explain' },
]

const innerColumns = [
  { title: '服务key', dataIndex: 'key', key: 'key' },
  { title: '地址', dataIndex: 'address', key: 'address' },
  { title: '端口', dataIndex: 'port', key: 'port' },
  { title: '时间', dataIndex: 'time', key: 'time' },
  { title: '状态', key: 'state', scopedSlots: { customRender: 'status' } },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const methods = [
  { title: '方法名称', dataIndex: 'name', key: 'name' },
  { title: '方法等级', dataIndex: 'level', key: 'level' },
  { title: '方法是否需要验证', key: 'isAuth', scopedSlots: { customRender: 'isAuth' } },
  { title: '方法说明', dataIndex: 'explain', key: 'explain' },
]



export default {
  components: {
    JsonViewer
  },
  data () {
    return {
      data: [],
      columns,
      innerColumns,
      methods,
    }
  },
  created () {
    //let self = this
    getServiceList().then(res => {
      console.log(res)
      this.data = []
      if (res.code === 10000) {
        const body = res.body
        for (let i = 0; i < body.list.length; ++i) {
          this.data.push({
            key: i,
            name: body.list[i].name,
            explain: body.list[i].explain,
            info: body.list[i].info,
          })
        }
      }
    })
  },
  methods: {
    updateClick () {
      getServiceList().then(res => {
        console.log(res)
        this.data = []
        if (res.code === 10000) {
          const body = res.body
          for (let i = 0; i < body.list.length; ++i) {
            this.data.push({
              key: i,
              name: body.list[i].name,
              explain: body.list[i].explain,
              info: body.list[i].info,
            })
          }
        }
      })
    }
  }
}
</script>
