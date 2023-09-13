<template>
	<div class="edit-card--file">
		<div class="aui-tab-header" style="z-index:999;">
			<el-button @click="goBack()">
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回
			</el-button>
		</div>
		<div class="aui-tab-body">
			<el-tabs v-model="activeName" tab-position="top" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="基本信息" name="base">
					<div class="demo-tabs-item edit-card-page">
						<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="120px">
							<h3 class="info-h3">
								<span style="margin-right:15px;">基本信息</span>
								<el-tag size="large" v-if="dataForm.status == 2">待审核</el-tag>
								<el-tag type="danger" v-if="dataForm.status == 3">未通过</el-tag>
								<el-tag type="success" v-if="dataForm.status == 1">已通过</el-tag>
								<el-tag type="info" v-if="dataForm.status == 0">待提交</el-tag>
							</h3>
							<el-row :gutter="20">
								<el-col :span="8">
									<el-form-item label="方案名称" prop="name">
										{{dataForm.name}}
									</el-form-item>
									<el-form-item label="学制" prop="eduSystem">
										{{ getDictLabelHandle("edu_system", dataForm.eduSystem) }}
									</el-form-item>
									<el-form-item label="学位" prop="academicDegree">
										{{ getDictLabelHandle("degree_type", dataForm.academicDegree) }}
									</el-form-item>
									<el-form-item label="最少学分" prop="scoreMin">
										{{dataForm.scoreMin}}分
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="学院" prop="instituteNo">
										{{dataForm.institute}}
										<!-- <ren-institute-tree disabled v-model="dataForm.instituteNo" :deptName="dataForm.institute"
											@change="instituteChange" size="large" placeholder="学院" nodekey="number"
											showType="select"></ren-institute-tree> -->
									</el-form-item>
									<el-form-item label="专业" prop="major">
										{{dataForm.major}}
										<!-- <el-select v-model="dataForm.major" size="large" placeholder="专业">
											<el-option @click="majorChange(item)" v-for="(item,index) in majorList" :key="index"
												:value="item.name" :label="item.name"></el-option>
										</el-select> -->
									</el-form-item>
									<el-form-item label="年级" prop="grade">
										{{dataForm.grade}}
										<!-- <el-select v-model="dataForm.grade" size="large" placeholder="年级">
											<el-option v-for="(item, index) in gradeList" :key="index" :value="item.name"
												:label="item.name"></el-option>
										</el-select> -->
									</el-form-item>
									<el-form-item label="专业方向" prop="majorDirection">
										{{dataForm.majorDirection}}
										<!-- <el-input v-model="dataForm.majorDirection" size="large" placeholder="专业方向"></el-input> -->
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="开始学年" prop="startGrade">
										{{ getDictLabelHandle("school_year", dataForm.startGrade) }}
									</el-form-item>
									<el-form-item label="开始学期" prop="startTerm">
										{{ getDictLabelHandle("term", dataForm.startTerm) }}
									</el-form-item>
									<el-form-item label="学期类型" prop="termType">
										{{ getDictLabelHandle("term_type", dataForm.termType) }}
									</el-form-item>
									<el-form-item label="修读类型" prop="courseType">
										{{ getDictLabelHandle("course_category", dataForm.courseType) }}
									</el-form-item>
								</el-col>
							</el-row>
							<h3>其他信息</h3>
							<el-form-item label="培养目标" prop="trainObjective">
								<el-input readonly type="textarea" size="large" v-model="dataForm.trainObjective" :rows="5"
									show-word-limit maxlength="255"></el-input>
							</el-form-item>
							<el-form-item label="修读要求" prop="readingRequirements">
								<el-input readonly type="textarea" size="large" v-model="dataForm.readingRequirements" :rows="5"
									show-word-limit maxlength="255"></el-input>
							</el-form-item>
							<el-form-item label="方案特色" prop="programFeatures">
								<el-input readonly type="textarea" size="large" v-model="dataForm.programFeatures" :rows="5"
									show-word-limit maxlength="255"></el-input>
							</el-form-item>
							<el-form-item label="主干学科" prop="majorDisciplines">
								<el-input readonly type="textarea" size="large" v-model="dataForm.majorDisciplines" :rows="5"
									show-word-limit maxlength="255"></el-input>
							</el-form-item>
							<el-form-item label="主干课程" prop="mainCourses">
								<el-input readonly type="textarea" size="large" v-model="dataForm.mainCourses" :rows="5"
									show-word-limit maxlength="255"></el-input>
							</el-form-item>
							<el-form-item label="主要专业实验" prop="mainProfessionalExperiments">
								<el-input readonly type="textarea" size="large" v-model="dataForm.mainProfessionalExperiments"
									:rows="5" show-word-limit maxlength="255"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</el-tab-pane>
				<el-tab-pane label="课组课程" name="groupcourse">
					<div class="demo-tabs-item">
						<groupcourse :caseInfo="dataForm" ref="groupcourse" :isAllowEdit="isAllowEdit"></groupcourse>
					</div>
				</el-tab-pane>
				<el-tab-pane label="课程列表" name="casegroupcourse">
					<div class="demo-tabs-item">
						<casegroupcourse :caseInfo="dataForm" ref="casegroupcourse" :isAllowEdit="isAllowEdit" :showAdd="true"></casegroupcourse>
					</div>
				</el-tab-pane>
				<el-tab-pane label="指导计划" name="guidancePlan">
					<div class="demo-tabs-item">
						<guidancePlan ref="guidancePlan" :caseInfo="dataForm"></guidancePlan>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts">
	import { getDictLabel } from "@/utils/utils";
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import groupcourse from "./groupcourse.vue";
	// import casegroupcourse from "./casegroupcourse.vue";
	// 课程列表变更
	import casegroupcourse from "./coursecase.vue";
	import guidancePlan from "./guidanceplan.vue";
	export default defineComponent({
		components: {
			groupcourse,
			casegroupcourse,
			guidancePlan
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				majorList: [] as IObject[],
				activeName: 'base',
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
					updateDate: "",
				},
				courseData: []
			});
		},
		computed: {
			dataRule() {
				return {
					// name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
				this.isAllowEdit = false;
				this.loading = false;
				let id = this.$route.query.id || '';
				console.log("id：", id);
				if (id && id != '0') {
					this.dataForm.id = id;
				}
				console.log(this.dataForm.id)
				this.activeName = 'base';
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			handleClick(tab : any) {
				let index = tab.index;
				let name = tab.props.name;
				this.activeName = name;
				// console.log('name',name)
				this.$nextTick(() => {
					console.log(this.dataForm.id);
					if(name != "base") {
						this.$refs[name].init(this.dataForm.id);
					}
					
				});
			},
			getDictLabelHandle(dictType : string, dictValue : number) {
				return getDictLabel(this.store.state.dicts, dictType, dictValue);
			},
			// 获取信息
			getInfo() {
				baseService.get("/programme/caselist/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
					if(this.dataForm.status == 1 || this.dataForm.status == 2) {
						this.isAllowEdit = false;
					}else {
						this.isAllowEdit = true;
					}
				});
			},
			// 学院变更
			instituteChange(data ?: IObject) {
				if (data) {
					this.dataForm.instituteNo = data.number;
					this.dataForm.institute = data.name;
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.majorList = data.children;
				} else {
					this.dataForm.instituteNo = "";
					this.dataForm.institute = "";
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.majorList = [];
				}
			},
			// 表单提交
			dataFormSubmitHandle(status : number) {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					this.loading = true;
					let postData = JSON.parse(JSON.stringify(this.dataForm));
					postData['status'] = status;
					(!this.dataForm.id ? baseService.post : baseService.put)("/programme/caselist", postData).then((res) => {
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

<style scoped>
	:deep(.mod-programme__groupcourse .el-card__body) {
		padding: 10px;
	}
</style>