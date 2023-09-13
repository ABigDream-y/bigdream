<template>
  <div class="mod-programme__guidanceplan">
    <div style="margin-bottom: 20px">
      <h3 style="margin-top: 0">基本概况</h3>
      <el-input v-model="summary" type="textarea" autosize readonly></el-input>
      <div style="margin: 20px 0">毕业学分和修读要求总览</div>
      <div v-if="courseType.length == 0">
        <el-table style="width: 100%">
          <el-table-column prop="courseNo" label="课程模块" width="150" header-align="center" align="center" />
          <el-table-column prop="courseNo" label="必修" width="150" header-align="center" align="center">
            <el-table-column prop="courseNo" label="门数" width="150" header-align="center" align="center" />
            <el-table-column prop="courseNo" label="学分" width="150" header-align="center" align="center" />
          </el-table-column>
          <el-table-column prop="courseNo" label="选修" width="150" header-align="center" align="center">
            <el-table-column prop="courseNo" label="学分" width="150" header-align="center" align="center" />
          </el-table-column>
          <el-table-column prop="courseNo" label="合计" width="150" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="courseNo" label="占总学分比例" width="150" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="courseNo" label="备注" header-align="center" align="center"> </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-table style="width: 100%" :data="courseType" show-summary>
          <el-table-column prop="courseType" label="课程模块" width="150" header-align="center" align="center" />
          <el-table-column prop="" label="必修" width="150" header-align="center" align="center">
            <el-table-column prop="compulsorynum" label="门数" width="150" header-align="center" align="center" />
            <el-table-column prop="compulsoryscore" label="学分" width="150" header-align="center" align="center" />
          </el-table-column>
          <el-table-column prop="" label="选修" width="150" header-align="center" align="center">
            <el-table-column prop="electivenum" label="门数" width="150" header-align="center" align="center" />
            <el-table-column prop="electivescore" label="学分" width="150" header-align="center" align="center" />
          </el-table-column>
          <el-table-column prop="score" label="合计" width="150" header-align="center" align="center"> </el-table-column>
          <el-table-column prop="" label="占总学分比例" width="150" header-align="center" align="center">
            <template v-slot="scope">
              <div v-if="scope.row.score > 0">{{ ((scope.row.score / scoreTotal) * 100).toFixed(2) }}%</div>
              <div v-else>{{ scope.row.score }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="备注" header-align="center" align="center"> </el-table-column>
        </el-table>
      </div>
    </div>
    <div style="margin-bottom: 20px">
      <h3 style="margin-top: 0">课程设置</h3>
    </div>
    <div v-if="tableData.length == 0">
      <el-table style="width: 100%">
        <el-table-column prop="courseNo" label="课程号" width="150" header-align="center" align="center" />
        <el-table-column prop="courseName" label="课程名称" header-align="center" align="center" />
        <el-table-column prop="courseCategory" label="修读形式" width="100" header-align="center" align="center" />
        <el-table-column prop="credit" label="学分" width="100" header-align="center" align="center" />
        <el-table-column prop="hours" label="总学时" width="100" header-align="center" align="center" />
        <el-table-column prop="teachingHours" label="授课学时" width="100" header-align="center" align="center" />
        <el-table-column prop="computerHours" label="上机学时" width="100" header-align="center" align="center" />
        <el-table-column prop="practicalHours" label="实践学时" width="100" header-align="center" align="center" />
        <el-table-column prop="otherHours" label="其他学时" width="100" header-align="center" align="center" />
        <el-table-column prop="planGrade" label="开课学年" width="100" header-align="center" align="center" />
        <el-table-column prop="planTerm" label="开课学期" width="100" header-align="center" align="center" />
        <el-table-column prop="remark" label="备注" width="100" header-align="center" align="center" />
      </el-table>
    </div>
    <div v-else v-for="(item, index) in tableData" :key="index" style="margin-bottom: 20px">
      <div style="margin: 0 0 20px 0">{{ item.name }}[最少修读 {{ item.scoreMin }} 学分 最少修读 {{ item.courseMin }} 门 最少完成 {{ item.courseMin }} 门]</div>
      <el-table :data="item.caseCourse" style="width: 100%" v-if="item.caseCourse.length > 0">
        <el-table-column prop="courseNo" label="课程号" width="150" header-align="center" align="center" />
        <el-table-column prop="courseName" label="课程名称" header-align="center" align="center" />
        <el-table-column prop="courseCategory" label="修读形式" width="100" header-align="center" align="center" />
        <el-table-column prop="credit" label="学分" width="80" header-align="center" align="center" />
        <el-table-column prop="hours" label="总学时" width="80" header-align="center" align="center" />
        <el-table-column prop="teachingHours" label="授课学时" width="100" header-align="center" align="center" />
        <el-table-column prop="computerHours" label="上机学时" width="100" header-align="center" align="center" />
        <el-table-column prop="practicalHours" label="实践学时" width="100" header-align="center" align="center" />
        <el-table-column prop="otherHours" label="其他学时" width="100" header-align="center" align="center" />
        <el-table-column prop="planGrade" label="开课学年" width="100" header-align="center" align="center" />
        <el-table-column prop="planTerm" label="开课学期" width="100" header-align="center" align="center" />
        <el-table-column prop="remark" label="备注" width="100" header-align="center" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
import { computed, defineComponent, reactive, toRefs } from "vue";
export default defineComponent({
  props: {
    caseInfo: Object
  },
  setup(props) {
    const state = reactive({
      summary: "", // 课程汇总信息
      scoreTotal: 0,
      numTotal: 0,
      courseType: [] as IObject[],
      caseCourseList: [] as IObject[],
      courseTypeList: [] as IObject[], // 课程分类
      tableData: [] as IObject[],
      headList: [] as IObject[],
      caseForm: computed(() => `${props.caseInfo}`) //培养方案详情
    });
    return { ...toRefs(state) };
  },
  watch: {},
  methods: {
    init(caseId: string) {
      this.numTotal = 0;
      this.scoreTotal = 0;
      this.courseType = [];
      this.summary = "";
      this.summary = this.caseInfo.name;
      console.log("info--", caseId);
      console.log("caseForm---", this.caseInfo);
      this.getTableData(caseId);
      this.getCourseType(caseId);
    },
    // 获取课程列表
    getCaseCourse(id: string) {
      // let compulsoryscoreTotal = 0;
      // let compulsorynum = 0;
      // let electivenum = 0;
      baseService.get("/programme/coursecase/page", { caseId: id, page: 1, limit: 999 }).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        console.log("培养方案课程", res);
        if (res.data) {
          this.caseCourseList = res.data.list;
        }
        if (this.courseType.length !== 0) {
          this.caseCourseList.forEach((item: any) => {
            // 总学分
            this.scoreTotal += Number(item.credit);
            this.numTotal += 1;
            this.courseType.forEach((cItem, index) => {
              if (cItem.courseType == item.courseType) {
                this.courseType[index].caseCourse.push(item);
                this.courseType[index].score += Number(item.credit);
                this.courseType[index].hours += Number(item.hours);
                if (item.courseCategory == "必修") {
                  this.courseType[index].compulsorynum++;
                  this.courseType[index].compulsoryscore += Number(item.credit);
                } else {
                  this.courseType[index].electivenum++;
                  this.courseType[index].electivescore += Number(item.credit);
                }
              }
            });
          });
        }
        console.log("typecourse", this.courseType);
        // 汇总
        this.courseType.forEach((item) => {
          if (item.caseCourse.length > 0) {
            this.summary = this.summary + "；" + item.courseType + item.caseCourse.length + "门，总学分: " + item.score.toFixed(1);
            if (item.compulsorynum > 0) {
              this.summary = this.summary + "，其中必修" + item.compulsorynum + "门，必修总学分：" + item.compulsoryscore.toFixed(1);
            }
            if (item.electivenum > 0) {
              this.summary = this.summary + "，其中选修" + item.electivenum + "门，选修总学分：" + item.electivescore.toFixed(1);
            }
          }
        });
      });
    },
    // 获取课程类型字段数据
    getCourseType(id: string) {
      baseService.get("/sys/dict/data/page", { dictTypeId: "1682234019179081729", page: 1, limit: 999 }).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        if (res.data) {
          this.courseType = res.data.list.map((item: any) => {
            return {
              courseType: item.dictValue,
              caseCourse: [], // 各类别课程列表
              score: 0,
              hours: 0,
              compulsorynum: 0, // 必修门数
              compulsoryscore: 0, // 必修学分
              electivenum: 0, // 选修门数
              electivescore: 0 // 选修学分
            };
          });
        }
        console.log("课程类型", this.courseType);
        this.getCaseCourse(id);
      });
    },
    getTableData(id: string) {
      baseService.get("/programme/casecourse/list?id=" + id).then((res) => {
        console.log("课程列表", res);
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.tableData = res.data;
      });
    }
  }
});
</script>
