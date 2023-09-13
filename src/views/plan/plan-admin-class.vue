<template>
	<div class="mod-sys__dept">
		<el-table v-loading="dataListLoading" :data="dataList" row-key="id" border style="width: 100%">
			<el-table-column prop="number" label="班级编号" header-align="center" align="center" min-width="100"></el-table-column>
			<el-table-column prop="name" label="班级名称" header-align="center" align="center" min-width="100"></el-table-column>
			<el-table-column prop="name" label="人数" header-align="center" align="center"  min-width="80"></el-table-column>
			<el-table-column prop="grade" label="年级" header-align="center" align="center" min-width="100"></el-table-column>
			<el-table-column prop="institute" label="院系" header-align="center" align="center" min-width="150"></el-table-column>
			<el-table-column prop="major" label="专业" header-align="center" align="center" min-width="150"></el-table-column>
			<!-- <el-table-column prop="name" label="校区" header-align="center" min-width="100"></el-table-column> -->
		</el-table>
	</div>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import { defineComponent, reactive, toRefs } from "vue";
	import useView from "@/hooks/useView";
	export default defineComponent({
		setup() {
			const state = reactive({
				createdIsNeed: false,
				visible: false,
				title:"",
				getDataListURL: "/manage/institute/list",
				dataForm:{
					planId:""
				} as IObject
			});
			return { ...useView(state), ...toRefs(state) };
		},
		methods: {
			init(id : string) {
				this.title = "行政班";
				this.visible = true;
				this.getDataListURL = "/plan/planrecord/getAdministrativeClass"
				// 
				this.dataForm.planId =  id;
				this.query();
			}
		}
	});
</script>