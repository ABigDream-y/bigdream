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
				<el-form-item label="周次" prop="count">
					<el-input v-model="dataForm.count" size="large" placeholder="周次"></el-input>
				</el-form-item>
				<!-- <el-form-item label="" prop="teacherId">
					<el-input v-model="dataForm.teacherId" size="large" placeholder=""></el-input>
				</el-form-item> -->
				<el-form-item label="职工号" prop="zgh">
					<el-input v-model="dataForm.zgh" size="large" placeholder="职工号"></el-input>
				</el-form-item>
				<el-form-item label="教师" prop="teacherName">
					<el-input v-model="dataForm.teacherName" size="large" placeholder="教师"></el-input>
				</el-form-item>
				<el-form-item label="职称" prop="position">
					<el-input v-model="dataForm.position" size="large" placeholder="职称"></el-input>
				</el-form-item>
				<el-form-item label="是否负责教师" prop="leaderStatus">
					<ren-radio-group v-model="dataForm.leaderStatus" size="large" dict-type="yesOrNo"></ren-radio-group>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" :rows="5" v-model="dataForm.remark" size="large"></el-input>
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
					teachingId: "",
					count: "",
					teacherId: "",
					zgh: "",
					teacherName: "",
					position: "",
					leaderStatus: 1,
					remark: "",
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
					teachingId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					teacherId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
					this.dataForm.teachingId = this.$route.query.tid
					if (this.dataForm.id) {
						this.getInfo();
					}
				});
			},
			// 获取信息
			getInfo() {
				baseService.get("/task/teachingteacher/" + this.dataForm.id).then((res) => {
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
					(!this.dataForm.id ? baseService.post : baseService.put)("/task/teachingteacher", this.dataForm).then((res) => {
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