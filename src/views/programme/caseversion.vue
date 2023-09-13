<template>
	<div class="mod-programme__caseversion">
		<el-form :inline="true" :model="dataForm" ref="searchForm" @keyup.enter="getDataList()">
      <el-form-item prop="status">
        <ren-select v-model="dataForm.status" dict-type="plan_version_status" placeholder="状态"></ren-select>
      </el-form-item>
			<el-form-item prop="code">
				<el-input v-model="dataForm.code" placeholder="编号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="name">
				<el-input v-model="dataForm.name" placeholder="培养方案版本名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('programme:caseversion:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('programme:caseversion:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('programme:caseversion:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%" :default-sort="defaultSort" @sort-change="dataListSortChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="status" label="状态" header-align="center" align="center">
      	<template v-slot="scope">
      		{{ getDictLabel("plan_version_status", scope.row.status) }}
      	</template>
      </el-table-column>
			<el-table-column prop="code" label="编号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="name" label="培养方案版本名称" header-align="center" align="center" width="200"></el-table-column>
			<el-table-column prop="versionNumber" label="版本号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="applicableScope" label="适用范围" header-align="center" align="center"></el-table-column>
			<el-table-column prop="educationalSystem" label="学制" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("edu_system", scope.row.educationalSystem) }}
				</template>
			</el-table-column>
			<el-table-column prop="graduate" label="授予学位" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("degree_type", scope.row.graduate) }}
				</template>
			</el-table-column>
			<el-table-column prop="revisionTime" label="修订时间" header-align="center" align="center" width="200"></el-table-column>
			<el-table-column prop="effectiveTime" label="生效时间" header-align="center" align="center" width="200"></el-table-column>
			<el-table-column prop="revisedBy" label="修订单位" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createDate" sortable label="创建时间" header-align="center" align="center" width="200"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('programme:caseversion:update') && scope.row.status == 0" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-else-if="scope.row.status != 0" type="text" size="small"
						@click="editHandle(scope.row.id)">详情</el-button>
					<el-button v-if="hasPermission('programme:caseversion:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>

					<!-- 判断状态 -->
					<el-button v-if="scope.row.status == 0 || scope.row.status == 2" type="text" size="small"
						@click="play(scope.row)">执行</el-button>
					<el-button v-if="scope.row.status == 1" type="text" size="small"
						@click="stop(scope.row)">中止</el-button>
					<el-button v-if="scope.row.status == 2" type="text" size="small"
						@click="abandon(scope.row)">废弃</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script lang="ts">
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./caseversion-add-or-update.vue";
	import baseService from "@/service/baseService";
	import { registerDynamicToRouterAndNext } from "@/router";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/programme/caseversion/page",
				getDataListIsPage: true,
				exportURL: "/programme/caseversion/export",
				deleteURL: "/programme/caseversion",
				routeName: '/programme-caseversion-edit',
				routePath: '/programme/caseversion-edit',
				routeTitle: '培养方案版本',
				deleteIsBatch: true,
				dataForm: {
					code: "",
					name: "",
          status: ""
				},
        defaultSort:{
        	order:"descending",
        	prop:"createDate"
        },
        order: "desc",
        orderField: "create_date"
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {

		},
		methods: {
			play(data) {
				let status = 1;
				data.status = status;
				console.log("data", data, " status -> ", status);
				this.$refs["addOrUpdate"].updateStatus(data);
			},
			stop(data) {
				let status = 2;
				data.status = status;
				console.log("data", data, " status -> ", status);
				this.$refs["addOrUpdate"].updateStatus(data);
			},
			abandon(data) {
				let status = 3;
				data.status = status;
				console.log("data", data, " status -> ", status);
				this.$refs["addOrUpdate"].updateStatus(data);
			}
		}
	});
</script>
