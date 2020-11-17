<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="addRole">添加根菜单</a-button>
    </div>
    <a-table ref="table" :columns="columns" :data-source="data" class="components-table-demo-nested">
      <span slot="action" slot-scope="text, row">
        <div v-if="row.parentID <= 0">
          <a v-if="router.add">添加</a>
          <a-divider type="vertical" />
          <a v-if="router.del">删除</a>
        </div>
        <div v-if="row.parentID > 0">
          <a v-if="router.del">删除</a>
        </div>
      </span>
    </a-table>

    <a-modal v-model="addModel" title="添加菜单" @ok="addOk">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="请选择菜单">
          <a-select
            placeholder="请选择菜单"
            v-decorator="['url', { rules: [{required: true, message: '菜单必须选择'}] }]">
            <a-select-option v-for="(item,index) in menus" :key="index" :value="index">{{ $t(item.meta.title) }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排序">
          <a-input v-decorator="['sort', { rules: [{ required: true, message: '请输入怕排序关键字' }] }]"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import { getMenu } from '@/api/power'
  import JsonViewer from 'vue-json-viewer'
  import { asyncRouterMap } from '@/config/router.config'

  const columns = [
    { title: '页面路径', dataIndex: 'url', key: 'url' },
    { title: '描述', dataIndex: 'describe', key: 'describe' },
    { title: '排序', dataIndex: 'sort', key: 'sort' },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }},
  ]

  export default {
    components: {
      JsonViewer
    },
    data () {
      return {
        data: [],
        columns,
        addModel: false,
        router:{},
        buildModel: false,
        formLayout: 'horizontal',
        menus:asyncRouterMap,
        form: this.$form.createForm(this, {
          describe: '',
          parentID: 0,
          sort: 0,
          url: '',
        }),
      }
    },
    created(){
      this.router = this.$route.meta
      console.log('当前页面权限 !!!',this.router)
      console.log('当前系统菜单',this.menus)
      getMenu().then(res => {
        this.data = []
        if (res.code === 10000) {
          const body = res.body
          for (let i = 0; i < body.menu.length; ++i) {
            const data = {
              key:body.menu[i].id,
              id:body.menu[i].id,
              url:body.menu[i].url,
              describe:body.menu[i].describe,
              sort:body.menu[i].sort,
              parentID:body.menu[i].parentID,
            }
            if (body.menu[i].children){
              data.children = []
              const children = body.menu[i].children
              for (let i = 0; i < children.length; ++i) {
                data.children.push({
                  key:children[i].id,
                  id:children[i].id,
                  url:children[i].url,
                  describe:children[i].describe,
                  sort:children[i].sort,
                  parentID:children[i].parentID,
                }) 
              }
            }
            this.data.push(data)
          }
          console.log(this.data)
        }
      })
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
