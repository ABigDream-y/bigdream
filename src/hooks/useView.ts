import app from "@/constants/app";
import { EMitt, EThemeSetting } from "@/constants/enum";
import { IObject, IViewHooks, IViewHooksOptions } from "@/types/interface";
import { registerDynamicToRouterAndNext } from "@/router";
import baseService from "@/service/baseService";
import { getToken } from "@/utils/cache";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import ui from "@/utils/ui";
import { checkPermission, getDictLabel } from "@/utils/utils";
import qs from "qs";
import { nextTick, onActivated, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { getChangeNum } from "@/utils/klyutils";

/**
 * 通用视图业务逻辑（列表/增删改查基本业务）
 * @param props 自定义通用业务state
 * @returns 返回响应式自定义state和通用方法
 */
const useView = (props : IViewHooksOptions | IObject) : IViewHooks => {
	const { t } = useI18n();
	const router = useRouter();
	const store = useStore();
	const defaultOptions : IViewHooksOptions = {
		createdIsNeed: true,
		activatedIsNeed: false,
		getDataListURL: "",
		getDataListIsPage: false,
		isXmuApi: false,
		deleteURL: "",
		deleteIsBatch: false,
		deleteIsBatchKey: "id",
		exportURL: "",
		importTemplateUrl: "",
		dataForm: {},
		dataList: [],
		order: "",
		orderField: "",
		page: 1,
		limit: 10,
		total: 0,
		dataListLoading: false,
		dataListSelections: [],
		addOrUpdateVisible: false,
		addOrUpdate: {},
		elTable: {},
		routeName: "",
		routeTitle: "",
		routeTitleCustom: "",
		routePath: "",
		getTypeListURL: "",
		typeList: [],
		mainFormId: app.$mainFormId,
	};
	const mergeDefaultStateToPageState = (options : IObject, props : IObject) : IViewHooksOptions => {
		for (const key in options) {
			if (!Object.getOwnPropertyDescriptor(props, key)) {
				props[key] = options[key];
			}
		}
		return props;
	};
	const state = mergeDefaultStateToPageState(defaultOptions, props);
	onMounted(() => {
		if (state.createdIsNeed && !state.activatedIsNeed) {
			viewFns.query();
			viewFns.getTypeList();
		}
	});
	onActivated(() => {
		if (store.state.closedTabs.includes(store.state.activeTabName)) {
			//如果当前打开的tab页面是之前已经关闭过的会存在keep-alive缓存
			//这里采用临时刷新页面解决方案
			//待vue官方开放缓存策略后再行实现 https://github.com/vuejs/vue-next/pull/4339   https://github.com/vuejs/rfcs/pull/284

			const closedTabs = store.state.closedTabs;
			store.dispatch({
				type: "updateState",
				payload: { closedTabs: closedTabs.filter((x : string) => x !== store.state.activeTabName) }
			});
			emits.emit(EMitt.OnReloadTabPage);
		}

		if (state.activatedIsNeed) {
			viewFns.query();
			viewFns.getTypeList();
		}
	});

	/**
	 * element-plus button组件聚焦事件bug，导致点击后一直处于聚焦状态，按下回车键依然会触发事件
	 * @param elm
	 */
	const fixEleButtonFocus = () => {
		const elm = state.addOrUpdate;
		if (elm && elm.$parent && elm.$parent.$el) {
			const node = elm.$parent.$el;
			node.setAttribute("tabindex", 0);
			node.focus();
			node.blur();
			node.removeAttribute("tabindex");
		}
	};

	//
	const rejectFns = {
		// 消息推送辅导员操作是否显示
		showPutMsgAction() {
			let showAction = false;
			if (store.state.user.superAdmin == 1) {
				// 超级管理员
				showAction = true;
			} else if (store.state.user.roleIdList && store.state.user.roleIdList.indexOf("1623514175589294081") != -1) {
				// 厦大管理员
				showAction = true;
			}
			return showAction;
			// return getChangeNum(number);
		},
		getVisitNumber(number : number) {
			return getChangeNum(number);
		},
		hasPermission(key : string) {
			return checkPermission(store.state.permissions as string[], key);
		},
		getDictLabel(dictType : string, dictValue : number) {
			return getDictLabel(store.state.dicts, dictType, dictValue);
		}
	};

	//
	const viewFns = {
		// 获取数据列表
		query() {
			if (!state.getDataListURL) {
				return;
			}
			state.dataListLoading = true;
			let params = {
				pageNum: state.page,
				pageSize: state.limit
			}

			baseService
				.get(state.getDataListURL, {
					order: state.order,
					orderField: state.orderField,
					page: state.getDataListIsPage ? state.page : null,
					limit: state.getDataListIsPage ? state.limit : null,
					...state.dataForm,
					...state.isXmuApi ? params : {}
				})
				.then((res) => {
					console.log("request address：", state.getDataListURL);
					console.log("params：", {
						order: state.order,
						orderField: state.orderField,
						page: state.getDataListIsPage ? state.page : null,
						limit: state.getDataListIsPage ? state.limit : null,
						...state.dataForm,
						...state.isXmuApi ? params : {}
					});
					console.log('res：', res);
					state.dataListLoading = false;
					if (res.code !== 0) {
						state.dataList = [];
						state.total = 0;
						return ui.error(res.msg);
					}

					if (!state.isXmuApi) {
						state.dataList = state.getDataListIsPage ? res.data.list : res.data;
						state.total = state.getDataListIsPage ? res.data.total : 0;
					} else {
						state.dataList = res.data.dataSet;
						state.total = res.data.pageInfo.total;
					}
				})
				.catch(() => {
					state.dataListLoading = false;
				});
		},
		// 多选
		dataListSelectionChangeHandle(val : IObject[]) {
			console.log(val);
			state.dataListSelections = val;
		},
		// 排序
		dataListSortChangeHandle(data : IObject) {
			if (!data.order || !data.prop) {
				state.order = "";
				state.orderField = "";
				return false;
			}
			state.order = data.order.replace(/ending$/, "");
			state.orderField = data.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
			viewFns.query();
		},
		// 分页, 每页条数
		pageSizeChangeHandle(val : number) {
			state.page = 1;
			state.limit = val;
			viewFns.query();
		},
		// 分页, 当前页
		pageCurrentChangeHandle(val : number) {
			state.page = val;
			viewFns.query();
		},
		//搜索
		getDataList() {
			state.page = 1;
			viewFns.query();
		},
		// 重置
		queryResetHandle() {
			const self = this as any;
			if (self.$refs.searchForm) {
				self.$refs['searchForm'].resetFields();
				self.getDataList();
			}
		},
		// 获取分类列表
		getTypeList() {
			if (!state.getTypeListURL) {
				return;
			}
			baseService.get(state.getTypeListURL, {
				params: {
					page: 1,
					limit: 9999999999
				}
			}).then((res) => {
				console.log('分类列表', res)
				if (res.code !== 0) {
					state.typeList = [];
				} else {
					state.typeList = res.data.list
				}
			});
		},
		getTypeName(id ?: string) {
			let name = "";
			const typeList = state.typeList ? state.typeList : [];
			typeList.forEach((item : IObject) => {
				if (item.id == id) {
					name = item.name;
				}
			})
			return name;
		},
		// 新增 / 修改
		addHandle(row : IObject) {
			state.addOrUpdateVisible = true;
			nextTick(() => {
				state.addOrUpdate?.init(row);
			});
		},
		addOrUpdateHandle(id ?: string) {
			state.addOrUpdateVisible = true;
			nextTick(() => {
				if (state.addOrUpdate && !state.addOrUpdate.visible) {
					fixEleButtonFocus();
					state.addOrUpdate.dataForm.id = id || "";
					state.addOrUpdate.init();
				}
			});
		},
		// addOrUpdateHandle(id?: string){
		// 	state.addOrUpdateVisible = true;
		// 	//触发tbuser-add-or-update页面中的init方法
		// 	nextTick(() => {
		// 		// state.addOrUpdate.init();
		// 		console.log(state.addOrUpdate)
		// 	});
		// },
		editHandle(id ?: string) {
			const self = this as any;
			const routeParams = {
				routeName: `${state.routeName}__${id ? id : 0}`,
				title: `${state.routeTitle} - ${state.routeTitleCustom ? state.routeTitleCustom : (id ? '编辑' : '新增')}`,
				path: `${state.routePath}`,
				query: {
					id: id ? id : 0,
					_mt: `${self.$route.meta.title ? self.$route.meta.title : state.routeTitle} - ${state.routeTitleCustom ? state.routeTitleCustom : (id ? '编辑' : '新增')}`
				}
			};
			registerDynamicToRouterAndNext(routeParams);
		},
		editWidthParamsHandle(query ?: IObject) {
			const self = this as any;
			const id = query ? query.id : 0;
			const routeParams = {
				routeName: `${state.routeName}__${id ? id : 0}`,
				title: `${state.routeTitle} - ${id ? '编辑' : '新增'}`,
				path: `${state.routePath}`,
				query: {
					...query,
					_mt: `${self.$route.meta.title ? self.$route.meta.title : state.routeTitle} - ${id ? '编辑' : '新增'}`
				}
			};
			registerDynamicToRouterAndNext(routeParams);
		},
		// 废弃
		discardHandle(id : string) {
			let list = [];
			if (id) {
				list.push(id);
			} else {
				list = state.dataListSelections.map((item) => {
					return item.id;
				});
				// let postDate = JSON.stringify(list);
				// this.dataFormSubmitHandle(list);
			}
			// this.dataFormSubmitHandle(list);
			console.log(list.length);
			if (list != null && list.length > 0) {
				ui.confirm(t("prompt.info", { handle: t("discard") }), t("prompt.title"), {
					confirmButtonText: t("confirm"),
					cancelButtonText: t("cancel"),
					type: "warning"
				}).then(() => {
					baseService
						.get("/course/courselibrary/discard", { ids: list.join(";") })
						.then((res) => {
							console.log(list);
							list = null;
							if (res.code !== 0) {
								ui.error(res.msg);
								return reject(new Error(res.msg));
							}
							ui.message({
								message: t("prompt.success"),
								type: "success",
								duration: 500,
								onClose: () => {
									viewFns.query();
								}
							});
						});
				}).catch(() => {

				});
			} else {
				this.$message({
					type: 'warning',
					iconClass: 'el-icon-warning',
					message: '请选择需要废弃的项目'
				});
			}
		},
		// 删除
		deleteHandle(id ?: string, pid ?: string) : Promise<any> {
			return new Promise((resolve, reject) => {
				if (
					state.deleteIsBatch &&
					!id &&
					state.dataListSelections &&
					state.dataListSelections.length <= 0
				) {
					ui.message({
						message: t("prompt.deleteBatch"),
						type: "warning",
						duration: 500
					});
					return;
				}
				ui.confirm(t("prompt.info", { handle: t("delete") }), t("prompt.title"), {
					confirmButtonText: t("confirm"),
					cancelButtonText: t("cancel"),
					type: "warning"
				})
					.then(() => {
						baseService
							.delete(
								`${state.deleteURL}${state.deleteIsBatch ? "" : "/" + id}`,
								state.deleteIsBatch
									? id
										? [id]
										: state.dataListSelections
											? state.dataListSelections.map(
												(item : IObject) => state.deleteIsBatchKey && item[state.deleteIsBatchKey]
											)
											: {}
									: {}
							)
							.then((res) => {
								if (res.code !== 0) {
									ui.error(res.msg);
									return reject(new Error(res.msg));
								}
								ui.message({
									message: t("prompt.success"),
									type: "success",
									duration: 500,
									onClose: () => {
										if (pid && state.elTable) {
											//针对配置了lazy属性的一般逻辑，局部删除实现
											state.elTable.store.states.lazyTreeNodeMap["pid"] = [];
											resolve(true);
										} else {
											viewFns.query();
											resolve(true);
										}
									}
								});
							});
					})
					.catch(() => {
						//
					});
			});
		},
		// 导出
		exportHandle() {
			window.location.href = `${app.api}${state.exportURL}?${qs.stringify({
				...state.dataForm,
				token: getToken()
			})}`;
			// baseService.download(state.exportURL, { ...state.dataForm, token: getToken() });
		},
		//批量导入模板下载
		downTemplateHandle() {
			if (state.importTemplateUrl) {
				window.location.href = `${app.api}${state.importTemplateUrl}?${qs.stringify({
					token: getToken()
				})}`;
			}
		},
		//关闭当前窗口
		closeCurrentTab() {
			if (getThemeConfigCacheByKey(EThemeSetting.OpenTabsPage)) {
				emits.emit(EMitt.OnCloseCurrTab);
			} else {
				router.replace("/home");
			}
		},
		// 处理流程路由
		handleFlowRoute(data : IObject) {
			const self = this as any;
			const routeParams = {
				path: `/flow-form/${data.processDefinitionKey}/form`,
				query: {
					taskId: data.taskId,
					processInstanceId: data.processInstanceId,
					businessKey: data.businessKey,
					showType: "taskHandle",
					_mt: `${self.$route.meta.title} - ${data.processDefinitionName}`
				}
			};
			registerDynamicToRouterAndNext(routeParams);
		},
		// 查看流程详情
		flowDetailRoute(data : IObject) {
			const self = this as any;
			const routeParams = {
				path: `/flow-form/${data.processDefinitionKey}/form`,
				query: {
					taskId: data.taskId,
					processInstanceId: data.processInstanceId,
					businessKey: data.businessKey,
					showType: "detail",
					_mt: `${self.$route.meta.title} - ${data.processDefinitionName}`
				}
			};
			registerDynamicToRouterAndNext(routeParams);
		}
	};

	//
	return {
		...viewFns,
		...rejectFns
	};
};

export default useView;