<template>
	<el-dialog width="80%" v-model="visible" :title="title" :close-on-click-modal="false"
		:close-on-press-escape="false">
		<!-- 课组 -->
		<div class="mod-programme__coursegroup">
			<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
				<el-form-item prop="name">
					<el-input v-model="dataForm.name" placeholder="课组名" clearable></el-input>
				</el-form-item>
				<el-form-item prop="grade">
					<ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList()">{{ $t("query") }}</el-button>
				</el-form-item>
				<el-form-item>
					<el-button @click="queryResetHandle()">重置</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="dataListLoading" :data="dataList" border @row-click="rowClickHandle"
				style="width: 100%">
				<el-table-column label="" header-align="center" align="center" width="50">
					<template v-slot="scope">
						<!-- 1 启用状态可选， 其余状态禁用不可选，根据status的取值做对应的判断即可 -->
						<el-radio :disabled="!(scope.row.status == 1)" v-model="selectForm.id"
							:label="scope.row.id">&nbsp;</el-radio>
					</template>
				</el-table-column>

				<el-table-column prop="name" label="课组名" header-align="center" align="center"
					width="200"></el-table-column>

				<el-table-column prop="status" label="状态" header-align="center" align="center">
					<template v-slot="scope">
						{{ getDictLabel("enable_status", scope.row.status) }}
					</template>
				</el-table-column>


				<el-table-column prop="grade" label="年级" header-align="center" align="center" width="100">
					<template v-slot="scope">
						{{ getDictLabel("grade", scope.row.grade) }}
					</template>
				</el-table-column>

				<el-table-column prop="institute" label="院系" header-align="center" align="center"
					width="200"></el-table-column>
				<el-table-column prop="scoreMin" label="最少修读学分" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="courseMin" label="最少修读门数" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="groupMin" label="最少完成课组数" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="totalCourse" label="课程总门数" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="totalHours" label="课程总学时" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="totalScore" label="课程总学分" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="publicStatus" label="是否校公选课组" header-align="center" align="center" width="200">
					<template v-slot="scope">
						{{ getDictLabel("yesOrNo", scope.row.publicStatus) }}
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
	import { registerDynamicToRouterAndNext } from "@/router";
	import { IObject } from "@/types/interface";
	// import baseService from "@/service/baseService";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	export default defineComponent({
		setup() {
			const state = reactive({
				visible: false,
				createdIsNeed: false,
				getDataListURL: "/programme/coursegroup/page",
				getDataListIsPage: true,
				exportURL: "/programme/coursegroup/export",
				deleteURL: "/programme/coursegroup",
				routeName: "/programme-coursegroup-edit",
				routePath: "/programme/coursegroup-edit",
				routeTitle: "课组",
				deleteIsBatch: true,
				title: "选择课组",
				current: 1, // 1 选课组   2 选课程
				dataForm: {
					name: "",
					grade: "",
					status: ""
				} as IObject,
				selectForm: {
					id: "",
					name: ""
				} as IObject,
				disabledList: {} as IObject,
				groupId: ""
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
			page(val : number) {
				console.log("page-", val);
			},
			limit(val : number) {
				console.log("limit-", val);
			}
		},
		methods: {
			init() {
				this.selectForm.id = "";
				// this.current = 1;
				this.title = "选择课组";
				this.visible = true;
				this.getDataListURL = "/programme/coursegroup/page";
				this.query();
			},
			rowClickHandle(data : IObject) {
				if(data.status && data.status == 1) {
					this.selectForm = {
						...this.selectForm,
						...data
					};
				} else {
					return;
				}
			},
			async dataFormSubmitHandle() {
				if (this.selectForm.id) {
					// 选择课程
					this.$emit("confirm", this.selectForm);
					// return;
				} else {
					this.$message.error("请选择课组！");
				}
			}
		}
	});
</script>