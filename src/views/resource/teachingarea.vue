<template>
	<div class="mod-resource__teachingarea" width="100%">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()" label-width="auto">
			<el-form-item prop="name">
				<el-input v-model="dataForm.name" placeholder="场地名称" clearable></el-input>
			</el-form-item>
			<el-form-item prop="campus">
				<ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
			</el-form-item>
			<!-- <el-form-item>
				<el-input v-model="dataForm.mainCategory" placeholder="场地类别" clearable></el-input>
			</el-form-item> -->
			<el-form-item prop="building">
				<el-input v-model="dataForm.building" placeholder="教学楼" clearable></el-input>
			</el-form-item>
			<el-form-item prop="floor">
				<el-input v-model="dataForm.floor" placeholder="楼层" clearable></el-input>
			</el-form-item>
			<el-form-item prop="house">
				<el-input v-model="dataForm.house" placeholder="门牌号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="seats">
				<el-input v-model="dataForm.seats" placeholder="容量" clearable></el-input>
			</el-form-item>
			<el-form-item prop="department">
				<el-input v-model="dataForm.department" placeholder="托管部门" clearable></el-input>
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
			<el-form-item v-if="hasPermission('resource:teachingarea:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:teachingarea:save')">
				<el-button type="success" @click="downTemplateHandle()">模板下载</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:teachingarea:save')">
				<el-button type="warning" @click="importHandle()">批量导入</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:teachingarea:save')">
				<el-button type="primary" @click="toAddOrUpdate()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:teachingarea:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%" :default-sort="defaultSort" @sort-change="dataListSortChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="name" label="场地名称" header-align="center" align="center"
				width="100"></el-table-column>
			<!-- <el-table-column prop="mainCategory" label="场地类别" header-align="center" align="center"
				width="100"></el-table-column> -->
			<el-table-column prop="campus" label="校区" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("campus", scope.row.campus) }}
				</template>
			</el-table-column>
			<el-table-column prop="building" label="教学楼" header-align="center" align="center"></el-table-column>
			<el-table-column prop="floor" label="楼层" header-align="center" align="center"></el-table-column>
			<el-table-column prop="house" label="门牌号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="seats" label="容量" header-align="center" align="center"></el-table-column>
			<el-table-column prop="department" label="托管部门" header-align="center" align="center"
				width="120"></el-table-column>
			<el-table-column prop="administrators" label="场地管理员" header-align="center" align="center"
				width="120"></el-table-column>
			<el-table-column prop="administratorsMobile" label="场地管理员电话" header-align="center" align="center"
				width="140"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("enable_status", scope.row.status) }}
				</template>
			</el-table-column>
			<el-table-column prop="createDate" sortable label="创建时间" header-align="center" align="center"
				width="200"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('resource:teachingarea:update')" type="text" size="small"
						@click="toAddOrUpdate(scope.row)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('resource:teachingarea:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination>
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

		<TeachingAreaImport v-if="importVisible" ref="teachingareaImport" @refreshDataList="query()"
			@error="errorHandle"> </TeachingAreaImport>

		<!-- 错误提示 -->
		<el-dialog title="错误提示" v-model="errorVisible" :close-on-click-modal="false" :close-on-press-escape="false"
			width="50%">
			<el-table v-loading="dataListLoading" :data="errorList" border style="width: 100%">
				<el-table-column prop="msg" label="错误信息" header-align="center" align="center"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./teachingarea-add-or-update.vue";
	import TeachingAreaImport from "./teachingarea-import.vue";
	export default defineComponent({
		components: {
			AddOrUpdate,
			TeachingAreaImport
		},
		props: {
			mainCategory: String
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/resource/teachingarea/page",
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
			mainCategory(val : string) {
				console.log("mainCategory", val);
				this.init();
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
		},
		methods: {
			init() {
				console.log("data", this.mainCategory);
				if (this.mainCategory) {
					this.dataForm.mainCategory = this.mainCategory;
					this.query();
				}
			},
			toAddOrUpdate(data ?: IObject) {
				let query = {} as IObject;
        console.log("data ", data);
				if (data) {
					query.id = data.id;
				}
				query.type = this.dataForm.mainCategory;
				console.log("query", query);
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
			}
		}
	});
</script>
