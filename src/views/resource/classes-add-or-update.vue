<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="班级编号" prop="number">
        <el-input v-model="dataForm.number" placeholder="班级编号"></el-input>
      </el-form-item>
      <el-form-item label="班级名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="班级名称"></el-input>
      </el-form-item>
      <el-form-item label="简称" prop="subName">
        <el-input v-model="dataForm.subName" placeholder="简称"></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
      </el-form-item>
      <el-form-item label="辅导员" prop="fdy">
        <el-input v-model="dataForm.fdy" placeholder="辅导员"></el-input>
      </el-form-item>
      <el-form-item label="辅导员联系方式" prop="fdyMobile">
        <el-input v-model="dataForm.fdyMobile" placeholder="辅导员联系方式"></el-input>
      </el-form-item>
      <el-form-item label="班主任" prop="teacher">
        <el-input v-model="dataForm.teacher" placeholder="班主任"></el-input>
      </el-form-item>
      <el-form-item label="班主任联系方式" prop="teacherMobile">
        <el-input v-model="dataForm.teacherMobile" placeholder="班主任联系方式"></el-input>
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
      <el-form-item label="专业方向" prop="majorDirection">
        <el-input v-model="dataForm.majorDirection" placeholder="专业方向"></el-input>
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
        number: "",
        name: "",
        subName: "",
        grade: "",
        fdy: "",
        fdyMobile: "",
        teacher: "",
        teacherMobile: "",
        campus: "",
        institute: "",
        instituteNo: "",
        major: "",
        majorDirection: "",
        remark: "",
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
        number: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/resource/classes/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/resource/classes", this.dataForm).then((res) => {
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