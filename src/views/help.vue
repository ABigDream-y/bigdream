<template>
	<el-card shadow="never" class="aui-card--fill">
		<h1 style="text-align:center;">在线帮助</h1>
		<div style="width:80%;margin:0 auto;" v-html="content"></div>
	</el-card>
</template>

<style scoped>
	.aui-card--fill {
		margin:20px;
		min-height:calc(100vh - 40px);
	}
</style>

<script lang="ts">
	import app from "@/constants/app";
	import { useStore } from "vuex";
	import {
		defineComponent,
		reactive,
		toRefs
	} from "vue";
	import baseService from "@/service/baseService";
	
	import {
		registerDynamicToRouterAndNext
	} from "@/router";
	import {
		IObject
	} from '@/types/interface';
	import useView from "@/hooks/useView";
	export default defineComponent({
		setup() {
			const store = useStore();
			const state = reactive({
				content:`<p>1.【学籍管理-&gt;学籍信息管理-&gt;学籍字段权限设置】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/e8ff31ad7ba54298bbe4c7ae685d6e14.png" alt="" width="955" height="697" /></p>
<p>2.【教学资源管理-&gt;学院管理】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/2f22db11ea42426f93533afbe6cdf960.png" alt="" width="947" height="711" /></p>
<p>3.【课程管理-&gt;新开课程申请】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/407a08a2d6344c65948e597dd7e5391e.png" alt="" width="963" height="388" /></p>
<p>4.【课程管理-&gt;新开课程申请-&gt;课程信息登记】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/bf9770bb220245368994ef1591a0d9be.png" alt="" width="961" height="743" /></p>
<p>5.【培养方案管理-&gt;维护设置】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/bddd4493ecf049bca5b0b632b817f3d6.png" alt="" width="921" height="717" /></p>
<p>6.【培养方案管理-&gt;课组管理-&gt;从课程库中选择】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/36fc0327adaa48d3b420db873a6b3e82.png" alt="" width="979" height="703" /></p>
<p>7.【培养方案管理-&gt;培养方案管理-&gt;培养方案审核-&gt;某方案基本信息】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/50bea57d1eaa4cecba827dae16aa6049.png" alt="" width="936" height="757" /></p>
<p>8.【培养方案管理-&gt;培养方案管理-&gt;培养方案审核-&gt;某方案课组课程】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/83a970e9dbdf4a6886047bf5f13269e9.png" alt="" width="974" height="372" /></p>
<p>9.【培养方案管理-&gt;培养方案管理-&gt;培养方案审核-&gt;某方案课程列表】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/e52b18c7547d4a11ba6e537de39ba141.png" alt="" width="907" height="356" /></p>
<p>10.【教学计划管理-&gt;教学计划调整-&gt;编辑教学计划】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/1f11752937c64961b926c3bb217539e6.png" alt="" width="905" height="362" /></p>
<p>11.【教学任务管理-&gt;维护设置】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/3c2d48111e864401a1dbb416044f35b2.png" alt="" width="962" height="693" /></p>
<p>12.【教学任务管理-&gt;教学任务管理】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/61add46698dd40df935ed9cca639b6bd.png" alt="" width="969" height="697" /></p>
<p>13.【教学任务管理-&gt;教学任务维护-&gt;编辑教学班】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/4a1748215d2842269e211009e203254a.png" alt="" width="892" height="814" /></p>
<p>14.【教学任务管理-&gt;教学任务维护-&gt;编辑教学班-&gt;上课教师维护】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/57f20fb676f84e2285d842420583b132.png" alt="" width="924" height="599" /></p>
<p>15.【教学任务管理-&gt;教学任务维护-&gt;开课任务书】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/63384e6d75fb44f899c3b8fb369a01b2.png" alt="" width="964" height="427" /></p>
<p>16.【排课管理-&gt;交互式排课】</p>
<p><img style="width:100%;height:auto;" src="http://182.44.69.19:8085/uploads/20230725/cf2275324c2d4e71a1cb438275cc26e7.png" alt="" width="981" height="690" /></p>`
			});
			return {
				...useView(state),
				...toRefs(state),
			};
		}
	});
</script>