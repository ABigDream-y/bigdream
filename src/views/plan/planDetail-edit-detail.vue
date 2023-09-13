<template>
  <div class="mod-plan__planDetail-edit-detail">
    <div class="wrap">
      <div class="row">
        <div class="item startGrade">
          <span class="title">计划学年</span>
          <span class="content">{{dataForm.startGrade}}</span>
        </div>
        <div class="item startTerm">
          <span class="title">计划学期</span>
          <span class="content">{{dataForm.startTerm}}</span>
        </div>
      </div>
      <div class="row">
        <div class="item name">
          <span class="title">方案名称</span>
          <span class="content" title="点击跳转详情" @click="detailHandle(dataForm)">{{dataForm.name}}</span>
        </div>
        <div class="item id">
          <span class="title">方案编号</span>
          <span class="content">{{dataForm.number}}</span>
        </div>
      </div>
      <div class="row">
        <div class="item institute">
          <span class="title">院系</span>
          <span class="content">{{dataForm.institute}}</span>
        </div>
        <div class="item major">
          <span class="title">专业</span>
          <span class="content">{{dataForm.major}}</span>
        </div>
        <div class="item majorDirection">
          <span class="title">专业方向</span>
          <span class="content">{{dataForm.majorDirection}}</span>
        </div>
      </div>
      <div class="row">
        <div class="item grade">
          <span class="title">年级</span>
          <span class="content">{{dataForm.grade}}</span>
        </div>
        <div class="item level">
          <span class="title">方案层次</span>
          <span class="content">{{dataForm.level}}</span>
        </div>
      </div>
      <div class="row">
        <div class="item status">
          <span class="title">状态</span>
          <span class="content">
            <span class="status no" v-if="dataForm.status == 1">未生成</span>
            <span class="status yes" v-else>已生成</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { registerDynamicToRouterAndNext } from "@/router";
  import baseService from "@/service/baseService";
  import { IObject } from "@/types/interface";
  import useView from "@/hooks/useView";
  import { defineComponent, reactive, toRefs } from "vue";
  import AddOrUpdate from "./groupcourse-add-or-update.vue";
  export default defineComponent({
    components: {

    },
    props: {

    },
    setup() {
      const state = reactive({
        dataForm: {
          id: "",
          grade: "",
          institute: "",
          instituteNo: "",
          major: "",
          majorDirection: "",
          name: "",
          eduSystem: "",
          startGrade: "",
          startTerm: "",
          termType: "",
          courseType: "",
          scoreMin: "",
          academicDegree: "",
          trainObjective: "",
          readingRequirements: "",
          programFeatures: "",
          majorDisciplines: "",
          mainCourses: "",
          mainProfessionalExperiments: "",
          status: 0,
          creator: "",
          createDate: "",
          updater: "",
          updateDate: ""
        } as IObject
      });
      return { ...useView(state), ...toRefs(state) };
    },
    watch: {

    },
    methods: {
      init(data) {
        this.dataForm = data;
        console.log(this.dataForm);
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

<style scoped lang="scss">
  .mod-left-card {
    width: 100%;
    min-height: calc(100vh - 50px - 40px - 30px - 20px - 55px - 42px - 20px);

    .group-title {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0;
    }

    .group-item {
      width: 100%;
      padding: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .active {
      background-color: rgba(62, 142, 247, 0.2);
      color: #3E8EF7;
    }

  }

  .wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    .row {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 20px 0;

      .item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-basis: calc(100% / 3);

        .title {
          margin-right: 10px;
          font-weight: bold;
          font-size: 16px;
        }

        .content {
          font-weight: 200;
          font-size: 16px;

          .status {
            border-radius: 5px;
            padding: 10px 20px;
            cursor: default;
          }

          .no {
            border: 1px solid #e6a23c;
            background: #fdf6ec;
            color: #e6a23c;
          }

          .yes {
            border: 1px solid #67c23a;
            background: #f0f9eb;
            color: #67c23a;
          }
        }
      }

      .startGrade,
      .startTerm {

        .content {
          font-style: italic;
          color: #0BB2D4;
        }
      }

      .name {
        .content {
          font-style: italic;
          color: #0BB2D4;
          cursor: pointer;
          text-decoration: underline;
          font-weight: bold;
        }
      }
    }
  }
</style>
