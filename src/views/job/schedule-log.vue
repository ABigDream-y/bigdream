<template>
  <el-dialog v-model="visible" :title="$t('schedule.log')" :close-on-click-modal="false" :close-on-press-escape="false" width="75%">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.jobId" :placeholder="$t('schedule.jobId')" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @sort-change="dataListSortChangeHandle" height="460" style="width: 100%">
      <el-table-column prop="jobId" :label="$t('schedule.jobId')" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column prop="beanName" :label="$t('schedule.beanName')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="params" :label="$t('schedule.params')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="status" :label="$t('schedule.status')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status === 1" size="small">{{ $t("schedule.statusLog1") }}</el-tag>
          <el-tag v-else type="danger" size="small" @click="showErrorInfo(scope.row.id)" style="cursor: pointer">{{ $t("schedule.statusLog0") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="times" :label="$t('schedule.times')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" :label="$t('schedule.createDate')" header-align="center" align="center" width="180"></el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
  </el-dialog>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
export default defineComponent({
  setup() {
    const state = reactive({
      getDataListURL: "/sys/scheduleLog/page",
      getDataListIsPage: true,
      dataForm: {
        jobId: ""
      },
      visible: false
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    init() {
      this.visible = true;
      this.getDataList();
    },
    // 失败信息
    showErrorInfo(id: string) {
      baseService.get(`/sys/scheduleLog/${id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.$alert(res.data.error);
      });
    }
  }
});
</script>
