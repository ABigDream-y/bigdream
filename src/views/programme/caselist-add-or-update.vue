<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
		:close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
			label-width="120px">
			
			<el-form-item label="编号" prop="number">
				<el-input v-model="dataForm.number" size="large" placeholder="编号"></el-input>
			</el-form-item>
			<el-form-item label="方案层次" prop="">
				<el-input v-model="dataForm.level" size="large" placeholder="方案层次"></el-input>
			</el-form-item>
			
			<el-form-item label="年级" prop="grade">
				<ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
			</el-form-item>
			<el-form-item label="院系" prop="institute">
				<el-input v-model="dataForm.institute" placeholder="院系"></el-input>
			</el-form-item>
			<el-form-item label="院系编号" prop="instituteNo">
				<el-input v-model="dataForm.instituteNo" placeholder="院系编号"></el-input>
			</el-form-item>
			<el-form-item label="专业" prop="major">
				<el-input v-model="dataForm.major" placeholder="专业"></el-input>
			</el-form-item>
			<el-form-item label="专业方向" prop="majorDirection">
				<el-input v-model="dataForm.majorDirection" placeholder="专业方向"></el-input>
			</el-form-item>
			<el-form-item label="方案名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="方案名称"></el-input>
			</el-form-item>
			<el-form-item label="学制" prop="eduSystem">
				<ren-select v-model="dataForm.eduSystem" dict-type="edu_system" placeholder="学制"></ren-select>
			</el-form-item>
			<el-form-item label="开始学年" prop="startGrade">
				<ren-select v-model="dataForm.startGrade" dict-type="grade" placeholder="开始学年"></ren-select>
			</el-form-item>
			<el-form-item label="开始学期" prop="startTerm">
				<ren-select v-model="dataForm.startTerm" dict-type="term" placeholder="开始学期"></ren-select>
			</el-form-item>
			<el-form-item label="学期类型" prop="termType">
				<el-select v-model="dataForm.termType" placeholder="请选择">
					<el-option label="人人" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="修读类型" prop="courseType">
				<el-select v-model="dataForm.courseType" placeholder="请选择">
					<el-option label="人人" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="最少学分" prop="scoreMin">
				<el-input v-model="dataForm.scoreMin" placeholder="最少学分"></el-input>
			</el-form-item>
			<el-form-item label="学位" prop="academicDegree">
				<el-select v-model="dataForm.academicDegree" placeholder="请选择">
					<el-option label="人人" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="培养目标" prop="trainObjective">
				<el-input type="textarea" v-model="dataForm.trainObjective"></el-input>
			</el-form-item>
			<el-form-item label="修读要求" prop="readingRequirements">
				<el-input type="textarea" v-model="dataForm.readingRequirements"></el-input>
			</el-form-item>
			<el-form-item label="方案特色" prop="programFeatures">
				<el-input type="textarea" v-model="dataForm.programFeatures"></el-input>
			</el-form-item>
			<el-form-item label="主干学科" prop="majorDisciplines">
				<el-input type="textarea" v-model="dataForm.majorDisciplines"></el-input>
			</el-form-item>
			<el-form-item label="主干课程" prop="mainCourses">
				<el-input type="textarea" v-model="dataForm.mainCourses"></el-input>
			</el-form-item>
			<el-form-item label="主要专业实验" prop="mainProfessionalExperiments">
				<el-input type="textarea" v-model="dataForm.mainProfessionalExperiments"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<ren-select v-model="dataForm.status" dict-type="verify_status" placeholder="状态"></ren-select>
			</el-form-item>
		</el-form>
		<template v-slot:footer>
			<el-button @click="visible = false">{{ $t("cancel") }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	export default defineComponent({
		setup() {
			return reactive({
				visible: false,
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
					status: "",
					creator: "",
					createDate: "",
					updater: "",
					updateDate: "",
					number: "",
					level: ""
				}
			});
		},
		computed: {
			dataRule() {
				return {
					name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		methods: {
			init() {
				this.visible = true;
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/programme/caselist/" + this.dataForm.id).then((res) => {
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
					(!this.dataForm.id ? baseService.post : baseService.put)("/programme/caselist", this.dataForm).then((res) => {
						if (res.code !== 0) {
							return this.$message.error(res.msg);
						}
						this.$message({
							message: this.$t("prompt.success"),
							type: "success",
							duration: 500,
							onClose: () => {
								this.visible = false;
								this.$emit("refreshDataList");
							}
						});
					});
				});
			}
		}
	});
</script>