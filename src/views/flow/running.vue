<template>
  <div class="mod__running">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.id" :placeholder="$t('running.id')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.definitionKey" :placeholder="$t('running.definitionKey')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%">
      <el-table-column prop="processInstanceId" :label="$t('running.id')" header-align="center" align="center" width="280"></el-table-column>
      <el-table-column prop="processDefinitionKey" :label="$t('running.definitionKey')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="processDefinitionName" :label="$t('running.processDefinitionName')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="startUserName" :label="$t('process.startUserId')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="suspended" :label="$t('running.suspended')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.suspended" size="small">{{ $t("running.suspended1") }}</el-tag>
          <el-tag v-else size="small" type="danger">{{ $t("running.suspended0") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="deleteHandle(scope.row.processInstanceId)">{{ $t("delete") }}</el-button>
          <el-button type="text" size="small" @click="taskDetail(scope.row)">{{ $t("process.viewFlowImage") }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" :label="$t('process.createTime')" header-align="center" align="center"></el-table-column>
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
      getDataListURL: "/flow/running/page",
      getDataListIsPage: true,
      deleteURL: "/flow/running",
      dataForm: {
        id: "",
        definitionKey: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    taskDetail(row: IObject) {
      if (!row.processDefinitionId) {
        return this.$message.error(this.$t("task.detailError"));
      }
      this.flowDetailRoute(row);
    }
  }
});
</script>
