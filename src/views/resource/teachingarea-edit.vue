<template>
  <div class="edit-card--file edit-card-page">
    <div class="aui-card-header">
      <el-button @click="goBack()"><el-icon>
          <ArrowLeft />
        </el-icon>返回</el-button>
      <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </div>
    <div class="edit-card__body">
      <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
        label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="场地类型" prop="mainCategory">
              <ren-select-data size="large" :disabled="!showType" v-model="dataForm.mainCategory" placeholder="场地类型"
                selectLabel="name" selectValue="id" dataUrl="/resource/teachingareatype/page"></ren-select-data>
              <!-- <el-input size="large" v-model="dataForm.name" placeholder="场地类型"></el-input> -->
            </el-form-item>
            <el-form-item label="场地名称" prop="name">
              <el-input size="large" v-model="dataForm.name" placeholder="场地名称"></el-input>
            </el-form-item>
            <el-form-item label="校区" prop="campus">
              <ren-select size="large" v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
            </el-form-item>
            <el-form-item label="楼层" prop="floor">
              <el-input size="large" v-model="dataForm.floor" placeholder="楼层"></el-input>
            </el-form-item>
            <el-form-item label="容量" prop="seats">
              <el-input-number size="large" v-model="dataForm.seats" placeholder="容量" :min="0"></el-input-number>
            </el-form-item>
            <el-form-item label="建筑面积" prop="area">
              <el-input size="large" v-model="dataForm.area" placeholder="建筑面积">
                <template #append>㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场地简称" prop="subName">
              <el-input size="large" v-model="dataForm.subName"></el-input>
            </el-form-item>
            <el-form-item label="教学楼" prop="building">
              <el-input size="large" v-model="dataForm.building" placeholder="教学楼"></el-input>
            </el-form-item>
            <el-form-item label="门牌号" prop="house">
              <el-input size="large" v-model="dataForm.house" placeholder="门牌号"></el-input>
            </el-form-item>
            <el-form-item label="考试座位数" prop="examSeats">
              <el-input-number size="large" v-model="dataForm.examSeats" placeholder="考试座位数" :min="0"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="托管部门" prop="department">
              <el-input size="large" v-model="dataForm.department" placeholder="托管部门"></el-input>
              <!-- <el-form-item>
                <ren-dept-tree v-model="dataForm.department" :placeholder="$t('dept.title')" :query="true"></ren-dept-tree>
              </el-form-item> -->
            </el-form-item>
            <el-form-item label="场地管理员电话" prop="administratorsMobile">
              <el-input size="large" v-model="dataForm.administratorsMobile" placeholder="场地管理员电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="场地管理员" prop="administrators">
              <el-input size="large" v-model="dataForm.administrators" placeholder="场地管理员"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <ren-radio-group size="large" v-model="dataForm.status" dict-type="enable_status"></ren-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input size="large" type="textarea" :rows="5" v-model="dataForm.remark" maxlength="255"
            show-word-limit></el-input>
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
          name: "",
          subName: "",
          campus: "",
          category: "",
          mainCategory: "",
          building: "",
          floor: "",
          house: "",
          seats: 0,
          examSeats: 0,
          area: "",
          department: "",
          administrators: "",
          administratorsMobile: "",
          remark: "",
          status: 1
        },
        showType: false
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
          administratorsMobile: [{ required: false, message: "请输入正确手机号", trigger: "blur", pattern: /^1[0-9]{10}$/ }],
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
        let query = this.$route.query;
        let id = query.id || "";
        if (id && id != "0") {
          this.dataForm.id = id;
        }
        let type = query.type || "";
        this.$nextTick(() => {
          this.$refs["dataFormRef"].resetFields();
          this.dataForm.mainCategory = type || "";
          if (type) {
            this.showType = false;
          } else {
            this.showType = true;
          }
          console.log("dataForm", this.dataForm);
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
        this.$refs["dataFormRef"].validate((valid : boolean) => {
          if (!valid) {
            return false;
          }
          console.log("提交", this.dataForm);
          this.loading = true;
          (!this.dataForm.id ? baseService.post : baseService.put)("/resource/teachingarea", this.dataForm).then((res) => {
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
        // this.store.state.activeTabName = "/resource/teachingareatype-detail";
        this.store.state.activeTabName = "/resource/teachingarealist";
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
      }
    }
  });
</script>
