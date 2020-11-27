<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="addGit">创建git仓库</a-button>
    </div>
    <a-table v-if="router.select" ref="table" :columns="columns" :data-source="data" class="components-table-demo-nested">
      <span slot="action" slot-scope="text, row">
        <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="remove(row)">
          <a>删除</a>
        </a-popconfirm>
      </span>
    </a-table>

    <a-modal v-if="router.add" v-model="addModel" title="创建git仓库" @ok="addGitOk">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="git地址">
          <a-input v-decorator="['address', { rules: [{ required: true, message: '请输入git仓库地址' }] }]"/>
        </a-form-item>
        <a-form-item label="git账号">
          <a-input v-decorator="['account', { rules: [{ required: false, message: '请输入git仓库账号' }] }]"/>
        </a-form-item>
        <a-form-item label="git密码">
          <a-input v-decorator="['pwd', { rules: [{ required: false, message: '请输入git仓库密码' }] }]"/>
        </a-form-item>
      </a-form>
    </a-modal>

  </div>
</template>

<script>
  import { getGitList,delGit,createGit } from '@/api/storage'
  import JsonViewer from 'vue-json-viewer'
  import { asyncRouterMap } from '@/config/router.config'
  import router from '@/router'
  import store from '@/store'

  const columns = [
    { title: 'git地址', dataIndex: 'address', key: 'address' },
    { title: '账号', dataIndex: 'account', key: 'account' },
    { title: '密码', dataIndex: 'pwd', key: 'pwd' },
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
          address: '',
          account: '',
          pwd: ''
        }),
      }
    },
    created(){
      this.router = this.$route.meta
      this.initGit()
    },
    methods: {
      addGit(){
        this.form=this.$form.createForm(this, {
          address: '',
          account: '',
          pwd: ''
        })
        this.addModel = true
      },
      addGitOk(){
        this.form.validateFields((err, values) => {
          if (err) {
            return
          }
          console.log(values)
          createGit({address:values.address,account:values.account,pwd:values.pwd}).then(res => {
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
              address: '',
              account: '',
              pwd: ''
            })
            this.initGit()
          })
        })
      },
      remove(row){
        console.log('删除',row)
        delGit({id:row.id}).then(res => {
          console.log(res)
          this.initGit()
        })
      },
      initGit(){
        getGitList().then(res => {
          this.data = []
          if (res.code === 10000) {
            const body = res.body
            console.log(body.gits)
            for (let i = 0; i < body.gits.length; ++i) {
              const data = {
                key:body.gits[i].id,
                id:body.gits[i].id,
                address:body.gits[i].address,
                account:body.gits[i].account,
                pwd:body.gits[i].pwd,
                time:body.gits[i].time,
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
    }
  }
</script>
