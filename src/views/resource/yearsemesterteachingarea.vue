<template>
	<div class="mod-resource__yearsemesterteachingarea">

    <div class="main" style="display: flex;flex-direction: row;justify-content: flex-start;align-items: flex-start;">
      <div class="left" style="border: 1px solid #eee;margin-right: 10px; padding: 10px;width: 300px;">
        <h3 class="title" style="margin: 0; margin-bottom: 10px;">学年学期</h3>
        <div v-loading="dataListLoading" style="max-height: 700px;overflow: auto;">
          <div :class="id == item.id ?'active':''" v-for="(item,index) in dataList" :key="index"
            class="group-item">
            <span style="flex:1;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;" :title="item.year + ' - ' + item.semester" @click="yearSelect(index)">{{item.year + " - " + item.semester}}</span>
            <!-- <el-button @click="deleteHandle(item.id)" v-if="hasPermission('programme:groupcourse:delete')" type="danger"
              icon="Delete" circle plain /> -->
          </div>
          <div v-if="dataList == null || dataList.length == 0">
            <el-empty description="暂无数据" />
          </div>
        </div>
      </div>
      <div class="right" style="width: calc(100% - 300px);">
        <semester-teaching-area ref="semesterTeachingAreaRef"
        	:fromId="dataForm.id"></semester-teaching-area>
      </div>
    </div>


		<!-- 弹窗, 新增 / 修改 -->
		<add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

		<TeachingareaSelect v-if="reachingAreaSelectVisible" ref="reachingAreaSelect" @confirm="confirmTeachingArea">
		</TeachingareaSelect>

		<copy-area v-if="copyVisible" ref="copyAreaRef" @confirm="confirmCopy"></copy-area>

		<!-- 错误提示 -->
		<el-dialog title="错误提示" v-model="errorVisible" :close-on-click-modal="false" :close-on-press-escape="false"
			width="50%">
			<el-table v-loading="dataListLoading" :data="errorList" border style="width: 100%">
				<el-table-column prop="msg" label="错误信息" header-align="center" align="center"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>


<style>
	.yearsemesterteachingarea-main {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-direction: row;
	}

	.yearsemesterteachingarea-main .left {
		flex: 1;
	}

	.yearsemesterteachingarea-main .right {
		flex: 2;
	}
</style>

