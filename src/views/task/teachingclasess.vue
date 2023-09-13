<template>
	<div class="mod-task__teachingclass">
		<el-form :inline="true" :model="dataForm">
			<!-- <el-form-item>
				<el-input v-model="dataForm.courseName" placeholder="课程名" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model="dataForm.courseNo" placeholder="课序号" clearable></el-input>
			</el-form-item> -->
			<!-- <el-form-item>
				<el-button @click="getDataList()">{{ $t("query") }}</el-button>
			</el-form-item> -->
			<!-- <el-form-item v-if="hasPermission('task:teachingclass:export')">
				<el-button type="info" @click="exportHandle()">{{ $t("export") }}</el-button>
			</el-form-item> -->
			<el-form-item v-if="hasPermission('task:teachingclass:save')">
				<el-button type="primary" @click="addClassHandle()">添加</el-button>
			</el-form-item>
			<!-- <el-form-item v-if="hasPermission('task:teachingclass:delete')">
				<el-button type="danger" @click="deleteHandle()">{{ $t("deleteBatch") }}</el-button>
			</el-form-item> -->
		</el-form>
		<el-table v-loading="dataListLoading" :data="dataList" border @selection-change="dataListSelectionChangeHandle"
			style="width: 100%">
			<el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
			<!-- <el-table-column prop="courseName" label="课程名" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="courseNo" label="课序号" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="classNum" label="班容量" header-align="center" align="center"></el-table-column> -->
			<!-- <el-table-column prop="teacher" label="上课教师" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="className" label="班级编号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="className" label="班级" header-align="center" align="center"></el-table-column>
			<!-- <el-table-column prop="campus" label="校区" header-align="center" align="center"></el-table-column> -->
			<el-table-column prop="grade" label="年级" header-align="center" align="center"></el-table-column>
			<el-table-column prop="institute" label="院系" header-align="center" align="center"></el-table-column>
			<el-table-column prop="major" label="专业" header-align="center" align="center"></el-table-column>
			<el-table-column :label="$t('handle')" fixed="right" header-align="center" align="center" width="100">
				<template v-slot="scope">
					<el-button v-if="hasPermission('task:teachingclass:delete') && total > 1" type="text" size="small" @click="deleteHandle(scope.row.id)">{{ $t("delete") }}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- <el-pagination :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="limit" :total="total"
			layout="total, sizes, prev, pager, next, jumper" @size-change="pageSizeChangeHandle"
			@current-change="pageCurrentChangeHandle"> </el-pagination> -->
		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" title="新增上课班级" ref="addOrUpdate" @confirm="confirmSelect"></add-or-update>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import AddOrUpdate from "./teaching-add.vue";
	import baseService from "@/service/baseService";
	export default defineComponent({
		components: {
			AddOrUpdate
		},
		setup() {
			const state = reactive({
				createdIsNeed: false,
				getDataListURL: "/task/teachingclass/page",
				getDataListIsPage: true,
				exportURL: "/task/teachingclass/export",
				deleteURL: "/task/teachingclass",
				routeName: "/task-teachingclass-edit",
				routePath: "/task/teachingclass-edit",
				routeTitle: "教学任务维护教学班",
				deleteIsBatch: true,
				courseId: "",
				dataForm: {
					teachingId: "",
					courseName: "",
					courseNo: ""
				},
				limit:9999
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {},
		methods: {
			init(teachingId : string, courseId : string) {
				console.log('teachingId',teachingId)
				console.log('courseId',courseId)
				this.courseId = courseId;
				this.dataForm.teachingId = teachingId;
				this.query();
			},
			addClassHandle() {
				console.log("addHandle------",this.courseId);
				this.addOrUpdateVisible = true;
				this.$nextTick(() => {
					this.$refs.addOrUpdate.init(this.courseId);
				});
			},
			//批量选择行政班添加到当前教学班的上课班级中
			confirmSelect(data : IObject[]) {
				console.log('data-----',data);
				let ids = data.map((item:IObject)=>item.id);
				
				// baseService.get("/task/adminclass/convert", {
				// 	id:this.dataForm.teachingId,
				// 	ids:data.map
				// }).then((res) => {
				// 	if (res.code !== 0) {
				// 		return this.$message.error(res.msg);
				// 	}
				// 	this.$emit('refresh');
				// });
			}
		}
	});
</script>