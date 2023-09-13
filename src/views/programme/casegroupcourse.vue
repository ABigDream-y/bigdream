<template>
	<div class="mod-programme__coursegroup">
		<div v-for="(item,index) in tableData" :key="index">
			<h3 style="margin-top:0;" >{{item.name}}[最少修读{{item.scoreMin}}学分]</h3>
			<el-table :data="item.caseCourse" style="width: 100%">
				<el-table-column prop="courseNo" label="课程号" width="150" header-align="center" align="center" />
				<el-table-column prop="courseName" label="课程名称" width="200" header-align="center" align="center" />
				<el-table-column prop="score" label="学分" width="100" header-align="center" align="center" />
				<el-table-column label="开课学期及学分" header-align="center" align="center">
					<el-table-column v-for="(head,hIndex) in headList" :key="index" :prop="head.prop" :label="head.title" header-align="center" align="center" />
				</el-table-column>
				<el-table-column prop="remark" label="备注" width="100" header-align="center" align="center" />
			</el-table>
		</div>
	</div>
</template>

<script lang="ts">
	import baseService from "@/service/baseService";
	import { IObject } from "@/types/interface";
	import { defineComponent, reactive, toRefs } from "vue";
	export default defineComponent({
		setup() {
			const state = reactive({
				tableData: [] as IObject[],
				headList:[] as IObject[]
			});
			return { ...toRefs(state) };
		},
		watch: {},
		methods: {
			init(caseId : string) {
				baseService.get("/programme/casecourse/list?id=" + caseId).then((res) => {
					console.log('课程列表', res)
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					
					this.tableData = res.data;
					
					let headList = [] as IObject[];
					let headTitle = [] as string[];
					this.tableData.forEach((item:IObject)=>{
						let list:IObject[] = item.caseCourse || [];
						let obj:IObject = {};
						list.forEach((val:IObject)=>{
							let title = val.planGrade + val.planTerm;
							if(headTitle.length == 0) {
								obj['title'] = title;
								obj['prop'] = 'score' + headList.length;
								headTitle.push(title);
								headList.push(obj);
								val[obj['prop']] = val.score;
							}else {
								let index:number = headTitle.indexOf(title);
								if(index != -1) {
									val[headList[index].prop] = val.score;
								}else {
									obj['title'] = title;
									obj['prop'] = 'score' + headList.length;
									headTitle.push(title);
									headList.push(obj);
									val[obj['prop']] = val.score;
								}
							}
						})
					})
					console.log('headList',headList)
					this.headList = headList;
				});
			}
		}

	});
</script>