<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="id" prop="id">
        <el-input v-model="dataForm.id" placeholder="id"></el-input>
      </el-form-item>
      <el-form-item label="教学场地id" prop="teachingAreaId">
        <el-input v-model="dataForm.teachingAreaId" placeholder="教学场地id"></el-input>
      </el-form-item>
      <el-form-item label="学年" prop="year">
        <el-input v-model="dataForm.year" placeholder="学年"></el-input>
      </el-form-item>
      <el-form-item label="学期" prop="semester">
        <el-input v-model="dataForm.semester" placeholder="学期"></el-input>
      </el-form-item>
      <el-form-item label="场地名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="场地名称"></el-input>
      </el-form-item>
      <el-form-item label="场地简称" prop="subName">
        <el-input v-model="dataForm.subName" placeholder="场地简称"></el-input>
      </el-form-item>
      <el-form-item label="校区" prop="campus">
        <el-input v-model="dataForm.campus" placeholder="校区"></el-input>
      </el-form-item>
      <el-form-item label="场地二级类别" prop="category">
        <el-input v-model="dataForm.category" placeholder="场地二级类别"></el-input>
      </el-form-item>
      <el-form-item label="场地类别" prop="mianCategory">
        <el-input v-model="dataForm.mianCategory" placeholder="场地类别"></el-input>
      </el-form-item>
      <el-form-item label="楼号" prop="building">
        <el-input v-model="dataForm.building" placeholder="楼号"></el-input>
      </el-form-item>
      <el-form-item label="楼层号" prop="floor">
        <el-input v-model="dataForm.floor" placeholder="楼层号"></el-input>
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
      <el-form-item label="是否可排课" prop="isSchedulingAllowed">
        <el-input v-model="dataForm.isSchedulingAllowed" placeholder="是否可排课"></el-input>
      </el-form-item>
      <el-form-item label="是否忽略冲突排课" prop="isConflictIgnored">
        <el-input v-model="dataForm.isConflictIgnored" placeholder="是否忽略冲突排课"></el-input>
      </el-form-item>
      <el-form-item label="是否可排考" prop="isExamSchedulingAllowed">
        <el-input v-model="dataForm.isExamSchedulingAllowed" placeholder="是否可排考"></el-input>
      </el-form-item>
      <el-form-item label="是否可借用" prop="isBorrowingAllowed">
        <el-input v-model="dataForm.isBorrowingAllowed" placeholder="是否可借用"></el-input>
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
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-input v-model="dataForm.status" placeholder="状态"></el-input>
      </el-form-item>
      <el-form-item label="创建者" prop="creator">
        <el-input v-model="dataForm.creator" placeholder="创建者"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createDate">
        <el-input v-model="dataForm.createDate" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="更新者" prop="updater">
        <el-input v-model="dataForm.updater" placeholder="更新者"></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateDate">
        <el-input v-model="dataForm.updateDate" placeholder="更新时间"></el-input>
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
        teachingAreaId: "",
        year: "",
        semester: "",
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
        isSchedulingAllowed: "",
        isConflictIgnored: "",
        isExamSchedulingAllowed: "",
        isBorrowingAllowed: "",
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
      baseService.get("/resource/semesterteachingarea/" + this.dataForm.id).then((res) => {
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
        (!this.dataForm.id ? baseService.post : baseService.put)("/resource/semesterteachingarea", this.dataForm).then((res) => {
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
