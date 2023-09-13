<template>
	<div>
		<div class="edit-card--file edit-card-page">
			<div class="aui-card-header">
				<el-button @click="goBack()"><el-icon>
						<ArrowLeft />
					</el-icon>返回</el-button>
				<el-button v-if="dataForm.status == null || dataForm.status == 2" type="primary" :loading="loading"
					@click="submitHandle()">{{ dataForm.status == 2 ? "重新" : "" }}提交</el-button>
				<el-button v-if="dataForm.status == 0" type="primary" :loading="loading"
					@click="verityHandle()">审核</el-button>
				<div style="margin-left: 20px">
					<el-tag v-if="dataForm.status == 0" type="warning">待审核</el-tag>
					<el-tag v-if="dataForm.status == 1" type="success">已通过</el-tag>
					<el-tag v-if="dataForm.status == 2" type="error">未通过</el-tag>
				</div>
			</div>
			<div class="edit-card__body">
				<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
					label-width="150px">
					<el-card shadow="naver" style="margin-bottom: 20px">
						<el-form-item label="" prop="userId">
							<el-button @click="selectHandle()" type="primary" size="large"
								v-if="!dataForm.id">选择学生</el-button>
						</el-form-item>
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="学号" prop="xh">
									<el-input size="large" readonly v-model="dataForm.xh" placeholder="学号"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="姓名" prop="username">
									<el-input size="large" readonly v-model="dataForm.username"
										placeholder="姓名"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="性别" prop="gender">
									<!-- <el-input size="large" readonly v-model="dataForm.gender" placeholder="性别"></el-input> -->
									<ren-select disabled size="large" v-model="dataForm.gender" dict-type="gender"
										placeholder="性别"></ren-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-card>
					<el-form-item label="" prop="">
						<el-link type="warning">注意：异动后院系等信息 请按照学院>专业>年级>班级顺序选择！按顺序选择后若无数据，请前往菜单 基础信息管理>>院系年级班级管理
							添加相关信息！</el-link>
					</el-form-item>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-card shadow="naver">
								<!-- <el-form-item label="原学校" prop="originalSchool">
								<el-input size="large" readonly v-model="dataForm.originalSchool" placeholder="原学校"></el-input>
							</el-form-item> -->
								<el-form-item label="原所在年级" prop="originalGrade">
									<el-input size="large" readonly v-model="dataForm.originalGrade"
										placeholder="原所在年级"></el-input>
								</el-form-item>
								<el-form-item label="原所属院系" prop="originalInstitute">
									<el-input size="large" readonly v-model="dataForm.originalInstitute"
										placeholder="原所属院系"></el-input>
								</el-form-item>
								<el-form-item label="原所属院系编号" prop="originalInstituteNo">
									<el-input size="large" readonly v-model="dataForm.originalInstituteNo"
										placeholder="原所属院系编号"></el-input>
								</el-form-item>
								<el-form-item label="原所在专业" prop="originalMajor">
									<el-input size="large" readonly v-model="dataForm.originalMajor"
										placeholder="原所在专业"></el-input>
								</el-form-item>
								<el-form-item label="原专业方向" prop="originalMajorDirection">
									<el-input size="large" readonly v-model="dataForm.originalMajorDirection"
										placeholder="原专业方向"></el-input>
								</el-form-item>
								<el-form-item label="原校区" prop="originalCampus">
									<ren-select size="large" disabled v-model="dataForm.originalCampus"
										dict-type="campus" placeholder="原校区"></ren-select>
								</el-form-item>
								<el-form-item label="原所属班级" prop="originalClass">
									<el-input size="large" readonly v-model="dataForm.originalClass"
										placeholder="原所属班级"></el-input>
								</el-form-item>
								<el-form-item label="原所属班级编号" prop="originalClassNo">
									<el-input size="large" readonly v-model="dataForm.originalClassNo"
										placeholder="原所属班级编号"></el-input>
								</el-form-item>
								<el-form-item label="原在籍状态" prop="originalXjStatus">
									<el-select size="large" disabled v-model="dataForm.originalXjStatus"
										placeholder="请选择">
										<el-option label="是" :value="1"></el-option>
										<el-option label="否" :value="0"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="原在校状态" prop="originalZxStatus">
									<el-select size="large" disabled v-model="dataForm.originalZxStatus"
										placeholder="请选择">
										<el-option label="是" :value="1"></el-option>
										<el-option label="否" :value="0"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否同步培养方案" prop="isSynchronousPlan">
									<ren-select :disabled="isReadonly" size="large" v-model="dataForm.isSynchronousPlan"
										dict-type="yesOrNo" placeholder="是否同步培养方案"></ren-select>
								</el-form-item>
								<el-form-item label="原培养方案" prop="originalPlan">
									<el-input size="large" readonly v-model="dataForm.originalPlan"
										placeholder="原培养方案"></el-input>
								</el-form-item>
							</el-card>
						</el-col>
						<el-col :span="12">
							<el-card shadow="naver">
								<!-- <el-form-item label="异动后学校" prop="changeSchool">
								<el-input :readonly="isReadonly" size="large" v-model="dataForm.changeSchool"
									placeholder="异动后学校"></el-input>
							</el-form-item> -->
								<el-form-item label="异动后校区" prop="changeCampus">
									<ren-select :disabled="isReadonly" size="large" v-model="dataForm.changeCampus"
										dict-type="campus" placeholder="异动后校区"></ren-select>
								</el-form-item>

								<el-form-item label="异动后院系" prop="changeInstitute">
									<ren-institute-tree v-if="!isReadonly" v-model="dataForm.changeInstituteNo"
										size="large" :deptName="dataForm.changeInstitute" placeholder="异动后院系"
										@change="instituteChange" nodekey="number"
										showType="select"></ren-institute-tree>
									<el-input v-else readonly size="large" v-model="dataForm.changeInstitute"
										placeholder="异动后院系"></el-input>
								</el-form-item>
								<el-form-item label="异动后院系编号" prop="changeInstituteNo">
									<el-input size="large" readonly v-model="dataForm.changeInstituteNo"
										placeholder="异动后院系编号"></el-input>
								</el-form-item>
								<el-form-item label="异动后专业" prop="changeMajor">
									<!-- <el-input size="large" v-model="dataForm.changeMajor" placeholder="异动后专业"></el-input> -->
									<el-select :disabled="isReadonly" v-model="dataForm.changeMajor" size="large"
										placeholder="专业">
										<el-option v-for="(item, index) in majorList" :key="index" :value="item.name"
											:label="item.name" @click="majorChange(item)"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="异动后年级" prop="changeGrade">
									<!-- <ren-select size="large" v-model="dataForm.changeGrade" dict-type="grade" placeholder="异动后年级"></ren-select> -->
									<el-select :disabled="isReadonly" v-model="dataForm.changeGrade" size="large"
										placeholder="年级">
										<el-option v-for="(item, index) in gradeList" :key="index" :value="item.name"
											:label="item.name" @click="gradeChange(item)"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="异动后方向" prop="changeMajorDirection">
									<el-input :readonly="isReadonly" size="large"
										v-model="dataForm.changeMajorDirection" placeholder="异动后方向"></el-input>
								</el-form-item>

								<el-form-item label="异动后班级" prop="changeClass">
									<!-- <el-input size="large" v-model="dataForm.changeClass" placeholder="异动后班级"></el-input> -->
									<el-select :disabled="isReadonly" v-model="dataForm.changeClass" size="large"
										placeholder="班级">
										<el-option v-for="(item, index) in classList" :key="index" :value="item.name"
											:label="item.name" @click="classChange(item)"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="异动后班级编号" prop="changeClassNo">
									<el-input size="large" readonly v-model="dataForm.changeClassNo"
										placeholder="异动后班级编号"></el-input>
								</el-form-item>
								<el-form-item label="异动后在籍状态" prop="changeXjStatus">
									<!-- <el-input size="large" v-model="dataForm.changeXjStatus" placeholder="异动后在籍状态"></el-input> -->
									<el-select :disabled="isReadonly" size="large" v-model="dataForm.changeXjStatus"
										placeholder="请选择">
										<el-option label="是" :value="1"></el-option>
										<el-option label="否" :value="0"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="异动后在校状态" prop="changeZxStatus">
									<!-- <el-input size="large" v-model="dataForm.changeZxStatus" placeholder="异动后在校状态"></el-input> -->
									<el-select :disabled="isReadonly" size="large" v-model="dataForm.changeZxStatus"
										placeholder="请选择">
										<el-option label="是" :value="1"></el-option>
										<el-option label="否" :value="0"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="异动日期" prop="changeDate">
									<el-date-picker :readonly="isReadonly" size="large" type="datetime"
										placeholder="异动日期" value-format="YYYY-MM-DD HH:mm:ss"
										v-model="dataForm.changeDate"></el-date-picker>
								</el-form-item>
								<el-form-item label="异动后培养方案" prop="changePlan">
									<el-input :readonly="isReadonly" size="large" v-model="dataForm.changePlan"
										placeholder="异动后培养方案"></el-input>
								</el-form-item>
							</el-card>
						</el-col>
					</el-row>

					<el-card shadow="naver" style="margin-top: 20px">
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="异动学年学期" prop="term">
									<el-select :disabled="isReadonly" v-model="dataForm.changeGradeTerm" size="large"
										placeholder="异动学年学期">
										<el-option v-for="(item, index) in gradeTermList" :key="index" :value="item.name"
											:label="item.name" @click="gradeTermChange(item)"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="审批文号" prop="approvalNumber">
									<el-input :readonly="isReadonly" size="large" v-model="dataForm.approvalNumber"
										placeholder="审批文号"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="异动类别" prop="changeCategory">
									<ren-select-data v-if="!isReadonly" size="large" v-model="dataForm.changeCategory"
										placeholder="请选择" selectLabel="name" selectValue="name"
										dataUrl="/student/changereason/page?status=1"></ren-select-data>
									<el-input readonly v-else size="large" v-model="dataForm.changeReason"
										placeholder="异动原因"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="异动原因" prop="changeReason">
									<el-input :readonly="isReadonly" size="large" type="textarea" :rows="5"
										v-model="dataForm.changeReason" placeholder="异动原因"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="24">
								<el-form-item label="异动说明" prop="changeDescription">
									<el-input :readonly="isReadonly" size="large" type="textarea" :rows="5"
										v-model="dataForm.changeDescription" placeholder="异动说明"></el-input>
								</el-form-item>
							</el-col>
							<!-- <el-col :span="8">
                <el-form-item label="审批日期" prop="approvalDate">
                  <el-date-picker :readonly="isReadonly" size="large" type="datetime" placeholder="审批日期" value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.approvalDate"></el-date-picker>
                </el-form-item>
              </el-col> -->
							<el-col :span="8">
								<el-form-item label="截止日期" prop="deadlineDate">
									<el-date-picker :readonly="isReadonly" size="large" type="datetime"
										placeholder="截止日期" value-format="YYYY-MM-DD HH:mm:ss"
										v-model="dataForm.deadlineDate"></el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
					</el-card>
					<el-card shadow="naver" style="margin-top: 20px" v-if="dataForm.status != null">
						<el-row :gutter="20">
							<el-col :span="8">
								<el-form-item label="状态" prop="status">
									<el-tag v-if="dataForm.status == 0" type="warning">待审核</el-tag>
									<el-tag v-if="dataForm.status == 1" type="success">已通过</el-tag>
									<el-tag v-if="dataForm.status == 2" type="error">未通过</el-tag>
								</el-form-item>
							</el-col>
							<el-col :span="16">
								<el-form-item label="审核意见:" prop="auditReason">
									<text>{{ dataForm.auditReason }}</text>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="审核时间:" prop="approvalDate">
									<text>{{ dataForm.approvalDate }}</text>
								</el-form-item>
							</el-col>
						</el-row>
					</el-card>
				</el-form>
			</div>
		</div>
		<student-dialog v-if="studentVisible" ref="studentDialog" @confirm="confirmSelect"></student-dialog>
		<vertify-dialog v-if="vertifyVisible" ref="vertifyDialogRef" @comfirm="comfirmVertify"></vertify-dialog>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import StudentDialog from "../dialog/student.vue";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import VertifyDialog from "../dialog/vertify-dialog.vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import dayjs from "dayjs";
	export default defineComponent({
		components: {
			StudentDialog,
			VertifyDialog
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				vertifyVisible: false,
				studentVisible: false,
				isReadonly: false,
				dataForm: {
					id: "",
					userId: "",
					term: "",
					status: null,
					approvalNumber: "",
					changeCategory: "",
					changeReason: "",
					changeDescription: "",
					xh: "",
					username: "",
					gender: "",
					// originalSchool: "",
					originalGrade: "",
					originalInstitute: "",
					originalInstituteNo: "",
					originalMajor: "",
					originalMajorDirection: "",
					originalCampus: "",
					originalClass: "",
					originalClassNo: "",
					originalXjStatus: "",
					originalZxStatus: "",
					changeGrade: "",
					changeInstitute: "",
					changeInstituteNo: "",
					changeMajor: "",
					changeMajorDirection: "",
					changeCampus: "",
					changeClass: "",
					changeClassNo: "",
					changeXjStatus: "",
					changeZxStatus: "",
					// changeSchool: "",
					changeDate: "",
					approvalDate: "",
					deadlineDate: "",
					isSynchronousPlan: "",
					originalPlan: "",
					changePlan: "",
					auditReason: "",
					// 异动学年学期
					changeGradeTerm: ""
				},
				majorList: [] as IObject[],
				gradeList: [] as IObject[],
				classList: [] as IObject[],
				gradeTermList: [] as IObject[]
			});
		},
		computed: {
			dataRule() {
				return {
					userId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					xh: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					username: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					// originalSchool: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalGrade: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalInstitute: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalInstituteNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalMajor: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalMajorDirection: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalCampus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalClass: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalClassNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalXjStatus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					originalZxStatus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeGrade: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					// changeSchool: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeInstitute: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeInstituteNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeMajor: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeMajorDirection: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeCampus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeClass: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeClassNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeXjStatus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					changeZxStatus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		activated() {
			this.init();
			console.log("init")
		},
		methods: {
			init() {
				this.isEdit = true;
				this.loading = false;
				this.isReadonly = false;
				let id = this.$route.query.id || "";
				if (id && id != "0") {
					this.dataForm.id = id;
				}
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					console.log(this.dataForm.id);
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/student/changerecord/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
					// 获取异动学年学期的数据, 根据id获取，若不需要请自行修改
					this.getGradeTermLists(this.dataForm.id);
					if (this.dataForm.status == 0 || this.dataForm.status == 1) {
						this.isReadonly = true;
					}
				});
			},
			// 学院变更
			instituteChange(data ?: IObject) {
				if (data) {
					this.dataForm.changeInstituteNo = data.number;
					this.dataForm.changeInstitute = data.name;
					// this.dataForm.majorNo = "";
					this.dataForm.changeMajor = "";
					this.dataForm.changeGrade = "";
					this.dataForm.changeClass = "";
					this.dataForm.changeClassNo = "";
					this.majorList = data.children;
				} else {
					this.dataForm.changeInstituteNo = "";
					this.dataForm.changeInstitute = "";
					// this.dataForm.majorNo = "";
					this.dataForm.changeMajor = "";
					this.dataForm.changeGrade = "";
					this.dataForm.changeClass = "";
					this.dataForm.changeClassNo = "";
					this.majorList = [];
				}
			},
			// 专业变更
			majorChange(data : IObject) {
				this.dataForm.changeGrade = "";
				this.dataForm.changeClass = "";
				this.dataForm.changeClassNo = "";
				this.gradeList = data.children;
			},
			// 获取异动学年学期的数据, 传入一个id，可以根据id查找
			getGradeTermLists(id) {
				// 发送请求获取数据或者其它方式获取都行
				// 没有接口，我用模拟的数据
				console.log("获取的异动学年学期数据：");
				this.gradeTermList = [
					{name: "选择一", id: 1},
					{name: "选择二", id: 2},
					{name: "选择三", id: 3},
					{name: "选择四", id: 4},
					{name: "选择五", id: 5}
				];
				console.log(this.gradeTermList);
			},
			// 异动学年学期变更
			gradeTermChange(data) {
				console.log(data);
				// 对dataForm对应的属性进行相应的修改
				this.dataForm.changeGradeTerm = data;
				console.log("选择的异动学年学期：", this.dataForm.changeGradeTerm);
			},
			// 选择学生
			selectHandle() {
				this.studentVisible = true;
				this.$nextTick(() => {
					this.$refs["studentDialog"].init("change");
				});
			},
			// 年级变更
			gradeChange(data : IObject) {
				this.dataForm.changeClass = "";
				this.dataForm.changeClassNo = "";
				this.classList = data.children;
			},
			// 班级变更
			classChange(data : IObject) {
				this.dataForm.changeClassNo = data.number;
			},
			confirmSelect(data : any) {
				console.log("data0--", data);
				this.dataForm = {
					...this.dataForm,
					userId: data.id,
					xh: data.xh,
					username: data.realName,
					gender: data.gender,
					// originalSchool: "漳州理工",
					originalGrade: data.grade,
					originalInstitute: data.institute,
					originalInstituteNo: data.instituteNo,
					originalMajor: data.major,
					originalMajorDirection: "暂无",
					originalCampus: data.campus,
					originalClass: data.className,
					originalClassNo: data.classNo,
					originalXjStatus: data.xjStatus,
					originalZxStatus: data.sfzx
				};
			},
			// 提交
			submitHandle() {
				let status = 0;
				this.dataFormSubmitHandle(status);
			},
			// 表单提交
			dataFormSubmitHandle(status : number) {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					let current = Date.now();
					this.loading = true;
					this.dataForm.status = status;
					if (status == 0) {
						this.dataForm.auditReason = "";
						this.dataForm.approvalDate = "";
					} else {
						this.dataForm.approvalDate = dayjs(this.dataForm.militaryDate).format("YYYY-MM-DD HH:mm:ss") || "";
					}
					(!this.dataForm.id ? baseService.post : baseService.put)("/student/changerecord", this.dataForm).then((res) => {
						if (res.code !== 0) {
							this.loading = false;
							return this.$message.error(res.msg);
						}
						if (status == 1) {
							// 审核通过后更新信息
							let postDate = {
								id: this.dataForm.userId,
								className: this.dataForm.changeClass,
								classNo: this.dataForm.changeClassNo,
								sfzj: this.dataForm.changeXjStatus,
								sfzx: this.dataForm.changeZxStatus,
								// xjStatus: this.dataForm.changeXjStatus,
								campus: this.dataForm.changeCampus,
								institute: this.dataForm.changeInstitute,
								instituteNo: this.dataForm.changeInstituteNo,
								major: this.dataForm.changeMajor,
								majorDirection: this.dataForm.changeMajorDirection
							};
							baseService.put("/student/student", postDate).then((res) => {
								if (res.code !== 0) {
									return this.$message.error(res.msg);
								}
							});
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
			// 审核
			verityHandle() {
				this.vertifyVisible = true;
				this.$nextTick(() => {
					this.$refs.vertifyDialogRef.init();
				});
			},
			comfirmVertify(status : number, value : string) {
				console.log("value---", status, value);
				// status 1 通过  2 不通过
				// this.dataForm.status = status;
				this.dataForm.auditReason = value;
				this.dataFormSubmitHandle(status);
			},
			goBack() {
				const activeTabName = this.store.state.activeTabName;
				const tabs = this.store.state.tabs;
				let index = findIndex(tabs, (x) => x.value === activeTabName);
				this.store.state.tabs.splice(index, 1);
				// this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
				this.store.state.activeTabName = "/student/changerecord";
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