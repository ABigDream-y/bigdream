<template>
	<div class="mod-sys__dept">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-button v-if="hasPermission('sys:dept:save')" type="primary"
					@click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" row-key="id" border style="width: 100%">
			<!-- <el-table-column prop="sort" :label="$t('dept.sort')" header-align="center" align="center"
				width="80"></el-table-column> -->
			<el-table-column prop="name" :label="$t('dept.name')" header-align="center"
				min-width="150"></el-table-column>
			<el-table-column prop="number" label="学院代码" header-align="center" align="center"
				min-width="150"></el-table-column>
			<el-table-column prop="pnumber" label="上级学院代码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="parentName" label="上级学院" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('sys:dept:update')" type="text" size="small"
						@click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('sys:dept:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./institute-add-or-update.vue";
	import useView from "@/hooks/useView";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({ getDataListURL: "/sys/dept/list", deleteURL: "/sys/dept",dataForm:{pnumber:'103'} });
			return { ...useView(state), ...toRefs(state) };
		}
	});
</script>