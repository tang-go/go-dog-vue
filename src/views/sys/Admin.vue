<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="addAdmin">添加管理员</a-button>
    </div>
    <a-table v-if="router.select" ref="table" :columns="columns" :data-source="data" class="components-table-demo-nested">
      <span slot="isDisable" slot-scope="text, row">
        <div v-if="router.update">
          <a-switch :default-checked="row.isDisable"  @change="onChange($event,row)" />
        </div>
      </span>
      <span slot="action" slot-scope="text, row">
        <a v-if="router.select">
          <a @click="seeMenu(row.menu)">查看菜单权限</a>
          <a-divider type="vertical" />
          <a @click="seeApi(row.apis)">查看api访问权限</a>
          <a-divider type="vertical" />
        </a>
        <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="remove(row)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-modal v-model="addModel" title="添加管理员" @ok="addOk">
      <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="名称">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入管理员名称' }] }]"/>
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-decorator="['phone', { rules: [{ required: true, message: '请输入手机号' }] }]"/>
        </a-form-item>
        <a-form-item label="密码">
          <a-input v-decorator="['pwd', { rules: [{ required: true, message: '请输入管理员登陆密码' }] }]"/>
        </a-form-item>
        <a-form-item label="请选择管理员角色">
          <a-select
            placeholder="请选择管理员角色"
            v-decorator="['index', { rules: [{required: true, message: '必须给管理员绑定一个角色'}] }]">
            <a-select-option v-for="(item,index) in rolelist" :key="index" :value="index">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <a-modal width="1000px" v-model="seeMenuModel" title="菜单权限详情" @ok="seeMenuModel = false">
      <div>
        <a-table v-if="router.select" ref="menuTable" :columns="menuColumns" :data-source="roleMenuData" class="components-table-demo-nested">
        </a-table>
      </div>
    </a-modal>

    <a-modal width="1000px" v-model="seeApiModel" title="角色API设置" @ok="seeApiModel = false">
      <div>
        <a-table v-if="router.select" ref="menuTable" :columns="apiColumns" :data-source="roleApiData" class="components-table-demo-nested">
        </a-table>
      </div>
    </a-modal>

  </div>
</template>

