<template>
  <div class="edit-card--file edit-card-page">
    <div class="aui-card-header">
      <el-button @click="goBack()"
        ><el-icon> <ArrowLeft /> </el-icon>返回</el-button
      >
      <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </div>
    <div class="edit-card__body">
      <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="24">
            <h3 class="info-h3">学生基本信息</h3>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生照片" prop="photo">
              <ren-upload v-model="dataForm.photo" :square="true" :cover="dataForm.photo"></ren-upload>
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
              <ren-select size="large" v-model="dataForm.gender" dict-type="gender" placeholder="性别"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="曾用名" prop="formerName">
              <el-input size="large" v-model="dataForm.formerName" placeholder="曾用名"></el-input>
            </el-form-item>
            <el-form-item label="姓名拼音" prop="namePinyin">
              <el-input size="large" v-model="dataForm.namePinyin" placeholder="姓名拼音"></el-input>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker size="large" type="date" placeholder="出生日期" value-format="YYYY-MM-DD" v-model="dataForm.birthday"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型" prop="idCardType">
              <ren-select size="large" v-model="dataForm.idCardType" dict-type="id_card_type" placeholder="证件类型"></ren-select>
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
              <ren-select size="large" v-model="dataForm.nation" dict-type="nation" placeholder="民族"></ren-select>
            </el-form-item>
            <el-form-item label="籍贯" prop="nativePlace">
              <el-input size="large" v-model="dataForm.nativePlace" placeholder="籍贯"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <h3 class="info-h3">学校学生信息</h3>
          </el-col>
          <el-col :span="8">
            <el-form-item label="校区" prop="campus">
              <ren-select size="large" v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
            </el-form-item>
            <el-form-item label="学院" prop="instituteNo">
              <ren-institute-tree v-model="dataForm.instituteNo" size="large" :deptName="dataForm.institute" @change="instituteChange" placeholder="学院" nodekey="number" showType="select"></ren-institute-tree>
            </el-form-item>
            <el-form-item label="专业" prop="major">
              <el-select v-model="dataForm.major" size="large" placeholder="专业">
                <el-option v-for="(item, index) in majorList" :key="index" :value="item.name" :label="item.name" @click="majorChange(item)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级" prop="grade">
              <el-select v-model="dataForm.grade" size="large" placeholder="年级">
                <el-option v-for="(item, index) in gradeList" :key="index" :value="item.name" :label="item.name" @click="gradeChange(item)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级" prop="className">
              <el-select v-model="dataForm.className" size="large" placeholder="班级">
                <el-option v-for="(item, index) in classList" :key="index" :value="item.name" :label="item.name" @click="classChange(item)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="培养层次" prop="pycc">
              <ren-select size="large" v-model="dataForm.pycc" dict-type="pycc" placeholder="培养层次"></ren-select>
            </el-form-item>
            <el-form-item label="学制" prop="eduSystem">
              <ren-select size="large" v-model="dataForm.eduSystem" dict-type="edu_system" placeholder="学制"></ren-select>
            </el-form-item>
            <el-form-item label="入学年级" prop="schoolYear">
              <ren-select size="large" v-model="dataForm.schoolYear" dict-type="grade" placeholder="入学年级"></ren-select>
            </el-form-item>
            <el-form-item label="入学日期" prop="schoolDate">
              <el-date-picker size="large" type="datetime" placeholder="入学日期" value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.schoolDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="招生季度" prop="enrollmentQuarter">
              <ren-select size="large" v-model="dataForm.enrollmentQuarter" dict-type="enrollment_quarter" placeholder="招生季度"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学位证号" prop="degreeCertificateNumber">
              <el-input size="large" v-model="dataForm.degreeCertificateNumber" placeholder="学位证号"></el-input>
            </el-form-item>
            <el-form-item label="高考成绩" prop="examinationScore">
              <el-input size="large" v-model="dataForm.examinationScore" placeholder="高考成绩"></el-input>
            </el-form-item>
            <el-form-item label="考生号" prop="examineeNumber">
              <el-input size="large" v-model="dataForm.examineeNumber" placeholder="考生号"></el-input>
            </el-form-item>
            <el-form-item label="学生类别" prop="studentCategory">
              <ren-select size="large" v-model="dataForm.studentCategory" dict-type="student_type" placeholder="学生类别"></ren-select>
            </el-form-item>
            <el-form-item label="宿舍号" prop="dormitoryNumber">
              <el-input size="large" v-model="dataForm.dormitoryNumber" placeholder="宿舍号"></el-input>
            </el-form-item>
            <el-form-item label="是否在籍" prop="sfzj">
              <ren-select size="large" v-model="dataForm.sfzj" dict-type="yesOrNo" placeholder="是否在籍"></ren-select>
            </el-form-item>
            <el-form-item label="是否在校" prop="sfzx">
              <ren-select size="large" v-model="dataForm.sfzx" dict-type="yesOrNo" placeholder="是否在校"></ren-select>
            </el-form-item>
            <el-form-item label="学籍状态" prop="xjStatus">
              <ren-select size="large" v-model="dataForm.xjStatus" dict-type="yesOrNo" placeholder="学籍状态"></ren-select>
            </el-form-item>
            <el-form-item label="特殊学生类型" prop="specialStudentType">
              <ren-select size="large" v-model="dataForm.specialStudentType" dict-type="special_stu_type" placeholder="特殊学生类型"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="外语种类" prop="languagesType">
              <ren-select size="large" v-model="dataForm.languagesType" dict-type="language_type" placeholder="外语种类"></ren-select>
            </el-form-item>
            <el-form-item label="是否授予学位" prop="degreeAwardedOrNot">
              <ren-select size="large" v-model="dataForm.degreeAwardedOrNot" dict-type="yesOrNo" placeholder="是否授予学位"></ren-select>
            </el-form-item>
            <el-form-item label="学位授予时间" prop="degreeAwardDate">
              <el-date-picker size="large" type="datetime" placeholder="学位授予时间" value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.degreeAwardDate"></el-date-picker>
            </el-form-item>

            <el-form-item label="授予学位" prop="graduate">
              <el-input size="large" v-model="dataForm.graduate" placeholder="授予学位"></el-input>
            </el-form-item>
            <el-form-item label="毕结业结论" prop="conclusionOfGraduation">
              <el-input size="large" v-model="dataForm.conclusionOfGraduation" placeholder="毕结业结论"></el-input>
            </el-form-item>
            <el-form-item label="毕结业时间" prop="completionTime">
              <el-date-picker size="large" type="datetime" placeholder="毕结业时间" value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.completionTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="毕结业证书号" prop="completionCertificateNumber">
              <el-input size="large" v-model="dataForm.completionCertificateNumber" placeholder="毕结业证书号"></el-input>
            </el-form-item>
            <el-form-item label="预计毕业年月" prop="expectedGraduationDate">
              <el-date-picker size="large" type="datetime" placeholder="预计毕业年月" value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.expectedGraduationDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="结业证书号" prop="finishCertificateNumber">
              <el-input size="large" v-model="dataForm.finishCertificateNumber" placeholder="结业证书号"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <h3 class="info-h3">其他信息</h3>
          </el-col>
          <el-col :span="8">
            <el-form-item label="通讯地址" prop="mailAddress">
              <el-input size="large" v-model="dataForm.mailAddress" placeholder="通讯地址"></el-input>
            </el-form-item>
            <el-form-item label="电子信箱" prop="email">
              <el-input size="large" v-model="dataForm.email" placeholder="电子信箱"></el-input>
            </el-form-item>
            <el-form-item label="火车到站" prop="trainArrival">
              <el-input size="large" v-model="dataForm.trainArrival" placeholder="火车到站"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="银行账号" prop="bankAccount">
              <el-input size="large" v-model="dataForm.bankAccount" placeholder="银行账号"></el-input>
            </el-form-item>
            <el-form-item label="政治面貌" prop="politicalOutlook">
              <ren-select size="large" v-model="dataForm.politicalOutlook" dict-type="political_outlook" placeholder="政治面貌"></ren-select>
            </el-form-item>
            <el-form-item label="婚姻状况" prop="maritalStatus">
              <ren-select size="large" v-model="dataForm.maritalStatus" dict-type="marital_status" placeholder="婚姻状况"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮政编码" prop="postalCode">
              <el-input size="large" v-model="dataForm.postalCode" placeholder="邮政编码"></el-input>
            </el-form-item>
            <el-form-item label="血型" prop="bloodType">
              <ren-select size="large" v-model="dataForm.bloodType" dict-type="blood_type" placeholder="血型"></ren-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <ren-select size="large" v-model="dataForm.status" dict-type="yesOrNo" placeholder="状态"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="学生备注" prop="remark">
              <el-input size="large" type="textarea" :rows="6" v-model="dataForm.remark" placeholder="学生备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
