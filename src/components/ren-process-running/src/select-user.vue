<template>
  <el-dialog v-model="visibleSelect" width="60%" :modal="false" :title="$t('user.select')" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="mod-sys__user">
      <el-form :inline="true" size="small" :model="dataForm" @keyup.enter="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.username" :placeholder="$t('user.username')" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%" size="small">
        <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
        <el-table-column prop="username" :label="$t('user.username')" sortable="custom" header-align="center" align="center"></el-table-column>
        <el-table-column prop="deptName" :label="$t('user.deptName')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="email" :label="$t('user.email')" header-align="center" align="center"></el-table-column>
        <el-table-column prop="mobile" :label="$t('user.mobile')" sortable="custom" header-align="center" align="center"></el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    </div>
    <template v-slot:footer>
      <el-button type="default" @click="cancelHandle()">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="commitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { noop } from "lodash";
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      visibleSelect: false,
      getDataListURL: "/sys/user/page",
      getDataListIsPage: true,
      dataForm: {
        username: ""
      },
      callback: noop
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    init(callback: (e: any) => any) {
      this.visibleSelect = true;
      this.callback = callback;
      this.$nextTick(() => {
        this.getDataList();
      });
    },
    cancelHandle() {
      this.visibleSelect = false;
    },
    commitHandle() {
      if (this.callback) {
        if (this.dataListSelections?.length !== 1) {
          this.$message.error(this.$t("user.selecterror"));
          return;
        } else {
          this.callback(this.dataListSelections[0]);
        }
      }
      this.visibleSelect = false;
    }
  }
});
</script>
