<template>
	<div class="mod-task__teaching">
		<div v-if="props.actions" style="margin-bottom: 10px">教学班（{{total}}）</div>
		<el-form v-if="props.actions" :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
			<!-- <el-form-item prop="courseNo">
				<el-input v-model="dataForm.courseNo" placeholder="课程号" clearable></el-input>
			</el-form-item>
			<el-form-item prop="courseName">
				<el-input v-model="dataForm.courseName" placeholder="课程名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button @click="queryResetHandle()">重置</el-button>
			</el-form-item> -->
			<!-- <el-form-item v-if="hasPermission('task:teaching:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item> -->
			<el-form-item v-if="hasPermission('task:teaching:save')">
				<el-button type="primary" @click="addTeachingClasessHandle()">{{ $t("add") }}</el-button>
			</el-form-item>
			<el-form-item v-if="hasPermission('task:teaching:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="success" @click="multiAuditHandle('',1)">批量通过</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="danger" @click="multiAuditHandle('',3)">批量不通过</el-button>
			</el-form-item>
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column v-if="props.actions" type="selection" header-align="center" align="center" width="50"></el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center" width="90">
				<template v-slot="scope">
					<el-tag v-if="scope.row.status == 0" type="info">待提交</el-tag>
					<el-tag v-if="scope.row.status == 2">待审核</el-tag>
					<el-tag type="success" v-if="scope.row.status == 1">已通过</el-tag>
					<el-tooltip class="item" effect="dark" placement="right" v-if="scope.row.status == 3">
						<template #content>未通过原因：<br />{{scope.row.description}}</template>
						<el-tag type="danger">
							<div style="display:flex;align-items:center;">
								未通过
								<el-icon style="margin-left:5px;">
									<QuestionFilled />
								</el-icon>
							</div>
						</el-tag>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="courseNo" label="课程号" header-align="center" align="center"
				width="150"></el-table-column>
			<el-table-column prop="courseName" label="课程名称" header-align="center" align="center"
				width="150"></el-table-column>
			<!-- <el-table-column prop="" label="课序号" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="classNo" label="教学班号" header-align="center" align="center"
				width="150"></el-table-column>
			<el-table-column prop="className" label="包含班级" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<span v-if="scope.row.adminNames">{{scope.row.adminNames.join('、')}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="grade" label="年级" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="" label="包含行政班" header-align="center" align="center" width="160"></el-table-column> -->
			<el-table-column prop="campus" label="上课校区" header-align="center" align="center"
				width="100"></el-table-column>
			<el-table-column prop="courseUnit" label="开课单位" header-align="center" align="center"
				width="150"></el-table-column>
			<!-- <el-table-column prop="" label="上课教师" header-align="center" align="center" width="100"></el-table-column> -->
			<!-- <el-table-column prop="description" label="选课说明" header-align="center" align="center"
				width="160"></el-table-column> -->
			<el-table-column prop="remark" label="备注" header-align="center" align="center"
				width="160"></el-table-column>
			<el-table-column v-if="props.actions" :label="$t('handle')" fixed="right" header-align="center" align="center" width="150">
				<template v-slot="scope">
					<el-button v-if="hasPermission('task:teaching:update')" type="text" size="small"
						@click="editHandle(scope.row.id)">设置</el-button>

					<el-button v-if="hasPermission('task:teaching:update') && scope.row.status == 2" type="text"
						size="small" @click="cancelAuditHandle(scope.row.id)">撤销</el-button>
					<el-button v-if="scope.row.status == 2" type="text" size="small"
						@click="multiAuditHandle(scope.row.id,1)">通过</el-button>
					<el-button v-if="scope.row.status == 2" type="text" size="small"
						@click="multiAuditHandle(scope.row.id,3)">不通过</el-button>

					<el-button v-if="hasPermission('task:teaching:delete') && scope.row.status != 1" type="text"
						size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination> -->
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
		<add-teaching-clasess ref="addTeachingClasess" title="新增教学班" v-if="addTeachingClasessVisible"
			@confirm="confirmAdd"></add-teaching-clasess>
	</div>
</template>

<script lang="ts">
	import baseService from "@/service/baseService";
	import useView from "@/hooks/useView";
	import { IObject } from "@/types/interface";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./teaching-add-or-update.vue";
	import AddTeachingClasess from "./teaching-add.vue";
	export default defineComponent({
		components: {
			AddOrUpdate,
			AddTeachingClasess
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
				getDataListURL: "/task/teaching/page",
				getDataListIsPage: true,
				addTeachingClasessVisible: false,
				exportURL: "/task/teaching/export",
				deleteURL: "/task/teaching",
				routeName: "/task-teaching-edit",
				routePath: "/task/teaching-edit",
				routeTitle: "教学班",
				deleteIsBatch: true,
				dataForm: {
					courseId: "",
					courseNo: "",
					courseName: ""
				},
				limit:9999
			});
			return { ...useView(state), ...toRefs(state), props };
		},
		watch: {},
		methods: {
			init(taskcourseId : string) {
				this.dataForm.courseId = taskcourseId;
				this.query();
				console.log("init");
				// this.$nextTick(()=>{
				// 	baseService.get("/task/teaching/page").then((res)=>{
				// 		if(res.code != 0) {
				// 			return this.$message.error(res.msg);
				// 		}
				// 		console.info("教学班：", res.data);
				// 		this.$emit("commitTeachingClassInfo", res.data);
				// 	}).catch((err)=>{
				// 		console.error(err);
				// 		return this.$message.error("获取教学班信息失败，请稍后重试");
				// 	});
				// });
			},
			addTeachingClasessHandle() {
				console.log("addclases");
				this.addTeachingClasessVisible = true;
				this.$nextTick(() => {
					this.$refs.addTeachingClasess.init(this.dataForm.courseId);
				});
			},
			confirmAdd(data : IObject[]) {
				console.log("data", data);
				let ids = data.map((item : IObject) => item.id);
				baseService.get("/task/adminclass/convert", ids).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.$emit('refresh');
				});
			},
			//批量审核
			multiAuditHandle(id : string, status : number) {
				if (!id && (!this.dataListSelections || (this.dataListSelections && this.dataListSelections.length == 0))) {
					return this.$message.error('请选择至少一条数据')
				}

				let that = this;
				let ids = [] as string[];
				let content = "";
				let confirm = "确定" + (status == 1 ? '批量通过' : '批量不通过') + "？";
				if (id) {
					ids = [id];
					content = "确定" + (status == 1 ? '通过' : '不通过') + "？";
				} else {
					let selectList = this.dataListSelections ? this.dataListSelections : [];
					let total = selectList.length;
					ids = selectList.filter((item : IObject) => item.status == 0).map((item : IObject) => item.id);
					content = "总共选择" + total + "条数据，其中" + ids.length + "条待审核数据，";
				}
				if (ids.length == 0) {
					content += "至少选择一条待审核数据！"
					this.$confirm(content, this.$t("prompt.title"), {
						confirmButtonText: this.$t("confirm"),
						cancelButtonText: this.$t("cancel"),
						type: "warning"
					}).then(() => {
					}).catch(() => {
					});
				}
				else if (status == 1) {
					content += confirm;
					this.$confirm(content, this.$t("prompt.title"), {
						confirmButtonText: this.$t("confirm"),
						cancelButtonText: this.$t("cancel"),
						type: "warning"
					}).then(() => {
						that.verifyBatchHandle({
							ids: ids,
							status: 1,
							opinion: ""
						})
					}).catch(() => {
						//
					});
				} else if (status == 3) {
					content += confirm;
					this.$prompt(content, '填写审核未通过理由', {
						confirmButtonText: '确认',
						cancelButtonText: '取消',
						inputType: "textarea",
						inputValidator: (value : string) => {
							if (!value) {
								return '理由不能为空！';
							}
						}
					}).then(({ value }) => {
						console.log('value---', value)
						that.verifyBatchHandle({
							ids: ids,
							status: 3,
							opinion: value
						})

					}).catch(() => {

					});
				}

			},
			//审核
			verifyBatchHandle(data : IObject) {
				// baseService.post("/plan/planrecord/batchAudit",data).then((res) => {
				// 	if (res.code !== 0) {
				// 		return this.$message.error(res.msg);
				// 	}
				// 	this.$emit('refresh');
				// });
			},
			// 撤销审核
			cancelAuditHandle(data : IObject) {
				this.$confirm(`确定撤销【${data.classNo}】教学班审核？`, this.$t("prompt.title"), {
					confirmButtonText: this.$t("confirm"),
					cancelButtonText: this.$t("cancel"),
					type: "warning"
				}).then(() => {
					baseService.put("/task/teaching", {
						id: data.id,
						status: 0
					}).then((res) => {
						if (res.code !== 0) {
							this.loading = false;
							return this.$message.error(res.msg);
						}
						this.$message({
							message: this.$t("prompt.success"),
							type: "success",
							duration: 500,
							onClose: () => {
								this.init(this.dataForm.courseId);
							}
						});
					});
				}).catch(() => {
					//
				});
			}
		}
	});
</script>