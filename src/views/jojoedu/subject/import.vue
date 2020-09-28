<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <!-- <el-tag type="warning">excel模版说明：仅最多支持二级课程分类；若有二级分类一级分类名称为必填;若只有一级分类，二级分类可留空;不要输入非法字符！</el-tag> -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>excel模版说明：</span>
          </div>
          <div class="text">
            1.仅最多支持二级课程分类<br>
            2.若有二级分类则一级分类为必填<br>
            3.若只有一级分类，二级分类可留空<br>
            4.不要输入非法字符！<br>
            <el-tag style="float:right">
              <i class="el-icon-download"/>
              <a :href="OSS_PATH + '/2020/execl/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'">点击下载模版</a>
            </el-tag>
          </div>
        </el-card>
      </el-form-item>

      <el-form-item label="选择Excel">
        <!-- 
          ref：这个组件的唯一标识，相当于id值
          auto-upload：是否自动上传，true即选择文件后就上传，这里为false选择手动点按钮上传
          limit：限制一次性上传的文件数，这里限制一次一个文件
          action：当手动点击上传时，执行的方法
          accept：设置组件接收的文件类型，这里只能是excel文件
         -->
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/subject/add'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传excel文件，且不超过500KB</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
            BASE_API: process.env.BASE_API, // 接口API地址
            OSS_PATH: process.env.OSS_PATH, // 阿里云OSS地址
            importBtnDisabled: false, // 按钮是否禁用
            loading: false
        }
    },
    created () {
      
    },
    methods: {
        //上传文件到服务器
        submitUpload(){
            this.loading = true
            this.importBtnDisabled = true
            this.$refs.upload.submit()
        },
        //文件上传成功，会接收接口返回的数据response
        fileUploadSuccess(response){
            this.loading = false
            this.$message({
              type: 'success',
              message: '文件上传成功!',
            })
        },
        //文件上传失败
        fileUploadError(response){
            this.loading = false
            this.$message({
              type: 'error',
              message: '文件上传失败!',
            })
        }
    }
}
</script>

<style>
  .text {
    font-size: 12px;
    padding-bottom: 30px;
  }

  .box-card {
    width: 300px;
  }
</style>