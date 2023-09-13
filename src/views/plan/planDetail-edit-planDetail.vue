<template>
	<div class="mod-plan__planDetail-edit-detail" style="height: 100%;">
		<div class="null" v-if="planForm.status == 1">方案[<span title="点击跳转详情"
				style="color: #0BB2D4;text-decoration: underline;cursor:pointer;"
				@click="detailHandle(planForm)">{{planForm.name}}</span>]暂未生成，请先生成教学计划^_^</div>
		<div v-else>
			<el-form :inline="true" ref="form" :model="planForm" @keyup.enter="getDataList()">
				<el-form-item v-if="hasPermission('plan:planrecord:save')">
					<el-button type="primary" @click="addCourseHandle()">{{ $t("add") }}</el-button>
				</el-form-item>
				<el-form-item v-if="hasPermission('plan:planrecord:delete')">
					<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="multiAuditHandle('',1)">批量通过</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="danger" @click="multiAuditHandle('',2)">批量不通过</el-button>
				</el-form-item>
				<el-form-item v-if="hasPermission('plan:planrecord:export')">
					<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="dataListLoading" :data="dataList" border
				@selection-change="dataListSelectionChangeHandle" style="width: 100%">
				<el-table-column type="selection" :selectable="selectable" header-align="center" align="center" width="50"></el-table-column>
				<el-table-column prop="status" label="状态" header-align="center" align="center" width="100">
					<template v-slot="scope">
						{{ getDictLabel("plan_course_status", scope.row.status) }}
					</template>
				</el-table-column>
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
				<el-table-column prop="credit" label="学分" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="hours" label="学时" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="weekHours" label="周学时" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="teachingHours" label="授课学时" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="practicalHours" label="实验学时" header-align="center" align="center"
					width="100"></el-table-column>
				<el-table-column prop="computerHours" label="上机学时" header-align="center" align="center"
					width="100"></el-table-column>
				<!-- <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column> -->
				<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
					<template v-slot="scope">
						<el-button v-if="scope.row.status == 0" type="text" size="small"
							@click="multiAuditHandle(scope.row.id,1)">通过</el-button>
						<el-button v-if="scope.row.status == 0" type="text" size="small"
							@click="multiAuditHandle(scope.row.id,2)">不通过</el-button>
						<el-button v-if="hasPermission('plan:planrecord:delete') && scope.row.status != 1" type="text" size="small"
							@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 审核弹窗 -->
			<vertify-dialog v-if="vertifyVisible" ref="vertifyDialogRef" @comfirm="comfirmVertify"></vertify-dialog>

			<case-course-group v-if="addOrUpdateVisible" ref="addOrUpdate" @confirm="comfirmHandle"></case-course-group>
		</div>
	</div>
</template>

