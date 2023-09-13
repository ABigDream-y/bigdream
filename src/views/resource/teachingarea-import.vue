<template>
  <el-dialog v-model="visible" title="教学场地导入" :close-on-click-modal="false" :close-on-press-escape="false" width="80%">
    <el-upload :action="uploadUrl" :disabled="!uploadUrl" :file-list="fileList" drag :before-upload="beforeUploadHandle" :on-success="successHandle" class="text-center">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text" v-html="$t('upload.text')"></div>
      <template v-slot:tip>
        <div class="el-upload__tip">
          {{ $t("upload.tip", { format: "xlsx、xls" }) }}
        </div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script lang="ts">
import { getToken } from "@/utils/cache";
import { IObject } from "@/types/interface";
import app from "@/constants/app";
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  name: "studentImportBatch",
  setup() {
    const state = reactive({
      visible: false,
      uploadUrl: "",
      num: 0,
      fileList: [] as IObject[]
    });
    return {
      ...toRefs(state)
    };
  },
  watch: {},
  methods: {
    init(type: string, id: string) {
      this.num = 0;
      this.visible = true;
      let apiUrl = "";
      if (type == "teachingarea") {
        apiUrl = "/resource/teachingarea/batchImport";
        this.uploadUrl = `${app.api}${apiUrl}?token=${getToken()}`;
      } else {
        apiUrl = "/resource/semesterteachingarea/batchImport";
        this.uploadUrl = `${app.api}${apiUrl}?token=${getToken()}&id=${id}`;
      }

      console.log("-uploadUrl===", this.uploadUrl);
      this.fileList = [];
    },
    // 上传之前
    beforeUploadHandle(file: IObject) {
      console.log("file--", file);
      if (file.type !== "application/vnd.ms-excel" && file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        this.$message.error(this.$t("upload.tip", { format: "xlsx、xls" }));
        return false;
      }
      this.num++;
    },
    // 上传成功
    successHandle(res: IObject, file: IObject, fileList: IObject[]) {
      console.log("上传成功", res);
      if (res.code !== 0) {
        this.num = 0;
        this.fileList = [];
        return this.$message.error(res.msg);
      }
      this.fileList = fileList;

      //导入有错误信息的
      if (res.data.importResult && res.data.importResult.length !== 0) {
        this.visible = false;
        // console.log(1)
        let errorList = res.data.importResult;
        this.$emit("error", errorList);
        return;
      }

      this.num--;
      if (this.num === 0) {
        this.$message({
          message: this.$t("prompt.success"),
          type: "success",
          duration: 500,
          onClose: () => {
            this.visible = false;
            this.$emit("refreshDataList");
          }
        });
      }
    }
  }
});
</script>
