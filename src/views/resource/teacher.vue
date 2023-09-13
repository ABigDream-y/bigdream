<template>
	<div class="mod-resource__teacher">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item prop="zgh">
				<el-input v-model="dataForm.zgh" placeholder="教职工号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="username">
				<el-input v-model="dataForm.username" placeholder="姓名" clearable></el-input>
			</el-form-item>
			<el-form-item prop="idCard">
				<el-input v-model="dataForm.idCard" placeholder="身份证号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="campus">
				<ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
			</el-form-item>
			<el-form-item prop="instituteNo">
				<ren-institute-tree v-model="dataForm.instituteNo" placeholder="学院" nodekey="number" showType="select"></ren-institute-tree>
			</el-form-item>
			<el-form-item prop="discipline">
				<el-input v-model="dataForm.discipline" placeholder="学科" clearable></el-input>
			</el-form-item>
			<el-form-item prop="rzStatus">
				<ren-select v-model="dataForm.rzStatus" dict-type="rz_status" placeholder="任职状态"></ren-select>
			</el-form-item>
			<el-form-item prop="status">
				<ren-select v-model="dataForm.status" dict-type="enable_status" placeholder="状态"></ren-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:teacher:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:teacher:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:teacher:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="zgh" label="教职工号" header-align="center" align="center" width="120"></el-table-column>
			<el-table-column prop="username" label="姓名" header-align="center" align="center" width="120">
				<template v-slot="scope">
					<el-icon style="color:#409EFF;" v-if="scope.row.gender == 0"><Male /></el-icon>
					<el-icon style="color:#F56C6C;" v-if="scope.row.gender == 1"><Female /></el-icon>
					{{scope.row.username}}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="gender" label="性别" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="contactMobile" label="联系方式" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="idCard" label="身份证号" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="email" label="电子邮箱" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="campus" label="校区" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("campus", scope.row.campus) }}
				</template>
			</el-table-column>
			<el-table-column prop="institute" label="学院" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="instituteNo" label="学院编号" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="major" label="所属专业" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="discipline" label="学科" header-align="center" align="center"></el-table-column>
			<el-table-column prop="position" label="职称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="rzStatus" label="任职状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("rz_status", scope.row.rzStatus) }}
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("enable_status", scope.row.status) }}
				</template>
			</el-table-column>
			<el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('resource:teacher:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('resource:teacher:delete')" type="text" size="small"
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
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./teacher-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/resource/teacher/page",
				getDataListIsPage: true,
				exportURL: "/resource/teacher/export",
				deleteURL: "/resource/teacher",
				routeName: '/resource-teacher-edit',
				routePath: '/resource/teacher-edit',
				routeTitle: '教师',
				deleteIsBatch: true,
				dataForm: {
					zgh: "",
					username: "",
					idCard: "",
					campus: "",
					institute: "",
					instituteNo: "",
					discipline: "",
					rzStatus: "",
					status: "",
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
		}
	});
</script>