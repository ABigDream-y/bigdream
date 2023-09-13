<template>
	<div class="mod-programme__coursecase">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<!-- <el-form-item>
        <el-input v-model="dataForm.caseId" placeholder="培养方案id" clearable></el-input>
      </el-form-item> -->
			<el-form-item prop="courseName">
				<el-input v-model="dataForm.courseName" placeholder="课程名称" clearable></el-input>
			</el-form-item>
			<el-form-item prop="instituteNo">
				<ren-institute-tree v-model="dataForm.instituteNo" placeholder="学院" nodekey="number"
					showType="select"></ren-institute-tree>
			</el-form-item>
			<el-form-item prop="hours">
				<el-input v-model="dataForm.hours" placeholder="学时" clearable></el-input>
			</el-form-item>
			<el-form-item prop="credit">
				<el-input v-model="dataForm.credit" placeholder="学分" clearable></el-input>
			</el-form-item>
			<!-- <el-form-item prop="planGrade">
				<ren-select v-model="dataForm.planGrade" dict-type="school_year" placeholder="计划学年"></ren-select>
			</el-form-item> -->
			<!-- <el-form-item prop="planTerm">
				<ren-select v-model="dataForm.planTerm" dict-type="term" placeholder="计划学期"></ren-select>
			</el-form-item> -->
			<el-form-item prop="courseType">
				<ren-select v-model="dataForm.courseType" dict-type="course_type" placeholder="课程分类"></ren-select>
			</el-form-item>
			<el-form-item prop="examType">
				<ren-select v-model="dataForm.examType" dict-type="exam_type" placeholder="考试类型"></ren-select>
			</el-form-item>
			<el-form-item prop="mainCourse">
				<ren-select v-model="dataForm.mainCourse" dict-type="yesOrNo" placeholder="是否是主干课程"></ren-select>
			</el-form-item>
			<el-form-item prop="status">
				<ren-select v-model="dataForm.status" dict-type="plan_course_status" placeholder="状态"></ren-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('programme:coursecase:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('programme:coursecase:save') && showAdd">
				<el-button type="primary" @click="addCourseHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('programme:coursecase:delete') && showAdd">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="courseNo" label="课程编号" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="courseName" label="课程名称" header-align="center" align="center" min-width="200"></el-table-column>
			<el-table-column prop="institute" label="开课院系" header-align="center" align="center" min-width="200"></el-table-column>
			<el-table-column prop="hours" label="学时" header-align="center" align="center" width="80"></el-table-column>
			<el-table-column prop="credit" label="学分" header-align="center" align="center" width="80"></el-table-column>
			<!-- <el-table-column prop="planGrade" label="计划学年" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("school_year", scope.row.courseType) }}
				</template>
			</el-table-column>
			<el-table-column prop="planTerm" label="计划学期" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("term", scope.row.courseType) }}
				</template>
			</el-table-column> -->
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
			<el-table-column prop="examType" label="考试类型" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("exam_type", scope.row.examType) }}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="credit" label="学分" header-align="center" align="center" width="100"></el-table-column> -->
			<!-- <el-table-column prop="hours" label="学时" header-align="center" align="center" width="100"></el-table-column> -->
			<!-- <el-table-column prop="weekHours" label="周学时" header-align="center" align="center"
				width="100"></el-table-column> -->
			<!-- <el-table-column prop="teachingHours" label="授课学时" header-align="center" align="center"
				width="100"></el-table-column> -->
			<!-- <el-table-column prop="practicalHours" label="实验学时" header-align="center" align="center"
				width="100"></el-table-column> -->
			<!-- <el-table-column prop="computerHours" label="上机学时" header-align="center" align="center"
				width="100"></el-table-column> -->
			<el-table-column prop="mainCourse" label="是否主干课程" header-align="center" align="center" width="150">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.mainCourse) }}
				</template>
			</el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="100">
				<template v-slot="scope">
					<el-button v-if="hasPermission('programme:coursecase:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<!-- <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update> -->
		<case-course-group :needGroupId="true" v-if="addOrUpdateVisible" ref="addOrUpdate" @confirm="comfirmHandle"></case-course-group>
	</div>
</template>

<script lang="ts">
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./coursecase-add-or-update.vue";
	import { IObject } from "@/types/interface";
	import baseService from "@/service/baseService";
	import CaseCourseGroup from "../dialog/course.vue";
	export default defineComponent({
		components: {
			AddOrUpdate,
			CaseCourseGroup
		},
		props: {
			showAdd: Boolean,
			caseInfo:Object
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/programme/coursecase/page",
				getDataListIsPage: true,
				exportURL: "/programme/coursecase/export",
				deleteURL: "/programme/coursecase",
				routeName: '/programme-coursecase-edit',
				routePath: '/programme/coursecase-edit',
				routeTitle: '培养方案课程列表',
				deleteIsBatch: true,
				dataForm: {
					caseId: "",
					groupId: "",
					courseName: "",
					institute: "",
					instituteNo: "",
					hours: "",
					credit: "",
					planGrade: "",
					planTerm: "",
					courseType: "",
					examType: "",
					mainCourse: "",
					status: ""
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
		},
		methods: {
			init(caseId : string, groupId : string) {
				console.log('方案信息',this.caseInfo);
				console.log("caseId：", caseId, "\tgroupId：", groupId);
				this.dataForm.caseId = caseId;
				this.dataForm.groupId = groupId;
				console.log('dataForm---', this.dataForm);
				this.query();
			},
			//清除数据
			clear(){
				this.page = 1;
				this.dataList = [];
			},
			toAddOrUpdate(data ?: IObject) {
				let query = {} as IObject;
				if (data) {
					query.id = data.id;
				}
				query.gid = this.dataForm.caseId
				this.editWidthParamsHandle(query);
			},
			addCourseHandle() {
				this.addOrUpdateVisible = true;
				this.$nextTick(() => {
					console.log(this.dataForm.caseId, this.dataForm.groupId);
					this.$refs.addOrUpdate.init(this.dataForm.groupId);
				})
			},
			comfirmHandle(data : IObject) {
				console.log("data: ", data);
				console.log(this.dataForm.caseId, this.dataForm.groupId);
				let postData = {
					groupId: this.dataForm.groupId,
					caseId: this.dataForm.caseId,
					courseName: data.name,
					courseNo:data.code,
					institute: data.unit,
					instituteNo: data.unitNo,
					hours: data.totalHours,
					credit: data.credit,
					courseType: data.courseType,
					courseCategory: data.courseCategory,
					courseMode: data.courseMode,
					examType: data.examType,
					weekHours: data.weekHours,
					teachingHours: data.teachingHours,
					practicalHours: data.practicalHours,
					computerHours: data.computerHours,
					otherHours: data.otherHours,
					mainCourse: 0,
					remark: "",
					status: 0,
				}
				console.log('提交的数据', postData);
				baseService.post("/programme/coursecase", postData).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.$message({
						message: this.$t("prompt.success"),
						type: "success",
						duration: 500,
						onClose: () => {
							this.init(this.dataForm.caseId,this.dataForm.groupId);
						}
					});
				});
			}
		}
	});
</script>