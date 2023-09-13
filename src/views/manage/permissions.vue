<template>
	<div class="edit-card--file">
		<div class="aui-tab-header" style="z-index:999;">
			<el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">保存</el-button>
		</div>
		<div class="aui-tab-body">
			<el-tabs v-model="activeName" tab-position="top" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="院系秘书" name="first">
					<div class="demo-tabs-item">
						<h3>基本信息</h3>
						<el-checkbox-group v-model="dataForm.base">
							<el-row :gutter="20">
								<el-col :span="4" v-for="(item,index) in baseList" :key="index">
									<el-checkbox :label="item.attrName">{{item.filedName}}</el-checkbox>
								</el-col>
							</el-row>
						</el-checkbox-group>
						<h3>在校信息</h3>
						<el-checkbox-group v-model="dataForm.school">
							<el-row :gutter="20">
								<el-col :span="4" v-for="(item,index) in schoolList" :key="index">
									<el-checkbox :label="item.attrName">{{item.filedName}}</el-checkbox>
								</el-col>
							</el-row>
						</el-checkbox-group>
						<h3>其他信息</h3>
						<el-checkbox-group v-model="dataForm.other">
							<el-row :gutter="20">
								<el-col :span="4" v-for="(item,index) in otherList" :key="index">
									<el-checkbox :label="item.attrName">{{item.filedName}}</el-checkbox>
								</el-col>
							</el-row>
						</el-checkbox-group>
					</div>
				</el-tab-pane>
				<el-tab-pane label="学籍管理员" name="second">
					<div class="demo-tabs-item">
						<h3>基本信息</h3>
						<el-checkbox-group v-model="dataForm.base">
							<el-row :gutter="20">
								<el-col :span="4" v-for="(item,index) in baseList" :key="index">
									<el-checkbox :label="item.attrName">{{item.filedName}}</el-checkbox>
								</el-col>
							</el-row>
						</el-checkbox-group>
						<h3>在校信息</h3>
						<el-checkbox-group v-model="dataForm.school">
							<el-row :gutter="20">
								<el-col :span="4" v-for="(item,index) in schoolList" :key="index">
									<el-checkbox :label="item.attrName">{{item.filedName}}</el-checkbox>
								</el-col>
							</el-row>
						</el-checkbox-group>
						<h3>其他信息</h3>
						<el-checkbox-group v-model="dataForm.other">
							<el-row :gutter="20">
								<el-col :span="4" v-for="(item,index) in otherList" :key="index">
									<el-checkbox :label="item.attrName">{{item.filedName}}</el-checkbox>
								</el-col>
							</el-row>
						</el-checkbox-group>
					</div>
				</el-tab-pane>
				<el-tab-pane label="学生" name="third">
					<div class="demo-tabs-item">
						<h3>基本信息</h3>
						<el-checkbox-group v-model="dataForm.base">
							<el-row :gutter="20">
								<el-col :span="4" v-for="(item,index) in baseList" :key="index">
									<el-checkbox :label="item.attrName">{{item.filedName}}</el-checkbox>
								</el-col>
							</el-row>
						</el-checkbox-group>
						<h3>在校信息</h3>
						<el-checkbox-group v-model="dataForm.school">
							<el-row :gutter="20">
								<el-col :span="4" v-for="(item,index) in schoolList" :key="index">
									<el-checkbox :label="item.attrName">{{item.filedName}}</el-checkbox>
								</el-col>
							</el-row>
						</el-checkbox-group>
						<h3>其他信息</h3>
						<el-checkbox-group v-model="dataForm.other">
							<el-row :gutter="20">
								<el-col :span="4" v-for="(item,index) in otherList" :key="index">
									<el-checkbox :label="item.attrName">{{item.filedName}}</el-checkbox>
								</el-col>
							</el-row>
						</el-checkbox-group>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts">
	import { baseList, schoolList, otherList } from "./field.js";
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
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
				activeName: 'first',
				activeIndex: 0,
				baseList: baseList,
				schoolList,
				otherList,
				dataForm: {
					base: [],
					school: [],
					other: []
				} as IObject,
				dataList: [] as IObject[],
				dataFields: [] as string[]
			});
		},
		computed: {
			dataRule() {
				return {};
			}
		},
		activated() {
			this.init();
		},
		methods: {
			init() {
				this.activeName = 'first';
				this.activeIndex = 0;
				this.getPermissionsList();
			},
			handleClick(tab : any) {
				let index = tab.index;
				let name = tab.props.name;
				this.activeName = name;
				this.activeIndex = index;
				this.dataForm.base = [];
				this.dataForm.school = [];
				this.dataForm.other = [];
				this.getPermissionsList();
			},
			getPermissionsList() {
				baseService.get("/manage/permissions/page", {
					page: 1,
					limit: 99999,
					status: 1,
					type: this.activeIndex
				}).then((res) => {
					if (res.code == 0) {
						console.log('权限列表', res.data.list);
						let list = res.data.list.map((item : IObject) => {
							return item.attrName
						});
						this.dataFields = list;
						this.dataList = res.data.list;
						this.baseList.forEach((item : IObject) => {
							if (list.indexOf(item.attrName) != -1) {
								this.dataForm.base.push(item.attrName)
							}
						})
						this.schoolList.forEach((item : IObject) => {
							if (list.indexOf(item.attrName) != -1) {
								this.dataForm.school.push(item.attrName)
							}
						})
						this.otherList.forEach((item : IObject) => {
							if (list.indexOf(item.attrName) != -1) {
								this.dataForm.other.push(item.attrName)
							}
						})
					}
				});
			},
			dataFormSubmitHandle() {
				console.log('dataForm', this.dataForm);
				let list = this.dataForm.base;
				list = list.concat(this.dataForm.school);
				list = list.concat(this.dataForm.other);


				let deleteFileds = [];
				for (let i = 0; i < this.dataList.length; i++) {
					if (list.indexOf(this.dataList[i].attrName) == -1) {
						deleteFileds.push(this.dataList[i].id);
					}
				}

				let fileds = [];
				for (let i = 0; i < list.length; i++) {
					let fIdx = this.dataList.findIndex(val => val.attrName == list[i]);
					if (fIdx == -1) {
						fileds.push({
							attrName: list[i]
						})
					}
				}

				let postData = {
					type: this.activeIndex.toString(),
					fileds: fileds,
					deleteFileds
				}
				console.log('提交的数据', postData);
				baseService.post("/manage/permissions", postData).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					
					this.$message({
						message: this.$t("prompt.success"),
						type: "success",
						duration: 500,
						onClose: () => {
							this.getPermissionsList();
						}
					});
					
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