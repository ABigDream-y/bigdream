<template>
	<div class="edit-card--file edit-card-page">
		<div class="aui-card-header">
			<el-button @click="goBack()"><el-icon>
					<ArrowLeft />
				</el-icon>返回</el-button>
			<el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</div>
		<div class="edit-card__body">
			<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
				label-width="120px">
				<el-form-item label="" prop="userId">
					<el-button type="primary" size="large" @click="selectCourse()">选择课程</el-button>
				</el-form-item>
				<el-row :gutter="20">
					<el-col :span="12">
						<el-form-item label="课程号" prop="courseNo">
							<el-input readonly v-model="dataForm.courseNo" size="large" placeholder="课程号"></el-input>
						</el-form-item>
						<el-form-item label="课程分类" prop="courseType">
							<ren-select :disabled="!isEdit" v-model="dataForm.courseType" size="large" dict-type="course_type"
								placeholder="课程分类"></ren-select>
						</el-form-item>
						<el-form-item label="考试类型" prop="examType">
							<ren-select :disabled="!isEdit" v-model="dataForm.examType" size="large"
								dict-type="exam_type" placeholder="考试类型"></ren-select>
						</el-form-item>
						<el-form-item label="学分" prop="credit">
							<el-input readonly v-model="dataForm.credit" size="large" placeholder="学分" :min="0"></el-input>
						</el-form-item>
						<el-form-item label="周学时" prop="weekHours">
							<el-input readonly v-model="dataForm.weekHours" size="large" placeholder="周学时" :min="0"></el-input>
						</el-form-item>
						<el-form-item label="实验学时" prop="practicalHours">
							<el-input readonly v-model="dataForm.practicalHours" size="large" placeholder="实验学时" :min="0"></el-input>
						</el-form-item>
						<el-form-item label="其他学时" prop="otherHours">
							<el-input readonly v-model="dataForm.otherHours" size="large" placeholder="其他学时" :min="0"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="课程名" prop="courseName">
							<el-input readonly v-model="dataForm.courseName" size="large" placeholder="课程名" :min="0"></el-input>
						</el-form-item>
						<el-form-item label="课程类别" prop="courseCategory">
							<ren-select :disabled="!isEdit" v-model="dataForm.courseCategory" size="large"
								dict-type="course_category" placeholder="课程类别"></ren-select>
						</el-form-item>
						<el-form-item label="教学方式" prop="courseMode">
							<ren-select :disabled="!isEdit" v-model="dataForm.courseMode" size="large" dict-type="course_mode"
								placeholder="教学方式"></ren-select>
						</el-form-item>
						<el-form-item label="学时" prop="hours">
							<el-input readonly v-model="dataForm.hours" size="large" placeholder="学时" :min="0"></el-input>
						</el-form-item>
						<el-form-item label="授课学时" prop="teachingHours">
							<el-input readonly v-model="dataForm.teachingHours" size="large" placeholder="授课学时" :min="0"></el-input>
						</el-form-item>
						<el-form-item label="上机学时" prop="computerHours">
							<el-input readonly v-model="dataForm.computerHours" size="large" placeholder="上机学时" :min="0"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item label="变更说明" prop="description">
					<el-input type="textarea" :rows="5" v-model="dataForm.description"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<course-dialog v-if="courseVisible" ref="courseDialog" @confirm="confirmCourse"></course-dialog>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import CourseDialog from "../dialog/course.vue";
	export default defineComponent({
		components: {
			CourseDialog
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				courseVisible:false,
				dataForm: {
					id: "",
					planId: "",
					courseNo: "",
					courseName: "",
					courseType: "",
					courseShape: "",
					credit: "",
					hours: "",
					weekHours: "",
					teachingHours: "",
					practicalHours: "",
					computerHours: "",
					otherHours: "",
					description: "",
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
					courseNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					courseName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
				let planId = this.$route.query.planId || "";
				this.dataForm.planId = planId;
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/plan/planrecord/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
				});
			},
			selectCourse() {
				this.courseVisible = true;
				this.$nextTick(() => {
					this.$refs['courseDialog'].init();
				})
			},
			confirmCourse(data : IObject) {
				console.log('data---',data)
				this.dataForm.courseNo = data.code;
				this.dataForm.courseName = data.name;
				this.dataForm.credit = data.credit;
				this.dataForm.hours = data.totalHours;
				
				this.dataForm.courseType = data.courseType;
				this.dataForm.courseCategory = data.courseCategory;
				this.dataForm.courseMode = data.courseMode;
				this.dataForm.examType = data.examType;
				
				this.dataForm.weekHours = data.weekHours;
				this.dataForm.teachingHours = data.teachingHours;
				this.dataForm.practicalHours = data.practicalHours;
				this.dataForm.computerHours = data.computerHours;
				this.dataForm.otherHours = data.otherHours;
				
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/plan/planrecord", this.dataForm).then((res) => {
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