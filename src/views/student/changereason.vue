<template>
	<div class="mod-student__changereason">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="dataForm.code" placeholder="异动原因代码" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.name" placeholder="异动原因名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.categoryCode" placeholder="异动类别代码" clearable></el-input>
			</el-form-item>
			<!-- <el-form-item>
				<ren-radio-group v-model="dataForm.status" dict-type="enable_status"></ren-radio-group>
			</el-form-item> -->
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:changereason:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:changereason:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:changereason:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="code" label="异动原因代码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="异动原因名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="categoryCode" label="异动类别代码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("enable_status", scope.row.status) }}
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('student:changereason:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('student:changereason:delete')" type="text" size="small"
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
	import AddOrUpdate from "./changereason-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/student/changereason/page",
				getDataListIsPage: true,
				exportURL: "/student/changereason/export",
				deleteURL: "/student/changereason",
				routeName: '/student-changereason-edit',
				routePath: '/student/changereason-edit',
				routeTitle: '学籍异动原因',
				deleteIsBatch: true,
				dataForm: {
					code: "",
					name: "",
					categoryCode: "",
					status: "",
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
		}
	});
</script>