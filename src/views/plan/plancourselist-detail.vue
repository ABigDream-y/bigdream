<template>
	<div class="edit-card--file edit-card-page course-detail-box">
		<div class="aui-card-header" style="position: relative;">
			<el-button @click="goBack()">
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回
			</el-button>
			
			<div v-if="isLoaded">
				<span class="course-name">课程名：《{{dataForm.courseName}}》</span>
				<span class="course-status wait" v-if="dataForm.status == 0">待审核</span>
				<span class="course-status yes" v-else-if="dataForm.status == 1">通过</span>
				<span class="course-status no" v-else>不通过</span>
			</div>

			<div class="actions" v-if="isLoaded">
				<el-button class="my-btn yes" v-if="dataForm.status == 0" type="text" size="small"
					@click="multiAuditHandle(1)">通过</el-button>
				<el-button class="my-btn no" v-if="dataForm.status == 0" type="text" size="small"
					@click="multiAuditHandle(2)">不通过</el-button>
			</div>
		</div>
		<div class="edit-card__body" style="height: 100%;width:100%;">
			<div v-if="isLoaded" style="height: 100%;width:100%;">
				<div class="not-null" v-if="!isNull">
					<div class="base-info">
						<h3 class="title">基本信息</h3>
						<div class="content">
							<div class="row">
								<div class="item">
									<span class="content-title">
										所属学年
									</span>
									<span class="content-main italic">
										{{dataForm.planDTO.startGrade}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										所属学期
									</span>
									<span class="content-main italic">
										{{dataForm.planDTO.startTerm}}
									</span>
								</div>
							</div>
							<div class="row">
								<div class="item">
									<span class="content-title">
										课程名称
									</span>
									<span class="content-main">
										{{dataForm.courseName}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										课程号
									</span>
									<span class="content-main">
										{{dataForm.courseNo}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										所属计划
									</span>
									<span class="content-main">
										{{dataForm.planDTO.name}}
									</span>
								</div>
							</div>
							<div class="row">
								<div class="item">
									<span class="content-title">
										院系
									</span>
									<span class="content-main">
										{{dataForm.planDTO.institute}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										专业
									</span>
									<span class="content-main">
										{{dataForm.planDTO.major}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										专业方向
									</span>
									<span class="content-main">
										{{dataForm.planDTO.majorDirection}}
									</span>
								</div>
							</div>
							<div class="row">
								<div class="item">
									<span class="content-title">
										年级
									</span>
									<span class="content-main">
										{{dataForm.planDTO.grade}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										方案层次
									</span>
									<span class="content-main">
										{{dataForm.planDTO.level}}
									</span>
								</div>
							</div>
							<div class="row">
								<div class="item">
									<span class="content-title">
										学分
									</span>
									<span class="content-main">
										{{dataForm.credit}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										学时
									</span>
									<span class="content-main">
										{{dataForm.hours}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										总学时
									</span>
									<span class="content-main">
										{{dataForm.totalHours}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										周学时
									</span>
									<span class="content-main">
										{{dataForm.weekHours}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										授课学时
									</span>
									<span class="content-main">
										{{dataForm.teachingHours}}
									</span>
								</div>
								<!-- 	<div class="item">
									<span class="content-title">
										实验学时
									</span>
									<span class="content-main">
										{{dataForm.hours}}
									</span>
								</div> -->
								<div class="item">
									<span class="content-title">
										实践学时
									</span>
									<span class="content-main">
										{{dataForm.practicalHours}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										上机学时
									</span>
									<span class="content-main">
										{{dataForm.computerHours}}
									</span>
								</div>
								<div class="item">
									<span class="content-title">
										其它学时
									</span>
									<span class="content-main">
										{{dataForm.otherHours}}
									</span>
								</div>
							</div>
						</div>
					</div>
					<div class="admin-class">
						<h3 class="title">行政班</h3>
						<div class="content">
							<PlanAdminClass ref="PlanAdminClass"></PlanAdminClass>
						</div>
					</div>
				</div>
				<div class="null"
					style="width: 100%;height: 100%;color:grey;display:flex;align-items:center;justify-content: center;"
					v-else>没有获取到数据噢，请稍等片刻再试一试^_^</div>
			</div>
			<div style="width: 100%;height: 100%;color:grey;display:flex;align-items:center;justify-content: center;"
				v-else>
				<div class="my-loading">加载中...</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive, toRefs } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import CourseDialog from "../dialog/course.vue";
	import useView from "@/hooks/useView";
	import AddOrUpdate from "./planrecord-add-or-update.vue";
	import PlanAdminClass from "./plan-admin-class.vue";
	import { registerDynamicToRouterAndNext } from "@/router";
	export default defineComponent({
		components: {
			CourseDialog,
			PlanAdminClass
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				courseVisible: false,
				dataForm: {
					id: "",
					grade: "",
					term: "",
					planId: "",
					courseNo: "",
					courseName: "",
					status: "",
					institute: "",
					instituteNo: "",
					major: "",
					status: 0,
					startGrade: "",
					startTerm: "",
					level: "",
					planDTO: {
						name: "",
						majorDirection: "",
						level: "",
						grade: "",
						major: "",
						institute: ""
					}
				},
				isLoaded: false,
				isNull: false
			});
		},
		computed: {
			dataRule() {
				return {
					courseNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					courseName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
				};
			}
		},
		created() {
			// this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
			this.init();
		},
		activated() {
			// this.init();
		},
		methods: {
			init() {
				this.loading = false;
				let id = this.$route.query.id || '';
				if (id && id != '0') {
					this.dataForm.id = id;
				}
				let planId = this.$route.query.planId || "";
				this.dataForm.planId = planId;
				this.$nextTick(() => {
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			verifyBatchHandle(data : IObject) {
				baseService.get("/plan/planrecord/batchAudit",data).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.query();
				});
			},
			//批量审核
			multiAuditHandle(status : number) {
				let id = this.dataForm.id;
				console.log(id);
				if (id == "" || id == null) {
					return this.$message.error('数据未准备好，请稍后再试');
				}

				let that = this;
				let ids = [] as string[];
				let content = "";
				let confirm = "确定" + (status == 1 ? '批量通过' : '批量不通过') + "？";
				if (id) {
					ids = [id];
					content = "确定" + (status == 1 ? '通过' : '不通过') + "？";
				} else {
					let total = this.dataListSelections.length;
					ids = this.dataListSelections.filter((item : IObject) => item.status == 0).map((item : IObject) => item.id);
					content = "总共选择" + total + "条数据，其中" + ids.length + "条待审核数据，";
				}
				if (ids.length == 0) {
					content += "至少选择一条待审核数据！"
					this.$confirm(content, this.$t("prompt.title"), {
						confirmButtonText: this.$t("confirm"),
						cancelButtonText: this.$t("cancel"),
						type: "warning"
					}).then(() => {
					}).catch(() => {
					});
				}
				else if (status == 1) {
					content += confirm;
					this.$confirm(content, this.$t("prompt.title"), {
						confirmButtonText: this.$t("confirm"),
						cancelButtonText: this.$t("cancel"),
						type: "warning"
					}).then(() => {
						that.verifyBatchHandle({
							planId: this.dataForm.planId,
							ids: ids.join(';'),
							status: 1,
							opinion: ""
						})
					}).catch(() => {
						//
					});
				} else if (status == 2) {
					content += confirm;
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
							planId: this.dataForm.planId,
							ids: ids.join(';'),
							status: 2,
							opinion: value
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
			// 获取课程信息
			getInfo() {
				console.log("request params：", this.dataForm.id);
				baseService.get("/plan/planrecord/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
					baseService.get("/plan/plan/" + res.data.planId).then((data) => {
						this.dataForm.planDTO = data.data;

						console.log(JSON.parse(JSON.stringify(this.dataForm)));

						this.isNull = false;
						this.isLoaded = true;

						this.getAdminClass();

					}).catch((err) => {
						this.isNull = true;
						this.isLoaded = true;
					})
				}).catch((err) => {
					this.isNull = true;
					this.isLoaded = true;
				});
			},
			goBack() {
				const activeTabName = this.store.state.activeTabName;
				const tabs = this.store.state.tabs;
				let index = findIndex(tabs, (x) => x.value === activeTabName);
				this.store.state.tabs.splice(index, 1);
				this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
				this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
				this.$router.push(this.store.state.activeTabName);
			},
			// 获取行政班列表
			getAdminClass() {
				this.$nextTick(() => {
					console.log(this.$refs["PlanAdminClass"]);
					this.$refs["PlanAdminClass"].init(this.dataForm.planId);
				})
			},
			goBack() {
				const activeTabName = this.store.state.activeTabName;
				const tabs = this.store.state.tabs;
				let index = findIndex(tabs, (x) => x.value === activeTabName);
				this.store.state.tabs.splice(index, 1);
				this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
				this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
				this.$router.push(this.store.state.activeTabName);
			},
			updateClosedTabs(closedTabs : any[], isTransform = true) {
				if (isTransform) {
					closedTabs = closedTabs.map((x) => x.value);
				}
				this.store.dispatch({
					type: "updateState",
					payload: {
						closedTabs
					}
				});
			},

		}
	});
</script>

<style>
	.course-detail-box .course-name,
	.course-detail-box .course-status {
		padding: 5px 10px;
		margin-left: 10px;
	}

	.course-detail-box .base-info .content {
		border: 1px solid #eee;
		border-radius: 5px;
	}

	.course-detail-box .base-info .content .row,
	.course-detail-box .base-info .content .row .item {
		display: flex;
		flex-direction: row;
		justify-content: flext-start;
		align-items: flex-start;
		padding: 10px;
		font-size: 15px;
	}

	.course-detail-box .base-info .content .row .item {
		align-items: center;
		flex-basis: calc(100% / 4);
	}

	.course-detail-box .base-info .content .row:last-child .item {
		flex-basis: calc(100% / 10);
	}

	.course-detail-box .base-info .content .row .item .content-title {
		font-weight: bold;
		margin-right: 20px;
	}

	.course-detail-box .base-info .content .row .item .content-main.italic {
		font-style: italic;
		color: var(--color-primary)
	}

	.course-detail-box .course-status {
		border-radius: 5px;
		cursor: default;
	}

	.course-detail-box .course-status.no {
		color: #f56c6c;
		border: 1px solid #f56c6c;
		background: #fef0f0;
	}

	.course-detail-box .course-status.wait {
		color: #e6a23c;
		border: 1px solid #e6a23c;
		background: #fdf6ec;
	}

	.course-detail-box .course-status.yes {
		color: #67c23a;
		border: 1px solid #67c23a;
		background: #f0f9eb;
	}

	.course-detail-box .actions {
		position: absolute;
		right: 20px;
		top: 50%;
		transform: translateY(-50%);
	}

	.course-detail-box .actions .my-btn {
		border-radius: 5px;
		padding: 15px 20px;
		color: white;
		box-sizing: border-box;
	}

	.course-detail-box .actions .my-btn.yes {
		background: var(--el-color-success);
	}

	.course-detail-box .actions .my-btn.no {
		background: var(--el-color-danger)
	}
</style>