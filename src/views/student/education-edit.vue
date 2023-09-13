<template>
	<div class="edit-card--file edit-card-page">
		<div class="aui-card-header">
			<el-button @click="goBack()"><el-icon>
					<ArrowLeft />
				</el-icon>返回</el-button>
			<el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</div>
		<div class="edit-card__body">
			<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
				label-width="120px">
				<!-- <el-form-item label="用户id" prop="userId">
        <el-input v-model="dataForm.userId" placeholder="用户id"></el-input>
      </el-form-item> -->
				<el-form-item label="单位名称" prop="unit">
					<el-input v-model="dataForm.unit" size="large" placeholder="单位名称"></el-input>
				</el-form-item>
				<el-form-item label="开始日期" prop="startDate">
					<el-date-picker size="large" type="date" placeholder="开始日期" value-format="YYYY-MM-DD"
						v-model="dataForm.startDate"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束日期" prop="endDate">
					<el-date-picker size="large" type="date" placeholder="结束日期" value-format="YYYY-MM-DD"
						v-model="dataForm.endDate"></el-date-picker>
				</el-form-item>
				<el-form-item label="担任职务" prop="post">
					<el-input v-model="dataForm.post" size="large" placeholder="担任职务"></el-input>
				</el-form-item>
				<el-form-item label="证明人" prop="certifier">
					<el-input v-model="dataForm.certifier" size="large" placeholder="证明人"></el-input>
				</el-form-item>
				<el-form-item label="工作内容" prop="jobContent">
					<el-input v-model="dataForm.jobContent" size="large" placeholder="工作内容"></el-input>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts">
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	export default defineComponent({
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				dataForm: {
					id: "",
					userId: "",
					unit: "",
					startDate: "",
					endDate: "",
					post: "",
					certifier: "",
					jobContent: "",
					creator: "",
					createDate: "",
					updater: "",
					updateDate: "",
				}
			});
		},
		computed: {
			dataRule() {
				return {
					userId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					unit: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					startDate: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					endDate: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					post: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					certifier: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					jobContent: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
				let id = this.$route.query.id || '';
				if (id && id != '0') {
					this.dataForm.id = id;
				}
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					this.dataForm.userId = this.$route.query.uid;
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/student/education/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
				});
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/student/education", this.dataForm).then((res) => {
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
								this.goBack()
							}
						});
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
			}
		}
	});
</script>