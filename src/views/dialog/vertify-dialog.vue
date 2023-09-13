<template>
  <el-dialog v-model="visible" title="审核情况" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="是否通过" prop="vertifyType">
        <el-radio-group v-model="dataForm.vertifyType" class="ml-4">
          <el-radio :label="1" size="large">是</el-radio>
          <el-radio :label="2" size="large">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核意见" prop="vertifyOpinion">
        <el-input type="textarea" :rows="6" v-model="dataForm.vertifyOpinion" placeholder="审核意见"></el-input>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="comfirmVertify" type="primary">确定</el-button>
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
      status: 0,
      type: 0,
      dataForm: {
        vertifyType: 1,
        vertifyOpinion: ""
      }
    });
  },
  computed: {
    dataRule() {
      return {
        vertifyType: [{ required: true, message: this.$t("validate.required"), trigger: ["blur", "change"] }]
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
    comfirmVertify() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        if (this.dataForm.vertifyType == 2 && this.dataForm.vertifyOpinion == "") {
          return this.$message.error("请输入不通过理由");
        }
        this.$emit("comfirm", this.dataForm.vertifyType, this.dataForm.vertifyOpinion);
        this.visible = false;
      });
    }
  }
});
</script>
