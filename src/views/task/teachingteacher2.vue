<template>
  <div class="mod-task__teachingteacher">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.teachingId" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.teacherId" placeholder="" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.zgh" placeholder="职工号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.teacherName" placeholder="教师" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('task:teachingteacher:save')" type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('task:teachingteacher:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="count" label="周次" header-align="center" align="center"></el-table-column>
      <el-table-column prop="teacherId" label="" header-align="center" align="center"></el-table-column>
      <el-table-column prop="zgh" label="职工号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="teacherName" label="教师" header-align="center" align="center"></el-table-column>
      <el-table-column prop="position" label="职称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="leaderStatus" label="是否负责教师" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.leaderStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('task:teachingteacher:update')" type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('task:teachingteacher:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./teachingteacher-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/task/teachingteacher/page",
      getDataListIsPage: true,
      exportURL: "/task/teachingteacher/export",
      deleteURL: "/task/teachingteacher",
	  routeName:'/task-teachingteacher-edit',
	  routePath:'/task/teachingteacher-edit',
	  routeTitle:'教学班上课教师',
      deleteIsBatch: true,
      dataForm: {
        teachingId: "",
        teacherId: "",
        zgh: "",
        teacherName: "",
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {
  }
});
</script>