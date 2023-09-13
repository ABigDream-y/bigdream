<template>
  <el-dialog width="80%" v-model="visible" title="学生选择" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="mod-student__student">
      <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.xh" placeholder="学号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.realName" placeholder="姓名" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.gender" dict-type="gender" placeholder="性别"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.idCard" placeholder="证件号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.className" placeholder="班级" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.classNo" placeholder="班级编号" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.pycc" dict-type="pycc" placeholder="培养层次"></ren-select>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.sfzj" dict-type="yesOrNo" placeholder="是否在籍"></ren-select>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.sfzx" dict-type="yesOrNo" placeholder="是否在校"></ren-select>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.eduSystem" dict-type="edu_system" placeholder="学制"></ren-select>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
        </el-form-item>
        <!-- <el-form-item>
				<el-input v-model="dataForm.institute" placeholder="学院" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.instituteNo" placeholder="学院编号" clearable></el-input>
			</el-form-item> -->
        <el-form-item>
          <el-input v-model="dataForm.major" placeholder="专业" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.schoolYear" dict-type="grade" placeholder="入学年级"></ren-select>
        </el-form-item>
        <el-form-item>
          <ren-select v-model="dataForm.status" dict-type="yesOrNo" placeholder="状态"></ren-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">{{ $t("query") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('student:student:save')" type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPermission('student:student:delete')" type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
        </el-form-item>
      </el-form>
      <el-table v-loading="dataListLoading" :data="dataList" border @row-click="rowClickHandle" style="width: 100%">
        <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
        <el-table-column label="" header-align="center" align="center" width="50">
          <template v-slot="scope">
            <el-radio v-model="selectForm.id" :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="xh" label="学号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="realName" label="姓名" header-align="center" align="center"></el-table-column>
        <el-table-column prop="gender" label="性别" header-align="center" align="center">
          <template v-slot="scope">
            {{ getDictLabel("gender", scope.row.gender) }}
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="证件号" header-align="center" align="center"></el-table-column>
        <el-table-column prop="className" label="班级" header-align="center" align="center"></el-table-column>
        <el-table-column prop="pycc" label="培养层次" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("pycc", scope.row.pycc) }}
          </template>
        </el-table-column>
        <el-table-column prop="sfzj" label="是否在籍" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("yesOrNo", scope.row.sfzj) }}
          </template>
        </el-table-column>
        <el-table-column prop="sfzx" label="是否在校" header-align="center" align="center" width="100">
          <template v-slot="scope">
            {{ getDictLabel("yesOrNo", scope.row.sfzx) }}
          </template>
        </el-table-column>
        <el-table-column prop="eduSystem" label="学制" header-align="center" align="center">
          <template v-slot="scope">
            {{ getDictLabel("edu_system", scope.row.eduSystem) }}
          </template>
        </el-table-column>
        <el-table-column prop="campus" label="校区" header-align="center" align="center">
          <template v-slot="scope">
            {{ getDictLabel("campus", scope.row.campus) }}
          </template>
        </el-table-column>
        <el-table-column prop="institute" label="学院" header-align="center" align="center"></el-table-column>
        <el-table-column prop="major" label="专业" header-align="center" align="center"></el-table-column>
        <el-table-column prop="grade" label="年级" header-align="center" align="center">
          <template v-slot="scope">
            {{ getDictLabel("grade", scope.row.grade) }}
          </template>
        </el-table-column>
        <el-table-column prop="schoolYear" label="入学年级" header-align="center" align="center">
          <template v-slot="scope">
            {{ getDictLabel("grade", scope.row.schoolYear) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" header-align="center" align="center">
          <template v-slot="scope">
            {{ getDictLabel("yesOrNo", scope.row.status) }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle" @current-change="pageCurrentChangeHandle"> </el-pagination>
    </div>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
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
      getDataListURL: "/student/student/page",
      getDataListIsPage: true,
      exportURL: "/student/student/export",
      deleteURL: "/student/student",
      routeName: "/student-student-edit",
      routePath: "/student/student-edit",
      routeTitle: "学籍信息",
      deleteIsBatch: true,
      dataForm: {
        xh: "",
        realName: "",
        gender: "",
        idCard: "",
        class: "",
        classNo: "",
        pycc: "",
        sfzj: "",
        sfzx: "",
        eduSystem: "",
        campus: "",
        institute: "",
        instituteNo: "",
        major: "",
        grade: "",
        schoolYear: "",
        status: ""
      } as IObject,
      selectType: "",
      selectForm: {
        id: "",
        name: ""
      } as IObject
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {},
  methods: {
    init(type: string) {
      this.visible = true;
      if (type && type == "change") {
        this.selectType = type;
      }
      this.query();
    },
    rowClickHandle(data: IObject) {
      this.selectForm = {
        ...this.selectForm,
        ...data
      };
    },
    dataFormSubmitHandle() {
      if (this.selectForm.id) {
        if (this.selectType && this.selectType == "change") {
          // 学籍异动
          baseService.get("/student/changerecord/page", { userId: this.selectForm.id }).then((res) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg);
            }
            let flag = true;
            if (res.data && res.data.total > 0) {
              let list = res.data.list;
              list.forEach((item) => {
                if (item.status == 0) {
                  flag = false;
                }
              });
            }
            if (flag == false) return this.$message.warning("该生存在一个待审核的异动申请！");
            this.$emit("confirm", this.selectForm);
            this.visible = false;
          });
        }
      } else {
        this.$message.error("请选择学生！");
      }
    }
  }
});
</script>
