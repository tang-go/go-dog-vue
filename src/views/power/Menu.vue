<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="addMenu">添加根菜单</a-button>
    </div>
    <a-table v-if="router.select" ref="table" :columns="columns" :data-source="data" class="components-table-demo-nested">
      <span slot="action" slot-scope="text, row">
        <div v-if="row.parentID <= 0">
          <a v-if="router.add" @click="addChildrenManu(row)">添加</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="remove(row)">
            <a>删除</a>
          </a-popconfirm>
        </div>
        <div v-if="row.parentID > 0">
          <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="remove(row)">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </span>
    </a-table>

    <a-modal v-model="addModel" title="添加菜单" @ok="addOk">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="请选择菜单">
          <a-select
            placeholder="请选择菜单"
            @change="selectMenu"
            v-decorator="['index', { rules: [{required: true, message: '菜单必须选择'}] }]">
            <a-select-option v-for="(item,index) in menus" :key="index" :value="index">{{ $t(item.meta.title) }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排序">
          <a-input v-decorator="['sort', { rules: [{ required: true, message: '请输入怕排序关键字' }] }]"/>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['describe', { rules: [{ required: true, message: '请输入菜单描述' }] }]"/>
        </a-form-item>
        <a-form-item label="路径">
          <a-input :disabled="true" :value="form.url"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import { getMenu,createMenu,delMenu } from '@/api/power'
  import JsonViewer from 'vue-json-viewer'
  import { asyncRouterMap } from '@/config/router.config'
  import router from '@/router'
  import store from '@/store'

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
        parentID:0,
        form: this.$form.createForm(this, {
          describe: '',
          parentID: 0,
          sort: 0,
          url: '',
        }),
      }
    },
    mounted(){
      console.log('系统菜单',asyncRouterMap)
      this.router = this.$route.meta
      this.initMenu()
    },
    methods: {
      remove(row){
        console.log('删除',row)
        delMenu({menuID:row.id}).then(res => {
          console.log(res)
          this.initMenu()
          this.initRouter()
        })
      },
      initMenu(){
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
      addOk () {
        this.form.validateFields((err, values) => {
          if (err) {
            return
          }
          console.log(values)
          createMenu({describe:values.describe,sort:Number(values.sort),parentID:this.parentID,url: this.menus[values.index].path}).then(res => {
            if (res.code !== 10000) {
              this.$notification['error']({
                message: '错误提示',
                description:
                  res.msg,
                duration: 3,
              })
              return
            }
            this.addModel = false
            this.parentID = 0
            this.form=this.$form.createForm(this, {
              describe: '',
              parentID: 0,
              sort: 0,
              url: '',
            })
            this.initMenu()
            this.initRouter()
          })
        })
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
