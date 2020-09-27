import request from "@/utils/request";

export default {
  //分页条件查询
  getTeacherPageList(currentPage, size, teacherQuery) {
    return request({
      //url: "/teacher/pageListByConditions/" + currentPage + "/" + size,
      url: `/teacher/pageListByConditions/${currentPage}/${size}`,
      method: "post",
      data: teacherQuery
    })
  },
  //根据id删除讲师
  deleteTeacherById(id) {
    return request({
      url: `/teacher/${id}`,
      method: "delete"
    })
  },
  //添加讲师
  addTeacher(teacher) {
    return request({
      url: "/teacher",
      method: "post",
      data: teacher
    })
  },
  //根据id查询讲师
  getTeacherById(id){
    return request({
      url: `/teacher/${id}`,
      method: "get"
    })
  },
  //修改讲师
  updateTeacher(teacher){
    return request({
      url: "/teacher",
      method: "put",
      data: teacher
    })
  }
}