<script lang="ts">
	import baseService from "@/service/baseService";
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./groupcourse-add-or-update.vue";
	import { registerDynamicToRouterAndNext } from "@/router";
	import VertifyDialog from "../dialog/vertify-dialog.vue";
	import CaseCourseGroup from "../dialog/course.vue";
	export default defineComponent({
		components: {
			VertifyDialog,
			CaseCourseGroup
		},
		props: {

		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/plan/planrecord/page",
				getDataListIsPage: true,
				exportURL: "/plan/planrecord/export",
				deleteURL: "/plan/planrecord",
				routeName: '/plan-planDetail-edit',
				routePath: '/plan/planDetail-edit',
				routeTitle: '教学计划生成管理',
				deleteIsBatch: true,
				vertifyVisible: false,
				dataForm: {
					planId: "",
					courseNo: "",
					courseName: "",
				} as IObject,
				planForm: {} as IObject,
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {

		},
		methods: {
			init(data : IObject) {
				this.planForm = data;
				console.log(this.planForm);
				this.dataForm.planId = data.id;
				this.query();
			},
			// 勾选状态
			selectable(row:IObject, index:number) {
				return row.status != 1;
			},
			detailHandle(data : IObject) {
				console.log("data", data);
				const routeParams = {
					routeName: `programme-casedetail__${data.id ? data.id : 0}`,
					title: `${data.name} - 详情`,
					path: `/programme/casedetail`,
					query: {
						id: data.id ? data.id : 0,
						_mt: `${data.name} - 详情`
					}
				};
				registerDynamicToRouterAndNext(routeParams);
			},
			//新增课程
			addCourseHandle() {
				this.addOrUpdateVisible = true;
				this.$nextTick(() => {
					this.$refs.addOrUpdate.init();
				})
			},
			//确定添加课程
			comfirmHandle(data : IObject) {
				console.log('data', data);
				let postData = {
					planId: this.planForm.id,
					courseNo: data.code,
					courseName: data.name,
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
					description: "",
					status: 0
				}
				console.log('提交的数据', postData);
				baseService.post("/plan/planrecord", postData).then((res) => {
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
			},
			multiAuditHandle(id : string, status : number) {
				if(!this.dataListSelections || (this.dataListSelections && this.dataListSelections.length == 0)) {
					return this.$message.error('请选择至少一条数据')
				}
				
				let that = this;
				let ids = [] as string[];
				let content = "";
				if (id) {
					ids = [id];
					content = "确定" + (status == 1 ? '通过' : '不通过') + "？";
				} else {
					let total = this.dataListSelections.length;
					ids = this.dataListSelections.filter((item : IObject) => item.status == 0).map((item : IObject) => item.id);
					content = "总共选择" + total + "条数据，其中" + ids.length + "条待审核数据，确定" + (status == 1 ? '批量通过' : '批量不通过') + "？";
				}
				if (status == 1) {
					this.$confirm(content, this.$t("prompt.title"), {
						confirmButtonText: this.$t("confirm"),
						cancelButtonText: this.$t("cancel"),
						type: "warning"
					}).then(() => {
						that.verifyBatchHandle({
							planId:this.planForm.id,
							ids: ids,
							status: 1,
							description: ""
						})
					}).catch(() => {
						//
					});
				} else if (status == 2) {
					this.$prompt(content, '填写审核未通过理由', {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
						inputType: "textarea",
						inputValidator: (value : string) => {
							if (!value) {
								return '理由不能为空！';
							}
						}
					}).then(({ value }) => {
						console.log('value---', value)
						that.verifyBatchHandle({
							planId:this.planForm.id,
							ids: ids,
							status: 2,
							description: value
						})

					}).catch(() => {

					});
				}
				// this.vertifyVisible = true;
				// this.$nextTick(() => {
				// 	this.$refs.vertifyDialogRef.init();
				// });
				// console.log("哈哈", this.dataListSelections);
			},
			verifyBatchHandle(data : IObject) {
				// baseService.post("/plan/planrecord/batch",data).then((res) => {
				// 	if (res.code !== 0) {
				// 		return this.$message.error(res.msg);
				// 	}
				// 	this.query();
				// });
			},
			comfirmVertify(status : number, value : string) {
				console.log("value---", status, value);
				let list = [];
				if (this.dataListSelections.length > 0) {
					this.dataListSelections.forEach((item, index) => {
						this.dataListSelections[index].status = status;
						this.dataListSelections[index].auditReason = value;
						list.push(this.dataListSelections[index]);
					});
				}
				let postDate = JSON.stringify(list);
				console.log("提交", postDate);
				this.dataFormSubmitHandle(postDate);
			},
			dataFormSubmitHandle(data : any) {
				// baseService.put("/student/changerecord/batchUpdate", data, { dataType: "json" }).then((res) => {
				//   if (res.code !== 0) {
				//     return this.$message.error(res.msg);
				//   }
				//   this.$message.success("批量审核成功");
				//   console.log(res);
				//   this.query();
				// });
			}
		}
	});
</script>

<style scoped lang="scss">
	.mod-left-card {
		width: 100%;
		min-height: calc(100vh - 50px - 40px - 30px - 20px - 55px - 42px - 20px);

		.group-title {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 0;
		}

		.group-item {
			width: 100%;
			padding: 10px;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.active {
			background-color: rgba(62, 142, 247, 0.2);
			color: #3E8EF7;
		}

	}

	.null {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		font-size: 20px;
		font-weight: 100;
		color: grey;
	}
</style>