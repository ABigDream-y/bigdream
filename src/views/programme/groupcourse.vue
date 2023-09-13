<template>
	<div class="mod-programme__groupcourse">
		<el-row :gutter="20">
			<el-col :span="7">
				<el-card shadow="never">
					<div class="mod-left-card">
						<h3 class="group-title" style="margin-top:0;">
							<span>课组信息</span>
							<el-button v-if="hasPermission('programme:groupcourse:save')" type="text"
								@click="addCourseGroup()">新增</el-button>
						</h3>
						<div v-loading="dataListLoading">
							<div :class="groupCourseId == item.groupId ?'active':''" v-for="(item,index) in dataList"
								:key="index" class="group-item">
								<span style="flex:1;"
									@click="groupCourseSelect(index)">{{item.groupName}}[最少修读<span style="color: green;font-weight: bold;">{{item.scoreMin}}</span>学分]</span>
								<el-button @click="deleteHandle(item.id)"
									v-if="hasPermission('programme:groupcourse:delete')" type="danger" icon="Delete"
									circle plain/>
							</div>
							<div v-if="dataList.length == 0">
								<el-empty description="暂无数据" />
							</div>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="17">
				<h3 style="margin-top: 0;">课组课程信息</h3>
				<case-group-course :caseInfo="caseInfo" ref="caseGroupCourse" :showAdd="false"></case-group-course>
			</el-col>
		</el-row>
		
		<case-course-group v-if="caseCourseGroupVisible" ref="caseCourseGroup"
			@confirm="comfirmHandle"></case-course-group>

	</div>
</template>

<script lang="ts">
	import baseService from "@/service/baseService";
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./groupcourse-add-or-update.vue";
	import CaseCourseGroup from "../dialog/coursegroup.vue";
	// import CaseGroupCourse from "./casecoursegroup.vue";
	// 课组课程信息列表变更
	import CaseGroupCourse from "./coursecase.vue";
	export default defineComponent({
		components: {
			AddOrUpdate,
			CaseCourseGroup,
			CaseGroupCourse
		},
		props:{
			caseInfo:Object
		},
		setup() {
			const state = reactive({
				caseCourseGroupVisible: false,
				createdIsNeed: false,
				getDataListURL: "/programme/groupcourse/page",
				getDataListIsPage: true,
				exportURL: "/programme/groupcourse/export",
				deleteURL: "/programme/groupcourse",
				routeName: '/programme-groupcourse-edit',
				routePath: '/programme/groupcourse-edit',
				routeTitle: '培养方案课组课程',
				deleteIsBatch: true,
				groupCourseId: "",
				dataForm: {
					caseId: "",
					groupId: "",
					groupName: "",
				} as IObject,
				limit: 9999,
				dataList:[] as IObject[]
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
			dataList(val) {
				console.log('dataList', val)
				if (val && val.length != 0) {
					this.groupCourseSelect(0);
					this.groupCourseId = this.dataList[0].groupId;
					this.$nextTick(()=>{
						this.$refs['caseGroupCourse'].init(this.dataForm.caseId, this.groupCourseId);
					});
				} else {
					this.$nextTick(()=>{
						this.$emit('commitGroupId', null);
						this.$refs['caseGroupCourse'].clear();
					});
				}
			}
		},
		methods: {
			init(caseId : string) {
				this.dataForm.caseId = caseId;
				this.refresh();
			},
			refresh() {
				this.groupCourseId = "";
				this.query();
				this.$nextTick(()=>{
					console.log(this.dataForm);
					console.log(this.dataList);
				});
			},
			addCourseGroup() {
				this.caseCourseGroupVisible = true;
				this.$nextTick(() => {
					this.$refs.caseCourseGroup.init();
				})
			},
			comfirmHandle(data : IObject) {
				console.log('data', data)
				let postData = {
					caseId: this.dataForm.caseId,
					groupId: data.id,
					groupName: data.name,
					scoreMin: data.scoreMin
				}
				let dataIdx = this.dataList.findIndex(val=>val.groupId == data.id);
				if(dataIdx != -1) {
					return this.$message.error('请勿添加重复课组数据')
				}
				
				console.log('提交的数据', postData);
				baseService.post("/programme/groupcourse", postData).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.$message({
						message: this.$t("prompt.success"),
						type: "success",
						duration: 500,
						onClose: () => {
							this.caseCourseGroupVisible = false;
							this.refresh();
						}
					});
				});
			},
			groupCourseSelect(index : number) {
				this.groupCourseId = this.dataList[index].groupId;
				this.$nextTick(()=>{
					this.$refs['caseGroupCourse'].init(this.dataForm.caseId, this.groupCourseId);
					this.$emit('commitGroupId', this.groupCourseId);
				});
			}
		}
	});
</script>

<style scoped lang="scss">
	.mod-left-card {
		width: 100%;
		min-height: calc(100vh - 50px - 40px - 30px - 20px - 55px - 42px - 20px);

		.group-title {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 0;
		}

		.group-item {
			width: 100%;
			padding: 10px;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.active {
			background-color: rgba(62, 142, 247, 0.2);
			color: #3E8EF7;
		}

	}
</style>