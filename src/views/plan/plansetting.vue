<template>
  <div>
    <div class="edit-card--file edit-card-page" style="position: relative;">
      <div class="aui-card-header">
        <el-button v-if="hasPermission('plan:plansetting:save')" type="primary" :loading="loading"
          @click="dataFormSubmitHandle()">计划参数维护保存</el-button>
      </div>
      <div class="edit-card__body">
        <h3 class="info-h3">计划参数维护</h3>
        <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
          label-width="250px">
          <el-form-item label="是否开放" prop="openStatus">
            <ren-radio-group v-model="dataForm.openStatus" dict-type="yesOrNo"></ren-radio-group>
          </el-form-item>
          <el-form-item label="是否可以从课程库添加课程" prop="status">
            <ren-radio-group v-model="dataForm.status" dict-type="yesOrNo"></ren-radio-group>
          </el-form-item>
          <el-form-item label="教学计划提交后对应的审核状态" prop="checkStatus">
            <el-radio-group v-model="dataForm.checkStatus">
              <el-radio :label="0">待审核</el-radio>
              <el-radio :label="1">已审核</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否读取培养方案指导教学计划生成" prop="planStatus">
            <ren-radio-group v-model="dataForm.planStatus" dict-type="yesOrNo"></ren-radio-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="计划学年" prop="schoolYear">
                <ren-select v-model="dataForm.schoolYear" size="large" dict-type="school_year"
                  placeholder="计划学年"></ren-select>
              </el-form-item>
              <!-- <el-form-item label="开始日期" prop="startDate">
    						<el-date-picker type="date" placeholder="开始日期" value-format="YYYY-MM-DD"
    							v-model="dataForm.startDate" size="large"></el-date-picker>
    					</el-form-item> -->
              <el-form-item label="日期" prop="date">
                <el-date-picker v-model="dataForm.date" type="daterange" unlink-panels range-separator="-"
                  start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" size="large" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划学期" prop="term">
                <ren-select v-model="dataForm.term" size="large" dict-type="term" placeholder="计划学期"></ren-select>
              </el-form-item>
              <!-- <el-form-item label="结束日期" prop="endDate">
    						<el-date-picker type="date" placeholder="结束日期" value-format="YYYY-MM-DD"
    							v-model="dataForm.endDate" size="large"></el-date-picker>
    					</el-form-item> -->
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div>
      <h3 class="info-h3">特殊院系设置（{{total}}）</h3>
      <!-- PlanSettingInstitute -->
      <plan-setting-institute ref="planSettingInstitute" @refreshTotal="getSpecialTotal"></plan-setting-institute>
    </div>
  </div>
</template>

<script lang="ts">
  import { checkPermission, getDictLabel } from "@/utils/utils";
  import { useStore } from "vuex";
  import { findIndex } from "lodash";
  import { defineComponent, reactive } from "vue";
  import baseService from "@/service/baseService";
  import { useDebounce } from "@/utils/utils";
  import PlanSettingInstitute from "./plansettinginstitute.vue";
  export default defineComponent({
    components: {
      PlanSettingInstitute
    },
    setup() {
      const store = useStore();
      return reactive({
        store,
        loading: false,
        visible: false,
        dataForm: {
          id: "",
          openStatus: 1,
          status: 1,
          checkStatus: 0,
          planStatus: 1,
          startDate: "",
          endDate: "",
          schoolYear: "",
          term: "",
          date: ""
        },
        total: 0
      });
    },
    computed: {
      dataRule() {
        return {
        };
      }
    },
    watch: {
      dataForm: {
        handler(val) {
          console.log(val);
          if (val.date != null) {
            console.log(val.date[0], "-", val.date[1]);
            this.dataForm.startDate = val.date[0];
            this.dataForm.endDate = val.date[1];
          } else {
            this.dataForm.startDate = "";
            this.dataForm.endDate = "";
          }
        },
        deep: true
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
        this.$nextTick(() => {
          this.$refs["dataFormRef"].resetFields();
          this.getInfo();
        });
      },
      // 获取信息
      getInfo() {
        // baseService.get("/plan/plansetting/" + this.dataForm.id).then((res) => {
        // 	if (res.code !== 0) {
        // 		return this.$message.error(res.msg);
        // 	}
        // 	this.dataForm = res.data;
        // });
        baseService.get("/plan/plansetting/page", {
          page: 1,
          limit: 9999
        }).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          let dataList = res.data.list;
          if (dataList.length != 0) {
            this.dataForm = {
              ...this.dataForm,
              ...dataList[0]
            }
          } else {
            this.dataForm.id = '';
          }
          console.log('dataList', dataList)
          this.dataForm = {
            ...dataList[0],
            date: [dataList[0].startDate, dataList[0].endDate]
          };
          console.log("dataForm: ", this.dataForm);
        });
      },
      hasPermission(key : string) {
        return checkPermission(this.store.state.permissions as string[], key);
      },
      // 特殊院系总数
      getSpecialTotal(total : number) {
        this.total = total;
      },
      // 表单提交
      dataFormSubmitHandle() {
        this.$refs["dataFormRef"].validate((valid : boolean) => {
          if (!valid) {
            return false;
          }
          this.loading = true;
          (!this.dataForm.id ? baseService.post : baseService.put)("/plan/plansetting", this.dataForm).then((res) => {
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
                this.init()
              }
            });
          });
        });
      },

    }
  });
</script>
