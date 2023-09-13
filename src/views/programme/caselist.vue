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
      <!-- <el-form-item prop="status">
				<ren-select v-model="dataForm.status" dict-type="verify_status" placeholder="状态"></ren-select>
			</el-form-item> -->
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryResetHandle()">重置</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('programme:caselist:export')">
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <!-- <el-form-item v-if="hasPermission('programme:caselist:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item> -->
      <el-form-item v-if="hasPermission('programme:caselist:delete')">
        <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border :default-sort="defaultSort" @sort-change="dataListSortChangeHandle" @selection-change="dataListSelectionChangeHandle"
      style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="number" label="编号" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="level" label="方案层次" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("verify_status", scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="方案名称" header-align="center" align="center" width="200">
        <template v-slot="scope">
          <span @click="detailHandle(scope.row)" title="点击查看详情" class="primary-color">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="grade" label="年级" header-align="center" align="center" width="100">
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
      <el-table-column prop="startTerm" label="开始学期" header-align="center" align="center" width="100">
        <template v-slot="scope">
          {{ getDictLabel("term", scope.row.startTerm) }}
        </template>
      </el-table-column>
      <el-table-column prop="termType" label="学期类型" header-align="center" align="center" width="100">
        <template v-slot="scope">
          {{ getDictLabel("term_type", scope.row.termType) }}
        </template>
      </el-table-column>
      <el-table-column prop="courseType" label="修读类型" header-align="center" align="center"
        width="100"></el-table-column>
      <el-table-column prop="scoreMin" label="最少学分" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="academicDegree" label="学位" header-align="center" align="center"
        width="100"></el-table-column>

      <el-table-column prop="createDate" label="提交时间" header-align="center" align="center"
        width="200" sortable></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button
            v-if="hasPermission('programme:caselist:update') && (scope.row.status == 0 || scope.row.status == 3)"
            type="text" size="small" @click="myEditHandle(scope.row)">{{ $t("update") }}</el-button>
          <el-button v-else type="text" size="small" @click="detailHandle(scope.row)">详情</el-button>
          <el-button v-if="hasPermission('programme:caselist:delete')" type="text" size="small"
            @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
          status: 1,
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
        if (data.status == 2) {
          title = "详情";
        } else if (data.status == 0 || data.status == 3) {
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
      }
    }
  });
</script>
