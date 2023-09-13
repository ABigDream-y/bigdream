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
				<el-tab-pane label="教学场地类型详情" name="type">
					<div class="demo-tabs-item edit-card-page">
						<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef"
							@keyup.enter="dataFormSubmitHandle()" label-width="120px">
							<el-row :gutter="20">
								<el-col :span="12">
									<el-form-item label="名称" prop="name">
										<el-input readonly size="large" v-model="dataForm.name"
											placeholder="名称"></el-input>
									</el-form-item>
									<el-form-item label="排序" prop="sort">
										<el-input-number disabled size="large" v-model="dataForm.sort" placeholder="排序"
											:min="0"></el-input-number>
									</el-form-item>
								</el-col>
								<el-col :span="12">
									<el-form-item label="类别" prop="type">
										<!-- <ren-select  size="large" v-model="dataForm.type" dict-type="area_type" placeholder="类型"></ren-select> -->
										<el-input readonly size="large" v-model="dataForm.type"
											placeholder="类别"></el-input>
									</el-form-item>
									<el-form-item label="状态" prop="status">
										<el-tag type="success" v-if="dataForm.status == 1">启用</el-tag>
										<el-tag type="danger" v-else>禁用</el-tag>
									</el-form-item>
								</el-col>
							</el-row>
							<el-form-item label="封面" prop="cover">
								<ren-upload disabled v-model="dataForm.cover"></ren-upload>
							</el-form-item>
							<!-- <el-form-item label="配置" prop="content" style="height: 400px">
                <editor v-model="dataForm.content" :init="{ height: 400 }"></editor>
              </el-form-item> -->
							<el-form-item label="配置" prop="content" style="height: auto">
								<div v-html="dataForm.content"></div>
							</el-form-item>
							<el-form-item label="备注" prop="remark">
								<!-- <el-input readonly size="large" type="textarea" :rows="5" v-model="dataForm.remark" maxlength="255" show-word-limit></el-input> -->
								<div>{{ dataForm.remark }}</div>
							</el-form-item>
						</el-form>
					</div>
				</el-tab-pane>
				<el-tab-pane label="学期场地" name="arealist">
					<div class="demo-tabs-item">
						<teaching-area ref="teachingAreaRef" :mainCategory="dataForm.name"></teaching-area>
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
	import Tinymce from "@/components/tinymce";
	import TeachingArea from "./teachingarea.vue";
	export default defineComponent({
		components: { editor: Tinymce, TeachingArea },
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
				activeName: "type",
				dataForm: {
					id: "",
					name: "",
					type: "",
					cover: "",
					sort: 0,
					status: 1,
					content: "",
					remark: ""
				}
			});
		},
		computed: {
			dataRule() {
				return {
					name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
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
				if (val == "arealist") {
					this.$nextTick(() => {
						this.$refs.teachingAreaRef.init();
					});
				}
			},
			rowData(newValue) {
				console.log(newValue);
				this.dataForm = newValue;
				console.log(this.dataForm)
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
				baseService.get("/resource/teachingareatype/" + this.dataForm.id).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
          console.log(res);
          console.log("dataForm: ", this.dataForm);
				});
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/resource/teachingareatype", this.dataForm).then((res) => {
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
				this.store.state.activeTabName = "/resource/teachingareatype";
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
