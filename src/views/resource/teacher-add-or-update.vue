<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="教职工号" prop="zgh">
        <el-input v-model="dataForm.zgh" placeholder="教职工号"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input v-model="dataForm.username" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input v-model="dataForm.gender" placeholder="性别"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactMobile">
        <el-input v-model="dataForm.contactMobile" placeholder="联系方式"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="idCard">
        <el-input v-model="dataForm.idCard" placeholder="身份证号"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="电子邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
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
      <el-form-item label="所属专业" prop="major">
        <el-input v-model="dataForm.major" placeholder="所属专业"></el-input>
      </el-form-item>
      <el-form-item label="学科" prop="discipline">
        <el-input v-model="dataForm.discipline" placeholder="学科"></el-input>
      </el-form-item>
      <el-form-item label="职称" prop="position">
        <el-input v-model="dataForm.position" placeholder="职称"></el-input>
      </el-form-item>
      <el-form-item label="任职状态" prop="rzStatus">
        <el-select v-model="dataForm.rzStatus" placeholder="请选择">
          <el-option label="人人" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <ren-radio-group v-model="dataForm.status" dict-type="enable_status"></ren-radio-group>
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
        zgh: "",
        username: "",
        gender: "",
        contactMobile: "",
        idCard: "",
        email: "",
        phone: "",
        campus: "",
        institute: "",
        instituteNo: "",
        major: "",
        discipline: "",
        position: "",
        rzStatus: "",
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
        zgh: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        username: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/resource/teacher/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/resource/teacher", this.dataForm).then((res) => {
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