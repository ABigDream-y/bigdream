<template>
	<div class="edit-card--file">
		<div class="aui-card-header">
			<el-button @click="goBack()"><el-icon>
					<ArrowLeft />
				</el-icon>返回</el-button>
			<el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</div>
		<div class="edit-card__body">
			<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
				label-width="120px">
				<el-form-item label="id" prop="id">
					<el-input v-model="dataForm.id" placeholder="id"></el-input>
				</el-form-item>
				<el-form-item label="培养方案id" prop="caseId">
					<el-input v-model="dataForm.caseId" placeholder="培养方案id"></el-input>
				</el-form-item>
				<el-form-item label="课程名称" prop="courseName">
					<el-input v-model="dataForm.courseName" placeholder="课程名称"></el-input>
				</el-form-item>
				<el-form-item label="开课院系" prop="institute">
					<el-input v-model="dataForm.institute" placeholder="开课院系"></el-input>
				</el-form-item>
				<el-form-item label="开课院系" prop="instituteNo">
					<el-input v-model="dataForm.instituteNo" placeholder="开课院系"></el-input>
				</el-form-item>
				<el-form-item label="学时" prop="hours">
					<el-input v-model="dataForm.hours" placeholder="学时"></el-input>
				</el-form-item>
				<el-form-item label="学分" prop="score">
					<el-input v-model="dataForm.score" placeholder="学分"></el-input>
				</el-form-item>
				<el-form-item label="计划学年" prop="planGrade">
					<el-input v-model="dataForm.planGrade" placeholder="计划学年"></el-input>
				</el-form-item>
				<el-form-item label="计划学期" prop="planTerm">
					<el-input v-model="dataForm.planTerm" placeholder="计划学期"></el-input>
				</el-form-item>
				<el-form-item label="课程性质" prop="courseType">
					<el-input v-model="dataForm.courseType" placeholder="课程性质"></el-input>
				</el-form-item>
				<el-form-item label="考试类型" prop="examType">
					<el-input v-model="dataForm.examType" placeholder="考试类型"></el-input>
				</el-form-item>
				<el-form-item label="是否主干课程" prop="mainCourse">
					<el-input v-model="dataForm.mainCourse" placeholder="是否主干课程"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="dataForm.remark" placeholder="备注"></el-input>
				</el-form-item>
				<el-form-item label="" prop="status">
					<el-input v-model="dataForm.status" placeholder=""></el-input>
				</el-form-item>
				<el-form-item label="创建者" prop="creator">
					<el-input v-model="dataForm.creator" placeholder="创建者"></el-input>
				</el-form-item>
				<el-form-item label="创建时间" prop="createDate">
					<el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
				</el-form-item>
				<el-form-item label="更新者" prop="updater">
					<el-input v-model="dataForm.updater" placeholder="更新者"></el-input>
				</el-form-item>
				<el-form-item label="更新时间" prop="updateDate">
					<el-input v-model="dataForm.updateDate" placeholder="更新时间"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts">
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	export default defineComponent({
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				dataForm: {
					id: "",
					caseId: "",
					courseName: "",
					institute: "",
					instituteNo: "",
					hours: "",
					score: "",
					planGrade: "",
					planTerm: "",
					courseType: "",
					examType: "",
					mainCourse: "",
					remark: "",
					status: "",
					creator: "",
					createDate: "",
					updater: "",
					updateDate: "",
				}
			});
		},
		computed: {
			dataRule() {
				return {
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
				let id = this.$route.query.id || '';
				if (id && id != '0') {
					this.dataForm.id = id;
				}
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/programme/coursecase/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
				});
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/programme/coursecase", this.dataForm).then((res) => {
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
								this.goBack()
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