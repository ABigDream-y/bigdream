<template>
  <div>
    <div class="edit-card--file edit-card-page">
      <div class="aui-card-header">
        <el-button @click="goBack()"
          ><el-icon> <ArrowLeft /> </el-icon>返回</el-button
        >
        <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
      </div>
      <div class="edit-card__body">
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="学年" prop="year">
                <el-select v-model="dataForm.year" class="m-2" placeholder="学年" size="large" clearable v-if="dataForm.id || !dataForm.parent" @change="selectYearChange">
                  <el-option v-for="(item, index) in yearList" :key="index" :label="item" :value="item" />
                </el-select>
                <el-input disabled size="large" v-model="dataForm.year" placeholder="学年" v-else></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学期" prop="semester">
                <el-select v-model="dataForm.semester" class="m-2" placeholder="学期" size="large" clearable v-if="dataForm.id || !dataForm.parent">
                  <view v-for="item in yearSemesterList" :key="item.id">
                    <el-option :label="item.semester" :value="item.semester" v-if="dataForm.year && dataForm.year == item.year" @click="selectSemesterHandle(item.id)" />
                  </view>
                </el-select>
                <el-input disabled size="large" v-model="dataForm.semester" placeholder="学年" v-else></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="场地名称" prop="name">
                <el-input readonly size="large" v-model="dataForm.name" placeholder="场地名称"></el-input>
                &nbsp;&nbsp;
                <el-button type="warning" @click="selectHandle()" v-if="!dataForm.id">选择场地</el-button>
              </el-form-item>
              <el-form-item label="场地简称" prop="subName">
                <el-input readonly size="large" v-model="dataForm.subName" placeholder="场地简称"></el-input>
              </el-form-item>
              <el-form-item label="校区" prop="campus">
                <el-input readonly size="large" v-model="dataForm.campus" placeholder="校区"></el-input>
              </el-form-item>
              <el-form-item label="场地类型" prop="mainCategory">
               <!-- <el-input readonly size="large" v-model="dataForm.mainCategory" placeholder="场地类型"></el-input> -->
                <ren-select-data size="large" disabled v-model="dataForm.mainCategory" placeholder="场地类型" selectLabel="name" selectValue="id" dataUrl="/resource/teachingareatype/page"></ren-select-data>
              </el-form-item>
              <el-form-item label="建筑面积" prop="area">
                <el-input readonly size="large" v-model="dataForm.area" placeholder="建筑面积">
                  <template #append>㎡</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教学楼" prop="building">
                <el-input readonly size="large" v-model="dataForm.building" placeholder="教学楼"></el-input>
              </el-form-item>
              <el-form-item label="楼层号" prop="floor">
                <el-input readonly size="large" v-model="dataForm.floor" placeholder="楼层号"></el-input>
              </el-form-item>
              <el-form-item label="门牌号" prop="house">
                <el-input readonly size="large" v-model="dataForm.house" placeholder="门牌号"></el-input>
              </el-form-item>
              <el-form-item label="容量" prop="seats">
                <el-input-number disabled size="large" v-model="dataForm.seats" placeholder="容量" :min="0"></el-input-number>
              </el-form-item>
              <el-form-item label="考试座位数" prop="examSeats">
                <el-input-number disabled size="large" v-model="dataForm.examSeats" placeholder="考试座位数" :min="0"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="托管部门" prop="department">
                <el-input readonly size="large" v-model="dataForm.department" placeholder="托管部门"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="场地管理员" prop="administrators">
                <el-input readonly size="large" v-model="dataForm.administrators" placeholder="场地管理员"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="场地管理员电话" prop="administratorsMobile">
                <el-input readonly size="large" v-model="dataForm.administratorsMobile" placeholder="场地管理员电话"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="是否可排课" prop="isSchedulingAllowed">
                <!-- <el-input size="large" v-model="dataForm.isSchedulingAllowed" placeholder="是否可排课"></el-input> -->
                <el-radio-group v-model="dataForm.isSchedulingAllowed" class="ml-4">
                  <el-radio :label="1" size="large">是</el-radio>
                  <el-radio :label="0" size="large">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否忽略冲突排课" prop="isConflictIgnored">
                <!-- <el-input size="large" v-model="dataForm.isConflictIgnored" placeholder="是否忽略冲突排课"></el-input> -->
                <el-radio-group v-model="dataForm.isConflictIgnored" class="ml-4">
                  <el-radio :label="1" size="large">是</el-radio>
                  <el-radio :label="0" size="large">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否可排考" prop="isExamSchedulingAllowed">
                <!-- <el-input size="large" v-model="dataForm.isExamSchedulingAllowed" placeholder="是否可排考"></el-input> -->
                <el-radio-group v-model="dataForm.isExamSchedulingAllowed" class="ml-4">
                  <el-radio :label="1" size="large">是</el-radio>
                  <el-radio :label="0" size="large">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否可借用" prop="isBorrowingAllowed">
                <!-- <el-input size="large" v-model="dataForm.isBorrowingAllowed" placeholder="是否可借用"></el-input> -->
                <el-radio-group v-model="dataForm.isBorrowingAllowed" class="ml-4">
                  <el-radio :label="1" size="large">是</el-radio>
                  <el-radio :label="0" size="large">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <el-input size="large" type="textarea" :rows="5" v-model="dataForm.remark" maxlength="255" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <!-- <el-input v-model="dataForm.status" placeholder="状态"></el-input> -->
            <ren-radio-group disabled size="large" v-model="dataForm.status" dict-type="enable_status"></ren-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 选择教学场地 -->
    <TeachingareaSelect v-if="addOrUpdateVisible" ref="addOrUpdate" @confirm="confirmTeachingArea"> </TeachingareaSelect>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { findIndex } from "lodash";
