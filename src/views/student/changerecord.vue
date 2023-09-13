<template>
  <div class="mod-student__changerecord">
    <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.term" placeholder="异动学年学期" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.approvalNumber" placeholder="审批文号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.changeCategory" placeholder="异动类别">
          <el-option label="选择" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.xh" placeholder="学号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.username" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.originalGrade" placeholder="原所在年级" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.originalInstitute" placeholder="原所属院系" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.originalMajor" placeholder="原所在专业" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <ren-select v-model="dataForm.originalCampus" dict-type="campus" placeholder="原校区"></ren-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.originalClass" placeholder="原所属班级" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.originalXjStatus" placeholder="原在籍状态">
          <el-option label="选择" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.originalZxStatus" placeholder="原在校状态">
          <el-option label="选择" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">{{ $t("query") }}</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('student:changerecord:export')">
        <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('student:changerecord:save')">
        <el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('student:changerecord:save')">
        <el-button type="warning" @click="multiAuditHandle()">批量审核</el-button>
      </el-form-item>
      <el-form-item v-if="hasPermission('student:changerecord:delete')">
        <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle" style="width: 100%">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center" width="120">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status == 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status == 1" type="success">已通过</el-tag>
          <el-tag v-else type="error">未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="term" label="异动学年学期" header-align="center" align="center" width="120"></el-table-column>
      <el-table-column prop="changeCategory" label="异动类别" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="xh" label="学号" header-align="center" align="center"></el-table-column>
      <el-table-column prop="username" label="姓名" header-align="center" align="center"></el-table-column>
      <el-table-column prop="gender" label="性别" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("gender", scope.row.gender) }}
        </template>
      </el-table-column>
      <el-table-column prop="originalSchool" label="原学校" header-align="center" align="center"></el-table-column>
      <el-table-column prop="originalGrade" label="原所在年级" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="originalInstitute" label="原所属院系" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="originalMajor" label="原所在专业" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="originalCampus" label="原校区" header-align="center" align="center">
        <template v-slot="scope">
          {{ getDictLabel("campus", scope.row.originalCampus) }}
        </template>
      </el-table-column>
      <el-table-column prop="originalClass" label="原所属班级" header-align="center" align="center" width="100"></el-table-column>
      <el-table-column prop="changeDate" label="异动日期" header-align="center" align="center" width="160"></el-table-column>
      <el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button v-if="hasPermission('student:changerecord:update')" type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
          <el-button v-if="hasPermission('student:changerecord:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <vertify-dialog v-if="vertifyVisible" ref="vertifyDialogRef" @comfirm="comfirmVertify"></vertify-dialog>
  </div>
</template>

<script lang="ts">
import useView from "@/hooks/useView";
import baseService from "@/service/baseService";
import { defineComponent, reactive, toRefs } from "vue";
import AddOrUpdate from "./changerecord-add-or-update.vue";
import VertifyDialog from "../dialog/vertify-dialog.vue";
export default defineComponent({
  components: {
    AddOrUpdate,
    VertifyDialog
  },
  setup() {
    const state = reactive({
      getDataListURL: "/student/changerecord/page",
      getDataListIsPage: true,
      exportURL: "/student/changerecord/export",
      deleteURL: "/student/changerecord",
      routeName: "/student-changerecord-edit",
      routePath: "/student/changerecord-edit",
      routeTitle: "学籍异动登记",
      deleteIsBatch: true,
      vertifyVisible: false,
      dataForm: {
        userId: "",
        term: "",
        approvalNumber: "",
        changeCategory: "",
        xh: "",
        username: "",
        originalGrade: "",
        originalInstitute: "",
        originalInstituteNo: "",
        originalMajor: "",
        originalCampus: "",
        originalClass: "",
        originalClassNo: "",
        originalXjStatus: "",
        originalZxStatus: ""
      }
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {},
  methods: {
    multiAuditHandle() {
      this.vertifyVisible = true;
      this.$nextTick(() => {
        this.$refs.vertifyDialogRef.init();
      });
      console.log("哈哈", this.dataListSelections);
    },
    comfirmVertify(status: number, value: string) {
      console.log("value---", status, value);
      let list = [];
      if (this.dataListSelections.length > 0) {
        // this.dataFormSubmitHandle(status);
        this.dataListSelections.forEach((item, index) => {
          this.dataListSelections[index].status = status;
          this.dataListSelections[index].auditReason = value;
          list.push(this.dataListSelections[index]);
        });
      }
      let postDate = JSON.stringify(list);
      console.log("提交", postDate);
      this.dataFormSubmitHandle(postDate);
    },
    dataFormSubmitHandle(data: any) {
      baseService.put("/student/changerecord/batchUpdate", data, { dataType: "json" }).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.$message.success("批量审核成功");
        console.log(res);
        this.query();
      });
    }
  }
});
</script>
