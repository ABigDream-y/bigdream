<template>
	<div class="mod-plan__planDetail-edit-compare" style="height: 100%;">
		<div class="null" v-if="dataForm.status == 1">方案[<span title="点击跳转详情"
				style="color: #0BB2D4;text-decoration: underline;cursor:pointer;"
				@click="detailHandle(dataForm)">{{dataForm.name}}</span>]暂未生成，请先生成教学计划^_^</div>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="never">
					<template #header>
						<h3 class="compare-title">
							<span>方案课程明细</span>
							<el-button v-if="isUpdateMate" @click="updateMateCourse()" type="primary"
								size="small">保存匹配修改</el-button>
						</h3>
					</template>
					<div class="compare-card">
						<el-table :data="caseCourseList" stripe style="width: 100%">
							<el-table-column type="index" label="序号" width="55" />
							<el-table-column prop="courseNo" label="课程号" width="200" />
							<el-table-column prop="courseName" label="课程名称" />
							<el-table-column prop="address" label="匹配情况" width="100">
								<template v-slot="scope">
									<el-button type="text" v-if="scope.row.courseNo"
										@click="mateCourseHandle(scope.row)">{{scope.row.isMate ? '取消匹配':'匹配'}}</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="never">
					<template #header>
						<h3 class="compare-title">计划课程明细</h3>
					</template>
					<div class="compare-card">
						<el-table :data="planCourse" stripe style="width: 100%">
							<el-table-column type="index" label="序号" width="55" />
							<el-table-column prop="courseNo" label="课程号" width="200">
								<template v-slot="scope">
									<el-button type="text">
										<span
											:style="{color:scope.row.courseNo ?'#000':'#F56C6C'}">{{scope.row.courseNo ?scope.row.courseNo:'无匹配课程'}}</span>
									</el-button>
								</template>
							</el-table-column>
							<el-table-column prop="courseName" label="课程名称">
								<template v-slot="scope">
									<el-button type="text">
										<span
											:style="{color:scope.row.courseNo ?'#000':'#F56C6C'}">{{scope.row.courseName ?scope.row.courseName:'无匹配课程'}}</span>
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<el-dialog v-model="visibleMate" title="匹配课程" :close-on-click-modal="false" :close-on-press-escape="false">
			<div>
				<el-table :data="planCourseList" @row-click="mateRowCourse" stripe style="width: 100%">
					<el-table-column prop="mateCourseNo" width="55">
						<template v-slot="scope">
							<el-radio v-model="mateCourseForm.id" :label="scope.row.id"
								:disabled="scope.row.mateCourseNo">&nbsp;</el-radio>
						</template>
					</el-table-column>
					<el-table-column type="index" label="序号" width="55" />
					<el-table-column prop="courseNo" label="课程号" width="200"></el-table-column>
					<el-table-column prop="courseName" label="课程名称"></el-table-column>
					<el-table-column prop="address" label="匹配情况" width="100">
						<template v-slot="scope">
							<span
								:style="{color:scope.row.mateCourseNo ?'#3E8EF7':'#F56C6C'}">{{scope.row.mateCourseNo ?'已匹配':'未匹配'}}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<template v-slot:footer>
				<el-button @click="visibleMate = false">{{ $t("cancel") }}</el-button>
				<el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
	import baseService from "@/service/baseService";
	import { IObject } from "@/types/interface";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./groupcourse-add-or-update.vue";
	import { registerDynamicToRouterAndNext } from "@/router";
	export default defineComponent({
		components: {

		},
		props: {

		},
		setup() {
			const state = reactive({
				visibleMate: false,
				dataForm: {
					id: "",
					grade: "",
					institute: "",
					instituteNo: "",
					major: "",
					majorDirection: "",
					name: "",
					eduSystem: "",
					startGrade: "",
					startTerm: "",
					termType: "",
					courseType: "",
					scoreMin: "",
					academicDegree: "",
					trainObjective: "",
					readingRequirements: "",
					programFeatures: "",
					majorDisciplines: "",
					mainCourses: "",
					mainProfessionalExperiments: "",
					status: 0,
					creator: "",
					createDate: "",
					updater: "",
					updateDate: ""
				} as IObject,
				caseCourseList: [] as IObject[],
				planCourseList: [] as IObject[],
				metaPlanCourse: [] as IObject[],  //匹配课程列表
				planCourse: [] as IObject[],
				mateCourseForm: {
					id: "",
					caseIndex: 0,
					planIndex: 0,
					courseNo: "",
					mateCourseNo: ""
				} as IObject,
				isUpdateMate: false,  //是否修改了匹配内容
			});
			return { ...toRefs(state) };
		},
		watch: {

		},
		methods: {
			init(data : IObject) {
				this.isUpdateMate = false;
				this.dataForm = data;
				this.dataForm.caseId = data.caseId;
				console.log(this.dataForm);
				this.getCaseCourseList();

			},
			//获取培养方案课程列表
			getCaseCourseList() {
				this.caseCourseList = [];
				if(this.dataForm.caseId) {
					baseService.get("/programme/coursecase/page", {
						caseId: this.dataForm.caseId,
						page: 1,
						limit: 9999
					}).then((res) => {
						console.log('培养方案计划课程', res)
						if (res.code == 0) {
							this.caseCourseList = res.data.list;
						}

						this.getPlanCourseList();
					});
				}
			},
			//获取教学计划课程列表
			getPlanCourseList() {
				this.planCourseList = [];
				this.planCourse = [];
				baseService.get("/plan/planrecord/page", {
					page: 1,
					limit: 9999,
					planId: this.dataForm.id
				}).then((res) => {
					console.log('教学计划课程', res);
					if (res.code == 0) {
						this.planCourseList = res.data.list;
					}

					this.handleCourse(false);

				});
			},
			// 处理课程
			handleCourse(isUpdate : boolean) {
				this.planCourse = [];
				let planCourseList = this.deepCloneHandle(this.planCourseList);
				for (let i = 0; i < this.caseCourseList.length; i++) {
					let caseObj : IObject = this.caseCourseList[i];
					let planIndex = planCourseList.findIndex((item : IObject) => item.mateCourseNo == caseObj.courseNo && item.mateCourseNo && caseObj.courseNo);
					let planObj : IObject = {};
					if (planIndex != -1) {
						caseObj['isMate'] = true;
						planObj = planCourseList[planIndex];
					} else {
						caseObj['isMate'] = false;
						planObj['courseName'] = "";
						planObj['courseNo'] = "";
					}
					this.caseCourseList[i] = caseObj;
					this.planCourse.push(planObj);
				}

				for (let i = 0; i < planCourseList.length; i++) {
					let index = this.planCourse.findIndex((item : IObject) => item.courseNo == planCourseList[i].courseNo);
					if (index == -1) {
						this.planCourse.push(planCourseList[i]);
					}
				}
				this.isUpdateMate = isUpdate;
				console.log('caseCourseList', this.caseCourseList);
				console.log('planCourse', this.planCourse);
			},
			//方案课程匹配操作
			mateCourseHandle(data : IObject) {
				console.log('index--', data);
				let caseIndex = this.caseCourseList.findIndex((item : IObject) => item.id == data.id);
				if (data.isMate) {
					//方案课程取消匹配
					// this.caseCourse[]
					this.caseCourseList[caseIndex].isMate = false;
					//对应匹配计划课程 的 匹配课程号清空
					for (let i = 0; i < this.planCourseList.length; i++) {
						if (this.planCourseList[i].mateCourseNo == data.courseNo) {
							this.planCourseList[i].mateCourseNo = "";
						}
					}
					this.handleCourse(true);
				} else {
					this.metaPlanCourse = this.deepCloneHandle(this.planCourseList);
					//匹配
					this.mateCourseForm = {
						id: "",
						caseIndex: -1,
						planIndex: -1,
						courseNo: "",
						mateCourseNo: ""
					}
					this.mateCourseForm['caseIndex'] = caseIndex;
					this.visibleMate = true;
					console.log('mateCourseForm', this.mateCourseForm);
				}
			},
			//选择匹配课程
			mateRowCourse(row : IObject) {
				console.log('row--', row);
				let planIndex = this.metaPlanCourse.findIndex((item : IObject) => item.id == row.id);
				if (!row.mateCourseNo) {
					this.mateCourseForm = {
						...this.mateCourseForm,
						...row,
						planIndex
					}
				}
				console.log('mateCourseForm', this.mateCourseForm);
			},
			//方案课程确定匹配
			dataFormSubmitHandle() {
				if (this.mateCourseForm.id) {
					let caseIndex = this.mateCourseForm.caseIndex;
					this.caseCourseList[caseIndex].isMate = true;
					this.planCourseList[this.mateCourseForm.planIndex].mateCourseNo = this.caseCourseList[caseIndex].courseNo;
					// console.log('planCourseList', this.planCourseList)
					this.handleCourse(true);
					this.visibleMate = false;
				} else {
					this.$message.error('请选择匹配的课程')
				}
			},
			//修改匹配
			updateMateCourse() {
				let postData : IObject[] = this.planCourseList.map((item : IObject) => {
					return {
						id: item.id,
						courseNo: item.mateCourseNo
					}
				});
				console.log('提交的数据', postData);
				this.$confirm("确定保存匹配修改？", this.$t("prompt.title"), {
					confirmButtonText: this.$t("confirm"),
					cancelButtonText: this.$t("cancel"),
					type: "warning"
				}).then(() => {
					baseService.get("/plan/planrecord/saveMatch", postData).then((res) => {
						console.log('教学计划课程', res);
						if (res.code == 0) {
							this.getCaseCourseList();
						}
					});
				}).catch(() => {
				});
			},
			deepCloneHandle(data:IObject){
				return JSON.parse(JSON.stringify(data));
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
			}
		}
	});
</script>

<style scoped lang="scss">
	.compare-card {
		width: 100%;
		height: calc(100vh - 50px - 40px - 30px - 42px - 40px - 15px - 10px - 43px - 42px);
		overflow: hidden;
		overflow-y: auto;
	}

	.compare-title {
		margin: 0;
		border-left: 2px solid #3E8EF7;
		padding-left: 8px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

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

	.compare-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: flex-start;

		.left {
			flex: 1;
		}

		.right {
			flex: 1;
		}
	}
</style>
