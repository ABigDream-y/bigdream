<template>
	<div class="mod-student__familyaddress">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<!-- <el-form-item>
        <el-input v-model="dataForm.userId" placeholder="用户id" clearable></el-input>
      </el-form-item> -->
			<el-form-item prop="mobile">
				<el-input v-model="dataForm.mobile" placeholder="家庭联系电话" clearable></el-input>
			</el-form-item>
			<el-form-item prop="contacts">
				<el-input v-model="dataForm.contacts" placeholder="联系人" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:familyaddress:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:familyaddress:save')">
				<el-button type="primary" @click="toAddOrUpdate()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('student:familyaddress:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="address" label="家庭住址" header-align="center" align="center"></el-table-column>
			<el-table-column prop="mobile" label="家庭联系电话" header-align="center" align="center"></el-table-column>
			<el-table-column prop="postCode" label="邮政编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="email" label="电子邮箱" header-align="center" align="center"></el-table-column>
			<el-table-column prop="contacts" label="联系人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('student:familyaddress:update')" type="text" size="small"
						@click="toAddOrUpdate(scope.row)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('student:familyaddress:delete')" type="text" size="small"
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
	import AddOrUpdate from "./familyaddress-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/student/familyaddress/page",
				getDataListIsPage: true,
				exportURL: "/student/familyaddress/export",
				deleteURL: "/student/familyaddress",
				routeName: '/student-familyaddress-edit',
				routePath: '/student/familyaddress-edit',
				routeTitle: '家庭住址',
				deleteIsBatch: true,
				dataForm: {
					userId: "",
					mobile: "",
					contacts: "",
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