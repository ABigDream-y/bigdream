<template>
	<div class="mod-task__taskcourse">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="dataForm.courseId" placeholder="课程号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.courseName" placeholder="课程名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<!-- <el-form-item>
				<el-button v-if="hasPermission('task:taskcourse:save')" type="primary"
					@click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item> -->
			<!-- <el-form-item>
        <el-button v-if="hasPermission('task:taskcourse:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item> -->
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="courseNo" label="课程号" header-align="center" align="center"
				width="150"></el-table-column>
			<el-table-column prop="courseName" label="课程名称" header-align="center" align="center"
				width="150"></el-table-column>
			<el-table-column prop="courseUnit" label="开课单位" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.status) }}
				</template>
			</el-table-column>
			<el-table-column prop="score" label="学分" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="totalHours" label="总学时" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="teachingHours" label="授课学时" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="computerHours" label="上机学时" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="practicalHours" label="实践学时" header-align="center" align="center"
				width="100"></el-table-column>
			<!-- <el-table-column prop="" label="其他学时" header-align="center" align="center" width="100"></el-table-column> -->
			<el-table-column prop="" label="计划信息" header-align="center" align="center">
				<template v-slot="scope">
					<div v-if="scope.row.planInfo">
						<el-button type="text" size="small" @click="showDialog(scope.row.courseId, 1, scope.row.planInfo.adminNum)">行政班（{{scope.row.planInfo.adminNum}}）</el-button><br/>
						<el-button type="text" size="small" @click="showDialog(scope.row.courseId, 2, scope.row.planInfo.expectedRefurbishment)">预计重修人数（{{scope.row.planInfo.expectedRefurbishment}}）</el-button><br/>
						<el-button type="text" size="small" @click="showDialog(scope.row.courseId, 3, scope.row.planInfo.adminStuNum)">行政班总人数（{{scope.row.planInfo.adminStuNum}}）</el-button>

					</div>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("task_course_status", scope.row.status) }}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="teachingMethods" label="教学方式" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="courseHead" label="课程负责人" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"
				width="100"></el-table-column> -->
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="200">
				<template v-slot="scope">
					<el-button v-if="hasPermission('task:taskcourse:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">教学班编排</el-button>
					<el-button v-if="hasPermission('task:taskcourse:update') && scope.row.planInfo" type="text" size="small"
						@click="showDialog(scope.row.courseId, 4, scope.row.planInfo.teachCount)">教学班列表（{{scope.row.planInfo.teachCount}}）</el-button>
					<!-- <el-button v-if="hasPermission('task:taskcourse:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
		
		<taskCourseDialog ref="taskCourseDialog"></taskCourseDialog>
	</div>
</template>

<script lang="ts">
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./taskcourse-add-or-update.vue";
	import taskCourseDialog from "./taskcourse-dialog.vue";
	export default defineComponent({
		components: {
			AddOrUpdate,
			taskCourseDialog
		},
		setup() {
			const state = reactive({
				getDataListURL: "/task/taskcourse/page",
				getDataListIsPage: true,
				exportURL: "/task/taskcourse/export",
				deleteURL: "/task/taskcourse",
				routeName: "/task-taskcourse-edit",
				routePath: "/task/taskcourse-edit",
				routeTitle: "教学任务维护课程",
				deleteIsBatch: true,
				dataForm: {
					courseId: "",
					courseName: "",
					status: ""
				},
				routeTitleCustom: "详情",
				showDialogVisible: false
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
			
		},
		methods: {
			showDialog(id, type, count) {
				this.showDialogVisible = true;
				
				this.$nextTick(()=>{
					this.$refs.taskCourseDialog.init(id, type, count);
				});
			}
		}
	});
</script>