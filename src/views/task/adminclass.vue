<template>
	<div class="mod-task__adminclass">
		<div v-if="props.actions" style="margin-bottom:10px;">行政班（{{total}}）</div>
		<el-form v-if="props.actions" :inline="true" :model="dataForm">
			<!-- <el-form-item>
				<el-input v-model="dataForm.classNo" placeholder="班级" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<ren-select v-model="dataForm.grade" dict-type="grade" placeholder="年级"></ren-select>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item> -->
			<!-- 显示/隐藏 -->
			<el-form-item>
				<el-button type="primary" @click="combineBatchHandle()">合班</el-button>
			</el-form-item>
			<!-- <el-form-item v-if="hasPermission('task:adminclass:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item> -->
			<!-- <el-form-item v-if="hasPermission('task:adminclass:save')">
				<el-button type="primary" @click="editHandle()">{{ $t("add") }}</el-button>
			</el-form-item> -->
			<!-- <el-form-item v-if="hasPermission('task:adminclass:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item> -->
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column v-if="props.actions" type="selection" :selectable="selectable" header-align="center" align="center"
				width="50"></el-table-column>
			<el-table-column prop="classNo" label="班级编号" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="className" label="班级" header-align="center" align="center"></el-table-column>
			<el-table-column prop="number" label="人数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="grade" label="年级" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("grade", scope.row.grade) }}
				</template>
			</el-table-column>
			<el-table-column prop="institute" label="院系" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="instituteNo" label="院系" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="major" label="专业" header-align="center" align="center"></el-table-column>
			<el-table-column prop="majorDirection" label="专业方向" header-align="center" align="center"
				width="120"></el-table-column>
			<el-table-column prop="campus" label="校区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="openingStatus" label="是否开课" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.openingStatus) }}
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("task_course_status", scope.row.status) }}
				</template>
			</el-table-column>
			<el-table-column v-if="props.actions" :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('task:adminclass:update') && scope.row.status == 0 && scope.row.openingStatus == 1" type="text" size="small"
						@click="turnTeachingHandle(scope.row)">转教学班</el-button>
					<!-- <el-button v-if="hasPermission('task:adminclass:update')" type="text" size="small"
						@click="combineHandle(scope.row)">合班</el-button> -->
					<!-- <el-button v-if="hasPermission('task:adminclass:update')" type="text" size="small"
						@click="splitHandle(scope.row)">拆班</el-button> -->
					<el-button
						v-if="hasPermission('task:adminclass:update') && scope.row.status == 0 && scope.row.openingStatus == 0"
						type="text" size="small" @click="cancelHandle(scope.row,1)">开课</el-button>
					<el-button
						v-if="hasPermission('task:adminclass:update') && scope.row.status == 0 && scope.row.openingStatus == 1"
						type="text" size="small" @click="cancelHandle(scope.row,0)">取消开课</el-button>
					<!-- <el-button v-if="hasPermission('task:adminclass:update')" type="text" size="small" @click="editHandle(scope.row.id)">{{ $t("update") }}</el-button> -->
					<!-- <el-button v-if="hasPermission('task:adminclass:delete')" type="text" size="small"
						@click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button> -->
				</template>
			</el-table-column>
		</el-table>
		<!-- <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination> -->
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./adminclass-add-or-update.vue";
	import baseService from "@/service/baseService";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		props: {
			actions: {
				type: Boolean,
				default: true
			}
		},
		setup(props) {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/task/adminclass/page",
				getDataListIsPage: true,
				exportURL: "/task/adminclass/export",
				deleteURL: "/task/adminclass",
				routeName: "/task-adminclass-edit",
				routePath: "/task/adminclass-edit",
				routeTitle: "教学任务维护行政班",
				deleteIsBatch: true,
				dataForm: {
					courseId: "",
					classNo: "",
					grade: ""
				},
				limit:9999
			});
			return { ...useView(state), ...toRefs(state), props };
		},
		activated() {
			// this.init();
		},
		watch: {
			
		},
		methods: {
			init(courseId : string) {
				this.dataForm.courseId = courseId;
				this.query();
				console.log("init");
				// this.$nextTick(()=>{
				// 	baseService.get("/task/adminclass/page").then((res)=>{
				// 		if(res.code != 0) {
				// 			return this.$message.error(res.msg);
				// 		}
				// 		console.info("行政班：", res.data);
				// 		this.$emit("commitAdminClassInfo", res.data);
				// 	}).catch((err)=>{
				// 		console.error(err);
				// 		return this.$message.error("获取行政班信息失败，请稍后重试");
				// 	});
				// });
			},
			selectable(row : IObject) {
				return row.status == 0 && row.openingStatus == 1;
			},
			// 转教学班
			turnTeachingHandle(data : IObject) {
				let that = this;
				this.$confirm(`确定将行政班级【${data.className}】转为教学班？`, this.$t("prompt.title"), {
					confirmButtonText: this.$t("confirm"),
					cancelButtonText: this.$t("cancel"),
					type: "warning"
				}).then(() => {
					baseService.get("/task/adminclass/convert", [data.id]).then((res) => {
						if (res.code !== 0) {
							return that.$message.error(res.msg);
						}
						that.$emit('refresh');
					});
				}).catch(() => {
					//
				});
			},
			//批量选择合班
			combineBatchHandle() {
				if (!this.dataListSelections || (this.dataListSelections && this.dataListSelections.length < 2)) {
					return this.$message.error("请至少选择两个行政班！");
				}
				let ids = this.dataListSelections.map((item : IObject) => item.id);
				baseService.get("/task/adminclass/convert", ids).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.$emit('refresh');
				});
			},
			// 单个选择合班
			combineHandle(data : IObject) {
				console.log("合班");
			},
			// 拆班
			splitHandle(data : IObject) {
				console.log("拆班");

			},
			//开课、取消开课
			cancelHandle(data : IObject, status : number) {
				let that = this;
				this.$confirm(`确定进行【${status == 1 ? '开课' : '取消开课'}操作？】`, this.$t("prompt.title"), {
					confirmButtonText: this.$t("confirm"),
					cancelButtonText: this.$t("cancel"),
					type: "warning"
				}).then(() => {
					baseService.get("/task/adminclass", {
						id: data.id,
						openingStatus: status
					}).then((res) => {
						if (res.code !== 0) {
							return that.$message.error(res.msg);
						}
						that.init(that.dataForm.courseId)
					});
				}).catch(() => {
				});
			}
		}
	});
</script>