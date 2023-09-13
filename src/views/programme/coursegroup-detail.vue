<template>
  <div class="edit-card--file">
    <div class="aui-tab-header" style="z-index: 999">
      <el-button @click="goBack()">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回
      </el-button>
    </div>
    <div class="aui-tab-body">
      <el-tabs v-model="activeName" tab-position="top" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="编辑" name="edit">
          <div class="demo-tabs-item edit-card-page">
            <coursegroupedit ref="edit"></coursegroupedit>
          </div>
        </el-tab-pane>
        <el-tab-pane label="课程列表" name="list">
          <div class="demo-tabs-item">
            <casecourse ref="list"></casecourse>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { getDictLabel } from "@/utils/utils";
import { useStore } from "vuex";
import { findIndex } from "lodash";
import { defineComponent, reactive } from "vue";

import coursegroupedit from "./coursegroup-edit.vue";
import casecourse from "./casecourse.vue";

export default defineComponent({
  components: {
    coursegroupedit,
    casecourse
  },
  setup() {
    const store = useStore();
    return reactive({
      store,
      loading: false,
      visible: false,
      activeName: "edit",
      dataForm: {
        id: "",
        grade: "",
        institute: "",
        instituteNo: "",
        major: "",
        majorDirection: "",
        name: "",
        eduSystem: "",
        startGrade: "",
        startTerm: "",
        termType: "",
        courseType: "",
        scoreMin: "",
        academicDegree: "",
        trainObjective: "",
        readingRequirements: "",
        programFeatures: "",
        majorDisciplines: "",
        mainCourses: "",
        mainProfessionalExperiments: "",
        status: 0,
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
        // name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
      };
    }
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.loading = false;
      let id = this.$route.query.id || "";
      let tab = this.$route.query.tab || "edit";
      console.log("id：", id);
      if (id && id != "0") {
        this.dataForm.id = id;
      }
      this.activeName = tab;
      this.$nextTick(() => {
        this.$refs[this.activeName].init();
      });
    },
    handleClick(tab: any) {
      let name = tab.props.name;
      this.activeName = name;
      this.$nextTick(() => {
        this.$refs[name].init();
      });
    },
    getDictLabelHandle(dictType: string, dictValue: number) {
      return getDictLabel(this.store.state.dicts, dictType, dictValue);
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

<style scoped>
:deep(.mod-programme__groupcourse .el-card__body) {
  padding: 10px;
}
</style>
