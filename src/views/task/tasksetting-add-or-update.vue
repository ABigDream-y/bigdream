<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="id" prop="id">
        <el-input v-model="dataForm.id" placeholder="id"></el-input>
      </el-form-item>
      <el-form-item label="是否开放" prop="openStatus">
        <ren-radio-group v-model="dataForm.openStatus" dict-type="yesOrNo"></ren-radio-group>
      </el-form-item>
      <el-form-item label="周学时是否满足授课学时" prop="status">
        <el-checkbox-group v-model="dataForm.status">
          <el-checkbox label="启用" name="type"></el-checkbox>
          <el-checkbox label="禁用" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="上课教师是否维护" prop="maintenanceStatus">
        <el-checkbox-group v-model="dataForm.maintenanceStatus">
          <el-checkbox label="启用" name="type"></el-checkbox>
          <el-checkbox label="禁用" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker type="date" placeholder="开始日期" value-format="YYYY-MM-DD" v-model="dataForm.startDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker type="date" placeholder="结束日期" value-format="YYYY-MM-DD" v-model="dataForm.endDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="开课总容量是否满足计划学生人数" prop="numberStatus">
        <el-checkbox-group v-model="dataForm.numberStatus">
          <el-checkbox label="启用" name="type"></el-checkbox>
          <el-checkbox label="禁用" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否有遗漏班级信息" prop="infoStatus">
        <el-checkbox-group v-model="dataForm.infoStatus">
          <el-checkbox label="启用" name="type"></el-checkbox>
          <el-checkbox label="禁用" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="开课周次" prop="courseCount">
        <ren-radio-group v-model="dataForm.courseCount" dict-type="yesOrNo"></ren-radio-group>
      </el-form-item>
      <el-form-item label="一年级" prop="oneGrade">
        <ren-select v-model="dataForm.oneGrade" dict-type="yesOrNo" placeholder="一年级"></ren-select>
      </el-form-item>
      <el-form-item label="二年级" prop="twoGrade">
        <ren-select v-model="dataForm.twoGrade" dict-type="yesOrNo" placeholder="二年级"></ren-select>
      </el-form-item>
      <el-form-item label="三年级" prop="threeGrade">
        <ren-select v-model="dataForm.threeGrade" dict-type="yesOrNo" placeholder="三年级"></ren-select>
      </el-form-item>
      <el-form-item label="四年级" prop="fourGrade">
        <ren-select v-model="dataForm.fourGrade" dict-type="yesOrNo" placeholder="四年级"></ren-select>
      </el-form-item>
      <el-form-item label="校公选" prop="publicStatus">
        <ren-select v-model="dataForm.publicStatus" dict-type="yesOrNo" placeholder="校公选"></ren-select>
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
        openStatus: "",
        status: "",
        maintenanceStatus: "",
        startDate: "",
        endDate: "",
        numberStatus: "",
        infoStatus: "",
        courseCount: "",
        oneGrade: "",
        twoGrade: "",
        threeGrade: "",
        fourGrade: "",
        publicStatus: "",
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
      baseService.get("/task/tasksetting/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/task/tasksetting", this.dataForm).then((res) => {
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