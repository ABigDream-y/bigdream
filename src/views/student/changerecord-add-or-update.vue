<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="用户id" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
      </el-form-item>
      <el-form-item label="异动学年学期" prop="term">
        <el-input v-model="dataForm.term" placeholder="异动学年学期"></el-input>
      </el-form-item>
      <el-form-item label="审批文号" prop="approvalNumber">
        <el-input v-model="dataForm.approvalNumber" placeholder="审批文号"></el-input>
      </el-form-item>
      <el-form-item label="异动类别" prop="changeCategory">
        <el-select v-model="dataForm.changeCategory" placeholder="请选择">
          <el-option label="人人" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="异动原因" prop="changeReason">
        <el-input v-model="dataForm.changeReason" placeholder="异动原因"></el-input>
      </el-form-item>
      <el-form-item label="异动说明" prop="changeDescription">
        <el-input v-model="dataForm.changeDescription" placeholder="异动说明"></el-input>
      </el-form-item>
      <el-form-item label="学号" prop="xh">
        <el-input v-model="dataForm.xh" placeholder="学号"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input v-model="dataForm.username" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input v-model="dataForm.gender" placeholder="性别"></el-input>
      </el-form-item>
      <el-form-item label="原学校" prop="originalSchool">
        <el-input v-model="dataForm.originalSchool" placeholder="原学校"></el-input>
      </el-form-item>
      <el-form-item label="原所在年级" prop="originalGrade">
        <el-input v-model="dataForm.originalGrade" placeholder="原所在年级"></el-input>
      </el-form-item>
      <el-form-item label="原所属院系" prop="originalInstitute">
        <el-input v-model="dataForm.originalInstitute" placeholder="原所属院系"></el-input>
      </el-form-item>
      <el-form-item label="原所属院系编号" prop="originalInstituteNo">
        <el-input v-model="dataForm.originalInstituteNo" placeholder="原所属院系编号"></el-input>
      </el-form-item>
      <el-form-item label="原所在专业" prop="originalMajor">
        <el-input v-model="dataForm.originalMajor" placeholder="原所在专业"></el-input>
      </el-form-item>
      <el-form-item label="原专业方向" prop="originalMajorDirection">
        <el-input v-model="dataForm.originalMajorDirection" placeholder="原专业方向"></el-input>
      </el-form-item>
      <el-form-item label="原校区" prop="originalCampus">
        <ren-select v-model="dataForm.originalCampus" dict-type="campus" placeholder="原校区"></ren-select>
      </el-form-item>
      <el-form-item label="原所属班级" prop="originalClass">
        <el-input v-model="dataForm.originalClass" placeholder="原所属班级"></el-input>
      </el-form-item>
      <el-form-item label="原所属班级编号" prop="originalClassNo">
        <el-input v-model="dataForm.originalClassNo" placeholder="原所属班级编号"></el-input>
      </el-form-item>
      <el-form-item label="原在籍状态" prop="originalXjStatus">
        <el-select v-model="dataForm.originalXjStatus" placeholder="请选择">
          <el-option label="人人" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原在校状态" prop="originalZxStatus">
        <el-select v-model="dataForm.originalZxStatus" placeholder="请选择">
          <el-option label="人人" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="异动后年级" prop="changeGrade">
        <ren-select v-model="dataForm.changeGrade" dict-type="grade" placeholder="异动后年级"></ren-select>
      </el-form-item>
      <el-form-item label="异动后院系" prop="changeInstitute">
        <el-input v-model="dataForm.changeInstitute" placeholder="异动后院系"></el-input>
      </el-form-item>
      <el-form-item label="异动后院系编号" prop="changeInstituteNo">
        <el-input v-model="dataForm.changeInstituteNo" placeholder="异动后院系编号"></el-input>
      </el-form-item>
      <el-form-item label="异动后专业" prop="changeMajor">
        <el-input v-model="dataForm.changeMajor" placeholder="异动后专业"></el-input>
      </el-form-item>
      <el-form-item label="异动后方向" prop="changeMajorDirection">
        <el-input v-model="dataForm.changeMajorDirection" placeholder="异动后方向"></el-input>
      </el-form-item>
      <el-form-item label="异动后校区" prop="changeCampus">
        <ren-select v-model="dataForm.changeCampus" dict-type="campus" placeholder="异动后校区"></ren-select>
      </el-form-item>
      <el-form-item label="异动后班级" prop="changeClass">
        <el-input v-model="dataForm.changeClass" placeholder="异动后班级"></el-input>
      </el-form-item>
      <el-form-item label="异动后班级编号" prop="changeClassNo">
        <el-input v-model="dataForm.changeClassNo" placeholder="异动后班级编号"></el-input>
      </el-form-item>
      <el-form-item label="异动后在籍状态" prop="changeXjStatus">
        <el-input v-model="dataForm.changeXjStatus" placeholder="异动后在籍状态"></el-input>
      </el-form-item>
      <el-form-item label="异动后在校状态" prop="changeZxStatus">
        <el-input v-model="dataForm.changeZxStatus" placeholder="异动后在校状态"></el-input>
      </el-form-item>
      <el-form-item label="异动后学校" prop="changeSchool">
        <el-input v-model="dataForm.changeSchool" placeholder="异动后学校"></el-input>
      </el-form-item>
      <el-form-item label="异动日期" prop="changeDate">
        <el-date-picker type="datetime" placeholder="异动日期" value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.changeDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="审批日期" prop="approvalDate">
        <el-date-picker type="datetime" placeholder="审批日期" value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.approvalDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="截止日期" prop="deadlineDate">
        <el-date-picker type="datetime" placeholder="截止日期" value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.deadlineDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="是否同步培养方案 0否 1是" prop="isSynchronousPlan">
        <ren-select v-model="dataForm.isSynchronousPlan" dict-type="yesOrNo" placeholder="是否同步培养方案 0否 1是"></ren-select>
      </el-form-item>
      <el-form-item label="原培养方案" prop="originalPlan">
        <el-input v-model="dataForm.originalPlan" placeholder="原培养方案"></el-input>
      </el-form-item>
      <el-form-item label="异动后培养方案" prop="changePlan">
        <el-input v-model="dataForm.changePlan" placeholder="异动后培养方案"></el-input>
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
        userId: "",
        term: "",
        approvalNumber: "",
        changeCategory: "",
        changeReason: "",
        changeDescription: "",
        xh: "",
        username: "",
        gender: "",
        originalSchool: "",
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
        changeSchool: "",
        changeDate: "",
        approvalDate: "",
        deadlineDate: "",
        isSynchronousPlan: "",
        originalPlan: "",
        changePlan: "",
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
        userId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        xh: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        username: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        originalSchool: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
        changeInstituteNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        changeMajor: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        changeMajorDirection: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        changeCampus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        changeClass: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        changeClassNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        changeXjStatus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        changeZxStatus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/student/changerecord/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (!this.dataForm.id ? baseService.post : baseService.put)("/student/changerecord", this.dataForm).then((res) => {
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