<template>
  <div>
    <div class="table-operator">
      <a-button v-if="router.add" type="primary" icon="plus" @click="addDocs">添加文档</a-button>
    </div>
    <a-table v-if="router.select" ref="table" :columns="columns" :data-source="data" class="components-table-demo-nested">
      <span slot="action" slot-scope="text, row">
        <a-popconfirm v-if="router.del" title="是否要删除此行？" @confirm="remove(row)">
          <a>删除</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a v-if="router.select" title="查看" @click="seeDocs(row)">查看</a>
      </span>
    </a-table>
    <a-modal v-model="addModel" title="添加文档" @ok="addOk">
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="名称">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入文档名称' }] }]"/>
        </a-form-item>
        <a-form-item label="文档地址">
          <a-input v-decorator="['url', { rules: [{ required: true, message: '请输入文档地址' }] }]"/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
  import { getDocsList,delDocs,createDocs } from '@/api/docs'
  import JsonViewer from 'vue-json-viewer'
  import { asyncRouterMap } from '@/config/router.config'
  import router from '@/router'
  import store from '@/store'
  import storage from 'store'
  import { ACCESS_TOKEN } from '@/store/mutation-types'

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '地址', dataIndex: 'url', key: 'url' },
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
          name: '',
          url: '',
        }),
      }
    },
    created(){
      this.router = this.$route.meta
      this.initDocs()
    },
    methods: {
      seeDocs(row){
        console.log('查看',row)
        const token = storage.get(ACCESS_TOKEN)
        const url = row.url+'?token='+token
        console.log('查看',url)
        window.open(url, '_blank')
      },
      addOk () {
        this.form.validateFields((err, values) => {
          if (err) {
            return
          }
          console.log(values)
          createDocs({name:values.name,url: values.url}).then(res => {
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
              name: '',
              url: '',
            })
            this.initDocs()
          })
        })
      },
      remove(row){
        console.log('删除',row)
        delDocs({id:row.id}).then(res => {
          console.log(res)
          this.initDocs()
        })
      },
      initDocs(){
        getDocsList().then(res => {
          this.data = []
          if (res.code === 10000) {
            const body = res.body
            console.log(body)
            for (let i = 0; i < body.docs.length; ++i) {
              const data = {
                key:body.docs[i].id,
                id:body.docs[i].id,
                name:body.docs[i].name,
                url:body.docs[i].url,
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
      addDocs () {
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
