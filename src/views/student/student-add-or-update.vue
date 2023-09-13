<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
		:close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
			label-width="120px">
			<el-form-item label="学号" prop="xh">
				<el-input v-model="dataForm.xh" placeholder="学号"></el-input>
			</el-form-item>
			<el-form-item label="学生照片" prop="photo">
				<el-input v-model="dataForm.photo" placeholder="学生照片"></el-input>
			</el-form-item>
			<el-form-item label="国家地区" prop="area">
				<el-input v-model="dataForm.area" placeholder="国家地区"></el-input>
			</el-form-item>
			<el-form-item label="曾用名" prop="formerName">
				<el-input v-model="dataForm.formerName" placeholder="曾用名"></el-input>
			</el-form-item>
			<el-form-item label="姓名" prop="realName">
				<el-input v-model="dataForm.realName" placeholder="姓名"></el-input>
			</el-form-item>
			<el-form-item label="姓名拼音" prop="namePinyin">
				<el-input v-model="dataForm.namePinyin" placeholder="姓名拼音"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="gender">
				<ren-select v-model="dataForm.gender" dict-type="gender" placeholder="性别"></ren-select>
			</el-form-item>
			<el-form-item label="出生日期" prop="birthday">
				<el-date-picker type="date" placeholder="出生日期" value-format="YYYY-MM-DD"
					v-model="dataForm.birthday"></el-date-picker>
			</el-form-item>
			<el-form-item label="证件类型" prop="idCardType">
				<ren-select v-model="dataForm.idCardType" dict-type="id_card_type" placeholder="证件类型"></ren-select>
			</el-form-item>
			<el-form-item label="证件号" prop="idCard">
				<el-input v-model="dataForm.idCard" placeholder="证件号"></el-input>
			</el-form-item>
			<el-form-item label="民族" prop="nation">
				<ren-select v-model="dataForm.nation" dict-type="nation" placeholder="民族"></ren-select>
			</el-form-item>
			<el-form-item label="籍贯" prop="nativePlace">
				<el-input v-model="dataForm.nativePlace" placeholder="籍贯"></el-input>
			</el-form-item>
			<el-form-item label="政治面貌" prop="politicalOutlook">
				<ren-select v-model="dataForm.politicalOutlook" dict-type="political_outlook"
					placeholder="政治面貌"></ren-select>
			</el-form-item>
			<el-form-item label="婚姻状况" prop="maritalStatus">
				<ren-select v-model="dataForm.maritalStatus" dict-type="marital_status" placeholder="婚姻状况"></ren-select>
			</el-form-item>
			<el-form-item label="邮政编码" prop="postalCode">
				<el-input v-model="dataForm.postalCode" placeholder="邮政编码"></el-input>
			</el-form-item>
			<el-form-item label="电话" prop="mobile">
				<el-input v-model="dataForm.mobile" placeholder="电话"></el-input>
			</el-form-item>
			<el-form-item label="血型" prop="bloodType">
				<ren-select v-model="dataForm.bloodType" dict-type="blood_type" placeholder="血型"></ren-select>
			</el-form-item>
			<el-form-item label="通讯地址" prop="mailAddress">
				<el-input v-model="dataForm.mailAddress" placeholder="通讯地址"></el-input>
			</el-form-item>
			<el-form-item label="电子信箱" prop="email">
				<el-input v-model="dataForm.email" placeholder="电子信箱"></el-input>
			</el-form-item>
			<el-form-item label="火车到站" prop="trainArrival">
				<el-input v-model="dataForm.trainArrival" placeholder="火车到站"></el-input>
			</el-form-item>
			<el-form-item label="银行账号" prop="bankAccount">
				<el-input v-model="dataForm.bankAccount" placeholder="银行账号"></el-input>
			</el-form-item>
			<el-form-item label="班级" prop="class">
				<el-input v-model="dataForm.class" placeholder="班级"></el-input>
			</el-form-item>
			<el-form-item label="班级编号" prop="classNo">
				<el-input v-model="dataForm.classNo" placeholder="班级编号"></el-input>
			</el-form-item>
			<el-form-item label="学生备注" prop="remark">
				<el-input v-model="dataForm.remark" placeholder="学生备注"></el-input>
			</el-form-item>
			<el-form-item label="培养层次" prop="pycc">
				<ren-select v-model="dataForm.pycc" dict-type="pycc" placeholder="培养层次"></ren-select>
			</el-form-item>
			<el-form-item label="是否在籍 0否 1是" prop="sfzj">
				<ren-select v-model="dataForm.sfzj" dict-type="yesOrNo" placeholder="是否在籍 0否 1是"></ren-select>
			</el-form-item>
			<el-form-item label="是否在校 0否 1是" prop="sfzx">
				<ren-select v-model="dataForm.sfzx" dict-type="yesOrNo" placeholder="是否在校 0否 1是"></ren-select>
			</el-form-item>
			<el-form-item label="学籍状态" prop="xjStatus">
				<ren-select v-model="dataForm.xjStatus" dict-type="yesOrNo" placeholder="学籍状态"></ren-select>
			</el-form-item>
			<el-form-item label="学制" prop="eduSystem">
				<ren-select v-model="dataForm.eduSystem" dict-type="edu_system" placeholder="学制"></ren-select>
			</el-form-item>
			<el-form-item label="校区" prop="campus">
				<ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
			</el-form-item>
			<el-form-item label="学院" prop="institute">
				<el-input v-model="dataForm.institute" placeholder="学院"></el-input>
			</el-form-item>
			<el-form-item label="学院编号" prop="instituteNo">
				<el-input v-model="dataForm.instituteNo" placeholder="学院编号"></el-input>
			</el-form-item>
			<el-form-item label="专业" prop="major">
				<el-input v-model="dataForm.major" placeholder="专业"></el-input>
			</el-form-item>
			<el-form-item label="专业方向" prop="majorDirection">
				<el-input v-model="dataForm.majorDirection" placeholder="专业方向"></el-input>
			</el-form-item>
			<el-form-item label="年级" prop="grade">
				<ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
			</el-form-item>
			<el-form-item label="学位证号" prop="degreeCertificateNumber">
				<el-input v-model="dataForm.degreeCertificateNumber" placeholder="学位证号"></el-input>
			</el-form-item>
			<el-form-item label="学位授予时间" prop="degreeAwardDate">
				<el-date-picker type="datetime" placeholder="学位授予时间" value-format="YYYY-MM-DD HH:mm:ss"
					v-model="dataForm.degreeAwardDate"></el-date-picker>
			</el-form-item>
			<el-form-item label="是否授予学位 0否 1是" prop="degreeAwardedOrNot">
				<ren-select v-model="dataForm.degreeAwardedOrNot" dict-type="yesOrNo"
					placeholder="是否授予学位 0否 1是"></ren-select>
			</el-form-item>
			<el-form-item label="授予学位" prop="graduate">
				<el-input v-model="dataForm.graduate" placeholder="授予学位"></el-input>
			</el-form-item>
			<el-form-item label="毕结业结论" prop="conclusionOfGraduation">
				<el-input v-model="dataForm.conclusionOfGraduation" placeholder="毕结业结论"></el-input>
			</el-form-item>
			<el-form-item label="毕结业时间" prop="completionTime">
				<el-date-picker type="datetime" placeholder="毕结业时间" value-format="YYYY-MM-DD HH:mm:ss"
					v-model="dataForm.completionTime"></el-date-picker>
			</el-form-item>
			<el-form-item label="毕结业证书号" prop="completionCertificateNumber">
				<el-input v-model="dataForm.completionCertificateNumber" placeholder="毕结业证书号"></el-input>
			</el-form-item>
			<el-form-item label="预计毕业年月" prop="expectedGraduationDate">
				<el-date-picker type="datetime" placeholder="预计毕业年月" value-format="YYYY-MM-DD HH:mm:ss"
					v-model="dataForm.expectedGraduationDate"></el-date-picker>
			</el-form-item>
			<el-form-item label="结业证书号" prop="finishCertificateNumber">
				<el-input v-model="dataForm.finishCertificateNumber" placeholder="结业证书号"></el-input>
			</el-form-item>
			<el-form-item label="高考成绩" prop="examinationScore">
				<el-input v-model="dataForm.examinationScore" placeholder="高考成绩"></el-input>
			</el-form-item>
			<el-form-item label="考生号" prop="examineeNumber">
				<el-input v-model="dataForm.examineeNumber" placeholder="考生号"></el-input>
			</el-form-item>
			<el-form-item label="入学年级" prop="schoolYear">
				<ren-select v-model="dataForm.schoolYear" dict-type="grade" placeholder="入学年级"></ren-select>
			</el-form-item>
			<el-form-item label="入学日期" prop="schoolDate">
				<el-date-picker type="datetime" placeholder="入学日期" value-format="YYYY-MM-DD HH:mm:ss"
					v-model="dataForm.schoolDate"></el-date-picker>
			</el-form-item>
			<el-form-item label="招生季度" prop="enrollmentQuarter">
				<ren-select v-model="dataForm.enrollmentQuarter" dict-type="enrollment_quarter"
					placeholder="招生季度"></ren-select>
			</el-form-item>
			<el-form-item label="特殊学生类型" prop="specialStudentType">
				<ren-select v-model="dataForm.specialStudentType" dict-type="special_stu_type"
					placeholder="特殊学生类型"></ren-select>
			</el-form-item>
			<el-form-item label="外语种类" prop="languagesType">
				<ren-select v-model="dataForm.languagesType" dict-type="language_type" placeholder="外语种类"></ren-select>
			</el-form-item>
			<el-form-item label="学生类别" prop="studentCategory">
				<ren-select v-model="dataForm.studentCategory" dict-type="student_type" placeholder="学生类别"></ren-select>
			</el-form-item>
			<el-form-item label="宿舍号" prop="dormitoryNumber">
				<el-input v-model="dataForm.dormitoryNumber" placeholder="宿舍号"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<ren-select v-model="dataForm.status" dict-type="yesOrNo" placeholder="状态"></ren-select>
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
				}
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
				baseService.get("/student/student/" + this.dataForm.id).then((res) => {
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
					(!this.dataForm.id ? baseService.post : baseService.put)("/student/student", this.dataForm).then((res) => {
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