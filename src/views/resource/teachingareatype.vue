<template>
  <div class="mod-resource__teachingareatype">
    <div class="teachingareatype-main">
      <div class="left">
        <el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
          <el-form-item prop="name">
            <el-input v-model="dataForm.name" placeholder="名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">{{ $t("query") }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="queryResetHandle()">重置</el-button>
          </el-form-item>
          <el-form-item v-if="hasPermission('resource:teachingareatype:save')">
            <el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
          </el-form-item>
          <el-form-item v-if="hasPermission('resource:teachingareatype:delete')">
            <el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="dataListLoading" :data="dataList" border style="width: 100%"
          @selection-change="dataListSelectionChangeHandle" :default-sort="defaultSort"
          @sort-change="dataListSortChangeHandle">
          <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
          <el-table-column prop="sort" label="排序" header-align="center" align="center" width="100"></el-table-column>
          <el-table-column prop="cover" label="封面" header-align="center" align="center" width="300">
            <template v-slot="scope">
              <div class="demo-image__preview" v-if="scope.row.cover">
                <el-image style="width: 200px; height: 100px"
                   :src="scope.row.cover"
                   :preview-src-list="[scope.row.cover]"
                   :preview-teleported="true"
                   :zoom-rate="1.2"
                   fit="cover"
                  />
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column> -->
          <el-table-column prop="name" label="名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="type" label="类别" header-align="center" align="center">
            <template v-slot="scope">
              {{ getDictLabel("area_type", scope.row.type) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" header-align="center" align="center" width="100">
            <template v-slot="scope">
              <el-tag type="success" v-if="scope.row.status == 1">启用</el-tag>
              <el-tag type="danger" v-else>禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createDate" sortable label="创建时间" header-align="center"
            align="center" width="200"></el-table-column>
          <el-table-column :label="$t('handle')" header-align="center" align="center" width="150">
            <template v-slot="scope">
              <!-- <el-button type="text" size="small" @click="areaHandle(scope.row)">教学场地</el-button> -->
              <el-button v-if="hasPermission('resource:teachingareatype:update')" type="text" size="small"
                @click.stop="detailHandle(scope.row)">详情</el-button>
              <el-button v-if="hasPermission('resource:teachingareatype:update')" type="text" size="small"
                @click.stop="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
              <el-button v-if="hasPermission('resource:teachingareatype:delete')" type="text" size="small"
                @click.stop="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
          layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
          @current-change="pageCurrentChangeHandle"> </el-pagination>
      </div>
      <!-- <div class="right">
				<TeachingAreaTypeDetail :showBack="false" :rowData="rowData"></TeachingAreaTypeDetail>
			</div> -->
    </div>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<style>
  .teachingareatype-main {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
  }

  .teachingareatype-main .left {
    flex: 1;
  }

  .teachingareatype-main .right {
    flex: 2;
  }

  .demo-image__error .image-slot {
    font-size: 30px;
  }

  .demo-image__error .image-slot .el-icon {
    font-size: 30px;
  }

  .demo-image__error .el-image {
    width: 100%;
    height: 200px;
  }

  /* .teachingareatype-main .left,
	.teachingareatype-main .right{
		min-height: 100vh;
	} */
</style>

<script lang="ts">
  import { registerDynamicToRouterAndNext } from "@/router";
  import useView from "@/hooks/useView";
  import { IObject } from "@/types/interface";
  import { defineComponent, reactive, toRefs } from "vue";
  import AddOrUpdate from "./teachingareatype-add-or-update.vue";
  import TeachingAreaTypeDetail from "./teachingareatype-detail.vue";
  export default defineComponent({
    components: {
      AddOrUpdate,
      TeachingAreaTypeDetail
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
        order: "desc",
        orderField: "sort",
        rowData: null,
        selectForm: {
          id: 0
        },
        defaultSort: {
          prop: "createDate",
          order: "descending"
        },
        order: "desc",
        orderField: "create_date",
        srcList: [],
        initIndex: 0
      });
      return { ...useView(state), ...toRefs(state) };
    },
    watch: {
      dataList: {
        handler(val) {
          console.log("dataList：", val);
          if (val) {
            this.selectForm = val[0];
            this.rowData = this.selectForm;
            this.srcList = [];
            for (var i = 0; i < val.length; i++) {
              if(val[i].cover) {
                this.srcList.push(val[i].cover);
              }
            }
          }
        },
        deep: true
      }
    },
    methods: {
      areaHandle(data : IObject) {
        console.log("data", data);
        const routeParams = {
          routeName: `resource-teachingarea__${data.id}`,
          title: `教学场地 - ${data.name}`,
          path: `/resource/teachingarea`,
          query: {
            tid: data.id,
            _mt: `教学场地 - ${data.name}`
          }
        };
        registerDynamicToRouterAndNext(routeParams);
      },
      detailHandle(data : string) {
        const routeParams = {
          routeName: `resource-teachingareatype-detail__${data.id}`,
          title: `${data.name} - 教学场地类型详情`,
          path: `/resource/teachingareatype-detail`,
          query: {
            id: data.id,
            _mt: `${data.name} - 教学场地类型详情`
          }
        };
        registerDynamicToRouterAndNext(routeParams);
      },
      handleRowClick(rowData : Object) {
        this.rowData = rowData;
        this.selectForm = rowData;
      }
    }
  });
</script>
