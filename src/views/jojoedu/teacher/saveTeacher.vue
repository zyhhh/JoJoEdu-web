<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" :step="1" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.intro" />
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.career" :rows="10" type="textarea" />
      </el-form-item>
    
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
        <!-- 头衔缩略图，注意这边image属性要是String类型，转String可直接+''或String(val) -->
        <pan-thumb :image="String(teacher.avatar)" /> 
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像</el-button>
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调-->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="baseapi+'/oss/uploadAvatar'"
          field="file"
          @close="closeImage"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        intro: '',
        career: '',
        avatar: 'https://jojo-edu.oss-cn-shanghai.aliyuncs.com/2020/09/default.jpg' //默认头像地址
      },
      imagecropperShow: false, //上传图片弹框是否显示的初始值
      imagecropperKey: 0, //上传图片组件的key值
      baseapi: process.env.BASE_API, //获取dev.env.js中的地址值
      saveBtnDisabled: false //保存按钮是否禁用，防止多次提交
    }
  },
  created() {
    this.init()
  },
  watch: {
    //监听，路由发生变化就会调这个方法
    $route(to, from) {
      this.init()
    },
  },
  methods: {
    getTeacherInfo(id) {
      teacherApi.getTeacherById(id).then((resp) => {
        this.teacher = resp.data.teacher
      })
    },
    saveOrUpdate() {
      //判断对象中是否有id，没有执行添加，有执行修改
      if (!this.teacher.id) {
        this.saveT()
      } else {
        this.updateT()
      }
    },
    saveT() {
      teacherApi.addTeacher(this.teacher).then((resp) => {
        this.$message({
          type: 'success',
          message: '添加讲师成功!',
        })
        //添加完成回到列表页面 路由跳转
        this.$router.push({ path: '/teacher/list' })
      })
    },
    updateT() {
      teacherApi.updateTeacher(this.teacher).then((resp) => {
        this.$message({
          type: 'success',
          message: '修改讲师成功!',
        })
        this.$router.push({ path: '/teacher/list' })
      })
    },
    init() {
      //判断路径中有id才需要查询并回写信息
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getTeacherInfo(id)
      } else {
        this.teacher = {}
      }
    },
    closeImage(){ //关闭上传弹窗
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey + 1 //每次上传和关闭改变控件的key，为了防止控件bug：已有图片要重新上传图片需点两次按钮才会到初始化状态
    },
    cropSuccess(data){ //上传成功回调
      console.log(data)
      this.imagecropperShow = false
      //返回头像地址
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1 //每次上传和关闭改变控件的key，为了防止控件bug：已有图片要重新上传图片需点两次按钮才会到初始化状态
    }
  },
}
</script>