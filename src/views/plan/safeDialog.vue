<template>
	<el-dialog v-model="visible" title="注意事项">
		<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef">
			<el-form-item prop="precautions">
				<el-input v-model="dataForm.precautions" type="textarea" :autosize="{ minRows: 10}" placeholder="请输入注意事项"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="hideDialog()">取消</el-button>
				<el-button type="primary" @click="dataFormSubmitHandle()">
					确定
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	export default defineComponent({
		setup() {
			return reactive({
				visible: false,
				radio: 1,
				showRange: false,
				dataForm: {
					id: "",
					planId: "",
					precautions: ""
				}
			});
		},
		computed: {
			dataRule() {
				return {
					precautions: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
				};
			}
		},
		props: {

		},
		methods: {
			showDialog() {
				this.visible = true;
			},
			hideDialog() {
				this.visible = false;
				this.clear();
			},
			clear() {
				this.dataForm.precautions = "";
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					console.log(this.dataForm);
					// 请求后台接口传递数据

					// 关闭dialog弹窗
					this.hideDialog();
					// 页面刷新

				});
			}
		},
		watch: {

		}
	});
</script>
<style scoped>
	.el-button--text {
		margin-right: 15px;
	}

	.el-select {
		width: 300px;
	}

	.el-input {
		width: 300px;
	}

	.dialog-footer button:first-child {
		margin-right: 10px;
	}
</style>