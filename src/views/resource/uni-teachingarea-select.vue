<template>
  <el-dialog width="80%" v-model="visible" title="场地选择" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="mod-resource__teachingarea">
      <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
        <el-form-item prop="name">
          <el-input v-model="dataForm.name" placeholder="场地名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="campus">
          <ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
        </el-form-item>
        <el-form-item prop="building">
          <el-input v-model="dataForm.building" placeholder="教学楼" clearable></el-input>
        </el-form-item>
        <el-form-item prop="floor">
          <el-input v-model="dataForm.floor" placeholder="楼层" clearable></el-input>
        </el-form-item>
        <el-form-item prop="house">
          <el-input v-model="dataForm.house" placeholder="门牌号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="seats">
          <el-input v-model="dataForm.seats" placeholder="容量" clearable></el-input>
        </el-form-item>
        <el-form-item prop="department">
          <el-input v-model="dataForm.department" placeholder="托管部门" clearable></el-input>
        </el-form-item>
        <el-form-item prop="status">
          <ren-select v-model="dataForm.status" dict-type="enable_status" placeholder="状态"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryResetHandle()">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @row-click="cellClickHandle" style="width: 100%">
        <el-table-column header-align="center" align="center" width="50">
          <template v-slot="scope">
            <el-radio :disabled="disabledList.includes(scope.row.id)" v-model="selectForm.id" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="场地名称" header-align="center" align="center"></el-table-column>
        <el-table-column prop="campus" label="校区" header-align="center" align="center">
          <template v-slot="scope">
            {{ getDictLabel("campus", scope.row.campus) }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="mainCategory" label="场地类别" header-align="center" align="center"></el-table-column> -->
        <el-table-column prop="building" label="教学楼" header-align="center" align="center"></el-table-column>
        <el-table-column prop="floor" label="楼层" header-align="center" align="center"></el-table-column>
        <el-table-column prop="house" label="门牌号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="seats" label="容量" header-align="center" align="center"></el-table-column>
        <el-table-column prop="department" label="托管部门" header-align="center" align="center" width="120"></el-table-column>
        <el-table-column prop="administrators" label="场地管理员" header-align="center" align="center" width="120"></el-table-column>
        <el-table-column prop="administratorsMobile" label="场地管理员电话" header-align="center" align="center" width="140"></el-table-column>
        <el-table-column prop="status" label="状态" header-align="center" align="center">
          <template v-slot="scope">
            {{ getDictLabel("enable_status", scope.row.status) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    </div>
    <div style="text-align: right; margin-top: 20px">
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { IObject } from "@/types/interface";
import useView from "@/hooks/useView";
import baseService from "@/service/baseService";
import { defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  setup() {
    const state = reactive({
      visible: false,
      createdIsNeed: false,
      getDataListURL: "/resource/teachingarea/page",
      getDataListIsPage: true,
      exportURL: "/resource/teachingarea/export",
      deleteURL: "/resource/teachingarea",
      routeName: "/resource-teachingarea-edit",
      routePath: "/resource/teachingarea-edit",
      importTemplateUrl: "/resource/teachingarea/download", //模板下载
      routeTitle: "教学场地",
      deleteIsBatch: true,
      dataForm: {
        name: "",
        campus: "",
        mainCategory: "",
        building: "",
        floor: "",
        house: "",
        seats: "",
        department: "",
        status: ""
      } as IObject,
      disabledList: [],
      defaultSelectForm: null,
      selectForm: {},
      //树形选择
      filterText: "",
      // deptList: [],
      expandedKeys: null
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {},
  activated() {
    console.log("roter", this.$route);
    let query = this.$route.query;
    if (query && query.tid) {
      this.dataForm.mainCategory = query.tid || "";
    }
    this.query();
  },
  methods: {
    init(id: string) {
      // this.defaultSelectForm = defaultSelectForm || null;
      this.dataListSelections = [];
      this.visible = true;
      Promise.all([this.getSelectedArea(id)]).then(() => {
        this.query();
      });
      // this.query();
      // console.log('member');
    },
    getSelectedArea(id) {
      // 当前学期已有场地
      this.disabledList = [];
      baseService.get("/resource/semesterteachingarea/page", { parent: id }).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        if (res.data.total && res.data.total > 0) {
          res.data.list.forEach((item) => {
            // 教学场地id
            this.disabledList.push(item.teachingAreaId);
          });
          console.log("disabled--", this.disabledList);
        }
      });
    },
    cellClickHandle(row: any) {
      console.log("row-", row);
      if (this.disabledList.includes(row.id)) return this.$message.error("该教学场地已存在！");
      this.selectForm = {
        ...this.selectForm,
        ...row
      };
      console.log(this.selectForm);
    },
    dataFormSubmitHandle() {
      // console.log("已选中===", this.selectForm);
      if (this.selectForm.id) {
        this.visible = false;
        this.$emit("confirm", this.selectForm);
      } else {
        this.$message.error("请选择一个场地！");
      }
    }
  }
});
</script>
