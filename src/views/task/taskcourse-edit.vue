<template>
	<div class="edit-card--file">
		<div class="aui-card-header">
			<el-button @click="goBack()"><el-icon>
					<ArrowLeft />
				</el-icon>返回</el-button>
			<!-- <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button> -->
		</div>
		<div class="edit-card__body">
			<el-card shadow="never">
				<template #header>
					<div class="card-header">
						<span>基本信息</span>
						<el-button class="button" type="primary">保存</el-button>
					</div>
				</template>
				<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="120px">
					<el-row :gutter="20">
						<el-col :span="8">
							<el-form-item label="课程号" prop="courseId">
								<div>{{ dataForm.courseId }}</div>
							</el-form-item>
							<el-form-item label="课程名称" prop="courseName">
								<div>{{ dataForm.courseName }}</div>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<div style="display: flex">
								<el-form-item label="学分" prop="score" label-position="left">
									<div>{{ dataForm.score }}</div>
								</el-form-item>
								<el-form-item label="总学时" prop="totalHours">
									<div>{{ dataForm.totalHours }}</div>
								</el-form-item>
								<el-form-item label="周学时" prop="totalHours">
									<div>{{ dataForm.totalHours }}</div>
								</el-form-item>
							</div>
							<div style="display: flex">
								<el-form-item label="授课学时" prop="totalHours">
									<div>{{ dataForm.totalHours }}</div>
								</el-form-item>
								<el-form-item label="实践学时" prop="totalHours">
									<div>{{ dataForm.totalHours }}</div>
								</el-form-item>
								<el-form-item label="上机学时" prop="totalHours">
									<div>{{ dataForm.totalHours }}</div>
								</el-form-item>
								<el-form-item label="其他学时" prop="totalHours">
									<div>{{ dataForm.totalHours }}</div>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
					<el-form-item label="开课单位" prop="courseUnit">
						<div>{{ dataForm.courseUnit }}</div>
					</el-form-item>
					<div style="display: flex">
						<el-form-item label="行政班" prop="planInfo">
							<div>{{ dataForm.planInfo.adminNum }}个</div>
						</el-form-item>
						<el-form-item label="行政班总人数" prop="">
							<div>{{ dataForm.planInfo.adminStuNum }}个</div>
						</el-form-item>
						<el-form-item label="预计重修人数" prop="">
							{{ dataForm.planInfo.expectedRefurbishment }}人
						</el-form-item>
						<el-form-item label="教学班" prop="">
							<div>{{ dataForm.planInfo.teachCount }}个</div>
						</el-form-item>
					</div>
				</el-form>
			</el-card>
			<el-card shadow="never" style="margin: 20px 0">
				<admin-class ref="adminClass" @refresh="refreshHandle()"
					@commitAdminClassInfo="getAdminClassInfo"></admin-class>
			</el-card>
			<el-card shadow="never">
				<teaching-clasess ref="teachingClass" @refresh="refreshHandle()"
					@commitTeachingClassInfo="getTeachingClassInfo"></teaching-clasess>
			</el-card>
		</div>
	</div>
</template>

<script lang="ts">
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import AdminClass from "./adminclass.vue";
	import TeachingClasess from "./teaching.vue";
	export default defineComponent({
		components: {
			AdminClass,
			TeachingClasess
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				dataForm: {
					id: "",
					courseId: "",
					courseName: "",
					courseUnit: "",
					status: "",
					teachingMethods: "",
					courseHead: "",
					score: 0,
					totalHours: 0,
					planInfo: {
						adminNum: 0,
						adminStuNum: 0,
						teachCount: 0,
						expectedRefurbishment: 0
					}
				},
				adminClassLists: {
					list: [],
					total: 0
				},
				teachingClassLists: {
					list: [],
					total: 0
				}
			});
		},
		computed: {
			dataRule() {
				return {
					courseId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					courseName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		activated() {
			this.init();
		},
		methods: {
			init() {
				this.loading = false;
				let id = this.$route.query.id || "";
				console.log('query', this.$route.query)
				if (id && id != "0") {
					this.dataForm.id = id;
				}
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取行政班的信息
			getAdminClassInfo(data) {
				console.log('行政班', data);
				if (data) {
					this.adminClassLists = data;
				}
			},
			// 获取教学班信息
			getTeachingClassInfo(data) {
				console.log("教学班：", data);
				if (data) {
					this.teachingClassLists = data;
				}
			},
			// 计算总人数
			calculateTotalCount(list) {
				let total = 0;
				for (var i = 0; i < list.length; i++) {
					total += list[i].number;
				}
				return total;
			},
			// 获取信息
			getInfo() {
				baseService.get("/task/taskcourse/" + this.dataForm.id).then((res) => {
					console.log('详情', res)
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = {
						...this.dataForm,
						...res.data
					};
					this.refreshHandle();
				});
			},
			refreshHandle() {
				this.$nextTick(() => {
					this.$refs.adminClass.init(this.dataForm.courseId);
					this.$refs.teachingClass.init(this.dataForm.courseId);
				})
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/task/taskcourse", this.dataForm).then((res) => {
						if (res.code !== 0) {
							this.loading = false;
							return this.$message.error(res.msg);
						}
						this.$message({
							message: this.$t("prompt.success"),
							type: "success",
							duration: 500,
							onClose: () => {
								this.loading = false;
								this.goBack();
							}
						});
					});
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
			}
		}
	});
</script>
<style>
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>