import request from "@/utils/request";

export default {
  //分页条件查询
  getSubjectList() {
    return request({
      url: '/subject/all',
      method: 'get'
    })
  }
}
