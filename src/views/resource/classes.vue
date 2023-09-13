<template>
	<div class="mod-resource__classes">
		<el-form :inline="true"  ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item prop="number">
				<el-input v-model="dataForm.number" placeholder="班级代码" clearable></el-input>
			</el-form-item>
			<el-form-item prop="name">
				<el-input v-model="dataForm.name" placeholder="班级名称" clearable></el-input>
			</el-form-item>
			<el-form-item prop="fdy">
				<el-input v-model="dataForm.fdy" placeholder="辅导员" clearable></el-input>
			</el-form-item>
			<el-form-item prop="teacher">
				<el-input v-model="dataForm.teacher" placeholder="班主任" clearable></el-input>
			</el-form-item>
			<el-form-item prop="campus">
				<ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
			</el-form-item>
			<el-form-item prop="instituteNo">
				<ren-institute-tree v-model="dataForm.instituteNo" @change="instituteChange" placeholder="学院"
					nodekey="number" showType="select"></ren-institute-tree>
			</el-form-item>
			<el-form-item prop="major" v-if="dataForm.instituteNo">
				<el-select v-model="dataForm.major" placeholder="所属专业">
					<el-option v-for="(item,index) in majorList" :key="index" :value="item.name"
						:label="item.name"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:classes:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:classes:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:classes:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="number" label="班级代码" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="name" label="班级名称" header-align="center" align="center" width="120"></el-table-column>
			<el-table-column prop="grade" label="年级" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("grade", scope.row.grade) }}
				</template>
			</el-table-column>
			<el-table-column prop="fdy" label="辅导员" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<div>{{scope.row.fdy}}</div>
					<div v-if="scope.row.fdyMobile">{{scope.row.fdyMobile}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="teacher" label="班主任" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<div>{{scope.row.teacher}}</div>
					<div v-if="scope.row.teacherMobile">{{scope.row.teacherMobile}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="campus" label="校区" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("campus", scope.row.campus) }}
				</template>
			</el-table-column>
			<el-table-column prop="institute" label="学院" header-align="center" align="center" width="200"></el-table-column>
			<!-- <el-table-column prop="instituteNo" label="学院代码" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="major" label="所属专业" header-align="center" align="center" width="200"></el-table-column>
			<!-- <el-table-column prop="createDate" label="创建时间" header-align="center" align="center"></el-table-column> -->
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('resource:classes:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('resource:classes:delete')" type="text" size="small"
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
	import AddOrUpdate from "./classes-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/resource/classes/page",
				getDataListIsPage: true,
				exportURL: "/resource/classes/export",
				deleteURL: "/resource/classes",
				routeName: '/resource-classes-edit',
				routePath: '/resource/classes-edit',
				routeTitle: '班级',
				deleteIsBatch: true,
				majorList: [] as IObject[],
				dataForm: {
					number: "",
					name: "",
					fdy: "",
					teacher: "",
					campus: "",
					institute: "",
					instituteNo: "",
					major: "",
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {},
		methods: {
			// 学院变更
			instituteChange(data ?: IObject) {
				if(data){
					this.dataForm.major = "";
					this.majorList = data.children;
				}else {
					this.dataForm.major = "";
					this.majorList = [];
				}
			}
		}
	});
</script>