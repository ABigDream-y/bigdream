<template>
	<el-dialog v-model="visible" title="教学计划生成进度" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
		<el-progress :text-inside="true" :stroke-width="26" :percentage="progress" />
		<el-row
			style="display: flex;flex-direction: column;justify-content: center;align-items: center;margin-top: 20px;">
			<div>教学计划生成中，请耐心等待...</div>
		</el-row>
	</el-dialog>
</template>

<script lang="ts">
	import { defineComponent, reactive } from "vue";
	import { IObject } from "@/types/interface";
	import { useStore } from "vuex";
	import { findIndex } from "lodash";
	import baseService from "@/service/baseService";
	import { useDebounce } from "@/utils/utils";
	import { ElNotification } from 'element-plus';
	import { h } from 'vue';
	export default defineComponent({
		setup() {
			return reactive({
				visible: false,
				requestURL: "/plan/planrecord/generatePlan",
				progress: 0,
				timer: null
			});
		},
		computed: {

		},
		props: {

		},
		methods: {
			showDialog() {
				this.visible = true;
			},
			hideDialog() {
				this.visible = false;
				this.clear();
			},
			request(data) {
				if(this.timer != null) {
					clearInterval(this.timer);
					this.timer = null;
				}
				console.log(data);
				baseService.get(
					this.requestURL,
					{
						planId: data.id
					}
				).then((res)=>{
					console.log(res);
					if(res.code != 0) {
						// 关闭dialog
						this.hideDialog();
						return this.$message.error(res.msg);
					}
					
					this.timer = setInterval(()=>{
						if(this.progress < 100) {
							this.progress += 1;
						} else {
							this.hideDialog();
							this.$message({
								type: "success",
								message: "完成",
								duration: 500,
								onClose: ()=>{
									this.$emit("refreshDataList");
								}
							});
							if(this.timer != null) {
								clearInterval(this.timer);
								this.timer = null;
							}
						}
					}, 10);
					
				}).catch((error)=>{
					console.error(error);
				})
			},
			// 提示
			tips(title, type, msg, offset, delay) {
				setTimeout(() => {
					ElNotification({
						title: title,
						message: h('i', { style: 'color: teal' }, msg),
						offset: offset,
						type: type
					});
				}, delay);
			},
			clear() {
				if(this.timer != null) {
					clearInterval(this.timer);
					this.timer = null;
				}
				this.progress = 0;
			}
		},
		watch: {

		}
	});
</script>
<style scoped>
	.el-button--text {
		margin-right: 15px;
	}

	.el-select {
		width: 300px;
	}

	.el-input {
		width: 300px;
	}

	.dialog-footer button:first-child {
		margin-right: 10px;
	}
</style>