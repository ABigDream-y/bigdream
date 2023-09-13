<template>
	<div class="mod-task__teachingteacher">
		<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
			<!-- <el-form-item>
				<el-input v-model="dataForm.teachingId" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.teacherId" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.zgh" placeholder="职工号" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.teacherName" placeholder="教师" clearable></el-input>
			</el-form-item> -->
			<!-- <el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('task:teachingteacher:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item> -->
			<el-form-item v-if="hasPermission('task:teachingteacher:save')">
				<el-button type="primary" @click="toAddOrUpdateByOne()">新增</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('task:teachingteacher:save')">
				<el-button type="primary" @click="toAddOrUpdate()">批量新增</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('task:teachingteacher:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<!-- <el-table-column prop="count" label="周次" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="teacherId" label="" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="zgh" label="职工号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="teacherName" label="教师" header-align="center" align="center"></el-table-column>
			<el-table-column prop="position" label="职称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="leaderStatus" label="是否负责教师" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.leaderStatus) }}
				</template>
			</el-table-column>
			<!-- <el-table-column prop="remark" label="备注" header-align="center" align="center"></el-table-column> -->
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('task:teachingteacher:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination> -->
		<!-- 批量选择新增老师 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @confirm="confirmBatchSelect"></add-or-update>
		<!-- 单个选择新增老师 -->
		<TeacherDialog v-if="teacherSingleVisible" ref="TeacherDialog" @confirm="confirmSelect"></TeacherDialog>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "../dialog/teacher-multi.vue";
	import TeacherDialog from "../dialog/teacher.vue";
	import baseService from "@/service/baseService";
	export default defineComponent({
		components: {
			AddOrUpdate,
			TeacherDialog
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/task/teachingteacher/page",
				getDataListIsPage: true,
				teacherSingleVisible: false,
				exportURL: "/task/teachingteacher/export",
				deleteURL: "/task/teachingteacher",
				routeName: '/task-teachingteacher-edit',
				routePath: '/task/teachingteacher-edit',
				routeTitle: '教学班上课教师',
				deleteIsBatch: true,
				dataForm: {
					teachingId: "",
					teacherId: "",
					zgh: "",
					teacherName: "",
				},
				limit: 99999
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
			total(val) {
				this.$emit('refresh', val)
			}
		},
		methods: {
			init(teachingId : string) {
				this.dataForm.teachingId = teachingId;
				this.query();
			},
			//批量新增教师
			toAddOrUpdate(data ?: Object) {
				this.addOrUpdateVisible = true;
				this.$nextTick(() => {
					console.log(data);
					this.$refs["addOrUpdate"].init();
				});
			},
			//批量新增教师确认
			confirmBatchSelect(data : IObject[]) {
				console.log("批量data：", data);
				//接口对接

				this.addOrUpdateVisible = false;


			},
			// 单个新增
			toAddOrUpdateByOne() {
				this.teacherSingleVisible = true;
				this.$nextTick(() => {
					this.$refs["TeacherDialog"].init();
				});
			},
			//新增教师确认
			confirmSelect(data : IObject) {
				console.log("单个data：", data);
				let postData = {
					teacherId:data.id,
					teachingId: this.dataForm.teachingId,
					zgh: data.zgh,
					teacherName: data.username,
					position: data.position,
					leaderStatus: 0,
					remark: "",
				}
				// 开始请求
				baseService.post("/task/teachingteacher", postData).then((res) => {
					console.log(res);
					if (res.code != 0) {
						return this.$message.error(res.msg);
					}
					this.teacherSingleVisible = false;
					// this.init();
					this.$message({
						message: '操作成功',
						type: 'success',
						duration: 500
					});
					this.query();
				}).catch((err) => {
					console.error(err);
					return this.$message.error('操作失败，请稍后重试');
				});
			}
		}
	});
</script>