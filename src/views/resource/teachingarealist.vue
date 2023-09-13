<template>
  <div class="mod-resource__teachingarea">
    <div class="main" style="display: flex;flex-direction: row;justify-content: flex-start;align-items: flex-start;">
      <div class="left" style="border: 1px solid #eee;margin-right: 10px; padding: 10px;width: 300px;">
        <h3 class="title" style="margin: 0; margin-bottom: 10px;">场地类型</h3>
        <div v-loading="dataListLoading" style="max-height: 700px;overflow: auto;">
          <div :class="id == item.id ?'active':''" v-for="(item,index) in teachingAreaTypeList.list" :key="index"
            class="group-item">
            <span style="flex:1;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;" :title="item.name" @click="teachingAreaTypeSelect(index)">{{item.name}}</span>
            <!-- <el-button @click="deleteHandle(item.id)" v-if="hasPermission('programme:groupcourse:delete')" type="danger"
              icon="Delete" circle plain /> -->
          </div>
          <div v-if="teachingAreaTypeList.list == null || teachingAreaTypeList.list.length == 0">
            <el-empty description="暂无数据" />
          </div>
        </div>
      </div>
      <div class="right" style="width: calc(100% - 300px);">
        <teachingarea ref="teachingarea" :mainCategory="id"></teachingarea>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
    border-radius: 5px;
  }
</style>

<script lang="ts">
  import { IObject } from "@/types/interface";
  import useView from "@/hooks/useView";
  import { defineComponent, reactive, toRefs } from "vue";
  import AddOrUpdate from "./teachingarea-add-or-update.vue";
  import TeachingAreaImport from "./teachingarea-import.vue";
  import baseService from "@/service/baseService";
  import teachingarea from "./teachingarea.vue";
  export default defineComponent({
    components: {
      AddOrUpdate,
      TeachingAreaImport,
      teachingarea
    },
    setup() {
      const state = reactive({
        createdIsNeed: false,
        getDataListURL: "/resource/teachingareatype/page",
        getDataListIsPage: true,
        exportURL: "/resource/teachingarea/export",
        deleteURL: "/resource/teachingarea",
        routeName: "/resource-teachingarea-edit",
        routePath: "/resource/teachingarea-edit",
        importTemplateUrl: "/resource/teachingarea/download", //模板下载
        routeTitle: "教学场地",
        errorVisible: false,
        deleteIsBatch: true,
        errorList: [],
        importVisible: false,
        id: "",
        name: "",
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
        teachingAreaTypeList: []
      });
      return { ...useView(state), ...toRefs(state) };
    },

    watch: {
      mainCategory(val : string) {
        console.log("mainCategory", val);
        this.init();
      },
      id(val) {

      }
    },
    // activated() {
    //   console.log("roter", this.$route);
    //   let query = this.$route.query;
    //   if (query && query.tid) {
    //     this.dataForm.mainCategory = query.tid || "";
    //   }
    //   this.query();
    // },
    created() {
      this.getDataList();
      this.getInfo();
    },
    methods: {
      teachingAreaTypeSelect(index) {
        this.id = this.teachingAreaTypeList.list[index].id;
        this.name = this.teachingAreaTypeList.list[index].name;
        this.$nextTick(() => {
          this.$refs['teachingarea'].init();
        });
      },
      init() {
        console.log("data", this.mainCategory);
        if (this.mainCategory) {
          this.dataForm.mainCategory = this.mainCategory;
          this.query();
        }
      },
      toAddOrUpdate(data ?: IObject) {
        let query = {} as IObject;
        if (data) {
          query.id = data.id;
        }
        query.type = this.dataForm.mainCategory;
        console.log("type", query.type);
        this.editWidthParamsHandle(query);
      },
      importHandle() {
        this.importVisible = true;
        this.$nextTick(() => {
          this.$refs.teachingareaImport.init("teachingarea");
        });
      },
      //导入错误数据提示
      errorHandle(data : any) {
        this.errorVisible = true;
        this.errorList = data;
        console.log("data", data);
      },
      getInfo() {
        console.log("getinfo----------------------------");
        baseService.get("/resource/teachingareatype/page",{
          limit: 9999,
          page: 1,
          order: "desc",
          orderField: "create_date"
        }).then((res) => {
          if (res.code != 0) {
            this.$message.error(res.msg);
          }
          this.teachingAreaTypeList = res.data;
          this.id = this.teachingAreaTypeList.list[0].id;
          this.name = this.teachingAreaTypeList.list[0].name;
          this.$nextTick(() => {
            this.$refs['teachingarea'].init();
          });
          console.log(this.teachingAreaTypeList.list);
        }).catch((err) => {
          console.error(err);
        });
      }
    }
  });
</script>
