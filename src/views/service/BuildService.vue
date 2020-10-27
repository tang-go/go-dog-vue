<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
    <a-form-item label="Git地址">
      <a-input v-decorator="['git', { rules: [{ required: true, message: '请输入git仓库地址' }] }]"/>
    </a-form-item>
    <a-form-item label="镜像仓库地址">
      <a-input v-decorator="['harbor', { rules: [{ required: true, message: '请输入镜像仓库地址' }] }]"/>
    </a-form-item>
    <a-form-item label="镜像名称">
      <a-input v-decorator="['name', { rules: [{ required: true, message: '请输入镜像名称' }] }]"/>
    </a-form-item>
    <a-form-item label="需要编译的相对目录">
      <a-input v-decorator="['path', { rules: [{ required: true, message: '请输入需要编译的目录' }] }]"/>
    </a-form-item>
    <a-form-item label="镜像版本">
      <a-input v-decorator="['version', { rules: [{ required: true, message: '镜像版本' }] }]"/>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" html-type="submit">
        确定
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  data () {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, {
        git: 'string',
        harbor: 'string',
        name: 'string',
        path: 'string',
        version: 'string',
      }),
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(value)
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleSelectChange (value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
      })
    },
  },
}
</script>