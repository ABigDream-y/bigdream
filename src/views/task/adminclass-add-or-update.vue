<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="id" prop="id">
        <el-input v-model="dataForm.id" placeholder="id"></el-input>
      </el-form-item>
      <el-form-item label="班级" prop="class">
        <el-input v-model="dataForm.class" placeholder="班级"></el-input>
      </el-form-item>
      <el-form-item label="班级" prop="classNo">
        <el-input v-model="dataForm.classNo" placeholder="班级"></el-input>
      </el-form-item>
      <el-form-item label="人数" prop="number">
        <el-input v-model="dataForm.number" placeholder="人数"></el-input>
      </el-form-item>
      <el-form-item label="年级" prop="grade">
        <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
      </el-form-item>
      <el-form-item label="院系" prop="institute">
        <el-input v-model="dataForm.institute" placeholder="院系"></el-input>
      </el-form-item>
      <el-form-item label="院系" prop="instituteNo">
        <el-input v-model="dataForm.instituteNo" placeholder="院系"></el-input>
      </el-form-item>
      <el-form-item label="专业" prop="major">
        <el-input v-model="dataForm.major" placeholder="专业"></el-input>
      </el-form-item>
      <el-form-item label="专业方向" prop="majorDirection">
        <el-input v-model="dataForm.majorDirection" placeholder="专业方向"></el-input>
      </el-form-item>
      <el-form-item label="校区" prop="campus">
        <el-input v-model="dataForm.campus" placeholder="校区"></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-checkbox-group v-model="dataForm.status">
          <el-checkbox label="启用" name="type"></el-checkbox>
          <el-checkbox label="禁用" name="type"></el-checkbox>
        </el-checkbox-group>
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
        class: "",
        classNo: "",
        number: "",
        grade: "",
        institute: "",
        instituteNo: "",
        major: "",
        majorDirection: "",
        campus: "",
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
      baseService.get("/task/adminclass/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/task/adminclass", this.dataForm).then((res) => {
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