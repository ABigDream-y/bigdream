<template>
	<div class="edit-card--file">
		<div class="aui-tab-header" style="position: absolute; z-index: 999; top: 15px; right: 20px;" v-if="showBack">
			<el-button @click="goBack()">
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回
			</el-button>
		</div>
		<div class="aui-tab-body" style="position: relative;">
			<el-tabs v-model="activeName" tab-position="top" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="学年学期详情" name="yearsemester">
					<div class="demo-tabs-item edit-card-page">
						<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef"
							@keyup.enter="dataFormSubmitHandle()" label-width="120px">
							<el-form-item label="学年" prop="year">
								<!-- <ren-select size="large" v-model="dataForm.year" dict-type="school_year" placeholder="学年"></ren-select> -->
								<el-input size="large" v-model="dataForm.year" readonly></el-input>
							</el-form-item>
							<el-form-item label="学期" prop="semester">
								<!-- <ren-select size="large" v-model="dataForm.semester" dict-type="term" placeholder="学期"></ren-select> -->
								<el-input size="large" v-model="dataForm.semester" readonly></el-input>
							</el-form-item>
							<el-form-item label="启动状态" prop="status">
								<ren-radio-group disabled size="large" v-model="dataForm.status"
									dict-type="enable_status"></ren-radio-group>
							</el-form-item>
						</el-form>
					</div>
				</el-tab-pane>
				<el-tab-pane label="学年学期教学场地" name="arealist">
					<div class="demo-tabs-item">
						<semester-teaching-area ref="semesterTeachingAreaRef"
							:fromId="dataForm.id"></semester-teaching-area>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts">
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import { defineComponent, reactive } from "vue";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import SemesterTeachingArea from "./semesterteachingarea.vue";
	export default defineComponent({
		components: {
			SemesterTeachingArea
		},
		props: {
			showBack: {
				type: Boolean,
				default: true
			},
			rowData: {
				type: Object,
				default: null
			}
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading: false,
				visible: false,
				activeName: "yearsemester",
				dataForm: {
					id: "",
					year: "",
					semester: "",
					status: 1,
					parent: ""
				}
			});
		},
		computed: {
			dataRule() {
				return {
					year: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					semester: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
					status: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		activated() {
			this.init();
		},
		watch: {
			activeName(val : string) {
				if (val == 'arealist') {
					this.$nextTick(() => {
						this.$refs.semesterTeachingAreaRef.init(this.dataForm.id)
					})
				}
			},
			rowData(val : Object) {
				this.dataForm = val;
			}
		},
		methods: {
			init() {
				this.loading = false;
				let id = this.$route.query.id || "";
				if (id && id != "0") {
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
				baseService.get("/resource/yearsemesterteachingarea/" + this.dataForm.id).then((res) => {
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
					(!this.dataForm.id ? baseService.post : baseService.put)("/resource/yearsemesterteachingarea", this.dataForm).then((res) => {
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
								this.goBack();
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
				// this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
				this.store.state.activeTabName = "/resource/yearsemesterteachingarea";
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
<style scoped lang="scss">
	.info-h3 {
		margin-top: 0;
	}

	.info-p {
		margin-top: 0px;
		font-size: 12px;
		color: gray;
	}

	.user-upload {
		display: flex;
		align-items: center;
	}
</style>
