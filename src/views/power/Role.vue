<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="addRole">添加角色</a-button>
    </div>
    <a-table v-if="router.select" ref="table" :columns="columns" :data-source="data" class="components-table-demo-nested">
      <span slot="action" slot-scope="text, row">
        <div v-if="row.isSuper === 'false'">
          <a v-if="router.update" @click="addChildrenManu(row)">菜单权限设置</a>
          <a-divider type="vertical" />
          <a v-if="router.update" @click="addChildrenManu(row)">api权限设置</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="remove(row)">
            <a>删除</a>
          </a-popconfirm>
        </div>
        <div v-if="row.isSuper === 'true'">
          系统默认管理员禁止操作
        </div>
      </span>
    </a-table>

    <a-modal v-model="addModel" title="添加角色" @ok="addOk">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="角色名称">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入角色名称' }] }]"/>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-decorator="['describe', { rules: [{ required: true, message: '请输入角色描述' }] }]"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import { getRoleList,createRole,delMenu } from '@/api/power'
  import JsonViewer from 'vue-json-viewer'
  import { asyncRouterMap } from '@/config/router.config'
  import router from '@/router'
  import store from '@/store'

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'describe', key: 'describe' },
    { title: '是否是超级角色', dataIndex: 'isSuper', key: 'isSuper' },
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
          name: '',
        }),
      }
    },
    created(){
      this.router = this.$route.meta
      console.log('当前页面权限 !!!',this.router)
      console.log('当前系统菜单',this.menus)
      this.initRole()
    },
    methods: {
      remove(row){
        console.log('删除',row)
        delMenu({menuID:row.id}).then(res => {
          console.log(res)
          this.initRole()
        })
      },
      initRole(){
        getRoleList().then(res => {
          this.data = []
          if (res.code === 10000) {
            const body = res.body
            console.log(body)
            for (let i = 0; i < body.role.length; ++i) {
              const data = {
                key:body.role[i].id,
                id:body.role[i].id,
                name:body.role[i].name,
                describe:body.role[i].describe,
                isSuper:body.role[i].isSuper.toString(),
                time:body.role[i].time,
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
        this.addModel = true
      },
      addRole () {
        this.addModel = true
      },
      addOk () {
        this.form.validateFields((err, values) => {
          console.log(values)
          createRole({describe:values.describe,name:values.name}).then(res => {
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
            this.form=this.$form.createForm(this, {
              describe: '',
              name: '',
            })
            this.initRole()
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
