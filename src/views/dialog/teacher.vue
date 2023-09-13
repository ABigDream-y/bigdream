<template>
	<el-dialog width="80%" v-model="visible" title="教师选择" :close-on-click-modal="false" :close-on-press-escape="false">
		<div class="mod-resource__teacher">
			<el-form :inline="true" ref="searchForm" :model="dataForm" @keyup.enter="getDataList()">
				<el-form-item prop="zgh">
					<el-input v-model="dataForm.zgh" placeholder="教职工号" clearable></el-input>
				</el-form-item>
				<el-form-item prop="username">
					<el-input v-model="dataForm.username" placeholder="姓名" clearable></el-input>
				</el-form-item>
				<el-form-item prop="idCard">
					<el-input v-model="dataForm.idCard" placeholder="身份证号" clearable></el-input>
				</el-form-item>
				<el-form-item prop="campus">
					<ren-select v-model="dataForm.campus" dict-type="campus" placeholder="校区"></ren-select>
				</el-form-item>
				<el-form-item prop="instituteNo">
					<ren-institute-tree v-model="dataForm.instituteNo" placeholder="学院" nodekey="number"
						showType="select"></ren-institute-tree>
				</el-form-item>
				<el-form-item prop="discipline">
					<el-input v-model="dataForm.discipline" placeholder="学科" clearable></el-input>
				</el-form-item>
				<el-form-item prop="rzStatus">
					<ren-select v-model="dataForm.rzStatus" dict-type="rz_status" placeholder="任职状态"></ren-select>
				</el-form-item>
				<el-form-item prop="status">
					<ren-select v-model="dataForm.status" dict-type="enable_status" placeholder="状态"></ren-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="getDataList()">{{ $t("query") }}</el-button>
				</el-form-item>
				<el-form-item>
					<el-button @click="queryResetHandle()">重置</el-button>
				</el-form-item>
			</el-form>
			<el-table v-loading="dataListLoading" :data="dataList" border
				@row-click="rowClickHandle" style="width: 100%">
				<el-table-column label="" header-align="center" align="center" width="50">
					<template v-slot="scope">
						<el-radio v-model="selectForm.id" :label="scope.row.id">&nbsp;</el-radio>
					</template>
				</el-table-column>
				
				<el-table-column prop="zgh" label="教职工号" header-align="center" align="center"
					width="120"></el-table-column>
				<el-table-column prop="username" label="姓名" header-align="center" align="center" width="120">
					<template v-slot="scope">
						<el-icon style="color:#409EFF;" v-if="scope.row.gender == 0">
							<Male />
						</el-icon>
						<el-icon style="color:#F56C6C;" v-if="scope.row.gender == 1">
							<Female />
						</el-icon>
						{{scope.row.username}}
					</template>
				</el-table-column>
				<!-- <el-table-column prop="gender" label="性别" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="contactMobile" label="联系方式" header-align="center"
					align="center"></el-table-column>
				<!-- <el-table-column prop="idCard" label="身份证号" header-align="center" align="center"></el-table-column> -->
				<!-- <el-table-column prop="email" label="电子邮箱" header-align="center" align="center"></el-table-column> -->
				<!-- <el-table-column prop="phone" label="手机号" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="campus" label="校区" header-align="center" align="center">
					<template v-slot="scope">
						{{ getDictLabel("campus", scope.row.campus) }}
					</template>
				</el-table-column>
				<el-table-column prop="institute" label="学院" header-align="center" align="center"></el-table-column>
				<!-- <el-table-column prop="instituteNo" label="学院编号" header-align="center" align="center"></el-table-column> -->
				<!-- <el-table-column prop="major" label="所属专业" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="discipline" label="学科" header-align="center" align="center"></el-table-column>
				<el-table-column prop="position" label="职称" header-align="center" align="center"></el-table-column>
				<el-table-column prop="rzStatus" label="任职状态" header-align="center" align="center">
					<template v-slot="scope">
						{{ getDictLabel("rz_status", scope.row.rzStatus) }}
					</template>
				</el-table-column>
				<el-table-column prop="status" label="状态" header-align="center" align="center">
					<template v-slot="scope">
						{{ getDictLabel("enable_status", scope.row.status) }}
					</template>
				</el-table-column>
			</el-table>
			<el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
				layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
				@current-change="pageCurrentChangeHandle"> </el-pagination>
			<!-- 弹窗, 新增 / 修改 -->
			<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
		</div>
		<template v-slot:footer>
			<el-button @click="visible = false">{{ $t("cancel") }}</el-button>
			<el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import baseService from "@/service/baseService";
	import { defineComponent, reactive, toRefs } from "vue";
	export default defineComponent({
		setup() {
			const state = reactive({
				visible: false,
				createdIsNeed: false,
				getDataListURL: "/resource/teacher/page",
				getDataListIsPage: true,
				exportURL: "/resource/teacher/export",
				deleteURL: "/resource/teacher",
				routeName: '/resource-teacher-edit',
				routePath: '/resource/teacher-edit',
				routeTitle: '教师',
				deleteIsBatch: true,
				dataForm: {
					zgh: "",
					username: "",
					idCard: "",
					campus: "",
					institute: "",
					instituteNo: "",
					discipline: "",
					rzStatus: "",
					status: "",
				} as IObject,
				selectType: "",
				selectForm: {
					id: "",
					name: ""
				} as IObject
			});
			return { ...useView(state), ...toRefs(state) };
		},
		props: {
			
		},
		watch: {},
		methods: {
			init() {
				this.visible = true;
				this.dataListSelections = [];
				this.query();
				console.log("init finished");
			},
			dataFormSubmitHandle() {
				let data = this.selectForm;
				console.log(data)
				if(!data.id || data.id == "" || data.id <= 0) {
					return this.$message.error('请选择一个需要添加的教师！');
				}
				this.$emit('confirm', data);
			},
			rowClickHandle(data) {
				console.log(data);
				this.selectForm = data;
			}
		}
	});
</script>