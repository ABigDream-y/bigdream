<template>
  <div class="edit-card--file edit-card-page">
    <div class="aui-card-header">
      <el-button @click="goBack()">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        返回
      </el-button>
      <el-button v-if="dataForm.status == 0 || dataForm.status == 3" type="primary" :loading="loading"
        @click="dataFormSubmitHandle(0)">仅保存</el-button>
      <el-button type="primary" v-if="dataForm.status == 0 || dataForm.status == 3" :loading="loading"
        @click="dataFormSubmitHandle(2)">{{dataForm.status == 3?'重新':''}}提交申请</el-button>
      <el-button type="success" v-if="dataForm.status == 2" :loading="loading"
        @click="dataFormSubmitHandle(1)">审核通过</el-button>
      <el-button type="danger" v-if="dataForm.status == 2" :loading="loading"
        @click="dataFormSubmitHandle(3)">审核不通过</el-button>
    </div>
    <div class="edit-card__body">
      <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="120px">
        <h3 class="info-h3">
          <span style="margin-right:15px;">基本信息</span>
          <el-tag size="large" v-if="dataForm.status == 2">待审核</el-tag>
          <el-tag type="danger" v-if="dataForm.status == 3">未通过</el-tag>
          <el-tag type="success" v-if="dataForm.status == 1">已通过</el-tag>
          <el-tag type="info" v-if="dataForm.status == 0">待提交</el-tag>
        </h3>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="方案名称" prop="name">
              <el-input :readonly="readonly" v-model="dataForm.name" size="large" placeholder="方案名称"></el-input>
            </el-form-item>
            <el-form-item label="编号" prop="number">
              <el-input :readonly="readonly" v-model="dataForm.number" size="large" placeholder="编号"></el-input>
            </el-form-item>
            <el-form-item label="方案层次" prop="level">
              <el-input :readonly="readonly" v-model="dataForm.level" size="large" placeholder="方案层次"></el-input>
            </el-form-item>
            <el-form-item label="学制" prop="eduSystem">
              <ren-select v-if="!readonly" v-model="dataForm.eduSystem" size="large" dict-type="edu_system"
                placeholder="学制"></ren-select>
              <el-input v-else readonly v-model="dataForm.eduSystem" size="large" placeholder="学制"></el-input>
            </el-form-item>
            <el-form-item label="学位" prop="academicDegree">
              <ren-select v-if="!readonly" v-model="dataForm.academicDegree" size="large" dict-type="degree_type"
                placeholder="学位"></ren-select>
              <el-input v-else readonly v-model="dataForm.academicDegree" size="large" dict-type="degree_type"
                placeholder="学位"></el-input>
            </el-form-item>

          </el-col>
          <el-col :span="8">
            <!-- <el-form-item label="年级" prop="grade">
							<ren-select v-model="dataForm.grade" size="large" dict-type="grade"
								placeholder="年级"></ren-select>
						</el-form-item> -->

            <el-form-item label="学院" prop="instituteNo">
              <ren-institute-tree v-if="!readonly" v-model="dataForm.instituteNo" :deptName="dataForm.institute"
                @change="instituteChange" size="large" placeholder="学院" nodekey="number"
                showType="select"></ren-institute-tree>
              <el-input v-else readonly v-model="dataForm.institute" size="large" placeholder="学院"
                showType="select"></el-input>
            </el-form-item>
            <el-form-item label="专业" prop="major">
              <el-select v-if="!readonly" v-model="dataForm.major" size="large" placeholder="专业">
                <el-option @click="majorChange(item)" v-for="(item,index) in majorList" :key="index" :value="item.name"
                  :label="item.name"></el-option>
              </el-select>
              <el-input v-else readonly v-model="dataForm.major" size="large" placeholder="专业">
              </el-input>
            </el-form-item>
            <el-form-item label="年级" prop="grade">
              <el-select v-if="!readonly" v-model="dataForm.grade" size="large" placeholder="年级">
                <el-option v-for="(item, index) in gradeList" :key="index" :value="item.name"
                  :label="item.name"></el-option>
              </el-select>
              <el-input v-else readonly v-model="dataForm.grade" size="large" placeholder="年级">
              </el-input>
            </el-form-item>
            <el-form-item label="专业方向" prop="majorDirection">
              <el-input :readonly="readonly" v-model="dataForm.majorDirection" size="large"
                placeholder="专业方向"></el-input>
            </el-form-item>
            <el-form-item label="最少学分" prop="scoreMin">
              <el-input-number v-if="!readonly" v-model="dataForm.scoreMin" size="large" placeholder="最少学分"
                :min="0"></el-input-number>
              <el-input v-else readonly v-model="dataForm.scoreMin" size="large" placeholder="最少学分"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始学年" prop="startGrade">
              <ren-select v-if="!readonly" v-model="dataForm.startGrade" size="large" dict-type="school_year"
                placeholder="开始学年"></ren-select>
              <el-input v-else readonly v-model="dataForm.startGrade" size="large" dict-type="school_year"
                placeholder="开始学年"></el-input>
            </el-form-item>
            <el-form-item label="开始学期" prop="startTerm">
              <ren-select v-if="!readonly" v-model="dataForm.startTerm" size="large" dict-type="term"
                placeholder="开始学期"></ren-select>
              <el-input v-else readonly v-model="dataForm.startTerm" size="large" dict-type="term"
                placeholder="开始学期"></el-input>
            </el-form-item>
            <el-form-item label="学期类型" prop="termType">
              <ren-select v-if="!readonly" v-model="dataForm.termType" size="large" dict-type="term_type"
                placeholder="学期类型"></ren-select>
              <el-input v-else readonly v-model="dataForm.termType" size="large" dict-type="term_type"
                placeholder="学期类型"></el-input>
            </el-form-item>
            <el-form-item label="修读类型" prop="courseType">
              <ren-select v-if="!readonly" v-model="dataForm.courseType" size="large" dict-type="course_category"
                placeholder="修读类型"></ren-select>
              <el-input v-else readonly v-model="dataForm.courseType" size="large" dict-type="course_category"
                placeholder="修读类型"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <h3>其他信息</h3>
        <el-form-item label="培养目标" prop="trainObjective">
          <el-input :readonly="readonly" type="textarea" size="large" v-model="dataForm.trainObjective" :rows="5"
            show-word-limit maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="修读要求" prop="readingRequirements">
          <el-input :readonly="readonly" type="textarea" size="large" v-model="dataForm.readingRequirements" :rows="5"
            show-word-limit maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="方案特色" prop="programFeatures">
          <el-input :readonly="readonly" type="textarea" size="large" v-model="dataForm.programFeatures" :rows="5"
            show-word-limit maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="主干学科" prop="majorDisciplines">
          <el-input :readonly="readonly" type="textarea" size="large" v-model="dataForm.majorDisciplines" :rows="5"
            show-word-limit maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="主干课程" prop="mainCourses">
          <el-input :readonly="readonly" type="textarea" size="large" v-model="dataForm.mainCourses" :rows="5"
            show-word-limit maxlength="255"></el-input>
        </el-form-item>
        <el-form-item label="主要专业实验" prop="mainProfessionalExperiments">
          <el-input :readonly="readonly" type="textarea" size="large" v-model="dataForm.mainProfessionalExperiments"
            :rows="5" show-word-limit maxlength="255"></el-input>
        </el-form-item>
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
        gradeList: [] as IObject[],
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
          updateDate: "",
          number: "",
          level: "",
          opinion: ""
        },
        readonly: false
      });
    },
    computed: {
      dataRule() {
        return {
          number: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          level: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          instituteNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          major: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          grade: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          startGrade: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          startTerm: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
          eduSystem: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],

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
        let id = this.$route.query.id || '';
        if (id && id != '0') {
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
        baseService.get("/programme/caselist/" + this.dataForm.id).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.dataForm = res.data;
          if (this.dataForm.status == 2) { // 待审核
            this.readonly = true;
          } else if (this.dataForm.status == 0 || this.dataForm.status == 3) {
            this.readonly = false;
          } else {
            this.readonly = true;
          }
        });
      },
      // 学院变更
      instituteChange(data ?: IObject) {
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
      // 专业变更
      majorChange(data : IObject) {
        this.dataForm.grade = "";
        this.gradeList = data.children;
      },
      // 表单提交
      dataFormSubmitHandle(status : number) {
        this.$refs["dataFormRef"].validate((valid : boolean) => {
          if (!valid) {
            return false;
          }

          if (status == 3) {
            this.$prompt("", "填写审核未通过理由", {
              confirmButtonText: "确认",
              cancelButtonText: "取消",
              inputType: "textarea",
              inputValidator: (value : string) => {
                if (!value) {
                  return "理由不能为空！";
                }
              }
            })
              .then(({ value }) => {
                this.loading = true;
                this.dataForm.opinion = value;
                let postData = JSON.parse(JSON.stringify(this.dataForm));
                postData['status'] = status;
                console.log("postData ", postData);
                (!this.dataForm.id ? baseService.post : baseService.put)("/programme/caselist", postData).then((res) => {
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
              })
              .catch((err) => {
                console.error(err);
              });
          } else {
            this.loading = true;
            let postData = JSON.parse(JSON.stringify(this.dataForm));
            postData['status'] = status;
            console.log("postData ", postData);
            (!this.dataForm.id ? baseService.post : baseService.put)("/programme/caselist", postData).then((res) => {
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
          }



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