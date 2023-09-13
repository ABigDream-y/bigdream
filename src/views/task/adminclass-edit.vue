<template>
  <div class="edit-card--file">
    <div class="aui-card-header">
      <el-button @click="goBack()"
        ><el-icon> <ArrowLeft /> </el-icon>返回</el-button
      >
      <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </div>
    <div class="edit-card__body">
      <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
        <el-form-item label="id" prop="id">
          <el-input v-model="dataForm.id" placeholder="id"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="dataForm.class" placeholder="班级"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="classNo">
          <el-input v-model="dataForm.classNo" placeholder="班级"></el-input>
        </el-form-item>
        <el-form-item label="人数" prop="number">
          <el-input v-model="dataForm.number" placeholder="人数"></el-input>
        </el-form-item>
        <el-form-item label="年级" prop="grade">
          <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
        </el-form-item>
        <el-form-item label="院系" prop="institute">
          <el-input v-model="dataForm.institute" placeholder="院系"></el-input>
        </el-form-item>
        <el-form-item label="院系" prop="instituteNo">
          <el-input v-model="dataForm.instituteNo" placeholder="院系"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="dataForm.major" placeholder="专业"></el-input>
        </el-form-item>
        <el-form-item label="专业方向" prop="majorDirection">
          <el-input v-model="dataForm.majorDirection" placeholder="专业方向"></el-input>
        </el-form-item>
        <el-form-item label="校区" prop="campus">
          <el-input v-model="dataForm.campus" placeholder="校区"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-checkbox-group v-model="dataForm.status">
            <el-checkbox label="启用" name="type"></el-checkbox>
            <el-checkbox label="禁用" name="type"></el-checkbox>
          </el-checkbox-group>
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
        class: "",
        classNo: "",
        number: "",
        grade: "",
        institute: "",
        instituteNo: "",
        major: "",
        majorDirection: "",
        campus: "",
        status: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: ""
      }
    });
  },
  computed: {
    dataRule() {
      return {};
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
      baseService.get("/task/adminclass/" + this.dataForm.id).then((res) => {
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
        this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/task/adminclass", this.dataForm).then((res) => {
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
      this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
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
