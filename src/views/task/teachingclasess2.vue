<template>
  <div class="mod-task__teachingclasess">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.teachingId" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.className" placeholder="班级" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.classNo" placeholder="班级编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.institute" placeholder="学院" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.instituteNo" placeholder="学院" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.major" placeholder="专业" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('task:teachingclasess:save')" type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('task:teachingclasess:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="className" label="班级" header-align="center" align="center"></el-table-column>
      <el-table-column prop="classNo" label="班级编号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="number" label="人数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="grade" label="年级" header-align="center" align="center"></el-table-column>
      <el-table-column prop="institute" label="学院" header-align="center" align="center"></el-table-column>
      <el-table-column prop="instituteNo" label="学院" header-align="center" align="center"></el-table-column>
      <el-table-column prop="major" label="专业" header-align="center" align="center"></el-table-column>
      <el-table-column prop="majorDirection" label="专业方向" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('task:teachingclasess:update')" type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('task:teachingclasess:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./teachingclasess-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/task/teachingclasess/page",
      getDataListIsPage: true,
      exportURL: "/task/teachingclasess/export",
      deleteURL: "/task/teachingclasess",
	  routeName:'/task-teachingclasess-edit',
	  routePath:'/task/teachingclasess-edit',
	  routeTitle:'教学班上课班级',
      deleteIsBatch: true,
      dataForm: {
        teachingId: "",
        className: "",
        classNo: "",
        institute: "",
        instituteNo: "",
        major: "",
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {
  }
});
</script>