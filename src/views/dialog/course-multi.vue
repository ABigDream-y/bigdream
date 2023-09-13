<template>
	<el-dialog width="80%" v-model="visible" title="选择课程" :close-on-click-modal="false" :close-on-press-escape="false">
		<div class="mod-course__courselibrary">
			<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
				<el-form-item prop="code">
					<el-input v-model="dataForm.code" placeholder="课程号" clearable></el-input>
				</el-form-item>
				<el-form-item prop="name">
					<el-input v-model="dataForm.name" placeholder="课程名" clearable></el-input>
				</el-form-item>
				<el-form-item prop="unit">
					<ren-institute-tree v-model="dataForm.unit" :deptName="dataForm.unit" placeholder="开课单位"
						nodekey="name" showType="select"></ren-institute-tree>
				</el-form-item>
				<el-form-item prop="category">
					<ren-select v-model="dataForm.category" dict-type="course_category" placeholder="课程类别"></ren-select>
				</el-form-item>
				<el-form-item prop="type">
					<ren-select v-model="dataForm.type" dict-type="course_type" placeholder="课程类别"></ren-select>
				</el-form-item>
				<el-form-item prop="mode">
					<ren-select v-model="dataForm.mode" dict-type="course_mode" placeholder="教学方式"></ren-select>
				</el-form-item>
				<el-form-item prop="language">
					<ren-select v-model="dataForm.language" dict-type="language_type" placeholder="授课语种"></ren-select>
				</el-form-item>
				<!-- <el-form-item prop="status">
					<ren-select v-model="dataForm.status" dict-type="verify_status" placeholder="课程状态"></ren-select>
				</el-form-item> -->
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
				<el-table-column prop="code" label="课程号" header-align="center" align="center"
					width="120"></el-table-column>
				<el-table-column prop="name" label="课程名" header-align="center" align="center"
					width="200"></el-table-column>
				<el-table-column prop="nameEn" label="英文课程名" header-align="center" align="center"
					width="200"></el-table-column>
				<el-table-column prop="unit" label="开课单位" header-align="center" align="center"
					width="200"></el-table-column>
				<el-table-column prop="credit" label="学分" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="totalHours" label="学时" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="category" label="课程类别" header-align="center" align="center" width="100">
					<template v-slot="scope">
						{{ getDictLabel("course_category", scope.row.category) }}
					</template>
				</el-table-column>
				<el-table-column prop="type" label="课程分类" header-align="center" align="center" width="100">
					<template v-slot="scope">
						{{ getDictLabel("course_type", scope.row.type) }}
					</template>
				</el-table-column>
				<el-table-column prop="language" label="授课语种" header-align="center" align="center" width="100">
					<template v-slot="scope">
						{{ getDictLabel("language_type", scope.row.language) }}
					</template>
				</el-table-column>
				<el-table-column prop="isExperiment" label="是否生成课内实验课" header-align="center" align="center" width="200">
					<template v-slot="scope">
						{{ getDictLabel("yesOrNo", scope.row.isExperiment) }}
					</template>
				</el-table-column>

				<el-table-column prop="status" label="课程状态" header-align="center" align="center" width="100">
					<template v-slot="scope">
						{{ getDictLabel("verify_status", scope.row.status) }}
					</template>
				</el-table-column>
			</el-table>
			<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
				layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
				@current-change="pageCurrentChangeHandle"> </el-pagination>
		</div>
		<template v-slot:footer>
			<el-button @click="visible = false">{{ $t("cancel") }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	export default defineComponent({
		setup() {
			const state = reactive({
				visible: false,
				createdIsNeed: false,
				getDataListURL: "/course/courselibrary/page",
				getDataListIsPage: true,
				exportURL: "/course/courselibrary/export",
				deleteURL: "/course/courselibrary",
				routeName: '/course-courselibrary-edit',
				routePath: '/course/courselibrary-edit',
				routeTitle: '课程库',
				deleteIsBatch: true,
				dataForm: {
					code: "",
					name: "",
					unit: "",
					category: "",
					type: "",
					mode: "",
					language: "",
					status: 1,
				} as IObject,
				selectForm: {
					id: "",
					name: ""
				} as IObject
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {},
		methods: {
			init() {
				this.visible = true;
				this.query();
			},
			rowClickHandle(data : IObject) {
				this.selectForm = {
					...this.selectForm,
					...data
				}
			},
			dataFormSubmitHandle() {
				if (this.selectForm.id) {
					this.$emit('confirm', this.selectForm);
					this.visible = false;
				} else {
					this.$message.error('请选择课程！')
				}
			}
		}
	});
</script>