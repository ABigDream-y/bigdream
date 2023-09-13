<template>
  <div class="mod-programme__coursegroup">
    <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item prop="name">
        <el-input v-model="dataForm.name" placeholder="课组名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="grade">
        <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
      </el-form-item>
      <!-- <el-form-item>
				<ren-radio-group v-model="dataForm.status" dict-type="yesOrNo"></ren-radio-group>
			</el-form-item> -->
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="queryResetHandle()">重置</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('programme:coursegroup:export')">
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('programme:coursegroup:save')">
        <el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('programme:coursegroup:delete')">
        <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" label="课组名" header-align="center" align="center" width="200"></el-table-column>
      <el-table-column prop="grade" label="年级" header-align="center" align="center" width="100">
        <template v-slot="scope">
          {{ getDictLabel("grade", scope.row.grade) }}
        </template>
      </el-table-column>
      <el-table-column prop="institute" label="院系" header-align="center" align="center" width="200"></el-table-column>
      <!-- <el-table-column prop="instituteNo" label="院系" header-align="center" align="center"></el-table-column> -->
      <!-- <el-table-column prop="courseType" label="任选课类别" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("course_type", scope.row.courseType) }}
				</template>
			</el-table-column> -->
      <!-- <el-table-column prop="courseCategory" label="课程类别" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("course_category", scope.row.courseCategory) }}
				</template>
			</el-table-column> -->
      <el-table-column prop="scoreMin" label="最少修读学分" header-align="center" align="center" width="200"></el-table-column>
      <el-table-column prop="courseMin" label="最少修读门数" header-align="center" align="center" width="200"></el-table-column>
      <el-table-column prop="groupMin" label="最少完成课组数" header-align="center" align="center" width="200"></el-table-column>
      <el-table-column prop="totalCourse" label="课程总门数" header-align="center" align="center" width="200"></el-table-column>
      <el-table-column prop="totalHours" label="课程总学时" header-align="center" align="center" width="200"></el-table-column>
      <el-table-column prop="totalScore" label="课程总学分" header-align="center" align="center" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("enable_status", scope.row.status) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="sort" label="顺序号" header-align="center" align="center"></el-table-column> -->
      <!-- <el-table-column prop="requirement" label="修读要求" header-align="center" align="center"></el-table-column> -->
      <el-table-column prop="publicStatus" label="是否校公选课组" header-align="center" align="center" width="200">
        <template v-slot="scope">
          {{ getDictLabel("yesOrNo", scope.row.publicStatus) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('programme:casecourse:page')" type="text" size="small" @click="courseHandle(scope.row, 'list')">课程列表</el-button>
          <el-button v-if="hasPermission('programme:coursegroup:update')" type="text" size="small" @click="courseHandle(scope.row, 'edit')">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('programme:coursegroup:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script lang="ts">
import { registerDynamicToRouterAndNext } from "@/router";
import { IObject } from "@/types/interface";
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./coursegroup-add-or-update.vue";
export default defineComponent({
  components: {
    AddOrUpdate
  },
  setup() {
    const state = reactive({
      getDataListURL: "/programme/coursegroup/page",
      getDataListIsPage: true,
      exportURL: "/programme/coursegroup/export",
      deleteURL: "/programme/coursegroup",
      routeName: "/programme-coursegroup-edit",
      routePath: "/programme/coursegroup-edit",
      routeTitle: "课组",
      deleteIsBatch: true,
      dataForm: {
        name: "",
        grade: "",
        status: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {},
  methods: {
    courseHandle(data: IObject, tab: string) {
      console.log("data ", data);
      const routeParams = {
        routeName: `programme-coursegroup-detail__${data.id}`,
        title: `${data.name} - 详情`,
        path: `/programme/coursegroup-detail`,
        query: {
          id: data.id,
          _mt: `${data.name} - 详情`,
          tab: tab
        }
      };
      registerDynamicToRouterAndNext(routeParams);
    }
  }
});
</script>
