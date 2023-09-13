<template>
  <el-dialog width="80%" v-model="visible" :title="`批量生成场地__${yearSemester.year}${yearSemester.semester}`" :close-on-click-modal="false" :close-on-press-escape="false">
    <div>基础设置</div>
    <el-card class="box-card" style="margin: 10px 0 30px 0" shadow="never">
      <div class="edit-card-page">
        <el-row :gutter="20">
          <el-form :model="settingForm" ref="settingFormRef" :rules="dataRule" label-width="150px">
            <el-col :span="12">
              <el-form-item label="是否可排课" prop="isSchedulingAllowed" @keyup.enter="dataFormSubmitHandle()">
                <!-- <el-input size="large" v-model="dataForm.isSchedulingAllowed" placeholder="是否可排课"></el-input> -->
                <el-radio-group v-model="settingForm.isSchedulingAllowed" class="ml-4">
                  <el-radio :label="1" size="large">是</el-radio>
                  <el-radio :label="0" size="large">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否忽略冲突排课" prop="isConflictIgnored">
                <!-- <el-input size="large" v-model="dataForm.isConflictIgnored" placeholder="是否忽略冲突排课"></el-input> -->
                <el-radio-group v-model="settingForm.isConflictIgnored" class="ml-4">
                  <el-radio :label="1" size="large">是</el-radio>
                  <el-radio :label="0" size="large">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否可排考" prop="isExamSchedulingAllowed">
                <!-- <el-input size="large" v-model="dataForm.isExamSchedulingAllowed" placeholder="是否可排考"></el-input> -->
                <el-radio-group v-model="settingForm.isExamSchedulingAllowed" class="ml-4">
                  <el-radio :label="1" size="large">是</el-radio>
                  <el-radio :label="0" size="large">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否可借用" prop="isBorrowingAllowed">
                <!-- <el-input size="large" v-model="dataForm.isBorrowingAllowed" placeholder="是否可借用"></el-input> -->
                <el-radio-group v-model="settingForm.isBorrowingAllowed" class="ml-4">
                  <el-radio :label="1" size="large">是</el-radio>
                  <el-radio :label="0" size="large">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </el-card>
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
      <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
        <el-table-column :selectable="selectableHandle" type="selection" header-align="center" align="center" width="50"></el-table-column>
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
      settingForm: {
        isSchedulingAllowed: 1,
        isConflictIgnored: 1,
        isExamSchedulingAllowed: 1,
        isBorrowingAllowed: 1
      },
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
      yearSemester: {},
      defaultSelectForm: null,
      selectForm: {},
      //树形选择
      filterText: "",
      // deptList: [],
      expandedKeys: null
    });
    return { ...useView(state), ...toRefs(state) };
  },
  computed: {
    dataRule() {
      return {
        isSchedulingAllowed: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        isConflictIgnored: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        isExamSchedulingAllowed: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        isBorrowingAllowed: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
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
    init(item: IObject) {
      this.yearSemester = item;
      // this.defaultSelectForm = defaultSelectForm || null;
      this.dataListSelections = [];

      this.visible = true;
      Promise.all([this.getSelectedArea(item.id)]).then(() => {
        this.query();
      });
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
    dataFormSubmitHandle() {
      this.$refs["settingFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        console.log("已选中", this.dataListSelections, this.parent);
        if (this.dataListSelections.length > 0) {
          this.visible = false;
          this.$emit("confirm", this.dataListSelections, this.settingForm, this.yearSemester);
        } else {
          this.$message.error("至少选择一个场地！");
        }
      });
    },
    // 禁选
    selectableHandle(row: any, index: number) {
      // console.log(row);
      if (this.disabledList.length > 0 && this.disabledList.includes(row.id)) {
        return false;
      } else {
        return true;
      }
      // return true;
    }
  }
});
</script>
