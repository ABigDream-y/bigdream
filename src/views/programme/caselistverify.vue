<template>
  <div class="mod-programme__caselist">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
      <!-- <el-form-item prop="grade">
				<ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
			</el-form-item> -->
      <el-form-item prop="number">
        <el-input v-model="dataForm.number" placeholder="编号"></el-input>
      </el-form-item>
      <el-form-item prop="level">
        <el-input v-model="dataForm.level" placeholder="方案层次"></el-input>
      </el-form-item>
      <el-form-item prop="instituteNo">
        <ren-institute-tree v-model="dataForm.instituteNo" @change="instituteChange" placeholder="学院" nodekey="number"
          showType="select"></ren-institute-tree>
      </el-form-item>
      <el-form-item prop="major" v-if="dataForm.instituteNo">
        <el-select v-model="dataForm.major" placeholder="专业">
          <el-option @click="majorChange(item)" v-for="(item, index) in majorList" :key="index" :value="item.name"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="grade" v-if="dataForm.major">
        <el-select v-model="dataForm.grade" placeholder="年级">
          <el-option v-for="(item, index) in gradeList" :key="index" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="majorDirection">
        <el-input v-model="dataForm.majorDirection" placeholder="专业方向" clearable></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="dataForm.name" placeholder="方案名称" clearable></el-input>
      </el-form-item>
      <el-form-item prop="eduSystem">
        <ren-select v-model="dataForm.eduSystem" dict-type="edu_system" placeholder="学制"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryResetHandle()">重置</el-button>
      </el-form-item>
      <br />
      <el-form-item v-if="hasPermission('programme:caselist:export')">
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <!-- <el-form-item v-if="hasPermission('programme:caselist:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item> -->
      <el-form-item v-if="hasPermission('programme:caselist:delete')">
        <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="multiAuditHandle('', 1)">批量通过</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" @click="multiAuditHandle('', 2)">批量不通过</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" :default-sort="defaultSort" @sort-change="dataListSortChangeHandle" border
      @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="number" label="编号" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="level" label="方案层次" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status == 0" type="info">待提交</el-tag>
          <el-tag v-if="scope.row.status == 2">待审核</el-tag>
          <el-tag type="success" v-if="scope.row.status == 1">已通过</el-tag>
          <el-tooltip class="item" effect="dark" placement="right" v-if="scope.row.status == 3">
            <template #content>未通过原因：<br />{{ scope.row.opinion }}</template>
            <el-tag type="danger">
              <div style="display: flex; align-items: center">
                未通过
                <el-icon style="margin-left: 5px">
                  <QuestionFilled />
                </el-icon>
              </div>
            </el-tag>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="方案名称" header-align="center" align="center" width="200">
        <template v-slot="scope">
          <span @click="detailHandle(scope.row)" class="primary-color">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="年级" sortable header-align="center" align="center" width="100">
        <template v-slot="scope">
          {{ getDictLabel("grade", scope.row.grade) }}
        </template>
      </el-table-column>
      <el-table-column prop="institute" label="院系" header-align="center" align="center" width="200"></el-table-column>
      <!-- <el-table-column prop="instituteNo" label="院系编号" header-align="center" align="center"></el-table-column> -->
      <el-table-column prop="major" label="专业" header-align="center" align="center" width="200"></el-table-column>
      <el-table-column prop="majorDirection" label="专业方向" header-align="center" align="center"
        width="200"></el-table-column>
      <el-table-column prop="eduSystem" label="学制" header-align="center" align="center" width="100">
        <template v-slot="scope">
          {{ getDictLabel("edu_system", scope.row.eduSystem) }}
        </template>
      </el-table-column>
      <el-table-column prop="startGrade" label="开始学年" header-align="center" align="center" width="150">
        <template v-slot="scope">
          {{ getDictLabel("school_year", scope.row.startGrade) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="startTerm" label="开始学期" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("term", scope.row.startTerm) }}
				</template>
			</el-table-column> -->
      <!-- <el-table-column prop="termType" label="学期类型" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("term_type", scope.row.termType) }}
				</template>
			</el-table-column> -->
      <!-- <el-table-column prop="courseType" label="修读类型" header-align="center" align="center"
				width="100"></el-table-column> -->
      <!-- <el-table-column prop="scoreMin" label="最少学分" header-align="center" align="center"
				width="100"></el-table-column> -->
      <!-- <el-table-column prop="academicDegree" label="学位" header-align="center" align="center"
				width="100"></el-table-column> -->

      <el-table-column prop="createDate" label="提交时间" header-align="center" align="center"
        width="200" sortable></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('programme:caselist:update') && dataForm.status == 2" type="text" size="small"
            @click="detailHandle(scope.row)">详情</el-button>
          <el-button v-if="hasPermission('programme:caselist:update') && (dataForm.status == 0 || dataForm.status == 3)"
            type="text" size="small" @click="myEditHandle(scope.row)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('programme:caselist:delete')" type="text" size="small"
            @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
          <el-button v-if="scope.row.status == 2" type="text" size="small"
            @click="multiAuditHandle(scope.row.id, 1)">通过</el-button>
          <el-button v-if="scope.row.status == 2" type="text" size="small"
            @click="multiAuditHandle(scope.row.id, 2)">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
      layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
      @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script lang="ts">
  import { registerDynamicToRouterAndNext } from "@/router";
  import { IObject } from "@/types/interface";
  import useView from "@/hooks/useView";
  import { defineComponent, reactive, toRefs } from "vue";
  import AddOrUpdate from "./caselist-add-or-update.vue";
  import baseService from "@/service/baseService";
  export default defineComponent({
    components: {
      AddOrUpdate
    },
    setup() {
      const state = reactive({
        getDataListURL: "/programme/caselist/page",
        getDataListIsPage: true,
        exportURL: "/programme/caselist/export",
        deleteURL: "/programme/caselist",
        routeName: "/programme-caselist-edit",
        routePath: "/programme/caselist-edit",
        routeTitle: "培养方案",
        deleteIsBatch: true,
        majorList: [] as IObject[],
        gradeList: [] as IObject[],
        dataForm: {
          grade: "",
          institute: "",
          instituteNo: "",
          major: "",
          majorDirection: "",
          name: "",
          eduSystem: "",
          status: 2,
          number: "",
          level: ""
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
    methods: {
      myEditHandle(data : Object) {
        let title = "";
        if(data.status == 2) {
          title = "详情";
        } else if(data.status == 0 || data.status == 3) {
          title = "编辑";
        } else {
          title = "详情";
        }
        const routeParams = {
          routeName: `programme-caselist-edit__${data.id ? data.id : 0}`,
          title: `${data.name} - ${title}`,
          path: `/programme/caselist-edit`,
          query: {
            id: data.id ? data.id : 0,
            _mt: `${data.name} - ${title}`
          }
        };
        registerDynamicToRouterAndNext(routeParams);
      },
      // 学院变更
      instituteChange(data ?: IObject) {
        if (data) {
          this.dataForm.major = "";
          this.majorList = data.children;
        } else {
          this.dataForm.major = "";
          this.majorList = [];
        }
      },
      // 专业变更
      majorChange(data : IObject) {
        this.dataForm.grade = "";
        this.gradeList = data.children;
      },
      detailHandle(data : IObject) {
        console.log("data", data);
        const routeParams = {
          routeName: `programme-casedetail__${data.id ? data.id : 0}`,
          title: `${data.name} - 详情`,
          path: `/programme/casedetail`,
          query: {
            id: data.id ? data.id : 0,
            _mt: `${data.name} - 详情`
          }
        };
        registerDynamicToRouterAndNext(routeParams);
      },
      //批量审核
      multiAuditHandle(id : string, status : number) {
        if (!id && (!this.dataListSelections || (this.dataListSelections && this.dataListSelections.length == 0))) {
          return this.$message.error("请选择至少一条数据");
        }
        let ids = [] as string[];
        let content = "";
        let confirm = "确定" + (status == 1 ? "批量通过" : "批量不通过") + "？";
        if (id) {
          ids = [id];
          content = "确定" + (status == 1 ? "通过" : "不通过") + "？";
        } else {
          let total = this.dataListSelections.length;
          ids = this.dataListSelections.filter((item : IObject) => item.status == 2).map((item : IObject) => item.id);
          content = "总共选择" + total + "条数据，其中" + ids.length + "条待审核数据，";
        }
        console.log(ids);
        if (ids.length == 0) {
          content += "至少选择一条待审核数据！";
          this.$confirm(content, this.$t("prompt.title"), {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning"
          });
        } else if (status == 1) {
          content += confirm;
          this.$confirm(content, this.$t("prompt.title"), {
            confirmButtonText: this.$t("confirm"),
            cancelButtonText: this.$t("cancel"),
            type: "warning"
          })
            .then(() => {
              this.verifyBatchHandle({
                id: this.dataForm.id,
                ids: ids.join(";"),
                status: 1,
                opinion: ""
              });
            })
            .catch((err) => {
              console.error(err);
            });
        } else if (status == 2) {
          content += confirm;
          this.$prompt(content, "填写审核未通过理由", {
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
              console.log("value---", value);
              this.verifyBatchHandle({
                id: this.dataForm.id,
                ids: ids.join(";"),
                status: 3,
                opinion: value
              });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      },
      verifyBatchHandle(data : IObject) {
        console.log("send request");
        baseService
          .get("/programme/caselist/batchAudit", data)
          .then((res) => {
            console.log("receive response");
            console.log(res);
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            }
            this.query();
            this.$message({
              type: "success",
              message: "操作成功",
              duration: 500
            });
          })
          .catch((err) => {
            console.log("receive response");
            console.error(err);
          });
      }
    }
  });
</script>
