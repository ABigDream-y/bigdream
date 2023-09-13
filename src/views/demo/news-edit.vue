<template>
	<div class="edit-card--file">
		<div class="aui-card-header">
			<el-button @click="goBack()">{{ $t("cancel") }}</el-button>
			<el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</div>
		<div class="edit-card__body">
			<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
				label-width="120px">
				<el-form-item prop="title" :label="$t('news.title')">
					<el-input v-model="dataForm.title" :placeholder="$t('news.title')"></el-input>
				</el-form-item>
				<el-form-item prop="content" :label="$t('news.content')" style="height: 300px">
					<editor v-model="dataForm.content" :init="{ height: 300 }"></editor>
				</el-form-item>
				<el-form-item prop="pubDate" :label="$t('news.pubDate')">
					<el-date-picker v-model="dataForm.pubDate" type="datetime" format="YYYY-MM-DD HH:mm:ss"
						value-format="YYYY-MM-DD HH:mm:ss" :placeholder="$t('news.pubDate')"></el-date-picker>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts">
	import {
		useStore
	} from "vuex";
	import {
		findIndex
	} from "lodash";
	import {
		defineComponent,
		reactive
	} from "vue";
	import baseService from "@/service/baseService";
	import {
		useDebounce
	} from "@/utils/utils";
	import Tinymce from "@/components/tinymce";
	export default defineComponent({
		components: {
			editor: Tinymce
		},
		setup() {
			const store = useStore();
			return reactive({
				store,
				loading:false,
				dataForm: {
					id: "",
					title: "",
					content: "",
					pubDate: ""
				}
			});
		},
		computed: {
			dataRule() {
				return {
					title: [{
						required: true,
						message: this.$t("validate.required"),
						trigger: "blur"
					}],
					content: [{
						required: true,
						message: this.$t("validate.required"),
						trigger: "blur"
					}],
					pubDate: [{
						required: true,
						message: this.$t("validate.required"),
						trigger: "blur"
					}]
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
			// console.log('created', this.store)
			// console.log('dataFormSubmitHandle',this.dataFormSubmitHandle)
			// console/*  */
		},
		activated() {
			console.log('actived', this.store.state.activeTabName)
			this.init();
		},
		methods: {
			init() {
				this.loading = false;
				let id = this.$route.query.id || '';
				if(id && id != '0') {
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
				baseService.get(`/demo/news/${this.dataForm.id}`).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = res.data;
				});
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid: boolean) => {
					if (!valid) {
						return false;
					}
					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/demo/news", this.dataForm, {
						"content-type": "application/x-www-form-urlencoded"
					}).then((res) => {
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
			updateClosedTabs(closedTabs: any[], isTransform = true) {
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
