<template>
	<div class="edit-card--file edit-card-page">
		<div class="aui-card-header">
			<el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</div>
		<div class="edit-card__body">
			<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
				label-width="120px">
				<el-form-item label="是否开放" prop="isOpenness">
					<ren-radio-group v-model="dataForm.isOpenness" dict-type="yesOrNo"></ren-radio-group>
				</el-form-item>
				<el-form-item label="开始日期" prop="startDate">
					<el-date-picker type="date" placeholder="开始日期" value-format="YYYY-MM-DD"
						v-model="dataForm.startDate"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束日期" prop="endDate">
					<el-date-picker type="date" placeholder="结束日期" value-format="YYYY-MM-DD"
						v-model="dataForm.endDate"></el-date-picker>
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
					isOpenness: "",
					startDate: "",
					endDate: "",
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
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/programme/casesetting/" + this.dataForm.id).then((res) => {
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
					(!this.dataForm.id ? baseService.post : baseService.put)("/programme/casesetting", this.dataForm).then((res) => {
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
			}
		}
	});
</script>