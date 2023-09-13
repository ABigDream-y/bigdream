<template>
	<div class="edit-card--file edit-card-page">
		<div class="aui-card-header">
			<el-button @click="goBack()">
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回
			</el-button>
			<el-button type="primary" v-if="dataForm.status == 0 || dataForm.status == 3" :loading="loading"
				@click="dataFormSubmitHandle(0)">仅保存</el-button>
			<el-button type="primary" v-if="dataForm.status == 0 || dataForm.status == 3" :loading="loading"
				@click="dataFormSubmitHandle(2)">{{dataForm.status == 3?'重新':''}}提交申请</el-button>
			<el-button type="success" v-if="dataForm.status == 2" :loading="loading"
				@click="dataFormSubmitHandle(1)">审核通过</el-button>
			<el-button type="danger" v-if="dataForm.status == 2" :loading="loading"
				@click="dataFormSubmitHandle(3)">审核不通过</el-button>
		</div>
		<div class="edit-card__body">
			<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="120px">
				<el-row :gutter="20">
					<el-col :span="24">
						<h3 class="info-h3">
							<span style="margin-right:15px;">基本信息</span>
							<!-- 0待提交 1已通过 2待审核 3未通过 -->
							<el-tag size="large" v-if="dataForm.status == 2">待审核</el-tag>
							<el-tag type="danger" v-if="dataForm.status == 3">未通过</el-tag>
							<el-tag type="success" v-if="dataForm.status == 1">已通过</el-tag>
							<el-tag type="info" v-if="dataForm.status == 0">待提交</el-tag>
						</h3>
					</el-col>
					<el-col :span="12">
						<el-form-item label="名称" prop="name">
							<el-input v-model="dataForm.name" size="large" placeholder="名称"></el-input>
						</el-form-item>
						<el-form-item label="年级" prop="grade">
							<ren-select v-model="dataForm.grade" size="large" dict-type="grade"
								placeholder="年级"></ren-select>
						</el-form-item>
						<el-form-item label="专业" prop="major">
							<el-select v-model="dataForm.major" size="large" placeholder="所属专业">
								<el-option v-for="(item,index) in majorList" :key="index" :value="item.name"
									:label="item.name"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="方案层次" prop="level">
							<ren-select v-model="dataForm.level" size="large" dict-type="scheme_level"
								placeholder="方案层次"></ren-select>
						</el-form-item>
						<el-form-item label="学院" prop="instituteNo">
							<ren-institute-tree v-model="dataForm.instituteNo" :deptName="dataForm.institute"
								@change="instituteChange" size="large" placeholder="学院" nodekey="number"
								showType="select"></ren-institute-tree>
						</el-form-item>
						<el-form-item label="专业方向" prop="majorDirection">
							<el-input v-model="dataForm.majorDirection" size="large" placeholder="专业方向"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
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
				majorList: [] as IObject[],
				dataForm: {
					id: "",
					name: "",
					level: "",
					grade: "",
					institute: "",
					instituteNo: "",
					major: "",
					majorDirection: "",
					status: 0
				}
			});
		},
		computed: {
			dataRule() {
				return {
					name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
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
				baseService.get("/plan/plan/" + this.dataForm.id).then((res) => {
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
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.majorList = data.children;
				} else {
					this.dataForm.instituteNo = "";
					this.dataForm.institute = "";
					// this.dataForm.majorNo = "";
					this.dataForm.major = "";
					this.majorList = [];
				}
			},
			// 表单提交
			dataFormSubmitHandle(status : number) {
				this.$refs["dataFormRef"].validate((valid : boolean) => {
					if (!valid) {
						return false;
					}
					let postData = JSON.parse(JSON.stringify(this.dataForm));
					postData['status'] = status;
					this.loading = true;
					(!this.dataForm.id ? baseService.post : baseService.put)("/plan/plan", postData).then((res) => {
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