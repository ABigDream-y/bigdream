<template>
	<div class="mod-sys__role">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="dataForm.name" :placeholder="$t('role.name')" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('sys:role:save')" type="primary" @click="addOrUpdateHandle()">
					{{ $t("add") }}
				</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('sys:role:delete')" type="danger" @click="deleteHandle()">
					{{ $t("deleteBatch") }}
				</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			@sort-change="dataListSortChangeHandle" style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="name" :label="$t('role.name')" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="remark" :label="$t('role.remark')" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="createDate" :label="$t('role.createDate')" sortable="custom" header-align="center"
				align="center" width="180"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<!-- <el-button type="text" size="small" @click="userHandle(scope.row.id)">用户</el-button> -->
					<el-button v-if="hasPermission('sys:role:update')" type="text" size="small"
						@click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('sys:role:delete')" type="text" size="small"
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
		registerDynamicToRouterAndNext
	} from "@/router";
	import {
		defineComponent,
		reactive,
		toRefs
	} from "vue";
	import AddOrUpdate from "./role-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/sys/role/page",
				getDataListIsPage: true,
				deleteURL: "/sys/role",
				deleteIsBatch: true,
				dataForm: {
					name: ""
				}
			});
			return {
				...useView(state),
				...toRefs(state)
			};
		},
		methods: {
			userHandle(id: string) {
				const routeParams = {
					routeName: `sys-userByRole__${id ? id : 0}`,
					title: `角色用户管理`,
					path: `/sys/userByRole`,
					query: {
						roleId: id,
						_mt: `角色用户管理`
					}
				};
				registerDynamicToRouterAndNext(routeParams);
			}
		}
	});
</script>
