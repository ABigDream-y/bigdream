<template>
  <div class="mod-manage__permissions">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.type" placeholder="类型" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="dataForm.status" dict-type="enable_status" placeholder="状态"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('manage:permissions:save')" type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('manage:permissions:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="type" label="类型" header-align="center" align="center"></el-table-column>
      <el-table-column prop="field" label="字段名称" header-align="center" align="center"></el-table-column>
      <el-table-column prop="filedName" label="字段说明" header-align="center" align="center"></el-table-column>
      <el-table-column prop="attrName" label="属性名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("enable_status", scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('manage:permissions:update')" type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('manage:permissions:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./permissions-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/manage/permissions/page",
      getDataListIsPage: true,
      exportURL: "/manage/permissions/export",
      deleteURL: "/manage/permissions",
	  routeName:'/manage-permissions-edit',
	  routePath:'/manage/permissions-edit',
	  routeTitle:'字段权限设置',
      deleteIsBatch: true,
      dataForm: {
        type: "",
        status: "",
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {
  }
});
</script>