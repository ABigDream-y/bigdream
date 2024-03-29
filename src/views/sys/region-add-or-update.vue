<template>
  <el-dialog v-model="visible" :title="insert ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="parentName" label="上级区域">
        <ren-region-tree ref="regionListTree" v-model="dataForm.pid" placeholder="选择区域" v-model:parent-name="dataForm.parentName"></ren-region-tree>
      </el-form-item>
      <el-form-item prop="name" :label="$t('region.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('region.name')"></el-input>
      </el-form-item>
      <el-form-item prop="id" :label="$t('region.id')">
        <el-input v-model="dataForm.id" :disabled="!insert" :placeholder="$t('region.id')"></el-input>
      </el-form-item>
      <el-form-item prop="sort" :label="$t('region.sort')">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t('region.sort')"></el-input-number>
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
      insert: true,
      regionList: [],
      regionListVisible: false,
      dataForm: {
        id: "",
        name: "",
        pid: "0",
        parentName: "",
        sort: 0
      }
    });
  },
  computed: {
    dataRule() {
      return {
        id: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        sort: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.insert = true;
      this.visible = true;
      this.dataForm.pid = "0";
      this.$nextTick(() => {
        if (this.dataForm.id) {
          this.insert = false;
          this.getInfo();
        } else {
          this.$refs["dataFormRef"].resetFields();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get(`/sys/region/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        (this.insert ? baseService.post : baseService.put)("/sys/region", this.dataForm).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList", this.dataForm);
            }
          });
        });
      });
    }
  }
});
</script>

<style lang="less">
.mod-sys__region {
  .region-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
}
</style>
