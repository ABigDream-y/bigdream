<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
		:close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
			label-width="120px">
			<el-form-item label="编号" prop="code">
				<el-input v-model="dataForm.code" placeholder="编号"></el-input>
			</el-form-item>
			<el-form-item label="培养方案版本名称" prop="name">
				<el-input v-model="dataForm.name" placeholder="培养方案版本名称"></el-input>
			</el-form-item>
			<el-form-item label="版本号" prop="versionNumber">
				<el-input v-model="dataForm.versionNumber" placeholder="版本号"></el-input>
			</el-form-item>
			<el-form-item label="适用范围" prop="applicableScope">
				<el-input v-model="dataForm.applicableScope" placeholder="适用范围"></el-input>
			</el-form-item>
			<el-form-item label="学制" prop="educationalSystem">
				<el-input v-model="dataForm.educationalSystem" placeholder="学制"></el-input>
			</el-form-item>
			<el-form-item label="授予学位" prop="graduate">
				<ren-select v-model="dataForm.graduate" dict-type="degree_type" placeholder="授予学位"></ren-select>
			</el-form-item>
			<el-form-item label="修订时间" prop="revisionTime">
				<el-date-picker type="datetime" placeholder="修订时间" value-format="yyyy-MM-dd HH:mm:ss"
					v-model="dataForm.revisionTime"></el-date-picker>
			</el-form-item>
			<el-form-item label="生效时间" prop="effectiveTime">
				<el-date-picker type="datetime" placeholder="生效时间" value-format="yyyy-MM-dd HH:mm:ss"
					v-model="dataForm.effectiveTime"></el-date-picker>
			</el-form-item>
			<el-form-item label="修订单位" prop="revisedBy">
				<el-input v-model="dataForm.revisedBy" placeholder="修订单位"></el-input>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<ren-select v-model="dataForm.status" dict-type="plan_version_status" placeholder="状态"></ren-select>
			</el-form-item>
		</el-form>
		<template v-slot:footer>
			<el-button @click="visible = false">{{ $t("cancel") }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	export default defineComponent({
		setup() {
			return reactive({
				visible: false,
				dataForm: {
					id: "",
					code: "",
					name: "",
					versionNumber: "",
					applicableScope: "",
					educationalSystem: "",
					graduate: "",
					revisionTime: "",
					effectiveTime: "",
					revisedBy: "",
					status: "",
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
					code: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					versionNumber: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					applicableScope: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		methods: {
			init() {
				this.visible = true;
				this.dataForm = {
					id: "",
					code: "",
					name: "",
					versionNumber: "",
					applicableScope: "",
					educationalSystem: "",
					graduate: "",
					revisionTime: "",
					effectiveTime: "",
					revisedBy: "",
					status: 0,
					creator: "",
					createDate: "",
					updater: "",
					updateDate: "",
				};
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/programme/caseversion/" + this.dataForm.id).then((res) => {
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
					(!this.dataForm.id ? baseService.post : baseService.put)("/programme/caseversion", this.dataForm).then((res) => {
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
			},
			updateStatus(data) {
				this.setDataForm(data);
				(!this.dataForm.id ? baseService.post : baseService.put)("/programme/caseversion", this.dataForm).then((res) => {
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
			},
			setDataForm(data) {
				this.dataForm = data;
			}
		}
	});
</script>