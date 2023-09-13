<template>
  <div class="mod-plan__planrecord">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
      <!-- <el-form-item prop="grade">
				<ren-select v-model="dataForm.grade" dict-type="school_year"
					placeholder="所属学年"></ren-select>
			</el-form-item>
			<el-form-item prop="term">
				<ren-select v-model="dataForm.term" dict-type="term"
					placeholder="所属学期"></ren-select>
			</el-form-item> -->
      <el-form-item prop="courseNo">
        <el-input v-model="dataForm.courseNo" placeholder="课程号" clearable></el-input>
      </el-form-item>
      <el-form-item prop="courseName">
        <el-input v-model="dataForm.courseName" placeholder="课程名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="instituteNo">
        <ren-institute-tree v-model="dataForm.instituteNo" :deptName="dataForm.institute" @change="instituteChange"
          placeholder="学院" nodekey="number" showType="select"></ren-institute-tree>
      </el-form-item>
      <!-- <el-form-item prop="major" v-if="dataForm.instituteNo"> -->
      <el-form-item prop="major">
        <el-select v-model="dataForm.major" placeholder="专业">
          <el-option @click="majorChange(item)" v-for="(item,index) in majorList" :key="index" :value="item.name"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="grade">
        <!-- <el-form-item prop="grade" v-if="dataForm.grade"> -->
        <el-select v-model="dataForm.grade" placeholder="年级">
          <el-option v-for="(item, index) in gradeList" :key="index" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="level">
        <el-input v-model="dataForm.level" placeholder="方案层次"></el-input>
      </el-form-item>
      <el-form-item prop="status">
        <ren-select v-model="dataForm.status" dict-type="plan_course_status" placeholder="课程状态"></ren-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryResetHandle()">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="multiAuditHandle('',1)">批量通过</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="multiAuditHandle('',2)">批量不通过</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('plan:planrecord:export')">
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
      style="width: 100%" :default-sort="defaultSort" @sort-change="dataListSortChangeHandle">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center" width="100">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status == 0">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">已通过</el-tag>
          <el-tooltip class="item" effect="dark" placement="right" v-if="scope.row.status == 2">
            <template #content>未通过原因：<br />{{scope.row.description}}</template>
            <el-tag type="danger">
              <div style="display:flex;align-items:center;">
                未通过
                <el-icon style="margin-left:5px;">
                  <QuestionFilled />
                </el-icon>
              </div>
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="courseNo" label="课程号" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="courseName" label="课程名" header-align="center" align="center" width="200"></el-table-column>
      <!-- <el-table-column prop="courseType" label="课程类别" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("course_category", scope.row.courseType) }}
				</template>
			</el-table-column>
			<el-table-column prop="courseShape" label="课程性质" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("course_mode", scope.row.courseShape) }}
				</template>
			</el-table-column> -->
      <el-table-column prop="level" label="行政班" header-align="center" align="center" width="100">
        <template v-slot="scope">
          <el-button type="text" @click="adminClassHandle(scope.row)">{{scope.row.classNumber}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="credit" label="学分" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="hours" label="学时" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="startGrade" label="所属学年" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <span v-if="scope.row.planDTO">
            {{ getDictLabel("school_year", scope.row.planDTO.startGrade) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="startTerm" label="所属学期" header-align="center" align="center" width="100">
        <template v-slot="scope">
          <span v-if="scope.row.planDTO">
            {{ getDictLabel("school_year", scope.row.planDTO.startTerm) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="方案层次" header-align="center" align="center" width="100">
        <template v-slot="scope">
          <span v-if="scope.row.planDTO">
            {{scope.row.planDTO.level}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="所属计划" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <span v-if="scope.row.planDTO">
            {{scope.row.planDTO.name}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="institute" label="院系" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <span v-if="scope.row.planDTO">
            {{scope.row.planDTO.institute}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="major" label="专业" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <span v-if="scope.row.planDTO">
            {{scope.row.planDTO.major}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="majorDirection" label="专业方向" header-align="center" align="center" width="100">
        <template v-slot="scope">
          <span v-if="scope.row.planDTO">
            {{scope.row.planDTO.majorDirection}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="年级" header-align="center" align="center" width="100">
        <template v-slot="scope">
          <span v-if="scope.row.planDTO">
            {{scope.row.planDTO.grade}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="courseCategory" label="课程类别" header-align="center" align="center" width="100">
        <template v-slot="scope">
          {{ getDictLabel("course_category", scope.row.courseCategory) }}
        </template>
      </el-table-column>
      <el-table-column prop="courseType" label="课程分类" header-align="center" align="center" width="100">
        <template v-slot="scope">
          {{ getDictLabel("course_type", scope.row.courseType) }}
        </template>
      </el-table-column>
      <el-table-column prop="courseMode" label="教学方式" header-align="center" align="center" width="100">
        <template v-slot="scope">
          {{ getDictLabel("course_mode", scope.row.courseMode) }}
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" width="200"
        sortable></el-table-column>
      <!-- <el-table-column prop="description" label="变更说明" header-align="center" align="center"></el-table-column> -->
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="scope.row.status == 0" type="text" size="small"
            @click="multiAuditHandle(scope.row.id,1)">通过</el-button>
          <el-button v-if="scope.row.status == 0" type="text" size="small"
            @click="multiAuditHandle(scope.row.id,2)">不通过</el-button>
          <el-button type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
          <el-button v-if="hasPermission('plan:planrecord:delete') && scope.row.status != 1" type="text" size="small"
            @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
      layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"> </el-pagination>
    <el-dialog width="80%" v-model="planAdminClassVisible" :title="planAdminClassTitle" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <plan-admin-class ref="planAdminClass"></plan-admin-class>
    </el-dialog>
    <!-- 行政班 -->

  </div>
</template>

<script lang="ts">
  import { IObject } from "@/types/interface";
  import useView from "@/hooks/useView";
  import { defineComponent, reactive, toRefs } from "vue";
  import AddOrUpdate from "./planrecord-add-or-update.vue";
  import baseService from "@/service/baseService";
  import PlanAdminClass from "./plan-admin-class.vue";
  import { registerDynamicToRouterAndNext } from "@/router";
  export default defineComponent({
    components: {
      PlanAdminClass,
    },
    setup() {
      const state = reactive({
        planAdminClassTitle: "",
        planAdminClassVisible: false,
        courseVisible: false,
        createdIsNeed: false,
        getDataListURL: "/plan/planrecord/page",
        getDataListIsPage: true,
        exportURL: "/plan/planrecord/export",
        deleteURL: "/plan/planrecord",
        routeName: '/plan-planrecord-edit',
        routePath: '/plan/planrecord-edit',
        routeTitle: '教学计划调整课程',
        // 生成教学计划
        createLessonPlanURL: "/plan/planrecord/generatePlan",
        // 批量添加课程
        batchAddCourseURL: "",
        deleteIsBatch: true,
        majorList: [] as IObject[],
        gradeList: [] as IObject[],
        dataForm: {
          id: "",
          grade: "",
          term: "",
          planId: "",
          courseNo: "",
          courseName: "",
          status: "",
          institute: "",
          instituteNo: "",
          major: "",
          status: "",
          startGrade: "",
          startTerm: "",
          level: ""
        } as IObject,
        planForm: {
          id: "",
          name: ""
        },
        plan: {
          startGrade: "",
          startTerm: ""
        },
        defaultSort: {
          prop: "createDate",
          order: "descending"
        },
        order: "desc",
        orderField: "create_date"
      });
      return { ...useView(state), ...toRefs(state) };
    },
    watch: {},
    activated() {
      console.log('roter', this.$route);
      let query = this.$route.query;
      console.log('query', query);

      this.query();
    },
    methods: {
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
      toAddOrUpdate(data ?: IObject) {
        let query = {} as IObject;
        if (data) {
          query.id = data.id;
        }
        query.planId = this.dataForm.planId
        this.editWidthParamsHandle(query);
      },
      //行政班
      adminClassHandle(data : IObject) {
        this.planAdminClassTitle = data.courseName + "-行政班";
        if (data.planDTO) {
          this.planAdminClassVisible = true;
          this.$nextTick(() => {
            this.$refs.planAdminClass.init(data.planDTO.id);
          })
        } else {
          this.$message.error('教学计划已被删除！')
        }

      },
      // 详情
      detailHandle(data : IObject) {
        console.log("data", data);
        const routeParams = {
          routeName: `plan-planDetail-edit__${data.id}`,
          title: `教学计划课程明细 - ${data.courseName}`,
          path: `/plan/plancourselist-detail`,
          query: {
            id: data.id,
            _mt: `教学计划课程明细 - ${data.courseName}`
          }
        };
        registerDynamicToRouterAndNext(routeParams);
      },
      //批量审核
      multiAuditHandle(id : string, status : number) {
        if (!id && (!this.dataListSelections || (this.dataListSelections && this.dataListSelections.length == 0))) {
          return this.$message.error('请选择至少一条数据')
        }

        let that = this;
        let ids = [] as string[];
        let content = "";
        let confirm = "确定" + (status == 1 ? '批量通过' : '批量不通过') + "？";
        if (id) {
          ids = [id];
          confirm = "确定" + (status == 1 ? '通过' : '不通过') + "？";
        } else {
          let total = this.dataListSelections.length;
          ids = this.dataListSelections.filter((item : IObject) => item.status == 0).map((item : IObject) => item.id);
          content = "总共选择" + total + "条数据，其中" + ids.length + "条待审核数据，";
        }
        console.log(ids);
        if (ids.length == 0) {
          content += "至少选择一条待审核数据！"
          this.$confirm(content, this.$t("prompt.title"), {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning"
          }).then(() => {
          }).catch(() => {
          });
        }
        else if (status == 1) {
          content += confirm;
          this.$confirm(content, this.$t("prompt.title"), {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning"
          }).then(() => {
            that.verifyBatchHandle({
              planId: this.planForm.id,
              ids: ids.join(';'),
              status: 1,
              opinion: ""
            })
          }).catch(() => {
            //
          });
        } else if (status == 2) {
          content += confirm;
          this.$prompt(content, '填写审核未通过理由', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            inputType: "textarea",
            inputValidator: (value : string) => {
              if (!value) {
                return '理由不能为空！';
              }
            }
          }).then(({ value }) => {
            console.log('value---', value)
            that.verifyBatchHandle({
              planId: this.planForm.id,
              ids: ids.join(';'),
              status: 2,
              opinion: value
            })

          }).catch(() => {

          });
        }
        // this.vertifyVisible = true;
        // this.$nextTick(() => {
        // 	this.$refs.vertifyDialogRef.init();
        // });
        // console.log("哈哈", this.dataListSelections);
      },
      verifyBatchHandle(data : IObject) {
        baseService.get("/plan/planrecord/batchAudit", data).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.query();
        });
      },
      //批量选择课程新增
      batchAddCourse() {
        this.courseVisible = true;
        this.$nextTick(() => {
          this.$refs['courseDialog'].init();
        })
      },
      confirmCourse(data : IObject) {
        console.log('data---')
      }
    }
  });
</script>
