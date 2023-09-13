<template>
	<div>
		<el-input v-model="showDeptName" :placeholder="placeholder" @click="deptDialog">
			<template v-slot:append>
				<el-button icon="search" @click="deptDialog"></el-button>
			</template>
		</el-input>
		<el-dialog v-model="visibleDept" width="50%" :modal="false" :title="placeholder" :close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form size="small" :inline="true" style="margin-bottom: 15px;">
				<el-form-item :label="$t('keyword')">
					<el-input v-model="filterText" :input-style="{ width: '150px' }"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="default">{{ $t("query") }}</el-button>
				</el-form-item>
			</el-form>

			<!-- <el-tree class="filter-tree" ref="tree" :data="deptList" :filter-node-method="filterNode" show-checkbox default-expand-all node-key="id" highlight-current
				:props="{ label: 'name', children: 'children' }">
			</el-tree> -->

			<el-tree class="filter-tree" :data="deptList" :default-expanded-keys="expandedKeys"
				:props="{ label: 'name', children: 'children' }" :expand-on-click-node="false"
				:filter-node-method="filterNode" :highlight-current="true" :node-key="nodekey" ref="tree"
				show-checkbox></el-tree>

			<template v-slot:footer>
				<el-button type="default" @click="cancelHandle()">{{ $t("cancel") }}</el-button>
				<el-button v-if="query" type="info" @click="clearHandle()">{{ $t("clear") }}</el-button>
				<el-button type="primary" @click="commitHandle()">{{ $t("confirm") }}</el-button>
			</template>
		</el-dialog>
	</div>
</template>
<script lang="ts">
	import { defineComponent } from "vue";
	import { IObject } from "@/types/interface";
	import baseService from "@/service/baseService";
	export default defineComponent({
		name: "RenDeptTreeMulti",
		data() {
			return {
				filterText: "",
				visibleDept: false,
				deptList: [],
				showDeptName: "",
				expandedKeys: [] as string[],
				defaultProps: {
					children: "children",
					label: "label"
				}
			};
		},
		props: {
			modelValue: String,
			deptName: {
				type: String,
				default: ''
			},
			query: Boolean,
			placeholder: String,
			//
			nodekey: {
				type: String,
				default: 'id'
			},
			parentNumber: {
				type: String,
				default: ''
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			},
			deptName(val) {
				console.log('deptName=====',val)
				this.showDeptName = val;
			}
		},
		created() {
			this.showDeptName = this.deptName || "";
		},
		methods: {
			deptDialog() {
				console.log('deptName',this.deptName)
				// this.showDeptName = "";
				this.visibleDept = false;
				this.deptList = [];
				this.filterText = "";
				
				this.expandedKeys = [];
				this.visibleDept = true;
				
				this.$nextTick(()=>{
					this.$refs.tree.setCheckedNodes(this.expandedKeys);
				})
				
				this.getDeptList(this.modelValue);
			},
			filterNode(value : string, data : IObject) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			async getDeptList(id ?: string) {
				return baseService.get("/sys/dept/list", {
					pid: this.parentNumber
				}).then((res : IObject) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.deptList = res.data;
					this.$nextTick(() => {
						if (id) {
							let arr = id.split(",")
							let valueArr = arr.map((item : string) => {
								let newItem = {};
								newItem[this.nodekey] = item;
								return newItem;
							})
							this.$refs.tree.setCheckedNodes(valueArr);
							this.expandedKeys = arr;
						}
					});
				});
			},
			cancelHandle() {
				this.visibleDept = false;
				this.deptList = [];
				this.filterText = "";
			},
			clearHandle() {
				this.$emit("update:modelValue", "");
				this.$emit("update:deptName", "");
				this.showDeptName = "";
				this.visibleDept = false;
				this.deptList = [];
				this.filterText = "";
			},
			commitHandle() {
				const node = this.$refs.tree.getCheckedNodes();
				console.log('node=====', node);
				if (!node) {
					this.$message.error(this.$t("dept.chooseerror"));
					return;
				}

				let deptIds = node.map((item : IObject) => {
					return item[this.nodekey]
				})

				let deptNames = node.map((item : IObject) => {
					return item.name
				})
				console.log('deptNames',deptNames)
				this.$emit("update:modelValue", deptIds.join(","));
				this.$emit("update:deptName", deptNames.join(","));
				this.showDeptName = deptNames.join(",");
				this.visibleDept = false;
				this.deptList = [];
				this.filterText = "";
			}
		}
	});
</script>