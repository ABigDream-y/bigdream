<template>
	<div class="mod-student__student">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item prop="xh">
				<el-input v-model="dataForm.xh" placeholder="学号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="realName">
				<el-input v-model="dataForm.realName" placeholder="姓名" clearable></el-input>
			</el-form-item>
			<el-form-item prop="gender">
				<ren-select v-model="dataForm.gender" dict-type="gender" placeholder="性别"></ren-select>
			</el-form-item>
			<el-form-item prop="idCard">
				<el-input v-model="dataForm.idCard" placeholder="证件号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="pycc">
				<ren-select v-model="dataForm.pycc" dict-type="pycc" placeholder="培养层次"></ren-select>
			</el-form-item>
			<el-form-item prop="sfzj">
				<ren-select v-model="dataForm.sfzj" dict-type="yesOrNo" placeholder="是否在籍"></ren-select>
			</el-form-item>
			<el-form-item prop="sfzx">
				<ren-select v-model="dataForm.sfzx" dict-type="yesOrNo" placeholder="是否在校"></ren-select>
			</el-form-item>
			<el-form-item prop="eduSystem">
				<ren-select v-model="dataForm.eduSystem" dict-type="edu_system" placeholder="学制"></ren-select>
			</el-form-item>
			<el-form-item prop="campus">
				<ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
			</el-form-item>
			<el-form-item prop="instituteNo">
				<ren-institute-tree v-model="dataForm.instituteNo" :deptName="dataForm.institute"
					@change="instituteChange" placeholder="学院" nodekey="number" showType="select"></ren-institute-tree>
			</el-form-item>
			<el-form-item prop="major">
				<el-select v-model="dataForm.major" placeholder="专业">
					<el-option v-for="(item, index) in majorList" :key="index" :value="item.name" :label="item.name"
						@click="majorChange(item)"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="grade">
				<el-select v-model="dataForm.grade" placeholder="年级">
					<el-option v-for="(item, index) in gradeList" :key="index" :value="item.name" :label="item.name"
						@click="gradeChange(item)"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="className">
				<el-select v-model="dataForm.className" placeholder="班级">
					<el-option v-for="(item, index) in classList" :key="index" :value="item.name" :label="item.name"
						@click="classChange(item)"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="schoolYear">
				<ren-select v-model="dataForm.schoolYear" dict-type="grade" placeholder="入学年级"></ren-select>
			</el-form-item>
			<el-form-item prop="status">
				<ren-select v-model="dataForm.status" dict-type="yesOrNo" placeholder="状态"></ren-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:student:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:student:save')">
				<el-button type="success" @click="downTemplateHandle()">模板下载</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:student:save')">
				<el-button type="warning" @click="importHandle()">批量导入</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:student:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:student:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border :default-sort="defaultSort" @sort-change="dataListSortChangeHandle" @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="xh" label="学号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="gender" label="性别" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("gender", scope.row.gender) }}
				</template>
			</el-table-column>
			<el-table-column prop="idCard" label="证件号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="className" label="班级" header-align="center" align="center"></el-table-column>
			<el-table-column prop="pycc" label="培养层次" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("pycc", scope.row.pycc) }}
				</template>
			</el-table-column>
			<el-table-column prop="sfzj" label="是否在籍" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.sfzj) }}
				</template>
			</el-table-column>
			<el-table-column prop="sfzx" label="是否在校" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.sfzx) }}
				</template>
			</el-table-column>
			<el-table-column prop="eduSystem" label="学制" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("edu_system", scope.row.eduSystem) }}
				</template>
			</el-table-column>
			<el-table-column prop="campus" label="校区" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("campus", scope.row.campus) }}
				</template>
			</el-table-column>
			<el-table-column prop="institute" label="学院" header-align="center" align="center"></el-table-column>
			<el-table-column prop="major" label="专业" header-align="center" align="center"></el-table-column>
			<el-table-column prop="grade" label="年级" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("grade", scope.row.grade) }}
				</template>
			</el-table-column>
			<el-table-column prop="schoolYear" label="入学年级" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("grade", scope.row.schoolYear) }}
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.status) }}
				</template>
			</el-table-column>
			<el-table-column prop="createDate" label="创建时间" sortable header-align="center" align="center" width="100">
			</el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button type="text" size="small" @click="detailHandle(scope.row.id)">详情</el-button>
					<el-button v-if="hasPermission('student:student:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('student:student:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

		<StudentImport v-if="importVisible" ref="studentImport" @refreshDataList="query()" @error="errorHandle">
		</StudentImport>

		<!-- 错误提示 -->
		<el-dialog title="错误提示" v-model="errorVisible" :close-on-click-modal="false" :close-on-press-escape="false"
			width="50%">
			<el-table v-loading="dataListLoading" :data="errorList" border style="width: 100%">
				<el-table-column prop="msg" label="错误信息" header-align="center" align="center"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script lang="ts">
	import { registerDynamicToRouterAndNext } from "@/router";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./student-add-or-update.vue";
	import StudentImport from "./student-import.vue";
	import { IObject } from "@/types/interface";
	export default defineComponent({
		components: {
			AddOrUpdate,
			StudentImport
		},
		setup() {
			const state = reactive({
				getDataListURL: "/student/student/page",
				getDataListIsPage: true,
				errorVisible: false,
				importVisible: false,
				errorList: [],
				exportURL: "/student/student/export",
				importTemplateUrl: "/student/student/download", // 模板下载
				deleteURL: "/student/student",
				routeName: "/student-student-edit",
				routePath: "/student/student-edit",
				routeTitle: "学籍信息",
				deleteIsBatch: true,
				dataForm: {
					xh: "",
					realName: "",
					gender: "",
					idCard: "",
					className: "",
					classNo: "",
					pycc: "",
					sfzj: "",
					sfzx: "",
					eduSystem: "",
					campus: "",
					institute: "",
					instituteNo: "",
					major: "",
					grade: "",
					schoolYear: "",
					status: ""
				},
				defaultSort:{
					order:"descending",
					prop:"createDate"
				},
				order: "desc",
				orderField: "create_date",
				majorList: [] as IObject[],
				gradeList: [] as IObject[],
				classList: [] as IObject[]
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {},
		methods: {
			detailHandle(id : string) {
				const routeParams = {
					routeName: `student-student-detail__${id ? id : 0}`,
					title: `学生信息 - 详情`,
					path: `/student/student-detail`,
					query: {
						id: id ? id : 0,
						_mt: `学生信息 - 详情`
					}
				};
				registerDynamicToRouterAndNext(routeParams);
			},
			// 学院变更
			instituteChange(data ?: IObject) {
				if (data) {
					this.dataForm.instituteNo = data.number;
					this.dataForm.institute = data.name;
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.dataForm.grade = "";
					this.dataForm.className = "";
					this.dataForm.classNo = "";
					this.majorList = data.children;
				} else {
					this.dataForm.instituteNo = "";
					this.dataForm.institute = "";
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.dataForm.grade = "";
					this.dataForm.className = "";
					this.dataForm.classNo = "";
					this.majorList = [];
				}
			},
			// 专业变更
			majorChange(data : IObject) {
				this.dataForm.grade = "";
				this.dataForm.className = "";
				this.dataForm.classNo = "";
				this.gradeList = data.children;
			},
			// 年级变更
			gradeChange(data : IObject) {
				this.dataForm.className = "";
				this.dataForm.classNo = "";
				this.classList = data.children;
			},
			// 班级变更
			classChange(data : IObject) {
				console.log(data);
				this.dataForm.classNo = data.number;
			},
			importHandle() {
				this.importVisible = true;
				this.$nextTick(() => {
					this.$refs.studentImport.init("teachingarea");
				});
			},
			//导入错误数据提示
			errorHandle(data : any) {
				this.errorVisible = true;
				this.errorList = data;
				console.log("data", data);
			}
		}
	});
</script>