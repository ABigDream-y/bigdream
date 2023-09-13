<template>
  <div class="mod-log__changerecordlog">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.operation" placeholder="操作" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.ip" placeholder="操作IP" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.creatorName" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <!-- <el-form-item v-if="hasPermission('log:changerecordlog:export')">
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item> -->
      <!-- <el-form-item v-if="hasPermission('log:changerecordlog:save')">
        <el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
      </el-form-item> -->
      <!-- <el-form-item v-if="hasPermission('log:changerecordlog:delete')">
        <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item> -->
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <!-- <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column> -->
      <el-table-column prop="operation" label="操作" header-align="center" align="center" width="140"></el-table-column>
      <el-table-column prop="userAgent" label="用户代理" header-align="center" align="center"></el-table-column>
      <el-table-column prop="ip" label="操作IP" header-align="center" align="center" width="140"></el-table-column>
      <el-table-column prop="creatorName" label="用户名" header-align="center" align="center" width="140"></el-table-column>
      <!-- <el-table-column prop="creator" label="创建者" header-align="center" align="center"></el-table-column> -->
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" width="160"></el-table-column>
      <!-- <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('log:changerecordlog:update')" type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('log:changerecordlog:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./changerecordlog-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/log/changerecordlog/page",
      getDataListIsPage: true,
      exportURL: "/log/changerecordlog/export",
      deleteURL: "/log/changerecordlog",
      routeName: "/log-changerecordlog-edit",
      routePath: "/log/changerecordlog-edit",
      routeTitle: "学籍异动日志",
      deleteIsBatch: true,
      dataForm: {
        operation: "",
        ip: "",
        creatorName: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {}
});
</script>
