<template>
	<div class="mod-resource__semesterteachingarea">
		<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item prop="year">
				<ren-select v-model="dataForm.year" dict-type="school_year" placeholder="学年"></ren-select>
			</el-form-item>
			<el-form-item prop="semester">
				<ren-select v-model="dataForm.semester" dict-type="term" placeholder="学期"></ren-select>
			</el-form-item>
			<el-form-item prop="name">
				<el-input v-model="dataForm.name" placeholder="场地名称" clearable></el-input>
			</el-form-item>
			<el-form-item prop="campus">
				<ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
			</el-form-item>
			<el-form-item prop="isSchedulingAllowed">
				<el-select v-model="dataForm.isSchedulingAllowed" placeholder="是否可排课" clearable>
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="isConflictIgnored">
				<el-select v-model="dataForm.isConflictIgnored" placeholder="是否忽略冲突排课" clearable>
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="isExamSchedulingAllowed">
				<el-select v-model="dataForm.isExamSchedulingAllowed" placeholder="是否可排考" clearable>
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="isBorrowingAllowed">
				<el-select v-model="dataForm.isBorrowingAllowed" placeholder="是否可借用" clearable>
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
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
			<el-form-item>
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:semesterteachingarea:save')">
				<el-button type="success" @click="downTemplateHandle()">模板下载</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('resource:semesterteachingarea:save')">
				<el-button type="warning" @click="importHandle()">批量导入</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('resource:semesterteachingarea:save')" type="primary"
					@click="toAddOrUpdate()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('resource:semesterteachingarea:delete')" type="danger"
					@click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%" :default-sort="defaultSort" @sort-change="dataListSortChangeHandle">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="year" label="学年" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("school_year", scope.row.year) }}
				</template>
			</el-table-column>
			<el-table-column prop="semester" label="学期" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("term", scope.row.semester) }}
				</template>
			</el-table-column>
			<el-table-column prop="name" label="场地名称" header-align="center" align="center"
				width="100"></el-table-column>
			<!-- <el-table-column prop="subName" label="场地简称" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="campus" label="校区" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="mainCategory" label="场地类别" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="building" label="教学楼" header-align="center" align="center"></el-table-column>
			<el-table-column prop="floor" label="楼层号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="house" label="门牌号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="seats" label="容量" header-align="center" align="center"></el-table-column>
			<el-table-column prop="isSchedulingAllowed" label="是否可排课" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ scope.row.isSchedulingAllowed == 1 ? "是" : "否" }}
				</template>
			</el-table-column>
			<el-table-column prop="isConflictIgnored" label="是否忽略冲突排课" header-align="center" align="center" width="150">
				<template v-slot="scope">
					{{ scope.row.isConflictIgnored == 1 ? "是" : "否" }}
				</template>
			</el-table-column>
			<el-table-column prop="isExamSchedulingAllowed" label="是否可排考" header-align="center" align="center"
				width="100">
				<template v-slot="scope">
					{{ scope.row.isExamSchedulingAllowed == 1 ? "是" : "否" }}
				</template>
			</el-table-column>
			<el-table-column prop="isBorrowingAllowed" label="是否可借用" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ scope.row.isBorrowingAllowed == 1 ? "是" : "否" }}
				</template>
			</el-table-column>
			<el-table-column prop="department" label="托管部门" header-align="center" align="center"
				width="100"></el-table-column>
			<!-- <el-table-column prop="administrators" label="场地管理员" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="administratorsMobile" label="场地管理员电话" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("enable_status", scope.row.status) }}
				</template>
			</el-table-column>
			<el-table-column prop="createDate" sortable label="创建时间" header-align="center" align="center"
				width="200"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('resource:semesterteachingarea:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('resource:semesterteachingarea:delete')" type="text" size="small"
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
	import useView from "@/hooks/useView";
	import { IObject } from "@/types/interface";
	import { defineComponent, reactive, toRefs } from "vue";
	import baseService from "@/service/baseService";
	import TeachingAreaImport from "./teachingarea-import.vue";
	import AddOrUpdate from "./semesterteachingarea-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate,
			TeachingAreaImport
		},
		props: {
			fromId: {
				type: String
			}
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/resource/semesterteachingarea/page",
				getDataListIsPage: true,
				exportURL: "/resource/semesterteachingarea/export",
				importTemplateUrl: "/resource/semesterteachingarea/download", // 模板下载
				deleteURL: "/resource/semesterteachingarea",
				routeName: "/resource-semesterteachingarea-edit",
				routePath: "/resource/semesterteachingarea-edit",
				routeTitle: "学期教学场地",
				deleteIsBatch: true,
				errorList: [],
				errorVisible: false,
				importVisible: false,
				dataForm: {
					year: "",
					semester: "",
					name: "",
					subName: "",
					campus: "",
					category: "",
					mainCategory: "",
					building: "",
					floor: "",
					house: "",
					seats: "",
					examSeats: "",
					area: "",
					isSchedulingAllowed: "",
					isConflictIgnored: "",
					isExamSchedulingAllowed: "",
					isBorrowingAllowed: "",
					department: "",
					administrators: "",
					administratorsMobile: "",
					remark: "",
					status: "",
					parent: ""
				} as IObject,
				parent: "",
        defaultSort: {
          prop: "createDate",
          order: "descending"
        },
        order: "desc",
        orderField: "create_date",
        data: {
          id: "",
          parentId: ""
        }
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
			fromId(val) {
				this.init(val);
			}
		},
		// activated() {
		//   console.log("query", this.$route.query);
		//   let query = this.$route.query || {};
		//   if (query && query.tid) {
		//     this.dataForm.parent = query.tid || "";
		//   }
		//   this.query();
		// },
		methods: {
			init(id : string) {
				if (id) {
					console.log("parentId", id);
					this.dataForm.parent = id;
					this.query();
				}
			},
			toAddOrUpdate(data ?: IObject) {
				let query = {} as IObject;
				if (data) {
					query.id = data.id;
				}
				if (this.dataForm.parent) {
					query.parentId = this.dataForm.parent;
				}
        console.log("query ", query);
				this.editWidthParamsHandle(query);
			},
			importHandle() {
				this.importVisible = true;
				this.$nextTick(() => {
					this.$refs.teachingareaImport.init("semesterteachingarea", this.dataForm.parent);
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
