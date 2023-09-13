<template>
	<div class="edit-card--file">
		<div class="aui-tab-header" style="z-index:999;">
			<el-button @click="goBack()">
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回
			</el-button>
			<el-button v-if="dataForm.status == 1" @click="createPlan(dataForm)" type="primary">
				生成教学计划
			</el-button>
		</div>
		<div class="aui-tab-body">
			<el-tabs v-model="activeName" tab-position="top" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="详情" name="detail">
					<div class="demo-tabs-item edit-card-page">
						<planDetailEditDetail ref="detail"></planDetailEditDetail>
					</div>
				</el-tab-pane>
				<el-tab-pane label="计划明细" name="planDetail">
					<div class="demo-tabs-item">
						<planDetailEditPlanDetail ref="planDetail"></planDetailEditPlanDetail>
					</div>
				</el-tab-pane>
				<el-tab-pane label="对比" name="compare">
					<div class="demo-tabs-item">
						<planDetailEditCompare ref="compare"></planDetailEditCompare>
					</div>
				</el-tab-pane>
			</el-tabs>
			<createPlanProgressDialog v-if="dataForm.status == 1" ref="createPlanProgressDialog" @refreshDataList="refresh"></createPlanProgressDialog>
		</div>
	</div>
</template>

<script lang="ts">
	import { getDictLabel } from "@/utils/utils";
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import planDetailEditDetail from "./planDetail-edit-detail.vue";
	import planDetailEditPlanDetail from "./planDetail-edit-planDetail.vue";
	import planDetailEditCompare from "./planDetail-edit-compare.vue";
	import createPlanProgressDialog from "./createPlanProgressDialog.vue";
	import useView from "@/hooks/useView";
	export default defineComponent({
		components: {
			planDetailEditDetail,
			planDetailEditPlanDetail,
			planDetailEditCompare,
			createPlanProgressDialog
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				visible: false,
				activeName: 'detail',
				dataForm: {
					id: "",
					grade: "",
					institute: "",
					instituteNo: "",
					major: "",
					majorDirection: "",
					name: "",
					eduSystem: "",
					startGrade: "",
					startTerm: "",
					termType: "",
					courseType: "",
					scoreMin: "",
					academicDegree: "",
					trainObjective: "",
					readingRequirements: "",
					programFeatures: "",
					majorDisciplines: "",
					mainCourses: "",
					mainProfessionalExperiments: "",
					status: 0,
					creator: "",
					createDate: "",
					updater: "",
					updateDate: ""
				}
			});
		},
		computed: {

		},
		created() {

		},
		activated() {
			this.init();
		},
		methods: {
			init() {
				let id = this.$route.query.planId || '';
				let tab = this.$route.query.tab || '';
				console.log("id：", id, "tab：", tab);
				this.activeName = tab;
				if (id && id != '0') {
					this.dataForm.id = id;
				}
				console.log(this.dataForm.id);
				this.$nextTick(() => {
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			createPlan(data:IObject) {
				this.$refs["createPlanProgressDialog"].showDialog();
				this.$refs["createPlanProgressDialog"].request(data);
				
			},
			refresh() {
				this.init();
			},
			// 获取信息
			getInfo() {
				baseService.get("/plan/plan/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					console.log(res.data);
					this.dataForm = res.data;
					this.$nextTick(()=>{
            this.$refs[this.activeName].init(this.dataForm);
          });
				});
			},
			goBack() {
				const activeTabName = this.store.state.activeTabName;
				const tabs = this.store.state.tabs;
				let index = findIndex(tabs, (x) => x.value === activeTabName);
				this.store.state.tabs.splice(index, 1);
				this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
				this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
				this.$router.push(this.store.state.activeTabName);
			},
			updateClosedTabs(closedTabs : any[], isTransform = true) {
				if (isTransform) {
					closedTabs = closedTabs.map((x) => x.value);
				}
				this.store.dispatch({
					type: "updateState",
					payload: {
						closedTabs
					}
				});
			},
			handleClick(tab : any) {
				let index = tab.index;
				let name = tab.props.name;
				this.activeName = name;
				this.$nextTick(() => {
					// console.log(this.dataForm);
					this.$refs[name].init(this.dataForm);
				});
			}
		}
	});
</script>

<style scoped>
	:deep(.mod-programme__groupcourse .el-card__body) {
		padding: 10px;
	}
</style>