import { registerDynamicToRouterAndNext } from "@/router";
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
import TeachingareaSelect from "./uni-teachingarea-select.vue";
export default defineComponent({
  components: { TeachingareaSelect },
  setup() {
    const store = useStore();
    return reactive({
      store,
      loading: false,
      visible: false,
      addOrUpdateVisible: false,
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
        isSchedulingAllowed: 1,
        isConflictIgnored: 1,
        isExamSchedulingAllowed: 1,
        isBorrowingAllowed: 1,
        department: "",
        administrators: "",
        administratorsMobile: "",
        remark: "",
        status: 1,
        parent: ""
      },
      parent: "",
      yearSemesterList: [],
      yearList: []
    });
  },
  computed: {
    dataRule() {
      return {
        year: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        semester: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        mainCategory: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        building: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        floor: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        house: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        seats: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        isSchedulingAllowed: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        isConflictIgnored: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        isExamSchedulingAllowed: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        isBorrowingAllowed: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
      console.log(query.id);
      let id = query.id || "";
      console.log(query);
      if (id && id != "0") {
        this.dataForm.id = id;
      }
      // 学年学期
      baseService.get("/resource/yearsemesterteachingarea/page").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        if (res.data.total > 0) {
          let yearList = [];
          this.yearSemesterList = res.data.list;
          this.yearSemesterList.map((item) => {
            // 学年列表
            yearList.push(item.year);

            // 学年学期列表新增
            if (query.parentId && !id) {
              this.dataForm.parent = query.parentId;
              // let yearSemester = {};
              if (item.id == query.parentId) {
                this.dataForm.year = item.year;
                this.dataForm.semester = item.semester;
              }
            }
          });
          this.yearList = new Set(yearList);
        }
      });

      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        console.log(this.dataForm);
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/resource/semesterteachingarea/" + this.dataForm.id).then((res) => {
        console.log("res ", res);
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
        console.log("data ", this.dataForm);
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        if (!this.dataForm.parent) {
          this.dataForm.parent = this.parentId;
        }
        this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/resource/semesterteachingarea", this.dataForm).then((res) => {
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
      this.store.state.activeTabName = "/resource/yearsemesterteachingarea";
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
    },
    selectHandle() {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(this.dataForm.parent);
      });
    },
    confirmTeachingArea(data: any) {
      console.log("data", data);
      this.dataForm = {
        ...this.dataForm,
        ...data,
        id: "",
        teachingAreaId: data.id
      };
      console.log(this.dataForm);
      this.addOrUpdateVisible = false;
    },
    selectSemesterHandle(id: string) {
      console.log(id);
      this.parent = id;
    },
    // 学年变更
    selectYearChange() {
      this.dataForm.semester = "";
    }
  }
});
</script>
