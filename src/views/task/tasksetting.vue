<template>
	<div>
    <div class="edit-card--file edit-card-page" style="position: relative;">
    	<div class="aui-card-header">
    		<el-button v-if="hasPermission('task:tasksetting:save')" type="primary" :loading="loading"
    			@click="dataFormSubmitHandle()">设置保存</el-button>
    	</div>
    	<div class="edit-card__body">
    		<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
    			label-width="180px">
    			<h3 class="info-h3">教学任务维护设置</h3>
    			<el-form-item label="是否开启教学任务维护" prop="openStatus">
    				<ren-radio-group v-model="dataForm.openStatus" size="large" dict-type="yesOrNo"></ren-radio-group>
    			</el-form-item>
    			<el-row :gutter="20">
    				<!-- <el-col :span="12">
    					<el-form-item label="开始日期" prop="startDate">
    						<el-date-picker type="date" placeholder="开始日期" value-format="YYYY-MM-DD"
    							v-model="dataForm.startDate" size="large"></el-date-picker>
    					</el-form-item>
    				</el-col>
    				<el-col :span="12">
    					<el-form-item label="结束日期" prop="endDate">
    						<el-date-picker type="date" placeholder="结束日期" value-format="YYYY-MM-DD"
    							v-model="dataForm.endDate" size="large"></el-date-picker>
    					</el-form-item>
    				</el-col> -->
    				<el-form-item label="日期" prop="date">
    					<el-date-picker
    					        v-model="dataForm.date"
    					        type="daterange"
    					        unlink-panels
    					        range-separator="-"
    					        start-placeholder="开始日期"
    					        end-placeholder="结束日期"
    							value-format="YYYY-MM-DD"
    					        size="large"
    					      />
    				</el-form-item>
    			</el-row>
    			<h3>教学任务维护约束条件设置</h3>
    			<el-form-item>
    				<el-checkbox-group v-model="conditionList" size="large">
    					<div>
    						<el-checkbox label="maintenanceStatus">上课教师是否维护</el-checkbox>
    					</div>
    					<div>
    						<el-checkbox label="numberStatus">开课总容量是否满足计划学生人数</el-checkbox>
    					</div>
    					<div>
    						<el-checkbox label="infoStatus">是否有遗漏班级信息</el-checkbox>
    					</div>
    					<div>
    						<el-checkbox label="status">开课周次、周学时是否满足授课学时</el-checkbox>
    					</div>
    				</el-checkbox-group>
    			</el-form-item>
    			<h3>开启周次设置</h3>
    			<el-form-item label="是否启用开始周次" prop="courseCount">
    				<ren-radio-group v-model="dataForm.courseCount" size="large" dict-type="yesOrNo"></ren-radio-group>
    			</el-form-item>
    			<el-row :gutter="20">
    				<el-col :span="12">
    					<el-form-item label="一年级" prop="oneGrade">
    						<ren-select v-model="dataForm.oneGrade" size="large" dict-type="yesOrNo" placeholder="一年级"></ren-select>
    					</el-form-item>
    					<el-form-item label="三年级" prop="threeGrade">
    						<ren-select v-model="dataForm.threeGrade" size="large" dict-type="yesOrNo" placeholder="三年级"></ren-select>
    					</el-form-item>
    					<el-form-item label="校公选" prop="publicStatus">
    						<ren-select v-model="dataForm.publicStatus" size="large" dict-type="yesOrNo" placeholder="校公选"></ren-select>
    					</el-form-item>
    				</el-col>
    				<el-col :span="12">
    					<el-form-item label="二年级" prop="twoGrade">
    						<ren-select v-model="dataForm.twoGrade" size="large" dict-type="yesOrNo" placeholder="二年级"></ren-select>
    					</el-form-item>
    					<el-form-item label="四年级" prop="fourGrade">
    						<ren-select v-model="dataForm.fourGrade" size="large" dict-type="yesOrNo" placeholder="四年级"></ren-select>
    					</el-form-item>
    				</el-col>
    			</el-row>
    		</el-form>
    	</div>
    </div>
    <div>
      <h3 class="info-h3">特殊院系设置（{{total}}）</h3>
      <task-setting-institute ref="taskSettingInstitute" @refreshTotal="getSpecialTotal"></task-setting-institute>
    </div>
  </div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import { checkPermission, getDictLabel } from "@/utils/utils";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import TaskSettingInstitute from "./tasksettinginstitute.vue";
	export default defineComponent({
		components:{
			TaskSettingInstitute
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				conditionList:[] as string[],
				condition:['maintenanceStatus','numberStatus','infoStatus','status'] as string[],
				dataForm: {
					id: "",
					openStatus: 1,
					status: 1,
					maintenanceStatus: "",
					startDate: "",
					endDate: "",
					numberStatus: "",
					infoStatus: "",
					courseCount: 1,
					oneGrade: "",
					twoGrade: "",
					threeGrade: "",
					fourGrade: "",
					publicStatus: 1,
					date: ""
				} as IObject,
				total: 0
			});
		},
		watch: {
			dataForm: {
				handler(val) {
					console.log(val);
					if(val.date != null) {
						console.log(val.date[0], "-", val.date[1]);
						this.dataForm.startDate = val.date[0];
						this.dataForm.endDate = val.date[1];
					}else {
						this.dataForm.startDate = "";
						this.dataForm.endDate = "";
					}
				},
				deep: true
			}
		},
		computed: {
			dataRule() {
				return {

				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		activated() {
			this.init();
		},
		methods: {
			init() {
				this.loading = false;
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					this.getInfo();
				});
			},
			// 获取信息
			getInfo() {
				// baseService.get("/task/tasksetting/" + this.dataForm.id).then((res) => {
				// 	if (res.code !== 0) {
				// 		return this.$message.error(res.msg);
				// 	}
				// 	this.dataForm = res.data;
				// });
				this.conditionList = [];
				baseService.get("/task/tasksetting/page", {
					page: 1,
					limit: 9999
				}).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					let dataList = res.data.list;
					if (dataList.length != 0) {
						this.dataForm = {
							...this.dataForm,
							...dataList[0]
						}

						for(let key in this.dataForm) {
							if(this.dataForm[key] == null) {
								this.dataForm[key] = "";
							}
						}

						for(let i=0;i<this.condition.length;i++) {
							let key = this.condition[i];
							if(this.dataForm[key]) {
								this.conditionList.push(key)
							}
						}

					} else {
						this.dataForm.id = '';
					}
					console.log('dataList', dataList)
					this.dataForm = {
						...dataList[0],
						date: [dataList[0].startDate, dataList[0].endDate]
					};
					console.log("dataForm: ", this.dataForm);
				});
			},
			hasPermission(key : string) {
				return checkPermission(this.store.state.permissions as string[], key);
			},
			// 特殊院系总数
			getSpecialTotal(total : number) {
				this.total = total;
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}

					// console.log('condition',this.condition);
					// console.log('conditionList',this.conditionList);
					for(let i=0;i<this.condition.length;i++) {
						if(this.conditionList.indexOf(this.condition[i]) != -1) {
							this.dataForm[this.condition[i]] = 1;
						}else {
							this.dataForm[this.condition[i]] = 0;
						}
					}
					console.log('dataForm',this.dataForm)

					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/task/tasksetting", this.dataForm).then((res) => {
						if (res.code !== 0) {
							this.loading = false;
							return this.$message.error(res.msg);
						}
						this.$message({
							message: this.$t("prompt.success"),
							type: "success",
							duration: 500,
							onClose: () => {
								this.loading = false;
								this.init()
							}
						});
					});
				});
			}
		}
	});
</script>
