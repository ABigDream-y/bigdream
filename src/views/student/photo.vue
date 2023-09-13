<template>
  <div class="mod-student__student">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item prop="xh">
        <el-input v-model="dataForm.xh" placeholder="学号" clearable></el-input>
      </el-form-item>
      <el-form-item prop="realName">
        <el-input v-model="dataForm.realName" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item prop="gender">
        <ren-select v-model="dataForm.gender" dict-type="gender" placeholder="性别"></ren-select>
      </el-form-item> -->

      <!-- <el-form-item prop="pycc">
        <ren-select v-model="dataForm.pycc" dict-type="pycc" placeholder="培养层次"></ren-select>
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="dataForm.institute" placeholder="学院" clearable></el-input>
      </el-form-item>
      <el-form-item prop="major">
        <el-input v-model="dataForm.major" placeholder="专业" clearable></el-input>
      </el-form-item>
      <el-form-item prop="grade">
        <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
      </el-form-item>
      <el-form-item prop="className">
        <el-input v-model="dataForm.className" placeholder="班级" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryResetHandle()">重置</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('student:student:export')">
        <el-button type="warning" @click="exportHandle()">批量下载</el-button>
      </el-form-item>
    </el-form>
    <!-- 5张 -->
    <el-row :gutter="20">
      <el-col :span="5" v-for="(item, index) in dataList" :key="index" style="margin-bottom: 10px">
        <el-card :body-style="{ padding: '0px', borderRadius: '0' }" shadow="never">
          <div style="text-align: center; padding-top: 20px">
            <img :src="item.photo" class="image" v-if="item.photo" />
            <div class="image-none" v-else>未上传</div>
          </div>
          <div style="padding: 5px 10px; height: 160px; text-align: center">
            <!-- 姓名 学号 年级 学院 专业 班级 -->
            <p>{{ item.realName + " " + item.xh }}</p>
            <p v-if="item.grade != '' || item.grade == null">{{ getDictLabel("grade", item.grade) + "级" }}</p>
            <p>{{ item.institute }}</p>
            <p>{{ item.major + " " + item.className }}</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script lang="ts">
import { registerDynamicToRouterAndNext } from "@/router";
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./student-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/student/student/page",
      getDataListIsPage: true,
      exportURL: "/student/student/batchDownload",
      deleteURL: "/student/student",
      routeName: "/student-student-edit",
      routePath: "/student/student-edit",
      routeTitle: "学籍信息",
      deleteIsBatch: true,
      dataForm: {
        xh: "",
        realName: "",
        gender: "",
        idCard: "",
        className: "",
        classNo: "",
        pycc: "",
        sfzj: "",
        sfzx: "",
        eduSystem: "",
        campus: "",
        institute: "",
        instituteNo: "",
        major: "",
        grade: "",
        schoolYear: "",
        status: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {},
  methods: {
    detailHandle(id: string) {
      const routeParams = {
        routeName: `student-student-detail__${id ? id : 0}`,
        title: `学生信息 - 详情`,
        path: `/student/student-detail`,
        query: {
          id: id ? id : 0,
          _mt: `学生信息 - 详情`
        }
      };
      registerDynamicToRouterAndNext(routeParams);
    }
  }
});
</script>
<style lang="scss" scoped>
.el-col-5 {
  width: 20%;
  max-width: 20%;
  flex: 0 0 20%;
}

.el-card {
  // background: transparent;
  // border: 0px;
}

.time {
  font-size: 12px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

.image {
  width: 110px;
  height: 154px;
  // display: block;
}

.image-none {
  width: 110px;
  height: 154px;
  margin: 0 auto;
  line-height: 154px;
  // display: block;
  color: #bbb;
  background-color: #f9f9f9;
}
</style>
