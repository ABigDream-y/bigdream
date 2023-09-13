<template>
	<div class="mod-task__teachingclass">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="dataForm.courseName" placeholder="课程名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.courseNo" placeholder="课序号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('task:teachingclass:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('task:teachingclass:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('task:teachingclass:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="courseName" label="课程名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseNo" label="课序号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="classNum" label="班容量" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacher" label="上课教师" header-align="center" align="center"></el-table-column>
			<el-table-column prop="class" label="上课班级" header-align="center" align="center"></el-table-column>
			<el-table-column prop="campus" label="校区" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('task:teachingclass:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('task:teachingclass:delete')" type="text" size="small"
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
	import AddOrUpdate from "./teachingclass-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/task/teachingclass/page",
				getDataListIsPage: true,
				exportURL: "/task/teachingclass/export",
				deleteURL: "/task/teachingclass",
				routeName: '/task-teachingclass-edit',
				routePath: '/task/teachingclass-edit',
				routeTitle: '教学任务维护教学班',
				deleteIsBatch: true,
				dataForm: {
					courseName: "",
					courseNo: "",
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
		}
	});
</script>