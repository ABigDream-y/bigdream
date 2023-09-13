<template>
  <div class="edit-card--file">
    <div class="aui-card-header">
      <el-button @click="goBack()"><el-icon>
          <ArrowLeft />
        </el-icon>返回</el-button>
      <el-button v-if="!readonly" type="primary" :loading="loading"
        @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </div>
    <div class="edit-card__body">
      <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
        label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="编号" prop="code">
              <el-input size="large" :readonly="readonly" v-model="dataForm.code" placeholder="编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="培养方案版本名称" prop="name" label-width="150px">
              <el-input size="large" :readonly="readonly" v-model="dataForm.name" placeholder="培养方案版本名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="版本号" prop="versionNumber">
              <el-input size="large" :readonly="readonly" v-model="dataForm.versionNumber" placeholder="版本号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="150px" label="适用范围" prop="applicableScope">
              <el-input size="large" :readonly="readonly" v-model="dataForm.applicableScope"
                placeholder="适用范围"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="学制" prop="educationalSystem">
              <ren-select size="large" v-model="dataForm.educationalSystem" dict-type="edu_system"
                placeholder="学制"></ren-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="150px" label="授予学位" prop="graduate">
              <ren-select size="large" v-if="!readonly" v-model="dataForm.graduate" dict-type="degree_type"
                placeholder="授予学位"></ren-select>
              <div v-else style="color: grey;">
                {{ dataForm.graduate }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="修订时间" prop="revisionTime">
              <el-date-picker :readonly="readonly" size="large" type="datetime" placeholder="修订时间"
                value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.revisionTime"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="150px" label="生效时间" prop="effectiveTime">
              <el-date-picker :readonly="readonly" size="large" type="datetime" placeholder="生效时间"
                value-format="YYYY-MM-DD HH:mm:ss" v-model="dataForm.effectiveTime"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="修订单位" prop="revisedBy">
              <el-input size="large" :readonly="readonly" v-model="dataForm.revisedBy" placeholder="修订单位"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item v-if="!isAdd" label-width="150px" label="状态" prop="status">
              <ren-select size="large" v-if="!readonly && !isAdd" v-model="dataForm.status"
                dict-type="plan_version_status" placeholder="状态"></ren-select>
              <div v-else-if="readonly" style="color: grey;">
                {{ getStatus(dataForm.status) }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :span="8">
          <el-form-item label="附件" prop="annex">
            <el-upload class="upload-demo" drag :action="uploadUrl"
              multiple :on-success="uploadSuccess" :on-error="uploadError" :limit="1">
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖动文件到这里或 <em>点击上传</em>
              </div>
              <template #tip>
                <!-- <div class="el-upload__tip">
                  jpg/png files with a size less than 500kb
                </div> -->
              </template>
            </el-upload>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
  import {
  	getToken
  } from "@/utils/cache";
  import app from "@/constants/app";
  import { useStore } from "vuex";
  import { findIndex, forEach } from "lodash";
  import { defineComponent, reactive } from "vue";
  import baseService from "@/service/baseService";
  import { useDebounce } from "@/utils/utils";
  import { UploadFilled } from '@element-plus/icons-vue';
  export default defineComponent({
    setup() {
      const store = useStore();
      return reactive({
        store,
        loading: false,
        visible: false,
        isFocus: false,
        uploadUrl: `${app.api}/sys/oss/upload?token=${getToken()}`,
        dataForm: {
          id: "",
          code: "",
          name: "",
          versionNumber: "",
          applicableScope: "",
          educationalSystem: "",
          graduate: "",
          revisionTime: "",
          effectiveTime: "",
          revisedBy: "",
          status: 0,
          creator: "",
          createDate: "",
          updater: "",
          updateDate: "",
          annex: ""
        },
        readonly: true,
        isAdd: false
      });
    },
    computed: {
      dataRule() {
        return {
          code: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          versionNumber: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          applicableScope: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        };
      }
    },
    created() {
      this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
    },
    activated() {
      this.init();
    },
    watch: {

    },
    methods: {
      uploadSuccess(res) {
        console.log(res);
        this.dataForm.annex = res.data.src ? res.data.src : "";
        console.log(this.dataForm);
      },
      uploadError(err) {
        this.$message.error("操作失败，请稍后重试");
      },
      init() {
        this.loading = false;
        let id = this.$route.query.id || '';
        if (id && id != '0') {
          this.dataForm.id = id;
          this.readonly = true;
          this.isAdd = false;
        } else {
          this.isAdd = true;
          this.readonly = false;
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
        baseService.get("/programme/caseversion/" + this.dataForm.id).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.dataForm = res.data;
          if (this.dataForm.status == 0) {
            this.readonly = false;
          } else {
            this.readonly = true;
          }
        });
      },
      // 表单提交
      dataFormSubmitHandle() {
        this.$refs["dataFormRef"].validate((valid : boolean) => {
          if (!valid) {
            return false;
          }
          this.loading = true;
          (!this.dataForm.id ? baseService.post : baseService.put)("/programme/caseversion", this.dataForm).then((res) => {
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
                this.goBack()
              }
            });
          });
        });
      },
      goBack() {
        const activeTabName = this.store.state.activeTabName;
        const tabs = this.store.state.tabs;
        const arr = activeTabName.split("-");
        console.log(arr);
        console.log(activeTabName);
        console.log(tabs);
        let index = findIndex(tabs, (x) => x.value === activeTabName);
        console.log(index);
        this.store.state.tabs.splice(index, 1);
        for (let i = 0; i <= tabs.length - 1; i++) {
          if (i != index) {
            console.log(tabs[i].value, tabs[i].value === arr[0]);
            if (tabs[i].value === arr[0]) {
              this.store.state.activeTabName = tabs[i].label;
              this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
              this.$router.push(tabs[i].value);
              return;
            }
          }
        }
        this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
        this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
        this.$router.push(this.store.state.activeTabName);
      },
      updateClosedTabs(closedTabs : any[], isTransform = true) {
        if (isTransform) {
          closedTabs = closedTabs.map((x) => x.value);
        }
        this.store.dispatch({
          type: "updateState",
          payload: {
            closedTabs
          }
        });
      },
      getStatus(status) {
        let text = "待生效";
        if (status == 0) {
          text = "待生效";
        } else if (status == 1) {
          text = "执行中";
        } else if (status == 2) {
          text = "中止";
        } else if (status == 3) {
          text = "废弃";
        }

        return text;
      }
    }
  });
</script>
