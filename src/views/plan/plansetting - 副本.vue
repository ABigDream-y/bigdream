<template>
  <div class="mod-plan__plansetting">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('plan:plansetting:save')" type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('plan:plansetting:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="openStatus" label="是否开放" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.openStatus) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否可以从课程库添加课程" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="checkStatus" label="教学计划提交后对应的审核状态" header-align="center" align="center"></el-table-column>
      <el-table-column prop="planStatus" label="是否读取培养方案指导教学计划生成" header-align="center" align="center"></el-table-column>
      <el-table-column prop="startDate" label="开始日期" header-align="center" align="center"></el-table-column>
      <el-table-column prop="endDate" label="结束日期" header-align="center" align="center"></el-table-column>
      <el-table-column prop="schoolYear" label="计划学年" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("grade", scope.row.schoolYear) }}
        </template>
      </el-table-column>
      <el-table-column prop="term" label="计划学期" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('plan:plansetting:update')" type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('plan:plansetting:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./plansetting-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/plan/plansetting/page",
      getDataListIsPage: true,
      exportURL: "/plan/plansetting/export",
      deleteURL: "/plan/plansetting",
	  routeName:'/plan-plansetting-edit',
	  routePath:'/plan/plansetting-edit',
	  routeTitle:'教学计划维护设置',
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