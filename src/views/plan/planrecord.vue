<template>
	<div class="mod-plan__planrecord">
		<el-card style="margin-bottom:20px;" shadow="never" v-if="dataForm.planId">
			<div style="margin-bottom:20px;">
				{{planForm.name}}【应开门数：<span style="color:#F7AF2C">2</span>；实开门数：<span style="color:#F7AF2C">{{total}}</span>】
			</div>
			<el-form :inline="true">
				<el-form-item style="margin-bottom:0;" label="计划学年" prop="startGrade">
					<ren-select v-model="plan.startGrade" dict-type="school_year"
						placeholder="计划学年"></ren-select>
				</el-form-item>
				<el-form-item style="margin-bottom:0;" label="计划学期" prop="startTerm">
					<ren-select v-model="plan.startTerm" dict-type="term"
						placeholder="计划学期"></ren-select>
				</el-form-item>
				<el-form-item style="margin-bottom:0;">
					<el-button type="primary" @click="createPlan()">生成教学计划</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item prop="courseNo">
				<el-input v-model="dataForm.courseNo" placeholder="课程号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="courseName">
				<el-input v-model="dataForm.courseName" placeholder="课程名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('plan:planrecord:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('plan:planrecord:save')">
				<el-button type="primary" @click="toAddOrUpdate()">添加课程</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('plan:planrecord:save')">
				<el-button type="primary" @click="batchAddCourse()">批量添加课程</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('plan:planrecord:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="courseNo" label="课程号" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="courseName" label="课程名" header-align="center" align="center"
				width="200"></el-table-column>
			<el-table-column prop="courseCategory" label="课程类别" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("course_category", scope.row.courseCategory) }}
				</template>
			</el-table-column>
			<el-table-column prop="courseType" label="课程分类" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("course_type", scope.row.courseType) }}
				</template>
			</el-table-column>
			<el-table-column prop="courseMode" label="教学方式" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("course_mode", scope.row.courseMode) }}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="examType" label="考试类型" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("exam_type", scope.row.examType) }}
				</template>
			</el-table-column> -->
			<el-table-column prop="credit" label="学分" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="hours" label="学时" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="weekHours" label="周学时" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="teachingHours" label="授课学时" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="practicalHours" label="实验学时" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="computerHours" label="上机学时" header-align="center" align="center"
				width="100"></el-table-column>
			<!-- <el-table-column prop="otherHours" label="其他学时" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="description" label="变更说明" header-align="center" align="center"></el-table-column> -->
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('plan:planrecord:update')" type="text" size="small"
						@click="toAddOrUpdate(scope.row)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('plan:planrecord:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	
		<course-dialog v-if="courseVisible" ref="courseDialog" @confirm="confirmCourse"></course-dialog>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./planrecord-add-or-update.vue";
	import baseService from "@/service/baseService";
	import CourseDialog from "../dialog/course-multi.vue";
	export default defineComponent({
		components: {
			AddOrUpdate,
			CourseDialog
		},
		setup() {
			const state = reactive({
				courseVisible:false,
				createdIsNeed: false,
				getDataListURL: "/plan/planrecord/page",
				getDataListIsPage: true,
				exportURL: "/plan/planrecord/export",
				deleteURL: "/plan/planrecord",
				routeName: '/plan-planrecord-edit',
				routePath: '/plan/planrecord-edit',
				routeTitle: '教学计划调整课程',
				// 生成教学计划
				createLessonPlanURL: "/plan/planrecord/generatePlan",
				// 批量添加课程
				batchAddCourseURL: "",
				deleteIsBatch: true,
				dataForm: {
					planId: "",
					courseNo: "",
					courseName: "",
				} as IObject,
				planForm:{
					id:"",
					name:""
				},
				plan:{
					startGrade:"",
					startTerm:""
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {},
		activated() {
			console.log('roter', this.$route);
			let query = this.$route.query;
			console.log('query',query);
			if (query && query.planId) {
				this.dataForm.planId = query.planId || "";
				this.getPlanInfo();
			}
			this.query();
		},
		methods: {
			//获取教学计划信息
			getPlanInfo() {
				if(this.dataForm.planId) {
					baseService.get("/plan/plan/" + this.dataForm.planId).then((res) => {
						console.log('教学计划详情',res)
						if (res.code !== 0) {
							return this.$message.error(res.msg);
						}
						this.planForm = res.data;
					});
				}
			},
			toAddOrUpdate(data ?: IObject) {
				let query = {} as IObject;
				if (data) {
					query.id = data.id;
				}
				query.planId = this.dataForm.planId
				this.editWidthParamsHandle(query);
			},
			//生成教学计划
			createPlan(){
				if(!this.plan.startGrade) {
					return this.$message.error('请选择计划学年！');
				}
				if(!this.plan.startTerm) {
					return this.$message.error('请选择计划学期！');
				}
				let data:IObject = {
					planId: this.planForm.id,
					caseId: 1
				};
				baseService.get(this.createLessonPlanURL, data).then((res)=>{
					console.log(res);
				});
				// baseService.post("/plan/plan/" ,postData).then((res) => {
				// 	console.log('教学计划详情',res)
				// 	if (res.code !== 0) {
				// 		return this.$message.error(res.msg);
				// 	}
				// 	this.planForm = res.data;
				// });
			},
			//批量选择课程新增
			batchAddCourse(){
				this.courseVisible = true;
				this.$nextTick(() => {
					this.$refs['courseDialog'].init();
				})
			},
			confirmCourse(data:IObject){
				console.log('data---')
			}
		}
	});
</script>