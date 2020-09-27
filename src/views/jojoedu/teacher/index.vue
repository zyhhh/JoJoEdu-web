<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师姓名" />
      </el-form-item>

      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师" />
          <el-option :value="2" label="首席讲师" />
        </el-select>
      </el-form-item>

      <el-form-item label="创建时间查询">
        <el-date-picker
          v-model="teacherQuery.createTimeStart"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          :picker-options="starttime"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.createTimeEnd"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
          :picker-options="endTime"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" plain @click="getTeacherList()">查询</el-button>
      <el-button type="info" icon="el-icon-delete" plain @click="resetData()">清空</el-button>
    </el-form>

    <!-- 主体信息展示表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中..."
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">{{ (currentpage-1)*pagesize + scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column label="讲师姓名" prop="name" width="100" align="center" />

      <el-table-column label="头衔" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.level===1?'高级讲师':'首席讲师' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="资历" prop="intro" align="center" />

      <el-table-column label="创建时间" prop="gmtCreate" width="160" align="center" />

      <el-table-column label="排序" prop="sort" width="60" align="center" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id,scope.row.name)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页栏 -->
    <div style="margin-top:10px">
      <el-pagination
        background
        @size-change="changePageSize"
        @current-change="changePage"
        :current-page="currentpage"
        :page-sizes="[2, 5, 10, 50]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalsize"
        :pager-count="5"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import teacher from '@/api/teacher'

export default {
  data() {
    return {
      list: null, //每页展示数据
      totalsize: 0, //总条数
      currentpage: 1, //当前页
      pagesize: 5, //每页条数
      teacherQuery: {}, //条件查询条件
      listLoading: true, //页面加载
      starttime: {
        //开始时间
        disabledDate: time => {
          if (this.teacherQuery.createTimeEnd) {
            return (
              time.getTime() >
              new Date(this.teacherQuery.createTimeEnd).getTime()
            )
          } else {
            // 不能大于当前日期
            return time.getTime() > Date.now() //加-8.64e7则表示含当天
          }
        }
      },
      endTime: {
        //结束时间
        disabledDate: time => {
          if (this.teacherQuery.createTimeStart) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() <
                new Date(this.teacherQuery.createTimeStart).getTime()
            )
          } else {
            //不能大于当前时间
            return time.getTime() > Date.now()
          }
        }
      }
    }
  },
  created() {
    this.getTeacherList() //初始查一遍讲师列表
  },
  methods: {
    getTeacherList() {
      teacher
        .getTeacherPageList(this.currentpage, this.pagesize, this.teacherQuery)
        .then(resp => {
          this.list = resp.data.teachers
          this.totalsize = resp.data.totalsize
          this.listLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    changePageSize(size) {
      //切换每页展示条数
      this.pagesize = size
      this.currentpage = 1
      this.getTeacherList()
    },
    changePage(page) {
      //切换第几页
      this.currentpage = page
      this.getTeacherList()
    },
    resetData() {
      //清空查询条件
      this.teacherQuery = {}
      this.getTeacherList()
    },
    removeDataById(id, name) {
      //删除讲师
      this.$confirm(
        '此操作将删除讲师【' + name + '】的信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        teacher.deleteTeacherById(id).then(resp => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getTeacherList()
        })
      })
    }
  }
}
</script>
