<template>
	<div class="mod-task__tasksettinginstitute">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<!-- <el-form-item v-if="hasPermission('task:tasksettinginstitute:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item> -->
			<el-form-item v-if="hasPermission('task:tasksettinginstitute:save')">
				<el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('task:tasksettinginstitute:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="institute" label="学院" header-align="center" align="center"></el-table-column>
			<el-table-column prop="instituteNo" label="学院编号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="startDate" label="开始日期" header-align="center" align="center"></el-table-column>
			<el-table-column prop="endDate" label="结束日期" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('task:tasksettinginstitute:update')" type="text" size="small"
						@click="myAddOrUpdateHandle(scope.row.id, dataList)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('task:tasksettinginstitute:delete')" type="text" size="small"
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
	import AddOrUpdate from "./tasksettinginstitute-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/task/tasksettinginstitute/page",
				getDataListIsPage: true,
				exportURL: "/task/tasksettinginstitute/export",
				deleteURL: "/task/tasksettinginstitute",
				routeName: '/task-tasksettinginstitute-edit',
				routePath: '/task/tasksettinginstitute-edit',
				routeTitle: '教学任务维护特殊院系设置',
				deleteIsBatch: true,
				dataForm: {
					institute: "",
					instituteNo: "",
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
			total(val) {
				this.$emit('refreshTotal', val)
			}
		},
		methods: {
			myAddOrUpdateHandle(id, ids) {
				this.addOrUpdateVisible = true;
				this.$nextTick(()=>{
					this.$refs.addOrUpdate.init(id, ids);
				});
			}
		}
	});
</script>