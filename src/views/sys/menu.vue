<template>
  <div class="mod-sys__menu">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-button v-if="hasPermission('sys:menu:save')" type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" row-key="id" border style="width: 100%">
      <el-table-column prop="name" :label="$t('menu.name')" header-align="center" min-width="150"></el-table-column>
      <el-table-column prop="icon" :label="$t('menu.icon')" header-align="center" align="center">
        <template v-slot="scope">
          <svg class="iconfont" aria-hidden="true">
            <use :xlink:href="`#${scope.row.icon}`"></use>
          </svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" :label="$t('menu.type')" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.type === 0" size="small">{{ $t("menu.type0") }}</el-tag>
          <el-tag v-else size="small" type="info">{{ $t("menu.type1") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="openStyle" :label="$t('menu.openStyle')" header-align="center" align="center">
        <template v-slot="scope">
          <span v-if="scope.row.type !== 0"></span>
          <el-tag v-else-if="scope.row.openStyle === 1" size="small">{{ $t("menu.openStyle1") }}</el-tag>
          <el-tag v-else size="small" type="info">{{ $t("menu.openStyle0") }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" :label="$t('menu.sort')" header-align="center" align="center"></el-table-column>
      <el-table-column prop="url" :label="$t('menu.url')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="permissions" :label="$t('menu.permissions')" header-align="center" align="center" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('sys:menu:save') && scope.row.type === 0" type="text" size="small" @click="addHandle(scope.row)">{{ $t("add") }}</el-button>
          <el-button v-if="hasPermission('sys:menu:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('sys:menu:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./menu-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({ getDataListURL: "/sys/menu/list", deleteURL: "/sys/menu" });
    return { ...useView(state), ...toRefs(state) };
  }
});
</script>
