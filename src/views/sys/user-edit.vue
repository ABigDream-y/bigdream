<template>
	<div class="edit-card--file">
		<div class="aui-card-header">
			<el-button @click="goBack()">
				<el-icon>
					<ArrowLeft />
				</el-icon>
				返回
			</el-button>
			<el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</div>
		<div class="edit-card__body">
			<el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="120px">
				<el-form-item prop="username" :label="$t('user.username')">
					<el-input v-model="dataForm.username" placeholder="教职工号"></el-input>
				</el-form-item>
				<!-- <el-form-item prop="eduPersonStaffId" label="教职工号" v-if="">
					<el-input v-model="dataForm.eduPersonStaffId" placeholder="教职工号"></el-input>
				</el-form-item> -->
				<el-form-item prop="deptName" :label="$t('user.deptName')">
					<ren-dept-tree v-model="dataForm.deptId" :placeholder="$t('dept.title')"
						v-model:deptName="dataForm.deptName"></ren-dept-tree>
				</el-form-item>
				<el-form-item prop="password" :label="$t('user.password')" :class="{ 'is-required': !dataForm.id }">
					<el-input v-model="dataForm.password" type="password" :placeholder="$t('user.password')"></el-input>
				</el-form-item>
				<el-form-item prop="confirmPassword" :label="$t('user.confirmPassword')"
					:class="{ 'is-required': !dataForm.id }">
					<el-input v-model="dataForm.confirmPassword" type="password"
						:placeholder="$t('user.confirmPassword')">
					</el-input>
				</el-form-item>
				<el-form-item prop="realName" :label="$t('user.realName')">
					<el-input v-model="dataForm.realName" :placeholder="$t('user.realName')"></el-input>
				</el-form-item>
				<el-form-item prop="gender" :label="$t('user.gender')">
					<ren-radio-group v-model="dataForm.gender" dict-type="gender"></ren-radio-group>
				</el-form-item>
				<el-form-item prop="email" :label="$t('user.email')">
					<el-input v-model="dataForm.email" :placeholder="$t('user.email')"></el-input>
				</el-form-item>
				<el-form-item prop="mobile" :label="$t('user.mobile')">
					<el-input v-model="dataForm.mobile" :placeholder="$t('user.mobile')"></el-input>
				</el-form-item>
				<el-form-item prop="roleIdList" :label="$t('user.roleIdList')" class="role-list">
					<el-select v-model="dataForm.roleIdList" multiple :placeholder="$t('user.roleIdList')" @change="roleChange">
						<el-option v-for="role in roleList" :key="role.id" :label="role.name" :value="role.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="status" :label="$t('user.status')" size="small">
					<el-radio-group v-model="dataForm.status">
						<el-radio :label="0">{{ $t("user.status0") }}</el-radio>
						<el-radio :label="1">{{ $t("user.status1") }}</el-radio>
					</el-radio-group>
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
		isEmail,
		isMobile,
		useDebounce
	} from "@/utils/utils";
	import {
		IObject
	} from "@/types/interface";
	export default defineComponent({
		setup() {
			const store = useStore();
			const state = reactive({
				store,
				eduPersonStaffId:"",
				dataForm: {
					id: "",
					username: "",
					deptId: "",
					deptName: "",
					password: "",
					confirmPassword: "",
					realName: "",
					gender: 0,
					email: "",
					mobile: "",
					roleIdList: [] as IObject[],
					postIdList: [] as IObject[],
					status: 1
				},
				loading: false,
				visible: false,
				roleList: [] as IObject[],
				roleIdListDefault: [] as IObject[],
				postList: [] as IObject[]
			});
			return state;
		},
		computed: {
			dataRule() {
				const validatePassword = (rule: any, value: string, callback: (e ? : Error) => any): any => {
					if (!this.dataForm.id && !/\S/.test(value)) {
						return callback(new Error(this.$t("validate.required")));
					}
					callback();
				};
				const validateConfirmPassword = (rule: any, value: string, callback: (e ? : Error) => any):
					any => {
						if (!this.dataForm.id && !/\S/.test(value)) {
							return callback(new Error(this.$t("validate.required")));
						}
						if (this.dataForm.password !== value) {
							return callback(new Error(this.$t("user.validate.confirmPassword")));
						}
						callback();
					};
				const validateEmail = (rule: any, value: string, callback: (e ? : Error) => any): any => {
					if (value && !isEmail(value)) {
						return callback(new Error(this.$t("validate.format", {
							attr: this.$t("user.email")
						})));
					}
					callback();
				};
				const validateMobile = (rule: any, value: string, callback: (e ? : Error) => any): any => {
					if (value && !isMobile(value)) {
						return callback(new Error(this.$t("validate.format", {
							attr: this.$t("user.mobile")
						})));
					}
					callback();
				};
				return {
					username: [{
						required: true,
						message: this.$t("validate.required"),
						trigger: ["blur", "change"]
					}],
					deptName: [{
						required: true,
						message: this.$t("validate.required"),
						trigger: ["blur", "change"]
					}],
					password: [{
						validator: validatePassword,
						trigger: ["blur", "change"]
					}],
					confirmPassword: [{
						validator: validateConfirmPassword,
						trigger: ["blur", "change"]
					}],
					realName: [{
						required: true,
						message: this.$t("validate.required"),
						trigger: ["blur", "change"]
					}],
					roleIdList: [{
						required: true,
						message: this.$t("validate.required"),
						trigger: ["blur", "change"]
					}],
					email: [{
						validator: validateEmail,
						trigger: ["blur", "change"]
					}],
					mobile: [{
						validator: validateMobile,
						trigger: ["blur", "change"]
					}]
				};
			}
		},
		created() {
			this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
		},
		activated() {
			this.init();
		},
		watch:{
			dataForm:{
				handler(val:any){
					console.log('watch----dataForm',val)
					this.eduPersonStaffId = "";
					if(val.roleIdList && val.roleIdList.length != 0 && val.roleIdList.indexOf("1637628606381846529") != -1) {
						this.eduPersonStaffId = val.username
					}
				},
				deep:true
			}
		},
		methods: {
			init() {
				this.eduPersonStaffId = "";
				this.visible = true;
				this.dataForm.deptId = "";
				this.loading = false;
				let id = this.$route.query.id || '';
				if (id && id != '0') {
					this.dataForm.id = id;
				}
				this.$nextTick(() => {
					this.$refs["dataFormRef"].resetFields();
					this.roleIdListDefault = [];
					Promise.all([this.getRoleList(), this.getPostList()]).then(() => {
						if (this.dataForm.id) {
							this.getInfo();
						}
					});
				});
			},
			// 获取角色列表
			getRoleList() {
				return baseService.get("/sys/role/list").then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.roleList = res.data;
				});
			},
			// 获取岗位列表
			getPostList() {
				return baseService.get("/sys/post/list").then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.postList = res.data;
				});
			},
			// 获取信息
			getInfo() {
				baseService.get(`/sys/user/${this.dataForm.id}`).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.dataForm = {
						...this.dataForm,
						...res.data,
						roleIdList: []
					};
					this.eduPersonStaffId = res.data.eduPersonStaffId;
					// 角色配置, 区分是否为默认角色
					for (let i = 0; i < res.data.roleIdList.length; i++) {
						if (this.roleList.filter((item: IObject) => item.id === res.data.roleIdList[i])[
								0]) {
							this.dataForm.roleIdList.push(res.data.roleIdList[i]);
							continue;
						}
						this.roleIdListDefault.push(res.data.roleIdList[i]);
					}
				});
			},
			roleChange(val:any){
				if(val && val.length != 0) {
					console.log('roleChange',val)
				}
			},
			// 表单提交
			dataFormSubmitHandle() {
				this.$refs["dataFormRef"].validate((valid: boolean) => {
					if (!valid) {
						return false;
					}

					(!this.dataForm.id ? baseService.post : baseService.put)("/sys/user", {
						...this.dataForm,
						eduPersonStaffId:this.eduPersonStaffId,
						roleIdList: [...this.dataForm.roleIdList, ...this.roleIdListDefault]
					}).then((res) => {
						if (res.code !== 0) {
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
				this.store.state.activeTabName = "/sys/user";
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
