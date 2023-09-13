<template>
  <div class="edit-card--file edit-card-page">
    <div class="aui-card-header">
      <el-button @click="goBack()"
        ><el-icon> <ArrowLeft /> </el-icon>返回</el-button
      >
      <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </div>
    <div class="edit-card__body">
      <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课组名" prop="name">
              <el-input v-model="dataForm.name" size="large" placeholder="课组名"></el-input>
            </el-form-item>
            <el-form-item label="年级" prop="grade">
              <ren-select v-model="dataForm.grade" size="large" dict-type="grade" placeholder="年级"></ren-select>
            </el-form-item>
            <el-form-item label="任选课类别" prop="courseType">
              <ren-select v-model="dataForm.courseType" size="large" dict-type="course_type" placeholder="任选课类别"></ren-select>
            </el-form-item>
            <el-form-item label="最少修读学分" prop="scoreMin">
              <el-input-number v-model="dataForm.scoreMin" :min="0" size="large" placeholder="最少修读学分"></el-input-number>
            </el-form-item>
            <el-form-item label="最少完成课程数" prop="groupMin">
              <el-input-number v-model="dataForm.groupMin" :min="0" size="large" placeholder="最少完成课程数"></el-input-number>
            </el-form-item>
            <el-form-item label="课程总学时" prop="totalHours">
              <el-input readonly v-model="dataForm.totalHours" :min="0" size="large" placeholder="课程总学时"></el-input>
            </el-form-item>
            <el-form-item label="是否校公选课组" prop="publicStatus">
              <ren-radio-group v-model="dataForm.publicStatus" dict-type="yesOrNo"></ren-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课组类型" prop="category">
              <ren-select v-model="dataForm.category" size="large" dict-type="course_group_type" placeholder="课组类型"></ren-select>
            </el-form-item>
            <el-form-item label="学院" prop="instituteNo">
              <ren-institute-tree v-model="dataForm.instituteNo" :deptName="dataForm.institute" size="large" placeholder="学院" nodekey="number" showType="select" @change="instituteChange"></ren-institute-tree>
            </el-form-item>
            <el-form-item label="课程类别" prop="courseCategory">
              <ren-select v-model="dataForm.courseCategory" size="large" dict-type="course_category" placeholder="课程类别"></ren-select>
            </el-form-item>
            <el-form-item label="最少修读门数" prop="courseMin">
              <el-input-number v-model="dataForm.courseMin" :min="0" size="large" placeholder="最少修读门数"></el-input-number>
            </el-form-item>
            <el-form-item label="课程总门数" prop="totalCourse">
              <el-input readonly v-model="dataForm.totalCourse" :min="0" size="large" placeholder="课程总门数"></el-input>
            </el-form-item>
            <el-form-item label="课程总学分" prop="totalScore">
              <el-input readonly v-model="dataForm.totalScore" :min="0" size="large" placeholder="课程总学分"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <ren-radio-group v-model="dataForm.status" dict-type="enable_status"></ren-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="修读要求" prop="requirement">
          <el-input type="textarea" :rows="5" v-model="dataForm.requirement" maxlength="255" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="5" v-model="dataForm.remark" maxlength="255" show-word-limit></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { findIndex } from "lodash";
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    const store = useStore();
    return reactive({
      store,
      loading: false,
      visible: false,
      dataForm: {
        id: "",
        name: "",
        grade: "",
        category: "",
        institute: "",
        instituteNo: "",
        courseType: "",
        courseCategory: "",
        scoreMin: "",
        courseMin: "",
        groupMin: "",
        totalCourse: "",
        totalHours: "",
        totalScore: "",
        sort: "",
        requirement: "",
        publicStatus: 1,
        status: 1,
        remark: ""
      }
    });
  },
  computed: {
    dataRule() {
      return {
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        grade: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.loading = false;
      let id = this.$route.query.id || "";
      if (id && id != "0") {
        this.dataForm.id = id;
      }
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/programme/coursegroup/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
        console.log("data: ", this.dataForm);
      });
    },
    // 学院变更
    instituteChange(data?: IObject) {
      if (data) {
        this.dataForm.instituteNo = data.number;
        this.dataForm.institute = data.name;
      } else {
        this.dataForm.instituteNo = "";
        this.dataForm.institute = "";
      }
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/programme/coursegroup", this.dataForm).then((res) => {
          if (res.code !== 0) {
            this.loading = false;
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.loading = false;
              this.goBack();
            }
          });
        });
      });
    },
    goBack() {
      const activeTabName = this.store.state.activeTabName;
      const tabs = this.store.state.tabs;
      let index = findIndex(tabs, (x) => x.value === activeTabName);
      this.store.state.tabs.splice(index, 1);
      // this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
      this.store.state.activeTabName = "/programme/coursegroup";
      this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
      this.$router.push(this.store.state.activeTabName);
    },
    updateClosedTabs(closedTabs: any[], isTransform = true) {
      if (isTransform) {
        closedTabs = closedTabs.map((x) => x.value);
      }
      this.store.dispatch({
        type: "updateState",
        payload: {
          closedTabs
        }
      });
    }
  }
});
</script>
