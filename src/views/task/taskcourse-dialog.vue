<template>
	<el-dialog width="80%" v-model="visible" :title="title" :close-on-click-modal="false" :close-on-press-escape="false">
		<div class="mod-course__taskcourse-dialog">
			<adminclass v-if="type == 1" ref="adminclass" :actions="false"></adminclass>
			<div v-else-if="type == 2">待完善</div>
			<div v-else-if="type == 3">待完善</div>
			<teaching v-else-if="type == 4" ref="teaching" :actions="false"></teaching>
		</div>
	</el-dialog>
</template>

<script lang="ts">
	import { IObject } from "@/types/interface";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import adminclass from "./adminclass.vue";
	import teaching from "./teaching.vue";
	export default defineComponent({
		components: {
			adminclass,
			teaching
		},
		setup() {
			const state = reactive({
				visible: false,
				createdIsNeed: false,
				getDataListURL: "/course/courselibrary/page",
				getDataListIsPage: true,
				exportURL: "/course/courselibrary/export",
				deleteURL: "/course/courselibrary",
				routeName: '/course-courselibrary-edit',
				routePath: '/course/courselibrary-edit',
				routeTitle: '课程库',
				deleteIsBatch: true,
				dataForm: {
					id: "",
					code: "",
					name: "",
					unit: "",
					category: "",
					type: "",
					mode: "",
					language: "",
					status: 1,
				} as IObject,
				selectForm: {
					id: "",
					name: ""
				} as IObject,
				components: [
					
				],
				title: "",
				type: ""
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
			
		},
		props: {
		
		},
		created() {
		
		},
		methods: {
			init(id, type, count) {
				this.visible = true;
				console.log(id, type);
				this.dataForm.id = id;
				this.type = type;
				if(type == 1) {
					this.title = "行政班列表" + "（"+ count +"）";
					this.loadData('adminclass', this.dataForm.id);
				}else if(type == 2) {
					this.title = "重修名单" + "（"+ count +"）";
					this.loadData('', this.dataForm.id);
				}else if(type == 3) {
					this.title = "学生列表" + "（"+ count +"）";
					this.loadData('', this.dataForm.id);
				}else if(type == 4){
					this.title = "教学班列表" + "（"+ count +"）";
					this.loadData('teaching', this.dataForm.id);
				}
			},
			loadData(ref : String, id) {
				this.$nextTick(()=>{
					if(this.$refs.hasOwnProperty(ref)) {
						this.$refs[ref].init(id);
					}
				});
			}
		}
	});
</script>