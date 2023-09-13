<template>
	<div class="mod-task__adminclass">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="dataForm.classNo" placeholder="班级" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<!-- 显示/隐藏 -->
			<!-- <el-form-item>
				<el-button type="primary">合班</el-button>
			</el-form-item> -->
			<el-form-item v-if="hasPermission('task:adminclass:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<!-- <el-form-item v-if="hasPermission('task:adminclass:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item> -->
			<el-form-item v-if="hasPermission('task:adminclass:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="courseNo" label="课程号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseName" label="课程名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="classNo" label="班级编号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="className" label="班级" header-align="center" align="center"></el-table-column>
			<el-table-column prop="number" label="人数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="grade" label="年级" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("grade", scope.row.grade) }}
				</template>
			</el-table-column>
			<el-table-column prop="institute" label="院系" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="instituteNo" label="院系" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="major" label="专业" header-align="center" align="center"></el-table-column>
			<el-table-column prop="majorDirection" label="专业方向" header-align="center" align="center"
				width="120"></el-table-column>
			<el-table-column prop="campus" label="校区" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="status" label="是否启用" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.status) }}
				</template>
			</el-table-column> -->
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("task_course_status", scope.row.status) }}
				</template>
			</el-table-column>
			<!-- <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('task:adminclass:update')" type="text" size="small"
						@click="combineHandle(scope.row.id)">转教学班</el-button>
					<el-button v-if="hasPermission('task:adminclass:update')" type="text" size="small"
						@click="combineHandle(scope.row.id)">合班</el-button>
					<el-button v-if="hasPermission('task:adminclass:update')" type="text" size="small"
						@click="splitHandle(scope.row.id)">拆班</el-button>
					<el-button v-if="hasPermission('task:adminclass:update')" type="text" size="small"
						@click="splitHandle(scope.row.id)">开课/取消开课</el-button>
					<el-button v-if="hasPermission('task:adminclass:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column> -->
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
	import AddOrUpdate from "./adminclass-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		props: {
			// 课程号
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/task/adminclass/page",
				getDataListIsPage: true,
				exportURL: "/task/adminclass/export",
				deleteURL: "/task/adminclass",
				routeName: "/task-adminclass-edit",
				routePath: "/task/adminclass-edit",
				routeTitle: "教学任务维护行政班",
				deleteIsBatch: true,
				dataForm: {
					courseId:"",
					classNo: "",
					grade: ""
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		activated() {
			this.init();
		},
		watch: {},
		methods: {
			init() {
				// this.dataForm.courseId = taskcourseId;
				this.query();
				console.log("init");
			},
			// 合班
			combineHandle() {
				console.log("合班");
			},
			// 拆班
			splitHandle() {
				console.log("拆班");
			}
		}
	});
</script>