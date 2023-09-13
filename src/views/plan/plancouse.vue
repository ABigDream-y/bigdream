<template>
	<div class="mod-plan__plancouse">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item prop="courseNo">
				<el-input v-model="dataForm.courseNo" placeholder="课程号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="courseName">
				<el-input v-model="dataForm.courseName" placeholder="课程名" clearable></el-input>
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
			<el-form-item v-if="hasPermission('plan:plancouse:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('plan:plancouse:save')">
				<el-button type="primary" @click="addCourseHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('plan:plancouse:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="courseNo" label="课程号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseName" label="课程名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="courseUnit" label="开课单位" header-align="center" align="center"></el-table-column>
			<el-table-column prop="hours" label="学时" header-align="center" align="center"></el-table-column>
			<el-table-column prop="score" label="学分" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("verify_status", scope.row.status) }}
				</template>
			</el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<!-- <el-button v-if="hasPermission('plan:plancouse:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button> -->
					<el-button v-if="hasPermission('plan:plancouse:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<case-course-group v-if="addOrUpdateVisible" ref="addOrUpdate" @confirm="comfirmHandle"></case-course-group>
	</div>
</template>

<script lang="ts">
	import baseService from "@/service/baseService";
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import CaseCourseGroup from "../dialog/course.vue";
	export default defineComponent({
		components: {
			CaseCourseGroup
		},
		setup() {
			const state = reactive({
				getDataListURL: "/plan/plancouse/page",
				getDataListIsPage: true,
				exportURL: "/plan/plancouse/export",
				deleteURL: "/plan/plancouse",
				routeName: '/plan-plancouse-edit',
				routePath: '/plan/plancouse-edit',
				routeTitle: '全校选修课教学计划维护',
				deleteIsBatch: true,
				dataForm: {
					courseId: "",
					courseNo: "",
					courseName: "",
					status: "",
				} as IObject,
				dataList: [] as IObject[]
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {},
		methods: {
			addCourseHandle() {
				this.addOrUpdateVisible = true;
				this.$nextTick(() => {
					this.$refs.addOrUpdate.init();
				})
			},
			comfirmHandle(data : IObject) {
				console.log('data', data)
				let postData = {
					courseId: data.id,
					courseNo: data.code,
					courseName: data.name,
					courseUnit: data.unit,
					hours: data.totalHours,
					score: data.credit,
					status: 2
				}
				console.log('提交的数据', postData);
				baseService.post("/plan/plancouse", postData).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.$message({
						message: this.$t("prompt.success"),
						type: "success",
						duration: 500,
						onClose: () => {
							this.query();
						}
					});
				});
			}
		}
	});
</script>