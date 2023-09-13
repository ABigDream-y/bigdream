<template>
	<div class="mod-programme__casesetting">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('programme:casesetting:save')" type="primary"
					@click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('programme:casesetting:delete')" type="danger"
					@click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="isOpenness" label="是否开放" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.isOpenness) }}
				</template>
			</el-table-column>
			<el-table-column prop="startDate" label="开始日期" header-align="center" align="center"></el-table-column>
			<el-table-column prop="endDate" label="结束日期" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('programme:casesetting:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('programme:casesetting:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script lang="ts">
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./casesetting-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/programme/casesetting/page",
				getDataListIsPage: true,
				exportURL: "/programme/casesetting/export",
				deleteURL: "/programme/casesetting",
				routeName: '/programme-casesetting-edit',
				routePath: '/programme/casesetting-edit',
				routeTitle: '维护设置',
				deleteIsBatch: true,
				dataForm: {
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
		}
	});
</script>