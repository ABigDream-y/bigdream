<template>
  <div class="mod-message__sms">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-select v-model="dataForm.platform" :placeholder="$t('sms.platform')" clearable>
          <el-option :label="$t('sms.platform1')" :value="1"></el-option>
          <el-option :label="$t('sms.platform2')" :value="2"></el-option>
          <el-option :label="$t('sms.platform3')" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" @sort-change="dataListSortChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="smsCode" :label="$t('sms.smsCode')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="platform" :label="$t('sms.platform')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.platform === 1" size="small">{{ $t("sms.platform1") }}</el-tag>
          <el-tag v-else-if="scope.row.platform === 2" size="small">{{ $t("sms.platform2") }}</el-tag>
          <el-tag v-else-if="scope.row.platform === 3" size="small">{{ $t("sms.platform3") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
      <el-table-column prop="createDate" :label="$t('sms.createDate')" sortable="custom" header-align="center" align="center" width="180"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="text" size="small" @click="sendHandle(scope.row)">{{ $t("sms.send") }}</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 发送短信 -->
    <send v-if="sendVisible" ref="send" @refreshDataList="getDataList"></send>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./sms-add-or-update.vue";
import Send from "./sms-send.vue";
import { IObject } from "@/types/interface";
export default defineComponent({
  components: {
    AddOrUpdate,
    Send
  },
  setup() {
    const state = reactive({
      getDataListURL: "/sys/sms/page",
      getDataListIsPage: true,
      deleteURL: "/sys/sms",
      deleteIsBatch: true,
      dataForm: {
        mobile: "",
        status: null,
        platform: ""
      },
      sendVisible: false
    });
    return { ...useView(state), ...toRefs(state) };
  },
  methods: {
    // 发送短信
    sendHandle(row: IObject) {
      this.sendVisible = true;
      this.$nextTick(() => {
        this.$refs.send.dataForm.smsCode = row.smsCode;
        this.$refs.send.init();
      });
    }
  }
});
</script>
