<template>
	<div>
		<!-- <el-select></el-select> -->
		<!-- <el-input v-model="showDeptName" :placeholder="placeholder" @click="deptDialog">
			<template v-slot:append>
				<el-button icon="search" @click="deptDialog"></el-button>
			</template>
		</el-input> -->
		<!-- <el-dialog v-model="visibleDept" width="30%" :modal="false" :title="placeholder" :close-on-click-modal="false"
			:close-on-press-escape="false">
			<el-form size="small" :inline="true">
				<el-form-item :label="$t('keyword')">
					<el-input v-model="filterText" :input-style="{ width: '150px' }"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="default">{{ $t("query") }}</el-button>
				</el-form-item>
			</el-form>
			<el-tree class="filter-tree" :data="deptList" :default-expanded-keys="expandedKeys"
				:props="{ label: 'name', children: 'children' }" :expand-on-click-node="false"
				:filter-node-method="filterNode" :highlight-current="true" :node-key="nodekey" ref="tree"> </el-tree>
			<template v-slot:footer>
				<el-button type="default" @click="cancelHandle()">{{ $t("cancel") }}</el-button>
				<el-button v-if="query" type="info" @click="clearHandle()">{{ $t("clear") }}</el-button>
				<el-button type="primary" @click="commitHandle()">{{ $t("confirm") }}</el-button>
			</template>
		</el-dialog> -->
	</div>
</template>
<script lang="ts">
	import { defineComponent } from "vue";
	import { IObject } from "@/types/interface";
	import baseService from "@/service/baseService";
	export default defineComponent({
		name: "RenDeptSelete",
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
			deptName: String,
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
				this.showDeptName = val;
			}
		},
		methods: {
			deptDialog() {
				this.expandedKeys = [];
				this.visibleDept = true;
				this.getDeptList(this.modelValue);
			},
			filterNode(value : string, data : IObject) {
				if (!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			async getDeptList(id ?: string) {
				return baseService.get("/sys/dept/list", {
					pid: this.parentNumber
				}).then((res) => {
					if (res.code !== 0) {
						return this.$message.error(res.msg);
					}
					this.deptList = res.data;
					this.$nextTick(() => {
						if (id) {
							this.$refs.tree.setCurrentKey(id);
							this.expandedKeys = [id];
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
				const node = this.$refs.tree.getCurrentNode();
				if (!node) {
					this.$message.error(this.$t("dept.chooseerror"));
					return;
				}
				this.$emit("update:modelValue", node[this.nodekey]);
				this.$emit("update:deptName", node.name);
				this.showDeptName = node.name;
				this.visibleDept = false;
				this.deptList = [];
				this.filterText = "";
			}
		}
	});
</script>