<template>
	<el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false"
		:close-on-press-escape="false">
		<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
			label-width="120px">
			<el-form-item label="培养方案" prop="caseId">
				<el-input v-model="dataForm.caseId" placeholder="培养方案"></el-input>
			</el-form-item>
			<el-form-item label="课组" prop="groupId">
				<el-input v-model="dataForm.groupId" placeholder="课组"></el-input>
			</el-form-item>
			<el-form-item label="课组名" prop="groupName">
				<el-input v-model="dataForm.groupName" placeholder="课组名"></el-input>
			</el-form-item>
			<el-form-item label="最少修读学分" prop="scoreMin">
				<el-input v-model="dataForm.scoreMin" placeholder="最少修读学分"></el-input>
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
					caseId: "",
					groupId: "",
					groupName: "",
					scoreMin: "",
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
					caseId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					groupId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		methods: {
			init() {
				this.visible = true;
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/programme/groupcourse/" + this.dataForm.id).then((res) => {
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
					(!this.dataForm.id ? baseService.post : baseService.put)("/programme/groupcourse", this.dataForm).then((res) => {
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