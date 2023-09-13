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
            <el-form-item label="班级代码" prop="number">
              <el-input v-model="dataForm.number" size="large" placeholder="班级代码"></el-input>
            </el-form-item>
            <el-form-item label="简称" prop="subName">
              <el-input v-model="dataForm.subName" size="large" placeholder="简称"></el-input>
            </el-form-item>
            <el-form-item label="辅导员" prop="fdy">
              <el-input v-model="dataForm.fdy" size="large" placeholder="辅导员"></el-input>
            </el-form-item>
            <el-form-item label="班主任" prop="teacher">
              <el-input v-model="dataForm.teacher" size="large" placeholder="班主任"></el-input>
            </el-form-item>
            <el-form-item label="校区" prop="campus">
              <ren-select v-model="dataForm.campus" size="large" dict-type="campus" placeholder="校区"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级名称" prop="name">
              <el-input v-model="dataForm.name" size="large" placeholder="班级名称"></el-input>
            </el-form-item>
            <el-form-item label="年级" prop="grade">
              <ren-select v-model="dataForm.grade" size="large" dict-type="grade" placeholder="年级"></ren-select>
            </el-form-item>
            <el-form-item label="辅导员联系方式" prop="fdyMobile">
              <el-input v-model="dataForm.fdyMobile" size="large" placeholder="辅导员联系方式"></el-input>
            </el-form-item>
            <el-form-item label="班主任联系方式" prop="teacherMobile">
              <el-input v-model="dataForm.teacherMobile" size="large" placeholder="班主任联系方式"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院" prop="instituteNo">
              <ren-institute-tree v-model="dataForm.instituteNo" :deptName="dataForm.institute" @change="instituteChange" size="large" placeholder="学院" nodekey="number" showType="select"></ren-institute-tree>
            </el-form-item>
            <el-form-item label="专业方向" prop="majorDirection">
              <el-input v-model="dataForm.majorDirection" size="large" placeholder="专业方向"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属专业" prop="major">
              <el-select v-model="dataForm.major" size="large" placeholder="所属专业">
                <el-option v-for="(item, index) in majorList" :key="index" :value="item.name" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { IObject } from "@/types/interface";
import { useStore } from "vuex";
import { findIndex } from "lodash";
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    const store = useStore();
    return reactive({
      store,
      loading: false,
      visible: false,
      majorList: [] as IObject[],
      dataForm: {
        id: "",
        number: "",
        name: "",
        subName: "",
        grade: "",
        fdy: "",
        fdyMobile: "",
        teacher: "",
        teacherMobile: "",
        campus: "",
        institute: "",
        instituteNo: "",
        majorNo: "",
        major: "",
        majorDirection: "",
        remark: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: ""
      }
    });
  },
  computed: {
    dataRule() {
      return {
        number: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
      this.dataForm.instituteNo = "";
      this.dataForm.institute = "";
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/resource/classes/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 学院变更
    instituteChange(data?: IObject) {
      if (data) {
        this.dataForm.instituteNo = data.number;
        this.dataForm.institute = data.name;
        this.dataForm.majorNo = "";
        this.dataForm.major = "";
        this.majorList = data.children;
      } else {
        this.dataForm.instituteNo = "";
        this.dataForm.institute = "";
        this.dataForm.majorNo = "";
        this.dataForm.major = "";
        this.majorList = [];
      }
    },
    // 专业变更
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/resource/classes", this.dataForm).then((res) => {
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
      this.store.state.activeTabName = "/resource/classes";
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
