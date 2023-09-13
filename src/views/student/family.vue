<template>
	<div class="mod-student__family">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<!-- <el-form-item>
        <el-input v-model="dataForm.userId" placeholder="用户id" clearable></el-input>
      </el-form-item> -->
			<el-form-item prop="username">
				<el-input v-model="dataForm.username" placeholder="姓名" clearable></el-input>
			</el-form-item>
			<el-form-item prop="jobUnit">
				<el-input v-model="dataForm.jobUnit" placeholder="工作单位" clearable></el-input>
			</el-form-item>
			<el-form-item prop="idCard">
				<el-input v-model="dataForm.idCard" placeholder="证件号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:family:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:family:save')">
				<el-button type="primary" @click="toAddOrUpdate()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:family:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="username" label="姓名" header-align="center" align="center"></el-table-column>
			<el-table-column prop="age" label="年龄" header-align="center" align="center"></el-table-column>
			<el-table-column prop="relationship" label="关系" header-align="center" align="center"></el-table-column>
			<el-table-column prop="politicalOutlook" label="政治面貌" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("political_outlook", scope.row.politicalOutlook) }}
				</template>
			</el-table-column>
			<el-table-column prop="jobUnit" label="工作单位" header-align="center" align="center"></el-table-column>
			<el-table-column prop="idCard" label="证件号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="career" label="职业" header-align="center" align="center"></el-table-column>
			<el-table-column prop="jobAdress" label="工作地址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="jobMobile" label="工作单位联系方式" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('student:family:update')" type="text" size="small"
						@click="toAddOrUpdate(scope.row)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('student:family:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
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
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./family-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/student/family/page",
				getDataListIsPage: true,
				exportURL: "/student/family/export",
				deleteURL: "/student/family",
				routeName: '/student-family-edit',
				routePath: '/student/family-edit',
				routeTitle: '家庭成员',
				deleteIsBatch: true,
				dataForm: {
					userId: "",
					username: "",
					jobUnit: "",
					idCard: "",
				} as IObject
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {},
		methods:{
			init(userId:string){
				this.dataForm.userId = userId;
				this.query();
			},
			toAddOrUpdate(data ?: IObject) {
				let query = {} as IObject;
				if (data) {
					query.id = data.id;
				}
				query.uid = this.dataForm.userId
				this.editWidthParamsHandle(query);
			}
		}
	});
</script>