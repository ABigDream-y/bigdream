<template>
  <el-dialog v-model="visible" title="复制场地" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="" prop="">
        <el-link type="warning">如需选择更多 学年、学期 数据，请前往菜单 基础信息管理>>数据字典 添加！</el-link>
      </el-form-item>
      <el-form-item label="学年" prop="year">
        <ren-select size="large" v-model="dataForm.year" dict-type="school_year" placeholder="学年"></ren-select>
      </el-form-item>
      <el-form-item label="学期" prop="semester">
        <ren-select size="large" v-model="dataForm.semester" dict-type="term" placeholder="学期"></ren-select>
      </el-form-item>
      <el-form-item label="启动状态" prop="status">
        <ren-radio-group size="large" v-model="dataForm.status" dict-type="enable_status"></ren-radio-group>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="comfirmCopy" type="primary">确定</el-button>
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
      // status: 0,
      type: 0,
      dataForm: {
        id: "",
        year: "",
        semester: "",
        status: 1,
        parent: ""
      }
    });
  },
  computed: {
    dataRule() {
      return {
        year: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        semester: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        status: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  methods: {
    init() {
      this.visible = true;
      // console.log(type);
      // this.status = status;
      // this.type = type;
    },
    comfirmCopy() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        // this.$message.success("omg");
        // if (this.dataForm.vertifyType == 2 && this.dataForm.vertifyOpinion == "") {
        //   return this.$message.error("请输入不通过理由");
        // }
        this.$emit("confirm", this.dataForm);
        this.visible = false;
      });
    }
  }
});
</script>
