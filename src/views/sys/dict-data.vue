<template>
	<div class="mod-sys__dict">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="dataForm.dictValue" :placeholder="$t('dict.dictValue')" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.dictLabel" :placeholder="$t('dict.dictLabel')" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('sys:dict:save')" type="primary" @click="addOrUpdateHandleX()">
					{{ $t("add") }}
				</el-button>
			</el-form-item>
			<el-form-item>
				<el-button v-if="hasPermission('sys:dict:delete')" type="danger" @click="deleteHandle()">
					{{ $t("deleteBatch") }}
				</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			@sort-change="dataListSortChangeHandle" style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="dictValue" :label="$t('dict.dictValue')" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="dictLabel" :label="$t('dict.dictLabel')" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="sort" :label="$t('dict.sort')" sortable="custom" header-align="center"
				align="center"></el-table-column>
			<el-table-column prop="remark" :label="$t('dict.remark')" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="createDate" :label="$t('dict.createDate')" sortable="custom" header-align="center"
				align="center" width="180"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('sys:dict:update')" type="text" size="small"
						@click="addOrUpdateHandleX(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="hasPermission('sys:dict:delete')" type="text" size="small"
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
	import {
		defineComponent,
		reactive,
		toRefs
	} from "vue";
	import AddOrUpdate from "./dict-data-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		props: {
			dictTypeId: String
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/sys/dict/data/page",
				getDataListIsPage: true,
				deleteURL: "/sys/dict/data",
				deleteIsBatch: true,
				dataForm: {
					dictTypeId: "0",
					dictLabel: "",
					dictValue: ""
				}
			});
			return {
				...useView(state),
				...toRefs(state)
			};
		},
		created() {
			this.dataForm.dictTypeId = this.dictTypeId as string;
			this.getDataList();
		},
		watch: {
			dictTypeId() {
				this.dataForm.dictTypeId = this.dictTypeId as string;
				this.getDataList();
			}
		},
		methods: {
			// 新增 / 修改
			addOrUpdateHandleX(id ? : string) {
				this.addOrUpdateVisible = true;
				this.$nextTick(() => {
					this.$refs.addOrUpdate.dataForm.id = id;
					this.$refs.addOrUpdate.dataForm.dictTypeId = this.dataForm.dictTypeId;
					this.$refs.addOrUpdate.init();
				});
			}
		}
	});
</script>
