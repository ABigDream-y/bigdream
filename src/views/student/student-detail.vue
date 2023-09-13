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
				<el-tab-pane label="学生基本信息" name="base">
					<div class="demo-tabs-item edit-card-page">
						<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef"
							@keyup.enter="dataFormSubmitHandle()" label-width="120px">
							<el-row :gutter="20">
								<el-col :span="24">
									<h3 class="info-h3">学生基本信息</h3>
								</el-col>
								<el-col :span="8">
									<el-form-item label="学生照片" prop="photo">
										<ren-upload v-model="dataForm.photo" :square="true"></ren-upload>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="学号" prop="xh">
										<el-input size="large" v-model="dataForm.xh" placeholder="学号"></el-input>
									</el-form-item>
									<el-form-item label="姓名" prop="realName">
										<el-input size="large" v-model="dataForm.realName" placeholder="姓名"></el-input>
									</el-form-item>
									<el-form-item label="性别" prop="gender">
										<ren-select size="large" v-model="dataForm.gender" dict-type="gender"
											placeholder="性别"></ren-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="曾用名" prop="formerName">
										<el-input size="large" v-model="dataForm.formerName"
											placeholder="曾用名"></el-input>
									</el-form-item>
									<el-form-item label="姓名拼音" prop="namePinyin">
										<el-input size="large" v-model="dataForm.namePinyin"
											placeholder="姓名拼音"></el-input>
									</el-form-item>
									<el-form-item label="出生日期" prop="birthday">
										<el-date-picker size="large" type="date" placeholder="出生日期"
											value-format="YYYY-MM-DD" v-model="dataForm.birthday"></el-date-picker>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="证件类型" prop="idCardType">
										<ren-select size="large" v-model="dataForm.idCardType" dict-type="id_card_type"
											placeholder="证件类型"></ren-select>
									</el-form-item>
									<el-form-item label="证件号" prop="idCard">
										<el-input size="large" v-model="dataForm.idCard" placeholder="证件号"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="电话" prop="mobile">
										<el-input size="large" v-model="dataForm.mobile" placeholder="电话"></el-input>
									</el-form-item>
									<el-form-item label="国家地区" prop="area">
										<el-input size="large" v-model="dataForm.area" placeholder="国家地区"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="民族" prop="nation">
										<ren-select size="large" v-model="dataForm.nation" dict-type="nation"
											placeholder="民族"></ren-select>
									</el-form-item>
									<el-form-item label="籍贯" prop="nativePlace">
										<el-input size="large" v-model="dataForm.nativePlace"
											placeholder="籍贯"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="24">
									<h3 class="info-h3">学校学生信息</h3>
								</el-col>
								<el-col :span="8">
									<el-form-item label="校区" prop="campus">
										<ren-select size="large" v-model="dataForm.campus" dict-type="campus"
											placeholder="校区"></ren-select>
									</el-form-item>
									<el-form-item label="学院" prop="institute">
										<el-input size="large" v-model="dataForm.institute" placeholder="学院"></el-input>
									</el-form-item>
									<el-form-item label="学院编号" prop="instituteNo">
										<el-input size="large" v-model="dataForm.instituteNo"
											placeholder="学院编号"></el-input>
									</el-form-item>
									<el-form-item label="专业" prop="major">
										<el-input size="large" v-model="dataForm.major" placeholder="专业"></el-input>
									</el-form-item>
									<el-form-item label="专业方向" prop="majorDirection">
										<el-input size="large" v-model="dataForm.majorDirection"
											placeholder="专业方向"></el-input>
									</el-form-item>
									<el-form-item label="年级" prop="grade">
										<ren-select size="large" v-model="dataForm.grade" dict-type="grade"
											placeholder="年级"></ren-select>
									</el-form-item>
									<el-form-item label="班级" prop="class">
										<el-input size="large" v-model="dataForm.class" placeholder="班级"></el-input>
									</el-form-item>
									<el-form-item label="班级编号" prop="classNo">
										<el-input size="large" v-model="dataForm.classNo" placeholder="班级编号"></el-input>
									</el-form-item>
									<el-form-item label="培养层次" prop="pycc">
										<ren-select size="large" v-model="dataForm.pycc" dict-type="pycc"
											placeholder="培养层次"></ren-select>
									</el-form-item>
									<el-form-item label="学制" prop="eduSystem">
										<ren-select size="large" v-model="dataForm.eduSystem" dict-type="edu_system"
											placeholder="学制"></ren-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="是否在籍" prop="sfzj">
										<ren-select size="large" v-model="dataForm.sfzj" dict-type="yesOrNo"
											placeholder="是否在籍"></ren-select>
									</el-form-item>
									<el-form-item label="是否在校" prop="sfzx">
										<ren-select size="large" v-model="dataForm.sfzx" dict-type="yesOrNo"
											placeholder="是否在校"></ren-select>
									</el-form-item>
									<el-form-item label="学籍状态" prop="xjStatus">
										<ren-select size="large" v-model="dataForm.xjStatus" dict-type="yesOrNo"
											placeholder="学籍状态"></ren-select>
									</el-form-item>
									<el-form-item label="学位证号" prop="degreeCertificateNumber">
										<el-input size="large" v-model="dataForm.degreeCertificateNumber"
											placeholder="学位证号"></el-input>
									</el-form-item>
									<el-form-item label="高考成绩" prop="examinationScore">
										<el-input size="large" v-model="dataForm.examinationScore"
											placeholder="高考成绩"></el-input>
									</el-form-item>
									<el-form-item label="考生号" prop="examineeNumber">
										<el-input size="large" v-model="dataForm.examineeNumber"
											placeholder="考生号"></el-input>
									</el-form-item>
									<el-form-item label="入学年级" prop="schoolYear">
										<ren-select size="large" v-model="dataForm.schoolYear" dict-type="grade"
											placeholder="入学年级"></ren-select>
									</el-form-item>
									<el-form-item label="入学日期" prop="schoolDate">
										<el-date-picker size="large" type="datetime" placeholder="入学日期"
											value-format="YYYY-MM-DD HH:mm:ss"
											v-model="dataForm.schoolDate"></el-date-picker>
									</el-form-item>
									<el-form-item label="招生季度" prop="enrollmentQuarter">
										<ren-select size="large" v-model="dataForm.enrollmentQuarter"
											dict-type="enrollment_quarter" placeholder="招生季度"></ren-select>
									</el-form-item>
									<el-form-item label="特殊学生类型" prop="specialStudentType">
										<ren-select size="large" v-model="dataForm.specialStudentType"
											dict-type="special_stu_type" placeholder="特殊学生类型"></ren-select>
									</el-form-item>

								</el-col>
								<el-col :span="8">
									<el-form-item label="外语种类" prop="languagesType">
										<ren-select size="large" v-model="dataForm.languagesType"
											dict-type="language_type" placeholder="外语种类"></ren-select>
									</el-form-item>
									<el-form-item label="学生类别" prop="studentCategory">
										<ren-select size="large" v-model="dataForm.studentCategory"
											dict-type="student_type" placeholder="学生类别"></ren-select>
									</el-form-item>
									<el-form-item label="宿舍号" prop="dormitoryNumber">
										<el-input size="large" v-model="dataForm.dormitoryNumber"
											placeholder="宿舍号"></el-input>
									</el-form-item>
									<el-form-item label="学位授予时间" prop="degreeAwardDate">
										<el-date-picker size="large" type="datetime" placeholder="学位授予时间"
											value-format="YYYY-MM-DD HH:mm:ss"
											v-model="dataForm.degreeAwardDate"></el-date-picker>
									</el-form-item>
									<el-form-item label="是否授予学位" prop="degreeAwardedOrNot">
										<ren-select size="large" v-model="dataForm.degreeAwardedOrNot"
											dict-type="yesOrNo" placeholder="是否授予学位"></ren-select>
									</el-form-item>
									<el-form-item label="授予学位" prop="graduate">
										<el-input size="large" v-model="dataForm.graduate"
											placeholder="授予学位"></el-input>
									</el-form-item>
									<el-form-item label="毕结业结论" prop="conclusionOfGraduation">
										<el-input size="large" v-model="dataForm.conclusionOfGraduation"
											placeholder="毕结业结论"></el-input>
									</el-form-item>
									<el-form-item label="毕结业时间" prop="completionTime">
										<el-date-picker size="large" type="datetime" placeholder="毕结业时间"
											value-format="YYYY-MM-DD HH:mm:ss"
											v-model="dataForm.completionTime"></el-date-picker>
									</el-form-item>
									<el-form-item label="毕结业证书号" prop="completionCertificateNumber">
										<el-input size="large" v-model="dataForm.completionCertificateNumber"
											placeholder="毕结业证书号"></el-input>
									</el-form-item>
									<el-form-item label="预计毕业年月" prop="expectedGraduationDate">
										<el-date-picker size="large" type="datetime" placeholder="预计毕业年月"
											value-format="YYYY-MM-DD HH:mm:ss"
											v-model="dataForm.expectedGraduationDate"></el-date-picker>
									</el-form-item>
									<el-form-item label="结业证书号" prop="finishCertificateNumber">
										<el-input size="large" v-model="dataForm.finishCertificateNumber"
											placeholder="结业证书号"></el-input>
									</el-form-item>
								</el-col>

								<el-col :span="24">
									<h3 class="info-h3">其他信息</h3>
								</el-col>
								<el-col :span="8">
									<el-form-item label="通讯地址" prop="mailAddress">
										<el-input size="large" v-model="dataForm.mailAddress"
											placeholder="通讯地址"></el-input>
									</el-form-item>
									<el-form-item label="电子信箱" prop="email">
										<el-input size="large" v-model="dataForm.email" placeholder="电子信箱"></el-input>
									</el-form-item>
									<el-form-item label="火车到站" prop="trainArrival">
										<el-input size="large" v-model="dataForm.trainArrival"
											placeholder="火车到站"></el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="银行账号" prop="bankAccount">
										<el-input size="large" v-model="dataForm.bankAccount"
											placeholder="银行账号"></el-input>
									</el-form-item>
									<el-form-item label="政治面貌" prop="politicalOutlook">
										<ren-select size="large" v-model="dataForm.politicalOutlook"
											dict-type="political_outlook" placeholder="政治面貌"></ren-select>
									</el-form-item>
									<el-form-item label="婚姻状况" prop="maritalStatus">
										<ren-select size="large" v-model="dataForm.maritalStatus"
											dict-type="marital_status" placeholder="婚姻状况"></ren-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="邮政编码" prop="postalCode">
										<el-input size="large" v-model="dataForm.postalCode"
											placeholder="邮政编码"></el-input>
									</el-form-item>
									<el-form-item label="血型" prop="bloodType">
										<ren-select size="large" v-model="dataForm.bloodType" dict-type="blood_type"
											placeholder="血型"></ren-select>
									</el-form-item>
									<el-form-item label="状态" prop="status">
										<ren-select size="large" v-model="dataForm.status" dict-type="yesOrNo"
											placeholder="状态"></ren-select>
									</el-form-item>
								</el-col>
								<el-col :span="20">
									<el-form-item label="学生备注" prop="remark">
										<el-input size="large" type="textarea" :rows="6" v-model="dataForm.remark"
											placeholder="学生备注"></el-input>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
				</el-tab-pane>
				<el-tab-pane label="监护人信息" name="guardian">
					<div class="demo-tabs-item">
						<guardian ref="guardian" :userId="dataForm.id"></guardian>
					</div>
				</el-tab-pane>
				<el-tab-pane label="教育经历" name="education">
					<div class="demo-tabs-item">
						<education ref="education" :userId="dataForm.id"></education>
					</div>
				</el-tab-pane>
				<el-tab-pane label="家庭成员" name="family">
					<div class="demo-tabs-item">
						<family ref="family" :userId="dataForm.id"></family>
					</div>
				</el-tab-pane>
				<el-tab-pane label="家庭住址" name="familyaddress">
					<div class="demo-tabs-item">
						<familyaddress ref="familyaddress" :userId="dataForm.id"></familyaddress>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import guardian from "./guardian.vue";
	import education from "./education.vue";
	import family from "./family.vue";
	import familyaddress from "./familyaddress.vue";
	export default defineComponent({
		components:{
			guardian,
			education,
			family,
			familyaddress
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				activeName: 'base',
				dataForm: {
					id: "",
					xh: "",
					photo: "",
					area: "",
					formerName: "",
					realName: "",
					namePinyin: "",
					gender: "",
					birthday: "",
					idCardType: "",
					idCard: "",
					nation: "",
					nativePlace: "",
					politicalOutlook: "",
					maritalStatus: "",
					postalCode: "",
					mobile: "",
					bloodType: "",
					mailAddress: "",
					email: "",
					trainArrival: "",
					bankAccount: "",
					class: "",
					classNo: "",
					remark: "",
					pycc: "",
					sfzj: "",
					sfzx: "",
					xjStatus: "",
					eduSystem: "",
					campus: "",
					institute: "",
					instituteNo: "",
					major: "",
					majorDirection: "",
					grade: "",
					degreeCertificateNumber: "",
					degreeAwardDate: "",
					degreeAwardedOrNot: "",
					graduate: "",
					conclusionOfGraduation: "",
					completionTime: "",
					completionCertificateNumber: "",
					expectedGraduationDate: "",
					finishCertificateNumber: "",
					examinationScore: "",
					examineeNumber: "",
					schoolYear: "",
					schoolDate: "",
					enrollmentQuarter: "",
					specialStudentType: "",
					languagesType: "",
					studentCategory: "",
					dormitoryNumber: "",
					status: "",
					creator: "",
					createDate: "",
					updater: "",
					updateDate: "",
				} as IObject
			});
		},
		computed: {
			dataRule() {
				return {
					xh: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					realName: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					gender: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					idCard: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					status: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
				this.activeName = 'base';
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/student/student/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;

					for (let key in this.dataForm) {
						if (this.dataForm[key] == null) {
							this.dataForm[key] = "";
						}
					}
				});
			},
			handleClick(tab : any) {
				let index = tab.index;
				let name = tab.props.name;
				this.activeName = name;
				this.$nextTick(() => {
					this.$refs[name].init(this.dataForm.id);
				});
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/student/student", this.dataForm).then((res) => {
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
<style scoped lang="scss">
	.info-h3 {
		margin-top: 0;
	}

	.info-p {
		margin-top: 0px;
		font-size: 12px;
		color: gray;
	}

	.user-upload {
		display: flex;
		align-items: center;
	}
</style>