export default defineComponent({
  setup() {
    const store = useStore();
    return reactive({
      store,
      loading: false,
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
        className: "",
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
        status: ""
      } as IObject,
      majorList: [] as IObject[],
      gradeList: [] as IObject[],
      classList: [] as IObject[]
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
		mobile: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
    // 学院变更
    instituteChange(data?: IObject) {
      if (data) {
        this.dataForm.instituteNo = data.number;
        this.dataForm.institute = data.name;
        // this.dataForm.majorNo = "";
        this.dataForm.major = "";
        this.dataForm.grade = "";
        this.dataForm.className = "";
        this.dataForm.classNo = "";
        this.majorList = data.children;
      } else {
        this.dataForm.instituteNo = "";
        this.dataForm.institute = "";
        // this.dataForm.majorNo = "";
        this.dataForm.major = "";
        this.dataForm.grade = "";
        this.dataForm.className = "";
        this.dataForm.classNo = "";
        this.majorList = [];
      }
    },
    // 专业变更
    majorChange(data: IObject) {
      this.dataForm.grade = "";
      this.dataForm.className = "";
      this.dataForm.classNo = "";
      this.gradeList = data.children;
    },
    // 年级变更
    gradeChange(data: IObject) {
      this.dataForm.className = "";
      this.dataForm.classNo = "";
      this.classList = data.children;
    },
    // 班级变更
    classChange(data: IObject) {
      console.log(data);
      this.dataForm.classNo = data.number;
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
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
      // this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
      this.store.state.activeTabName = "/student/student";
      this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
      this.$router.push(this.store.state.activeTabName);
    },
    updateClosedTabs(closedTabs: any[], isTransform = true) {
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
