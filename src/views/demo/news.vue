<template>
	<div class="mod-demo__news">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<el-input v-model="dataForm.title" :placeholder="$t('news.title')" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-date-picker v-model="daterange" type="daterange" value-format="YYYY-MM-DD"
					:range-separator="$t('datePicker.range')" :start-placeholder="$t('datePicker.start')"
					:end-placeholder="$t('datePicker.end')"> </el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			@sort-change="dataListSortChangeHandle" style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="title" :label="$t('news.title')" header-align="center" align="center">
			</el-table-column>
			<el-table-column prop="pubDate" :label="$t('news.pubDate')" sortable="custom" header-align="center"
				align="center" width="180"></el-table-column>
			<el-table-column prop="createDate" :label="$t('news.createDate')" sortable="custom" header-align="center"
				align="center" width="180"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}
					</el-button>
					<el-button type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}
					</el-button>
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
	import AddOrUpdate from "./news-add-or-update.vue";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/demo/news/page",
				getDataListIsPage: true,
				deleteURL: "/demo/news",
				deleteIsBatch: true,
				daterange: null,
				routeName:'demo-news-edit',
				routePath:'/demo/news-edit',
				routeTitle:'新闻管理',
				dataForm: {
					title: "",
					startDate: null as number | null,
					endDate: null as number | null
				}
			});
			return {
				...useView(state),
				...toRefs(state)
			};
		},
		watch: {
			daterange(val: number[] | null) {
				if (val === null) {
					this.dataForm.startDate = null;
					this.dataForm.endDate = null;
				} else {
					this.dataForm.startDate = val[0];
					this.dataForm.endDate = val[1];
				}
			}
		},
		activated() {
			console.log('public',window.location.origin)
		}
	});
</script>