<script>
  import { getAdminList,createAdmin,disableAdmin,openAdmin,delAdmin } from '@/api/admin'
  import JsonViewer from 'vue-json-viewer'
  import { asyncRouterMap } from '@/config/router.config'
  import router from '@/router'
  import store from '@/store'
  import { getRoleList } from '@/api/power'

  const columns = [
    { title: 'ID', dataIndex: 'adminID', key: 'adminID' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '管理员角色', dataIndex: 'roleName', key: 'roleName' },
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '是否禁用', key: 'isDisable', scopedSlots: { customRender: 'isDisable' }},
    { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }},
  ]
  
  const menuColumns = [
    { title: '页面路径', dataIndex: 'url', key: 'url' },
    { title: '描述', dataIndex: 'describe', key: 'describe' },
    { title: '增加权限', dataIndex: 'add', key: 'add' },
    { title: '删除权限', dataIndex: 'del', key: 'del' },
    { title: '修改权限', dataIndex: 'update', key: 'update' },
    { title: '查询权限', dataIndex: 'select', key: 'select' },
  ]

  const apiColumns = [
    { title: 'api', dataIndex: 'api', key: 'api' },
    { title: '描述', dataIndex: 'describe', key: 'describe' },
    { title: '时间', dataIndex: 'time', key: 'time' },
  ]
  export default {
    components: {
      JsonViewer
    },
    data () {
      return {
        data: [],
        rolelist:[],
        roleMenuData:[],
        roleApiData:[],
        checked:false,
        columns,
        menuColumns,
        apiColumns,
        addModel: false,
        seeMenuModel:false,
        seeApiModel:false,
        router:{},
        buildModel: false,
        formLayout: 'horizontal',
        menus:asyncRouterMap,
        parentID:0,
        form: this.$form.createForm(this, {
          phone: '',
          name: '',
          pwd:'',
          roleID:0,
          index:0,
        }),
      }
    },
    created(){
      this.router = this.$route.meta
      this.initRole()
      this.initAdmin()
    },
    methods: {
      addOk(){
        this.form.validateFields((err, values) => {
          console.log(values)
          createAdmin({name:values.name,phone:values.phone,pwd:values.pwd,roleID:this.rolelist[values.index].id}).then(res => {
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
              phone: '',
              name: '',
              pwd:'',
              roleID:0,
              index:0,
            })
            this.initAdmin()
          })
        })
      },
      onChange(checked,row) {
        console.log(checked,row)
        if (checked){
          disableAdmin({adminID:row.adminID}).then(res => {
            if (res.code !== 10000) {
              this.$notification['error']({
                message: '错误提示',
                description:
                  res.msg,
                duration: 3,
              })
              return
            }
            this.$notification['success']({
              message: '提示',
              description:'禁用管理员成功',
              duration: 3,
            })
            this.initAdmin()
          })
        }else{
          openAdmin({adminID:row.adminID}).then(res => {
            if (res.code !== 10000) {
              this.$notification['error']({
                message: '错误提示',
                description:
                  res.msg,
                duration: 3,
              })
              return
            }
            this.$notification['success']({
              message: '提示',
              description:'开启管理员成功',
              duration: 3,
            })
            this.initAdmin()
          })
        }
        
      },
      addAdmin(){
        this.addModel = true
      },
      remove(row){
        console.log('删除',row)
        delAdmin({adminID:row.adminID}).then(res => {
          if (res.code !== 10000) {
            this.$notification['error']({
              message: '错误提示',
              description:
                res.msg,
              duration: 3,
            })
            return
          }
          this.$notification['success']({
            message: '提示',
            description:'删除成功',
            duration: 3,
          })
          this.initAdmin()
        })
      },
      seeApi(apis){
        this.roleApiData = []
        for (let i = 0; i < apis.length; ++i) {
          const data = {
            key:apis[i].id,
            id:apis[i].id,
            api:apis[i].api,
            describe:apis[i].describe,
            time:apis[i].time,
          }
          this.roleApiData.push(data)
        }
        console.log('roleApiData',this.roleApiData)
        this.seeApiModel = true
      },
      seeMenu(menu){
        this.roleMenuData = []
          
        for (let i = 0; i < menu.length; ++i) {
          console.log('role manu',menu)
          const data = {
            key:menu[i].id,
            id:menu[i].id,
            url:menu[i].url,
            describe:menu[i].describe,
            add:menu[i].add.toString(),
            del:menu[i].del.toString(),
            update:menu[i].update.toString(),
            select:menu[i].select.toString(),
            parentID:menu[i].parentID,
          }
          if (menu[i].children){
            data.children = []
            const children = menu[i].children
            for (let i = 0; i < children.length; ++i) {
              data.children.push({
                key:children[i].id,
                id:children[i].id,
                url:children[i].url,
                describe:children[i].describe,
                add:children[i].add.toString(),
                del:children[i].del.toString(),
                update:children[i].update.toString(),
                select:children[i].select.toString(),
                parentID:children[i].parentID,
              }) 
            }
          }
          this.roleMenuData.push(data)
        }
        console.log(this.roleMenuData)
        this.seeMenuModel = true
      },
      initRole(){
        getRoleList().then(res => {
          this.rolelist = []
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
              this.rolelist.push(data)
            }
            console.log(this.rolelist)
          }
        })
      },
      initAdmin(){
        getAdminList().then(res => {
          this.data = []
          if (res.code === 10000) {
            const body = res.body
            console.log(body)
            for (let i = 0; i < body.adminInfos.length; ++i) {
              const data = {
                key:body.adminInfos[i].adminID,
                adminID:body.adminInfos[i].adminID,
                name:body.adminInfos[i].name,
                phone:body.adminInfos[i].phone,
                roleID:body.adminInfos[i].roleID,
                roleName:body.adminInfos[i].roleName,
                menu:body.adminInfos[i].menu,
                apis:body.adminInfos[i].apis,
                isDisable:body.adminInfos[i].isDisable,
                time:body.adminInfos[i].time,
              }
              this.data.push(data)
            }
          }
        })
      }
    }
  }
</script>
