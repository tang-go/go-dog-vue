<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="addRole">添加根菜单</a-button>
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

    <a-modal v-model="addModel" title="添加角色" @ok="addOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>

<script>
  import { getRoleList } from '@/api/manage'
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
        addModel: false,
        router:{},
      }
    },
    created(){
    this.router = this.$route.meta
    console.log('当前页面权限',this.router)
  },
    methods: {
      addRole () {
        this.addModel = true
      },
      addOk () {
        this.addModel = false
      },
      addCancel () {
        this.addModel = false
      },
      edit (row) {
        // axios 发送数据到后端 修改数据成功后
        // 调用 refresh() 重新加载列表数据
        // 这里 setTimeout 模拟发起请求的网络延迟..
        setTimeout(() => {
          this.$refs.table.refresh() // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 1500)
      }
    }
  }
</script>
