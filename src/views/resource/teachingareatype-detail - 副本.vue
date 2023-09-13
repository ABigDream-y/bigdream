<template>
  <div class="mod-programme__groupcourse">
    <el-row :gutter="20">
      <el-col :span="7">
        <el-card shadow="never">
          <div class="mod-left-card">
            <h3 class="group-title" style="margin-top: 0">
              <span>教学场地类型</span>
              <div>
                <el-button v-if="hasPermission('resource:teachingareatype:save')" type="text" @click="editHandle()">新增</el-button>
              </div>
            </h3>
            <div v-loading="dataListLoading">
              <div :class="activeId == item.id ? 'active' : ''" v-for="(item, index) in dataList" :key="index" class="group-item">
                <span style="flex: 1" @click="initArea(item)">{{ item.name }}</span>
                <el-button @click="deleteHandle(item.id)" v-if="hasPermission('resource:teachingareatype:delete')" type="danger" icon="Delete" circle plain />
              </div>
              <div v-if="dataList.length == 0">
                <el-empty description="暂无数据" />
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="17">
        <div class="mod-right-card">
          <p style="margin-top: 0">教学场地信息</p>
          <teaching-area ref="teachingAreaRef"></teaching-area>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
import useView from "@/hooks/useView";
import { defineComponent, reactive, toRefs } from "vue";
import TeachingArea from "./teachingarea.vue";
export default defineComponent({
  components: {
    TeachingArea
  },
  setup() {
    const state = reactive({
      getDataListURL: "/resource/teachingareatype/page",
      getDataListIsPage: true,
      exportURL: "/resource/teachingareatype/export",
      deleteURL: "/resource/teachingareatype",
      routeName: "/resource-teachingareatype-edit",
      routePath: "/resource/teachingareatype-edit",
      routeTitle: "教学场地",
      deleteIsBatch: true,
      dataForm: {
        name: ""
      },
      limit: 999,
      activeId: "",
      order: "desc",
      orderField: "sort"
    });
    return { ...useView(state), ...toRefs(state) };
  },
  watch: {
    dataList(val) {
      if (val && val.length != 0) {
        // this.groupCourseSelect(0);
        this.activeId = val[0].id;
        this.initArea(val[0]);
      }
    }
  },
  methods: {
    init() {
      // this.query();
    },
    addCourseGroup() {
      this.caseCourseGroupVisible = true;
      this.$nextTick(() => {
        this.$refs.teachingAreaRef.init();
      });
    },
    comfirmHandle(data: IObject) {
      console.log("data", data);
      let postData = {};
      let dataIdx = this.dataList.findIndex((val) => val.groupId == data.id);
      if (dataIdx != -1) {
        return this.$message.error("请勿添加重复课组数据");
      }

      console.log("提交的数据", postData);
      baseService.post("/programme/groupcourse", postData).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.$message({
          message: this.$t("prompt.success"),
          type: "success",
          duration: 500,
          onClose: () => {
            this.refresh();
          }
        });
      });
    },
    initArea(val: any) {
      this.activeId = val.id;
      this.$nextTick(() => {
        this.$refs["teachingAreaRef"].init(val.name);
      });
    }
  }
});
</script>

<style scoped lang="scss">
// .mod-programme__groupcourse{

// }
.mod-left-card {
  width: 100%;
  max-height: calc(100vh - 50px - 40px - 30px - 55px - 42px);
  overflow: auto;

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
    color: #3e8ef7;
  }
}

.mod-right-card {
  width: 100%;
  max-height: calc(100vh - 50px - 40px - 30px - 55px);
  overflow: auto;
}
</style>
