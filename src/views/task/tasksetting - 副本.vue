<template>
  <div class="mod-task__tasksetting">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('task:tasksetting:save')" type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('task:tasksetting:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="openStatus" label="是否开放" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.openStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="周学时是否满足授课学时" header-align="center" align="center"></el-table-column>
      <el-table-column prop="maintenanceStatus" label="上课教师是否维护" header-align="center" align="center"></el-table-column>
      <el-table-column prop="startDate" label="开始日期" header-align="center" align="center"></el-table-column>
      <el-table-column prop="endDate" label="结束日期" header-align="center" align="center"></el-table-column>
      <el-table-column prop="numberStatus" label="开课总容量是否满足计划学生人数" header-align="center" align="center"></el-table-column>
      <el-table-column prop="infoStatus" label="是否有遗漏班级信息" header-align="center" align="center"></el-table-column>
      <el-table-column prop="courseCount" label="开课周次" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.courseCount) }}
        </template>
      </el-table-column>
      <el-table-column prop="oneGrade" label="一年级" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.oneGrade) }}
        </template>
      </el-table-column>
      <el-table-column prop="twoGrade" label="二年级" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.twoGrade) }}
        </template>
      </el-table-column>
      <el-table-column prop="threeGrade" label="三年级" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.threeGrade) }}
        </template>
      </el-table-column>
      <el-table-column prop="fourGrade" label="四年级" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.fourGrade) }}
        </template>
      </el-table-column>
      <el-table-column prop="publicStatus" label="校公选" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.publicStatus) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('task:tasksetting:update')" type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('task:tasksetting:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./tasksetting-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/task/tasksetting/page",
      getDataListIsPage: true,
      exportURL: "/task/tasksetting/export",
      deleteURL: "/task/tasksetting",
	  routeName:'/task-tasksetting-edit',
	  routePath:'/task/tasksetting-edit',
	  routeTitle:'教学任务维护设置',
      deleteIsBatch: true,
      dataForm: {
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {
  }
});
</script>