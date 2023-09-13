<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="场地名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="场地名称"></el-input>
      </el-form-item>
      <el-form-item label="场地简称" prop="subName">
        <el-input type="textarea" v-model="dataForm.subName"></el-input>
      </el-form-item>
      <el-form-item label="校区" prop="campus">
        <ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
      </el-form-item>
      <el-form-item label="场地二级类别" prop="category">
        <el-input v-model="dataForm.category" placeholder="场地二级类别"></el-input>
      </el-form-item>
      <el-form-item label="场地类别" prop="mainCategory">
        <el-input v-model="dataForm.mainCategory" placeholder="场地类别"></el-input>
      </el-form-item>
      <el-form-item label="教学楼" prop="building">
        <el-input v-model="dataForm.building" placeholder="教学楼"></el-input>
      </el-form-item>
      <el-form-item label="楼层" prop="floor">
        <el-input v-model="dataForm.floor" placeholder="楼层"></el-input>
      </el-form-item>
      <el-form-item label="门牌号" prop="house">
        <el-input v-model="dataForm.house" placeholder="门牌号"></el-input>
      </el-form-item>
      <el-form-item label="座位数" prop="seats">
        <el-input v-model="dataForm.seats" placeholder="座位数"></el-input>
      </el-form-item>
      <el-form-item label="考试座位数" prop="examSeats">
        <el-input v-model="dataForm.examSeats" placeholder="考试座位数"></el-input>
      </el-form-item>
      <el-form-item label="建筑面积" prop="area">
        <el-input v-model="dataForm.area" placeholder="建筑面积"></el-input>
      </el-form-item>
      <el-form-item label="托管部门" prop="department">
        <el-input v-model="dataForm.department" placeholder="托管部门"></el-input>
      </el-form-item>
      <el-form-item label="场地管理员" prop="administrators">
        <el-input v-model="dataForm.administrators" placeholder="场地管理员"></el-input>
      </el-form-item>
      <el-form-item label="场地管理员电话" prop="administratorsMobile">
        <el-input v-model="dataForm.administratorsMobile" placeholder="场地管理员电话"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="dataForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <ren-select v-model="dataForm.status" dict-type="enable_status" placeholder="状态"></ren-select>
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
        name: "",
        subName: "",
        campus: "",
        category: "",
        mainCategory: "",
        building: "",
        floor: "",
        house: "",
        seats: "",
        examSeats: "",
        area: "",
        department: "",
        administrators: "",
        administratorsMobile: "",
        remark: "",
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
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        mainCategory: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        building: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        floor: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        house: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        seats: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      baseService.get("/resource/teachingarea/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/resource/teachingarea", this.dataForm).then((res) => {
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