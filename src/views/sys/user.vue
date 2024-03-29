<template>
	<div class="mod-sys__user">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="dataForm.username" :placeholder="$t('user.username')" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<ren-select v-model="dataForm.gender" dict-type="gender" :placeholder="$t('user.gender')"></ren-select>
			</el-form-item>
			<el-form-item>
				<ren-dept-tree v-model="dataForm.deptId" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('sys:user:save')" type="primary" @click="editHandle()">
					{{ $t("add") }}
				</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('sys:user:delete')" type="danger" @click="deleteHandle()">
					{{ $t("deleteBatch") }}
				</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('sys:user:export')" type="info" @click="exportHandle()">
					{{ $t("export") }}
				</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			@sort-change="dataListSortChangeHandle" style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="username" :label="$t('user.username')" sortable="custom" header-align="center"
				align="center"></el-table-column>
			<el-table-column prop="realName" label="姓名" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="deptName" :label="$t('user.deptName')" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="email" :label="$t('user.email')" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="mobile" :label="$t('user.mobile')" sortable="custom" header-align="center"
				align="center"></el-table-column>
			<el-table-column prop="gender" :label="$t('user.gender')" sortable="custom" header-align="center"
				align="center">
				<template v-slot="scope">
					{{ getDictLabel("gender", scope.row.gender) }}
				</template>
			</el-table-column>
			<el-table-column prop="status" :label="$t('user.status')" sortable="custom" header-align="center"
				align="center">
				<template v-slot="scope">
					<el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t("user.status0") }}</el-tag>
					<el-tag v-else size="small" type="success">{{ $t("user.status1") }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createDate" :label="$t('user.createDate')" sortable="custom" header-align="center"
				align="center" width="180"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('sys:user:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('sys:user:delete')" type="text" size="small"
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
	import {
		defineComponent,
		reactive,
		toRefs
	} from "vue";
	import AddOrUpdate from "./user-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/sys/user/page",
				getDataListIsPage: true,
				deleteURL: "/sys/user",
				deleteIsBatch: true,
				exportURL: "/sys/user/export",
				routeName: '/sys-user-edit',
				routePath: '/sys/user-edit',
				routeTitle: '用户',
				dataForm: {
					username: "",
					deptId: "",
					postId: "",
					gender: ""
				}
			});
			return {
				...useView(state),
				...toRefs(state)
			};
		},
		methods: {}
	});
</script>
