<template>
	<div class="mod-programme__casecourse">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<!-- <el-form-item>
				<el-input v-model="dataForm.groupId" placeholder="课组" clearable></el-input>
			</el-form-item> -->
			<el-form-item prop="courseNo">
				<el-input v-model="dataForm.courseNo" placeholder="课程编号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="courseName">
				<el-input v-model="dataForm.courseName" placeholder="课程名称" clearable></el-input>
			</el-form-item>
			<el-form-item prop="mainCourse">
				<el-select v-model="dataForm.mainCourse" placeholder="是否主干课程">
					<el-option :value="1" label="是"></el-option>
					<el-option :value="0" label="否"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<!-- <el-table-column prop="groupId" label="课组" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="courseNo" label="课程编号" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="courseName" label="课程名称" header-align="center" align="center"
				width="200"></el-table-column>
			<el-table-column prop="institute" label="开课院系" header-align="center" align="center"
				width="200"></el-table-column>
			<el-table-column prop="instituteNo" label="开课院系" header-align="center" align="center"
				width="200"></el-table-column>
			<el-table-column prop="hours" label="学时" header-align="center" align="center" width="200"></el-table-column>
			<el-table-column prop="score" label="学分" header-align="center" align="center" width="200"></el-table-column>
			<el-table-column prop="planGrade" label="计划学年" header-align="center" align="center" width="200">
				<template v-slot="scope">
					{{ getDictLabel("grade", scope.row.planGrade) }}
				</template>
			</el-table-column>
			<el-table-column prop="planTerm" label="计划学期" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("term", scope.row.planTerm) }}
				</template>
			</el-table-column>
			<el-table-column prop="courseType" label="课程性质" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("course_mode", scope.row.courseType) }}
				</template>
			</el-table-column>
			<el-table-column prop="examType" label="考试类型" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("exam_type", scope.row.examType) }}
				</template>
			</el-table-column>
			<el-table-column prop="mainCourse" label="是否主干课程" header-align="center" align="center" width="200">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.mainCourse) }}
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
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./casecourse-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/programme/casecourse/page",
				getDataListIsPage: true,
				exportURL: "/programme/casecourse/export",
				deleteURL: "/programme/casecourse",
				routeName: '/programme-casecourse-edit',
				routePath: '/programme/casecourse-edit',
				routeTitle: '课组课程列表',
				deleteIsBatch: true,
				dataForm: {
					groupId: "",
					courseNo: "",
					courseName: "",
					mainCourse: "",
				} as IObject
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {},
		methods: {
			init(groupId:string){
				this.dataForm.groupId = groupId;
				this.query();
			},
			toAddOrUpdate(data ?: IObject) {
				let query = {} as IObject;
				if (data) {
					query.id = data.id;
				}
				query.gid = this.dataForm.groupId
				this.editWidthParamsHandle(query);
			}
		}
	});
</script>