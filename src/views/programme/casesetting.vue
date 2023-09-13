<template>
	<div class="edit-card--file edit-card-page">
		<!-- <div class="aui-card-header aui-card-header-end"> -->
		<div class="aui-card-header">
			<el-button v-if="hasPermission('programme:casesetting:save')" type="primary" :loading="loading"
				@click="dataFormSubmitHandle()">方案参数维护保存</el-button>
		</div>
		<div class="edit-card__body">
			<h3 class="info-h3">方案参数维护</h3>
			<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
				label-width="120px">
				<el-form-item label="是否开放" prop="isOpenness">
					<ren-radio-group v-model="dataForm.isOpenness" @update:modelValue="update" dict-type="yesOrNo"></ren-radio-group>
				</el-form-item>
				<!-- <el-form-item label="开始日期" prop="startDate">
					<el-date-picker :readonly="readonly" type="date" placeholder="开始日期" value-format="YYYY-MM-DD"
						v-model="dataForm.startDate" ></el-date-picker>
				</el-form-item>
				<el-form-item label="结束日期" prop="endDate">
					<el-date-picker :readonly="readonly" type="date" placeholder="结束日期" value-format="YYYY-MM-DD"
						v-model="dataForm.endDate" ></el-date-picker>
				</el-form-item> -->
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
			</el-form>
			<h3 class="info-h3">特殊院系设置（{{total}}）</h3>
			<case-setting-institute ref="caseSettingInstitute" @refreshTotal="getSpecialTotal"></case-setting-institute>
		</div>
	</div>
</template>

<script lang="ts">
	import { checkPermission, getDictLabel } from "@/utils/utils";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import CaseSettingInstitute from "./casesettinginstitute.vue";
	export default defineComponent({
		components: {
			CaseSettingInstitute
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				dataForm: {
					id: "",
					isOpenness: 1,
					startDate: "",
					endDate: "",
					date: ""
				},
				total:0,
				readonly: false
			});
		},
		computed: {
			dataRule() {
				return {};
			}
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
			update(val) {
				console.log(val);
				if(val == 1) {
					// 是
					this.readonly = false;
				} else {
					// 否
					this.readonly = true;
				}
				console.log(this.readonly);
			},
			// 获取信息
			getInfo() {
				// baseService.get("/programme/casesetting/" + this.dataForm.id).then((res) => {
				// 	if (res.code !== 0) {
				// 		return this.$message.error(res.msg);
				// 	}
				// 	this.dataForm = res.data;
				// });
				baseService.get("/programme/casesetting/page", {
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
						if(this.dataForm.isOpenness == 1) {
							this.readonly = false;
						} else {
							this.readonly = true;
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
			getSpecialTotal(total:number){
				this.total = total;
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					this.loading = true;
					let postData = JSON.parse(JSON.stringify(this.dataForm));
					// postData['startDate'] = this.dataForm.startDate + " 00:00:00";
					// postData['endDate'] = this.dataForm.endDate + " 00:00:00";
					console.log(postData);
					(!this.dataForm.id ? baseService.post : baseService.put)("/programme/casesetting", postData).then((res) => {
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
								this.init();
							}
						});
					});
				});
			}
		}
	});
</script>