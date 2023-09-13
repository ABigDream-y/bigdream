<template>
	<div class="task-page">
		<el-row :gutter="20">
			<el-col :span="7">
				<el-card class="institute-el-card" shadow="naver">
					<div class="institute-card">
						<div class="institute-item" :class="dataForm.institute == '' ?'active':''">全部</div>
						<div @click="instituteItemClick(index)" class="institute-item"
							:class="dataForm.institute == item.number ?'active':''"
							v-for="(item,index) in instituteList" :key="index">{{item.name}}</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="17">
				<h3>行政班信息</h3>
				<adminclass></adminclass>
				<h3>教学班信息</h3>
				<!-- <teachingclass></teachingclass> -->
				<teaching></teaching>
			</el-col>
		</el-row>
	</div>
</template>

<style scoped lang="scss">
	.task-page {

		:deep(.institute-el-card .el-card__body) {
			padding-top: 10px;
			padding-bottom: 10px;
			padding: 10px;
		}

		.institute-card {
			width: 100%;
			height: calc(100vh - 50px - 40px - 30px - 42px - 22px);
			overflow: hidden;
			overflow-y: auto;

			.institute-item {
				padding: 10px 10px;
				cursor: pointer;

				&:hover {
					background-color: rgba(62, 142, 247, 0.2);
					color: #3E8EF7;
				}
			}

			.active {
				background-color: rgba(62, 142, 247, 0.2);
				color: #3E8EF7;
			}
		}
	}
</style>

<script lang="ts">
	import { defineComponent, reactive, toRefs } from "vue";
	import adminclass from "./adminclass.vue";
	import teachingclass from "./teachingclass.vue";
	import teaching from "./teaching.vue";
	import baseService from "@/service/baseService";
	import { IObject } from "@/types/interface";
	export default defineComponent({
		components: {
			adminclass,
			teachingclass,
			teaching
		},
		setup() {
			const state = reactive({
				instituteList: [] as IObject[],
				dataForm: {
					institute: ""
				} as IObject
			});
			return { ...toRefs(state) };
		},
		activated() {
			this.getInstituteList();
		},
		methods: {
			//获取学院列表
			getInstituteList() {
				baseService.get(`/manage/institute/list`).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.instituteList = res.data;
					console.log('学院数据', res)
				});
			},
			//学院点击
			instituteItemClick(index : number) {
				let institute = this.instituteList[index];
				this.dataForm.institute = institute.number;
				this.$nextTick(() => {
					// this.$refs
				})
			}
		}

	});
</script>