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
            <el-form-item label="名称" prop="name">
              <el-input size="large" v-model="dataForm.name" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number size="large" v-model="dataForm.sort" placeholder="排序" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别" prop="type">
              <ren-select size="large" v-model="dataForm.type" dict-type="area_type" placeholder="类型"></ren-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <ren-radio-group size="large" v-model="dataForm.status" dict-type="enable_status"></ren-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
       <el-form-item label="封面" prop="cover">
          <ren-upload v-model="dataForm.cover" :cover="dataForm.cover" :isFocus="isFocus"></ren-upload>
          <el-input size="large" style="margin-top: 20px; width: 100% !important" @focus="isFocus = true" @blur="isFocus = false" v-model="dataForm.cover" placeholder="封面地址"></el-input>
        </el-form-item>
        <el-form-item label="配置" prop="content" style="height: 400px">
          <editor v-model="dataForm.content" :init="{ height: 400 }"></editor>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input size="large" type="textarea" :rows="5" v-model="dataForm.remark" maxlength="255" show-word-limit></el-input>
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
import Tinymce from "@/components/tinymce";
export default defineComponent({
  components: { editor: Tinymce },
  setup() {
    const store = useStore();
    return reactive({
      store,
      loading: false,
      visible: false,
      dataForm: {
        id: "",
        name: "",
        type: "",
        cover: "",
        sort: 0,
        status: 1,
        content: "",
        remark: ""
      },
	  isFocus: false
    });
  },
  computed: {
    dataRule() {
      return {
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  mounted() {

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
      baseService.get("/resource/teachingareatype/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
        for(var key in this.dataForm) {
          if(this.dataForm[key] == null) {
            this.dataForm[key] = "";
          } 
        }
        console.log("data ", this.dataForm);
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/resource/teachingareatype", this.dataForm).then((res) => {
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
      this.store.state.activeTabName = "/resource/teachingareatype";
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
