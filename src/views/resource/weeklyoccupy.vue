<template>
  <div class="mod-resource__weeklyoccupy">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.week" placeholder="星期" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.timeSlot" placeholder="节次" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.isOccupy" placeholder="是否占用" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.usage" placeholder="使用情况" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.remark" placeholder="备注" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('resource:weeklyoccupy:save')" type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-if="hasPermission('resource:weeklyoccupy:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="id" label="id" header-align="center" align="center"></el-table-column>
      <el-table-column prop="week" label="星期" header-align="center" align="center"></el-table-column>
      <el-table-column prop="timeSlot" label="节次" header-align="center" align="center"></el-table-column>
      <el-table-column prop="isOccupy" label="是否占用" header-align="center" align="center"></el-table-column>
      <el-table-column prop="usage" label="使用情况" header-align="center" align="center"></el-table-column>
      <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
      <el-table-column prop="parent" label="父表id" header-align="center" align="center"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('resource:weeklyoccupy:update')" type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('resource:weeklyoccupy:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
import AddOrUpdate from "./weeklyoccupy-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/resource/weeklyoccupy/page",
      getDataListIsPage: true,
      exportURL: "/resource/weeklyoccupy/export",
      deleteURL: "/resource/weeklyoccupy",
	  routeName:'/resource-weeklyoccupy-edit',
	  routePath:'/resource/weeklyoccupy-edit',
	  routeTitle:'周占用表',
      deleteIsBatch: true,
      dataForm: {
        week: "",
        timeSlot: "",
        isOccupy: "",
        usage: "",
        remark: "",
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {
  }
});
</script>