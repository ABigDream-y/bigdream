<template>
	<div class="mod-plan__plan">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item prop="name">
				<el-input v-model="dataForm.name" placeholder="名称" clearable></el-input>
			</el-form-item>
			<!-- <el-form-item prop="grade">
				<ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
			</el-form-item> -->
			<el-form-item prop="instituteNo">
				<ren-institute-tree v-model="dataForm.instituteNo" @change="instituteChange" placeholder="学院"
					nodekey="number" showType="select"></ren-institute-tree>
			</el-form-item>
			<el-form-item prop="major" v-if="dataForm.instituteNo">
				<el-select v-model="dataForm.major" placeholder="专业">
					<el-option v-for="(item,index) in majorList" :key="index" :value="item.name"
						:label="item.name"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="majorDirection">
				<el-input v-model="dataForm.majorDirection" placeholder="专业方向" clearable></el-input>
			</el-form-item>
			<el-form-item prop="status">
				<ren-select v-model="dataForm.status" dict-type="verify_status" placeholder="状态"></ren-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('plan:plan:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<!-- <el-form-item v-if="hasPermission('plan:plan:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item> -->
			<el-form-item v-if="hasPermission('plan:plan:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSortChangeHandle"
			style="width: 100%" :default-sort="defaultSort" @sort-change="">
			<!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="startGrade" label="所属学年" header-align="center" align="center"
				width="150"></el-table-column>
			<el-table-column prop="startTerm" label="所属学期" header-align="center" align="center"
				width="150"></el-table-column>
			<el-table-column prop="name" label="名称" header-align="center" align="center" width="200"></el-table-column>
			<el-table-column prop="level" label="方案层次" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="grade" label="年级" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("grade", scope.row.grade) }}
				</template>
			</el-table-column>
			<el-table-column prop="institute" label="院系" header-align="center" align="center" width="150"></el-table-column>
			<!-- <el-table-column prop="instituteNo" label="院系" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="major" label="专业" header-align="center" align="center" width="150"></el-table-column>
			<el-table-column prop="majorDirection" label="专业方向" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center" width="80">
				<template v-slot="scope">
					{{ getDictLabel("create_status", scope.row.status) }}
				</template>
			</el-table-column>
      <el-table-column prop="createDate" label="创建时间" header-align="center" align="center" width="200"
        sortable></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<!-- <el-button v-if="hasPermission('plan:plan:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button> -->
					<el-button v-if="hasPermission('plan:plan:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
					<!-- <el-button type="text" size="small"
						@click="planRecord(scope.row)">{{ $t("createPlan") }}</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script lang="ts">
	import { registerDynamicToRouterAndNext } from "@/router";
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./plan-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/plan/plan/page",
				getDataListIsPage: true,
				exportURL: "/plan/plan/export",
				deleteURL: "/plan/plan",
				routeName: '/plan-plan-edit',
				routePath: '/plan/plan-edit',
				routeTitle: '教学计划',
				deleteIsBatch: true,
				majorList: [] as IObject[],
				dataForm: {
					name: "",
					grade: "",
					institute: "",
					instituteNo: "",
					major: "",
					majorDirection: "",
					status: ""
				},
        defaultSort: {
          prop: "createDate",
          order: "descending"
        },
        order: "desc",
        orderField: "create_date"
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
		},
		methods: {
			// 学院变更
			instituteChange(data ?: IObject) {
				if (data) {
					this.dataForm.major = "";
					this.majorList = data.children;
				} else {
					this.dataForm.major = "";
					this.majorList = [];
				}
			},
			planRecord(data : IObject) {
				const routeParams = {
					routeName: `plan-planrecord__${data.id}`,
					title: `教学计划 - ${data.name}`,
					path: `/plan/planrecord`,
					query: {
						planId: data.id,
						_mt: `教学计划 - ${data.name}`
					}
				};
				registerDynamicToRouterAndNext(routeParams);
			}
		}
	});
</script>
