<template>
	<el-dialog v-model="visible" :title="title" width="80%" :close-on-click-modal="false" :close-on-press-escape="false">
		<!-- <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()"
			label-width="120px">
			<el-form-item label="选择行政班" prop="adminClassIds">
				<el-select v-model="dataForm.adminClassIds" placeholder="选择行政班" multiple>
					<el-option v-for="(item,index) in dataList" :key="index" :value="item.id"
						:label="item.classNo + '-' +item.className"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input type="textarea" :rows="6" v-model="dataForm.remark" placeholder="备注"></el-input>
			</el-form-item>
		</el-form> -->

		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" :selectable="selectable" header-align="center" align="center"
				width="50"></el-table-column>
			<el-table-column prop="classNo" label="班级编号" header-align="center" align="center" width="100"></el-table-column>
			<el-table-column prop="className" label="班级" header-align="center" align="center"></el-table-column>
			<el-table-column prop="number" label="人数" header-align="center" align="center"></el-table-column>
			<el-table-column prop="grade" label="年级" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("grade", scope.row.grade) }}
				</template>
			</el-table-column>
			<el-table-column prop="institute" label="院系" header-align="center" align="center"></el-table-column>
			<el-table-column prop="major" label="专业" header-align="center" align="center"></el-table-column>
			<el-table-column prop="majorDirection" label="专业方向" header-align="center" align="center"
				width="120"></el-table-column>
			<el-table-column prop="campus" label="校区" header-align="center" align="center"></el-table-column>
			<el-table-column prop="openingStatus" label="是否开课" header-align="center" align="center" width="100">
				<template v-slot="scope">
					{{ getDictLabel("yesOrNo", scope.row.openingStatus) }}
				</template>
			</el-table-column>
			<el-table-column prop="status" label="状态" header-align="center" align="center">
				<template v-slot="scope">
					{{ getDictLabel("task_course_status", scope.row.status) }}
				</template>
			</el-table-column>
		</el-table>

		<template v-slot:footer>
			<el-button @click="visible = false;">取消</el-button>
			<el-button @click="comfirmVertify" type="primary">确定</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts">
	import useView from "@/hooks/useView";
	import { IObject } from "@/types/interface";
	import { defineComponent, reactive, toRefs } from "vue";
	import baseService from "@/service/baseService";
	export default defineComponent({
		props:{
			title:String
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				visible: false,
				getDataListIsPage: true,
				status: 0,
				type: 0,
				dataForm: {
					page:1,
					limit:9999,
					remark: "",
					courseId:""
				},
				page:1,
				limit:9999,
				courseId: "",
				dataList: [] as IObject[]
			});
			return { ...useView(state), ...toRefs(state) };
		},
		computed: {
			dataRule() {
				return {
					adminClassIds: [{ required: true, message: this.$t("validate.required"), trigger: ["blur", "change"] }]
				};
			}
		},
		methods: {
			init(courseId : string) {
				this.page = 1;
				this.limit = 9999;
				this.getDataListURL = "/task/adminclass/page";
				this.dataForm.courseId = courseId;
				this.dataForm.page = 1;
				this.dataForm.limit = 9999;
				console.log('courseId--', courseId)
				this.visible = true;
				this.courseId = courseId;
				this.dataListSelections = [];
				// this.dataForm.adminClassIds = [];
				// this.dataForm.remark = "";
				this.query();
			},
			selectable(row : IObject) {
				return row.status == 0 && row.openingStatus == 1;
			},
			//获取教学班
			// getDataList() {
			// 	this.dataListLoading = true;
			// 	baseService.get("/task/adminclass/page", {
			// 		page: 1,
			// 		limit: 99999,
			// 		courseId: this.courseId
			// 	}).then((res) => {
			// 		this.dataListLoading = false;
			// 		if (res.code !== 0) {
			// 			return this.$message.error(res.msg);
			// 		}
			// 		this.dataList = res.data.list.filter((item : IObject) => { return item.status == 0 && row.openingStatus == 1; });
			// 	});
			// },
			comfirmVertify() {
				let selectList = this.dataListSelections ? this.dataListSelections:[];
				if (selectList.length == 0) {
					return this.$message.error('至少选择一个行政班')
				}
				this.$emit('confirm', selectList);
				this.visible = false;
			}
		}
	});
</script>