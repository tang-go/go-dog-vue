<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="addRole">添加角色</a-button>
    </div>
    <a-table v-if="router.select" ref="table" :columns="columns" :data-source="data" class="components-table-demo-nested">
      <span slot="action" slot-scope="text, row">
        <div v-if="row.isSuper === 'false'">
          <a v-if="router.select" @click="addMenu(row)">角色菜单设置</a>
          <a-divider type="vertical" />
          <a v-if="router.select" @click="addApi(row)">角色api设置</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="removeRole(row)">
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

    <a-modal width="1000px" v-model="addMenuModel" title="角色菜单设置" @ok="addMenuModel = false">
      <div>
        <div class="table-operator">
          <a-button v-if="router.add" type="primary" icon="plus" @click="addRoleMenu">添加角色菜单权限</a-button>
        </div>
        <a-table v-if="router.select" ref="menuTable" :columns="menuColumns" :data-source="roleMenuData" class="components-table-demo-nested">
          <span slot="action" slot-scope="text, row">
            <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="removeRoleMenu(row)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>

        <a-modal v-model="addRoleMenuModel" title="添加角色菜单权限" @ok="addRoleMenuOk">
          <a-form :form="addRoleMenuform" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="请选择菜单">
              <a-select
                placeholder="请选择菜单"
                @change="selectRoleMenu"
                v-decorator="['index', { rules: [{required: true, message: '菜单必须选择'}] }]">
                <a-select-option v-for="(item,index) in adminMenus" :key="index" :value="index">{{ item.describe }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="页面权限">
              <a-checkbox-group
                v-decorator="['checkbox', { initialValue: ['select'] }]"
                style="width: 100%;"
              >
                <a-row>
                  <a-col :span="12">
                    <a-checkbox value="add">
                      增加权限
                    </a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox value="del">
                      删除权限
                    </a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox value="update">
                      修改权限
                    </a-checkbox>
                  </a-col>
                  <a-col :span="12">
                    <a-checkbox disabled value="select">
                      查询权限
                    </a-checkbox>
                  </a-col>
                </a-row>
              </a-checkbox-group>
            </a-form-item>
            <a-form-item label="路径">
              <a-input :disabled="true" :value="addRoleMenuform.url"/>
            </a-form-item>
          </a-form>
        </a-modal>
      </div>
    </a-modal>
    
    
    <a-modal width="1000px" v-model="addApiModel" title="角色API设置" @ok="addMenuModel = false">
      <div>
        <div class="table-operator">
          <a-button v-if="router.add" type="primary" icon="plus" @click="addRoleApi">添加角色api权限</a-button>
        </div>

        <a-table v-if="router.select" ref="menuTable" :columns="apiColumns" :data-source="roleApiData" class="components-table-demo-nested">
          <span slot="action" slot-scope="text, row">
            <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="removeRoleApi(row)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </a-table>

        <a-modal v-model="addRoleApiModel" title="添加角色API" @ok="addRoleApiOk">
          <a-form :form="addRoleApiForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-form-item label="请选择API">
              <a-select
                placeholder="请选择API"
                @change="selectRoleApi"
                v-decorator="['index', { rules: [{required: true, message: 'API必须选择'}] }]">
                <a-select-option v-for="(item,index) in adminApis" :key="index" :value="index">{{ item.describe }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="API">
              <a-input :disabled="true" :value="addRoleApiForm.api"/>
            </a-form-item>
          </a-form>
        </a-modal>

      </div>
    </a-modal>

  </div>
</template>

<script>
  import { getRoleList,createRole,delRole,delRoleMenu,getRoleMenuList,bindRoleMenu,getRoleApiList,bindRoleApi,delRoleApi } from '@/api/power'
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

  const menuColumns = [
    { title: '页面路径', dataIndex: 'url', key: 'url' },
    { title: '描述', dataIndex: 'describe', key: 'describe' },
    { title: '增加权限', dataIndex: 'add', key: 'add' },
    { title: '删除权限', dataIndex: 'del', key: 'del' },
    { title: '修改权限', dataIndex: 'update', key: 'update' },
    { title: '查询权限', dataIndex: 'select', key: 'select' },
    { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }},
  ]

  const apiColumns = [
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
        addApiModel:false,
        addRoleApiModel:false,
        roleApiData:[],
        data: [],
        columns,
        menuColumns,
        apiColumns,
        roleMenuData:[],
        addModel: false,
        addMenuModel:false,
        addRoleMenuModel:false,
        roleID:0,
        addRoleApiForm: this.$form.createForm(this, {
          describe: '',
          api: '',
        }),
        addRoleMenuform: this.$form.createForm(this, {
          describe: '',
          url: '',
        }),
        router:{},
        buildModel: false,
        formLayout: 'horizontal',
        menus:[],
        adminMenus:[],
        adminApis:[],
        form: this.$form.createForm(this, {
          describe: '',
          name: '',
        }),
      }
    },
    mounted(){
      this.router = this.$route.meta
      console.log('当前页面权限 !!!',this.router)
      const menus = store.getters.menus
      console.log('当前用户菜单',menus)
      const apis = store.getters.apis
      console.log('当前用户API',apis)
      this.adminApis = apis
      this.adminMenus = []
      for (var i = 0; i < menus.length; i++){
        const data = {
          id:menus[i].id,
          url:menus[i].url,
          describe:menus[i].describe,
        }
        console.log('menus',i,menus[i])
        this.adminMenus.push(data)
        if (menus[i].children){
          const children = menus[i].children
          for (let j = 0; j < children.length; j++) {
            const data = {
              id:children[j].id,
              url:children[j].url,
              describe:children[j].describe,
            }
            this.adminMenus.push(data)
          }
        }
      }
      this.initRole()
    },
    methods: {
      addRoleApiOk(){
        this.addRoleApiForm.validateFields((err, values) => {
          console.log('addRoleApiOk',values)
          const data = {apiID: this.adminApis[values.index].id,roleID: this.roleID}
          console.log('bind role api',data)
          bindRoleApi(data).then(res => {
            if (res.code !== 10000) {
              this.$notification['error']({
                message: '错误提示',
                description:
                  res.msg,
                duration: 3,
              })
              return
            }
            this.addRoleApiModel = false
            this.addRoleApiForm = this.$form.createForm(this, {
              describe: '',
              api: '',
            })
            this.initRoleApi(this.roleID)
          })
        })
      },
      addMenu(row){
        console.log('添加角色菜单',row)
        this.initRoleMenu(row.id)
        this.roleID = row.id
        this.addMenuModel = true
      },
      addApi(row){
        console.log('添加角色api',row)
        this.initRoleApi(row.id)
        this.roleID = row.id
        this.addApiModel = true
      },
      addRoleApi(){
        this.addRoleApiModel = true
      },
      selectRoleApi(index){
        console.log(this.adminApis[index].api)
        this.addRoleApiForm.api = this.adminApis[index].api
      },
      removeRoleApi(row){
        console.log('删除',row)
        delRoleApi({apiID:row.id,roleID:this.roleID}).then(res => {
           if (res.code !== 10000) {
              this.$notification['error']({
                message: '错误提示',
                description:
                  res.msg,
                duration: 3,
              })
              return
            }
            this.initRoleApi(this.roleID)
        })
      },
      removeRole(row){
        console.log('删除角色',row)
        delRole({id:row.id}).then(res => {
           if (res.code !== 10000) {
              this.$notification['error']({
                message: '错误提示',
                description:
                  res.msg,
                duration: 3,
              })
              return
            }
            this.initRole()
        })
      },
      removeRoleMenu(row){
        console.log('删除',row)
        delRoleMenu({menuID:row.id,roleID:this.roleID}).then(res => {
           if (res.code !== 10000) {
              this.$notification['error']({
                message: '错误提示',
                description:
                  res.msg,
                duration: 3,
              })
              return
            }
            this.initRoleMenu(this.roleID)
        })
      },
      addRoleMenu(){
        this.addRoleMenuModel = true
      },
      selectRoleMenu(index){
        console.log(this.adminMenus[index].url)
        this.addRoleMenuform.url = this.adminMenus[index].url
      },
      addRoleMenuOk(){
        this.addRoleMenuform.validateFields((err, values) => {
          console.log('addRoleMenuOk',values)
          const data = {add: false,del: false,menuID: this.adminMenus[values.index].id,roleID: this.roleID,select: true,update: false}
          if (values.add === 'add'){
            data.add = true
          }
          if (values.del === 'del'){
            data.del = true
          }
          if (values.update === 'update'){
            data.update = true
          }
          if (values.select === 'select'){
            data.select = true
          }
          console.log('bind role menu',data)
          bindRoleMenu(data).then(res => {
            if (res.code !== 10000) {
              this.$notification['error']({
                message: '错误提示',
                description:
                  res.msg,
                duration: 3,
              })
              return
            }
            this.addRoleMenuModel = false
            this.addRoleMenuform = this.$form.createForm(this, {
              describe: '',
              url: '',
            })
            this.initRoleMenu(this.roleID)
          })
        })
      },
      initRoleApi(roleID){
        getRoleApiList({roleID:roleID}).then(res => {
          if (res.code === 10000) {
            const body = res.body
            this.roleApiData = []
            for (let i = 0; i < body.apis.length; ++i) {
              const data = {
                key:body.apis[i].id,
                id:body.apis[i].id,
                api:body.apis[i].api,
                describe:body.apis[i].describe,
                time:body.apis[i].time,
              }
              this.roleApiData.push(data)
            }
            console.log('roleApiData',this.roleApiData)
          }
        })
      },
      initRoleMenu(id){
        getRoleMenuList({roleID:id}).then(res => {
          this.roleMenuData = []
          if (res.code === 10000) {
            const body = res.body
            if (!body.menu){
              return
            }
            for (let i = 0; i < body.menu.length; ++i) {
              console.log('role manu',body.menu)
              const data = {
                key:body.menu[i].id,
                id:body.menu[i].id,
                url:body.menu[i].url,
                describe:body.menu[i].describe,
                add:body.menu[i].add.toString(),
                del:body.menu[i].del.toString(),
                update:body.menu[i].update.toString(),
                select:body.menu[i].select.toString(),
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
          }
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
