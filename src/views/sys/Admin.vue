<template>
  <div>
    <a-table v-if="router.select" ref="table" :columns="columns" :data-source="data" class="components-table-demo-nested">
      <span slot="action" slot-scope="text, row">
        <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="remove(row)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
  import { getApiList,delApi } from '@/api/power'
  import JsonViewer from 'vue-json-viewer'
  import { asyncRouterMap } from '@/config/router.config'
  import router from '@/router'
  import store from '@/store'

  const columns = [
    { title: 'api', dataIndex: 'api', key: 'api' },
    { title: '描述', dataIndex: 'describe', key: 'describe' },
    { title: '时间', dataIndex: 'time', key: 'time' },
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
        parentID:0,
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
      this.initApi()
    },
    methods: {
      remove(row){
        console.log('删除',row)
        delApi({id:row.id}).then(res => {
          console.log(res)
          this.initApi()
        })
      },
      initApi(){
        getApiList().then(res => {
          this.data = []
          if (res.code === 10000) {
            const body = res.body
            console.log(body.apis)
            for (let i = 0; i < body.apis.length; ++i) {
              const data = {
                key:body.apis[i].id,
                id:body.apis[i].id,
                api:body.apis[i].api,
                describe:body.apis[i].describe,
                time:body.apis[i].time,
              }
              this.data.push(data)
            }
          }
        })
      },
      initRouter(){
        store.dispatch('RomveRoter')
      },
      selectMenu(index){
        console.log(this.menus[index].path)
        this.form.url = this.menus[index].path
      },
      addChildrenManu(row){
        console.log('row',row)
        this.parentID = row.id
        this.addModel = true
      },
      addMenu () {
        this.parentID = 0
        this.addModel = true
      },
      addCancel () {
        this.addModel = false
      },
      edit (row) {
        setTimeout(() => {
          this.$refs.table.refresh() // refresh() 不传参默认值 false 不刷新到分页第一页
        }, 1500)
      }
    }
  }
</script>
