<template>
	<div class="mod-demo__sysnotice}">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<el-form-item>
				<ren-select v-model="dataForm.type" dict-type="notice_type"
					:placeholder="$t('notice.type')"></ren-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<!-- <el-form-item>
				<el-button type="primary" @click="addOrUpdateHandle()">{{ $t("add") }}</el-button>
			</el-form-item> -->
			<el-form-item>
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="title" :label="$t('notice.title')" header-align="center"
				align="center"></el-table-column>
			<el-table-column prop="type" :label="$t('notice.type')" header-align="center" align="center" width="150">
				<template v-slot="scope">
					{{ getDictLabel("notice_type", scope.row.type) }}
				</template>
			</el-table-column>
			<el-table-column prop="senderName" :label="$t('notice.senderName')" header-align="center" align="center"
				width="150"></el-table-column>
			<el-table-column prop="senderDate" :label="$t('notice.senderDate')" header-align="center" align="center"
				width="170"></el-table-column>
			<el-table-column prop="status" :label="$t('notice.status')" header-align="center" align="center"
				width="130">
				<template v-slot="scope">
					<el-tag v-if="scope.row.status === 0" size="small" type="danger">{{ $t("notice.status0") }}</el-tag>
					<el-tag v-else size="small" type="success">{{ $t("notice.status1") }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="scope.row.status === 0" type="text" size="small"
						@click="addOrUpdateHandle(scope.row.id)">{{ $t("update") }}</el-button>
					<el-button v-if="scope.row.status === 1" type="text" size="small"
						@click="viewHandle(scope.row)">{{ $t("notice.view") }}</el-button>
					<el-button type="text" size="small"
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
	import AddOrUpdate from "./notice-add-or-update.vue";
	import { IObject } from "@/types/interface";
	import { registerDynamicToRouterAndNext } from "@/router";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				getDataListURL: "/sys/notice/page",
				getDataListIsPage: true,
				deleteURL: "/sys/notice",
				deleteIsBatch: true,
				dataForm: {
					type: ""
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},

		methods: {
			viewHandle(row : IObject) {
				// 路由参数
				const routeParams = {
					path: "/notice/notice-view",
					query: {
						id: row.id,
						_mt: this.$t("notice.view1")
					}
				};
				// 动态路由
				registerDynamicToRouterAndNext(routeParams);
			}
		}
	});
</script>