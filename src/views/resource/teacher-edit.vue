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
            <el-form-item label="教职工号" prop="zgh">
              <el-input v-model="dataForm.zgh" size="large" placeholder="教职工号"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
              <ren-select v-model="dataForm.gender" size="large" dict-type="gender" placeholder="性别"></ren-select>
            </el-form-item>
            <el-form-item label="联系方式" prop="contactMobile">
              <el-input v-model="dataForm.contactMobile" size="large" placeholder="联系方式"></el-input>
            </el-form-item>
            <el-form-item label="校区" prop="campus">
              <ren-select v-model="dataForm.campus" size="large" dict-type="campus" placeholder="校区"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="username">
              <el-input v-model="dataForm.username" size="large" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="dataForm.idCard" size="large" placeholder="身份证号"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="dataForm.email" size="large" placeholder="电子邮箱"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="dataForm.phone" size="large" placeholder="手机号"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
						
					</el-col> -->
          <el-col :span="12">
            <el-form-item label="学院" prop="instituteNo">
              <ren-institute-tree v-model="dataForm.instituteNo" size="large" :deptName="dataForm.institute" @change="instituteChange" placeholder="学院" nodekey="number" showType="select"></ren-institute-tree>
            </el-form-item>
            <el-form-item label="学科" prop="discipline">
              <el-input v-model="dataForm.discipline" size="large" placeholder="学科"></el-input>
            </el-form-item>
            <el-form-item label="任职状态" prop="rzStatus">
              <ren-select size="large" v-model="dataForm.rzStatus" dict-type="rz_status" placeholder="任职状态"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属专业" prop="major">
              <el-select v-model="dataForm.major" size="large" placeholder="所属专业">
                <el-option v-for="(item, index) in majorList" :key="index" :value="item.name" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职称" prop="position">
              <el-input v-model="dataForm.position" size="large" placeholder="职称"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <ren-radio-group v-model="dataForm.status" dict-type="enable_status"></ren-radio-group>
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
        zgh: "",
        username: "",
        gender: 0,
        contactMobile: "",
        idCard: "",
        email: "",
        phone: "",
        campus: "",
        institute: "",
        instituteNo: "",
        major: "",
        discipline: "",
        position: "",
        rzStatus: 1,
        status: 1
      }
    });
  },
  computed: {
    dataRule() {
      return {
        zgh: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        gender: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        username: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        rzStatus: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        status: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
      baseService.get("/resource/teacher/" + this.dataForm.id).then((res) => {
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
        // this.dataForm.majorNo = "";
        this.dataForm.major = "";
        this.majorList = data.children;
      } else {
        this.dataForm.instituteNo = "";
        this.dataForm.institute = "";
        // this.dataForm.majorNo = "";
        this.dataForm.major = "";
        this.majorList = [];
      }
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/resource/teacher", this.dataForm).then((res) => {
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
      this.store.state.activeTabName = "/resource/teacher";
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
