<template>
	<div>
		<el-card shadow="never" class="aui-card--fill">
			<iframe v-if="currentUrl" frameborder="no" border="0" marginwidth="0" marginheight="0" :src="currentUrl"
				width="100%" height="100%" />
		</el-card>
	</div>
</template>

<style scoped>
	.aui-card--fill {
		position: relative;
		width: 100%;
		height: calc(100vh - 50px - 40px - 30px - 40px);
		background-color: #fff;
	}
	
	.aui-card--fill iframe {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		/* height: calc(100vh - 50px - 38px - 30px); */
	}
</style>

<style scoped lang="less">
	.home-flex {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.result-card {
		display: flex;
		flex-wrap: wrap;
	}

	.home-left {
		width: 100%;
		min-height: 200px;
	}

	.home-right {
		width: 100%;
		height: 100%;
		min-height: 200px;
	}

	.data-card {
		margin-top: 20px;
		border: 1px solid #E2E2E2;
		padding: 20px 15px;

		.data-title {
			margin-top: 0;
		}
	}

	.data-list {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;

		.data-item {
			width: 30%;
			text-align: center;
			cursor: pointer;
			margin-bottom: 15px;

			.data-label {
				position: relative;
				margin-top: 10px;
				font-size: 16px;
				display: flex;
				align-items: center;
				justify-content: center;

				.item-badge {
					// margin-top: 10px;
					// margin-right: 40px;
				}

				.icon-dot {
					position: absolute;
					min-width: 17px;
					text-align: center;
					top: -10px;
					right: 30%;
					background-color: #FF0000;
					color: #fff;
					border-radius: 50%;
					font-size: 12px;
					padding: 2px;
				}

				.label-icon {
					font-size: 18px;
					margin-right: 5px;
					color: #00BEAD;
				}

				.label-icon2 {
					font-size: 35px;
					color: #BD3124;
					color: #17B3A3;
				}

				.label-img {
					width: 50px;
					height: 50px;
				}
			}

			.data-num {
				font-size: 16px;
				margin-top: 10px;

				.number {
					color: #AF1D1D;
					margin-right: 10px;
					font-weight: bold;
					font-size: 20px;
				}
			}
		}
	}

	.right-card {
		margin: 0;
		margin-bottom: 20px;
		overflow: hidden;
		height: calc((100% - 20px)/2);

		.right-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20px;

			.label {
				font-size: 16px;
			}

			.more {
				display: flex;
				align-items: center;
			}

			.label-icon {
				margin-left: 10px;
				color: #00BEAD;
			}
		}
	}

	.notice-card {
		height: 300px;
		overflow: hidden;
	}

	.form-card {
		width: 100%;
		height: 400px;
		border: 1px solid #E2E2E2;
		padding: 20px 15px;
		margin: 0;
	}

	.help-card {
		height: calc(100% - 20px - 300px);
		overflow: hidden;
	}

	.card-box {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.list-item {
		display: flex;
		align-items: center;
		// justify-content: space-between;
		font-size: 16px;
		margin-bottom: 17px;
		cursor: pointer;

		.item-icon {
			color: #00BEAD;
			margin-right: 10px;
			font-weight: bold;
		}

		.item-label {
			flex: 1;
			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			word-break: break-all;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
	}

	.list-item-help {
		margin-bottom: 18px;
	}

	.margin-bottom-0 {
		margin-bottom: 0;
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
				store,
				createdIsNeed: false,
				homeLeftHeight: 0,
				banner: [] as IObject[],
				courseNum: 0,
				helpList: [] as IObject[],
				noticeList: [] as IObject[],
				signinNum: 0,
				signupNum: 0,
				verifyCourseNum: 0,
				verifyRosterNum: 0,
				homeData: {
					assessNum: 0,
					surveyNum: 0
				},
				isStaffRole: false,
				// 辅导员带生测试结果
				resultLoading:false,
				studentResult: [] as IObject[],
				resultTotal: 0,
				groupSort:0,
				selectType:1,
				currentUrl:"https://datav.howevent.com/howevent/#/dw/3ACMvQB0"
				
			});
			return {
				...useView(state),
				...toRefs(state),
			};
		},
		created() {
			// this.isStaffRole = this.store.state.user.staffRole == '辅导员';
			// console.log('isStaffRole', this.store.state.user)
			// if (this.isStaffRole) {
			// 	// this.getNoticeStuPage();
			// 	this.get90SCLResult();
			// } else {
			// 	this.getBannerList();
			// }

			// this.getHomeData();

			// this.getNotice();
			// this.getHelp();
		},
		mounted() {
			// this.initView();
			// window.onresize = () => {
			// 	this.initView();
			// }
		},
		methods: {
			
		}
	});
</script>