<script lang="ts">
	import { registerDynamicToRouterAndNext } from "@/router";
	import useView from "@/hooks/useView";
	import { defineComponent, reactive, toRefs } from "vue";
	import { IObject } from "@/types/interface";
	import TeachingareaSelect from "./multi-teachingarea-select.vue";
	import baseService from "@/service/baseService";
	import CopyArea from "../dialog/copyarea.vue";
	import AddOrUpdate from "./yearsemesterteachingarea-add-or-update.vue";
  import SemesterTeachingArea from "./semesterteachingarea.vue";
	export default defineComponent({
		components: {
			AddOrUpdate,
			TeachingareaSelect,
			CopyArea,
			SemesterTeachingArea
		},
		setup() {
			const state = reactive({
				getDataListURL: "/resource/yearsemesterteachingarea/page",
				getDataListIsPage: true,
				exportURL: "/resource/yearsemesterteachingarea/export",
				deleteURL: "/resource/yearsemesterteachingarea",
				routeName: "/resource-yearsemesterteachingarea-edit",
				routePath: "/resource/yearsemesterteachingarea-edit",
				routeTitle: "学年学期教学场地",
        limit: 9999,
				deleteIsBatch: true,
				copyVisible: false,
				reachingAreaSelectVisible: false,
        id: "",
				dataForm: {
					year: "",
					semester: "",
					status: "",
          order: "desc",
          orderField: "create_date",
          page: 1
				},
				copyId: "",
				errorVisible: false,
				errorList: [],
				rowData: null,
				selectForm: {
					id: 0
				}
			});
			return { ...useView(state), ...toRefs(state) };
		},
		watch: {
			dataList: {
				handler(val) {
					console.log("dataList：", val);
					if(val) {
						this.selectForm = val[0];
						this.rowData = this.selectForm;
            this.id = val[0].id;
            this.$nextTick(() => {
              console.log("id ", this.id, "data ", this.rowData);
              this.$refs['semesterTeachingAreaRef'].init(this.id);
            });
					}
				},
				deep: true
			}
		},
		methods: {
			// areaHandle(data: IObject, column: IObject) {
			//   console.log("data", data, column);
			//   if (column && column.label == "操作") {
			//     return;
			//   }
			//   const routeParams = {
			//     routeName: `resource-teachingarea__${data.id}`,
			//     title: `学期教学场地 - ${data.year + data.semester}`,
			//     path: `/resource/semesterteachingarea`,
			//     query: {
			//       tid: data.id,
			//       _mt: `学期教学场地 - ${data.year + data.semester}`
			//     }
			//   };
			//   registerDynamicToRouterAndNext(routeParams);
			// },
      yearSelect(index) {
        this.id = this.dataList[index].id;
        this.rowData = this.dataList[index];
        this.$nextTick(() => {
          this.$refs['semesterTeachingAreaRef'].init(this.id);
        });
      },
			areaHandle(data : IObject) {
				this.rowData = data;
				this.selectForm = data;
			},
			areaAddHandle(data : IObject) {
				console.log("data", data);
				this.reachingAreaSelectVisible = true;
				this.$nextTick(() => {
					this.$refs.reachingAreaSelect.init(data);
				});
			},
			confirmTeachingArea(data : IObject, form : IObject, yearSemester : IObject) {
				console.log("data", data, form, yearSemester);
				const teachingareaList = data;
				const dataForm = this.dataForm;
				let ids = [];
				teachingareaList.map((item : IObject) => {
					ids.push(item.id);
				});
				this.dataForm = {
					ids: ids.join(";"),
					// teachingAreaId: ids.join(";"),
					...form,
					id: yearSemester.id,
					year: yearSemester.year,
					semester: yearSemester.semester
				};
				console.log(this.dataForm);
				baseService.get("/resource/yearsemesterteachingarea/generateArea", this.dataForm).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					console.log(res);
					if (res.data.importResult.length > 0) {
						this.errorVisible = true;
						this.errorList = res.data.importResult;
						return;
					}
					return this.$message.success("生成场地成功！");
					// return this.$message.success(`成功生成${res.data.total}条场地记录!`);
				});
				this.$nextTick(() => {
					this.reachingAreaSelectVisible = false;
					this.dataForm = {
						...dataForm
					};
				});
			},
			copyHandle(data : IObject) {
				console.log("data", data);
				this.copyId = data.id;
				this.copyVisible = true;
				this.$nextTick(() => {
					this.$refs.copyAreaRef.init();
				});
			},
			confirmCopy(data : any) {
				console.log("data--", data);
				baseService.get("/resource/yearsemesterteachingarea/copy", { ...data, id: this.copyId }).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					console.log(res);
					this.$message.success("复制成功");
					this.copyVisible = false;
					this.query();
				});
			},
			// 详情
			detailHandle(data : string) {
				const routeParams = {
					routeName: `resource-teachingarea__${data.id}`,
					title: `${data.year + data.semester} - 学年学期场地详情`,
					path: `/resource/yearsemesterteachingarea-detail`,
					query: {
						id: data.id,
						_mt: `${data.year + data.semester} - 学年学期场地详情`
					}
				};
				registerDynamicToRouterAndNext(routeParams);
			}
		}
	});
</script>

<style scoped lang="scss">
  .group-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0;
  }

  .group-item {
    width: 100%;
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .active {
    background-color: rgba(62, 142, 247, 0.2);
    color: #3E8EF7;
    border-radius: 5px;
  }
</style>
