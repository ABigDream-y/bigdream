<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="" prop="teachingId">
        <el-input v-model="dataForm.teachingId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="周次" prop="count">
        <el-input v-model="dataForm.count" placeholder="周次"></el-input>
      </el-form-item>
      <el-form-item label="" prop="teacherId">
        <el-input v-model="dataForm.teacherId" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="职工号" prop="zgh">
        <el-input v-model="dataForm.zgh" placeholder="职工号"></el-input>
      </el-form-item>
      <el-form-item label="教师" prop="teacherName">
        <el-input v-model="dataForm.teacherName" placeholder="教师"></el-input>
      </el-form-item>
      <el-form-item label="职称" prop="position">
        <el-input v-model="dataForm.position" placeholder="职称"></el-input>
      </el-form-item>
      <el-form-item label="是否负责教师" prop="leaderStatus">
        <ren-radio-group v-model="dataForm.leaderStatus" dict-type="yesOrNo"></ren-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
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
        teachingId: "",
        count: "",
        teacherId: "",
        zgh: "",
        teacherName: "",
        position: "",
        leaderStatus: "",
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
        teachingId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        teacherId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/task/teachingteacher/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/task/teachingteacher", this.dataForm).then((res) => {
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