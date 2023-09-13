<template>
	<el-dialog v-model="visible" title="教职工列表" :close-on-click-modal="false" :close-on-press-escape="false" width="80%">

		<div class="mod-sys__user">
			<el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
				<el-form-item prop="XGH">
					<el-input v-model="dataForm.XGH" placeholder="学工号" clearable></el-input>
				</el-form-item>
				<!-- <el-form-item prop="DWDM">
					<el-select v-model="dataForm.DWDM" placeholder="单位" clearable>
						<el-option v-for="(item,index) in instituteList" :key="index" :label="item.MC"
							:value="item.DM"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item prop="GWLBMC">
					<el-input v-model="dataForm.GWLBMC" placeholder="岗位类别名称" clearable></el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList()">{{ $t("query") }}</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="dataListLoading" :data="dataList" border
				@selection-change="dataListSelectionChangeHandle" style="width: 100%;">
				<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
				<el-table-column prop="XGH" label="学工号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="XM" label="姓名" header-align="center" align="center"></el-table-column>
				<el-table-column prop="DWMC" label="单位名称" header-align="center" align="center"></el-table-column>
				<el-table-column prop="GWLBMC" label="岗位类别名称" header-align="center" align="center"></el-table-column>
				<el-table-column prop="SFLX" label="是否离校" header-align="center" align="center"></el-table-column>
				<el-table-column prop="CLRQ" label="处理日期" header-align="center" align="center"></el-table-column>
			</el-table>
			<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
				layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
				@current-change="pageCurrentChangeHandle"> </el-pagination>

		</div>
		<div style="text-align: right;margin-top:20px;">
			<el-button @click="visible = false">{{ $t('cancel') }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()" :loading="loadingBtn">{{ $t('confirm') }}</el-button>
		</div>
	</el-dialog>

</template>

<script lang="ts">
	import useView from "@/hooks/useView";
	import baseService from "@/service/baseService";
	import {
		IObject
	} from '@/types/interface';
	import {
		defineComponent,
		reactive,
		toRefs
	} from "vue";
	export default defineComponent({
		setup() {
			const state = reactive({
				visible: false,
				loadingBtn: false,
				createdIsNeed: false,
				activatedIsNeed: false,
				getDataListURL: "/xmuApi/getStaffInfoList",
				isXmuApi:true,
				getDataListIsPage: true,
				deleteIsBatch: true,
				dataForm: {
					DWDM: '',//单位代码
					GWLBMC:'',//岗位类别名称
					XGH: ''//学工号
				},
				instituteList: [], //院级
				departmentList: [], //系别
				roleIdList: []
			});
			return {
				...useView(state),
				...toRefs(state)
			};
		},
		// watch: {
		// 	dataForm: {
		// 		// 数据变化回调方法
		// 		handler(val) {
		// 			let url = val.keywords ? '/xmuApi/getStaffInfo' : '/xmuApi/getStaffList';
		// 			this.getDataListURL = url;
		// 		},
		// 		deep: true
		// 	}
		// },
		methods: {
			querygetDataList() {
				if (this.dataForm.keywords) {
					this.dataForm.JZGRYLBDM = '';
					this.dataForm.DWDM = '';
					this.dataForm.LS = '';
					this.dataForm.ZGH = '';
				}
				this.getDataList();
			},
			queryResetHandle() {
				this.dataForm.GWLBMC = '';
				this.dataForm.DWDM = '';
				this.dataForm.XGH = '';
				this.getDataList();
			},
			init(roleId: string) {
				this.roleIdList = [roleId];
				console.log('roleIdList', this.roleIdList)
				this.visible = true;
				this.loadingBtn = false;
				this.query();
				// 获取组织、学院
				// baseService.get("/xmuApi/xmuDeptRows").then((res) => {
				// 	console.log('学院', res.data)
				// 	if (res.code !== 0 &&  res.data) {
				// 		this.instituteList = [];
				// 		return;
				// 	}
				// 	this.instituteList = res.data.dataSet;
				// });
			},
			getDWDMname(val: string) {
				let name = "";
				this.instituteList.forEach(((item: IObject) => {
					if (item.DM == val) {
						name = item.MC
					}
				}))
				if (!name) {
					name = val;
				}
				return name;
			},
			getDepartment(val: string) {
				if (!val) return;
				this.dataForm.keywords = '';
				this.dataForm.DWDM = '';
				baseService.get("/xmuApi/xmuDeptRows", {
					LS: val
				}).then((res) => {
					console.log('系别', res.data)

					if (res.code !== 0 && res.data) {
						this.departmentList = [];
						return;
					}
					this.departmentList = res.data.dataSet;
					if (this.departmentList.length > 1) {
						this.departmentList.splice(0, 1);
						this.departmentList.unshift({
							MC: '全部',
							DM: ''
						})

					} else if (this.departmentList.length == 0) {
						this.departmentList = [{
							MC: '全部',
							DM: ''
						}]
					}
				});
			},
			dataFormSubmitHandle() {
				if (this.dataListSelections.length == 0) {
					return this.$message.error('请选择教职工人员！')
				}
				let staffIdList = this.dataListSelections.map((item:IObject) => {
					return item.XGH
				})
				console.log('提交的数据', {
					staffIdList: staffIdList,
					roleIdList: this.roleIdList
				})
				// return;
				this.loadingBtn = true;
				baseService.post('/sys/user/batchAddUser', {
					staffIdList: staffIdList,
					roleIdList: this.roleIdList
				}).then((res) => {
					console.log('添加', res)
					if (res.code !== 0) {
						this.loadingBtn = false;
						return this.$message.error(res.msg)
					}
					this.$message({
						message: this.$t('prompt.success'),
						type: 'success',
						duration: 500,
						onClose: () => {
							this.visible = false
							this.loadingBtn = false;
							this.$emit('refreshDataList', res.data)
						}
					})
				}).catch(() => {
					this.loadingBtn = false;
				})
			}
		}
	});
</script>
