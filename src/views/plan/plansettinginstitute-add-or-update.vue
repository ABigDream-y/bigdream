<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
		:close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
			label-width="120px">
			<el-form-item v-if="!canSelect"  label="学院" prop="">
				<el-input readonly size="large" placeholder="学院" :value="dataForm.institute"></el-input>
				<!-- <ren-institute-tree v-model="dataForm.instituteNo" size="large" :deptName="dataForm.institute"
					@change="instituteChange" placeholder="学院" nodekey="number" showType="select"></ren-institute-tree> -->
			</el-form-item>
			<el-form-item v-else label="学院" prop="instituteNo">
				<!-- <el-input readonly size="large" placeholder="学院" :value="dataForm.institute"></el-input> -->
				<ren-institute-tree v-model="dataForm.instituteNo" size="large" :deptName="dataForm.institute"
					@change="instituteChange" placeholder="学院" nodekey="number" showType="select"></ren-institute-tree>
			</el-form-item>
			<!-- <el-form-item label="开始日期" prop="startDate">
				<el-date-picker type="date" placeholder="开始日期" value-format="YYYY-MM-DD" v-model="dataForm.startDate"
					size="large"></el-date-picker>
			</el-form-item>
			<el-form-item label="结束日期" prop="endDate">
				<el-date-picker type="date" placeholder="结束日期" value-format="YYYY-MM-DD" v-model="dataForm.endDate"
					size="large"></el-date-picker>
			</el-form-item> -->
			<el-form-item label="日期" prop="date">
				<el-date-picker v-model="dataForm.date" type="daterange" unlink-panels range-separator="-"
					start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" size="large" />
			</el-form-item>
		</el-form>
		<template v-slot:footer>
			<el-button @click="visible = false">{{ $t("cancel") }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	export default defineComponent({
		setup() {
			return reactive({
				visible: false,
				dataForm: {
					id: "",
					institute: "",
					instituteNo: "",
					startDate: "",
					endDate: "",
					creator: "",
					createDate: "",
					updater: "",
					updateDate: "",
					date: []
				},
				canSelect: true
			});
		},
		watch: {
			dataForm: {
				handler(val) {
					console.log(val);
					console.log(val.startDate, val.endDate);
					console.log(val.hasOwnProperty("date"));
					if (val.startDate && val.endDate && !val.hasOwnProperty("date")) {
						console.log(this.dataForm.date);
						this.dataForm.date = [];
						this.dataForm.date.push(val.startDate);
						this.dataForm.date.push(val.endDate);
						return;
					}
					if (val.date != null) {
						console.log(val.date[0], "-", val.date[1]);
						this.dataForm.startDate = val.date[0];
						this.dataForm.endDate = val.date[1];
					} else {
						this.dataForm.startDate = "";
						this.dataForm.endDate = "";
					}
				},
				ids: "",
				canSelect: true
			}
		},
		computed: {
			dataRule() {
				return {
					instituteNo: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					// startDate: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					// endDate: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					date: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		methods: {
			init(id ?, ids ?) {
				this.visible = true;
				this.canSelect = true;
				console.log(id, ids);
				if(id && ids) {
					this.dataForm.id = id;
					this.ids = ids;
					this.canSelect = false;
				} else {
					this.dataForm.id = "";
					this.dataForm.institute = "";
					this.dataForm.instituteNo = "";
					this.dataForm.startDate = "";
					this.dataForm.endDate = "";
					this.dataForm.date = [];
					this.ids = "";
				}
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/plan/plansettinginstitute/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
				});
			},
			// 学院变更
			instituteChange(data ?: IObject) {
				if (data) {
					this.dataForm.instituteNo = data.number;
					this.dataForm.institute = data.name;
				} else {
					this.dataForm.instituteNo = "";
					this.dataForm.institute = "";
				}
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					(!this.dataForm.id ? baseService.post : baseService.put)("/plan/plansettinginstitute", this.dataForm).then((res) => {
						if (res.code !== 0) {
							return this.$message.error(res.msg);
						}
						this.$message({
							message: this.$t("prompt.success"),
							type: "success",
							duration: 500,
							onClose: () => {
								this.visible = false;
								this.$emit("refreshDataList");
							}
						});
					});
				});
			}
		}
	});
</script>