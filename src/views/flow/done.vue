<template>
  <div class="mod__process">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.processDefinitionName" :placeholder="$t('process.name')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="processInstanceId" :label="$t('running.id')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="processDefinitionName" :label="$t('process.processDefinitionName')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="processDefinitionVersion" :label="$t('process.processDefinitionVersion')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag size="small">v{{ scope.row.processDefinitionVersion }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startUserName" :label="$t('process.startUserId')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="endTime" :label="$t('process.endTime')" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="showDetail(scope.row)">{{ $t("process.detail") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import { IObject } from "@/types/interface";
export default defineComponent({
  setup() {
    const state = reactive({
      getDataListURL: "/flow/common/done/page",
      getDataListIsPage: true,
      dataForm: {
        processDefinitionName: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    showDetail(row: IObject) {
      if (!row.businessKey) {
        return this.$message.error(this.$t("task.detailError"));
      }
      this.flowDetailRoute(row);
    }
  }
});
</script>
