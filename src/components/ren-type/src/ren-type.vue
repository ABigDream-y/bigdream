<template>
	<el-select ref="renType" v-model="value" @change="$emit('update:modelValue', $event)" :placeholder="placeholder" clearable>
		<el-option v-for="(data,index) in dataList" :key="index" :value="data[optionValue]" :label="data[optionLabel]">
		</el-option>
	</el-select>
</template>
<script lang="ts">
	import {
		computed,
		defineComponent
	} from "vue";
	import baseService from "@/service/baseService";
	export default defineComponent({
		name: "RenType",
		props: {
			modelValue: [Number, String],
			dictType: String,
			placeholder: String,
			optionLabel: {
				type: String,
				default: 'name'
			},
			optionValue: {
				type: String,
				default: 'id'
			},
			getUrl: {
				type: String,
				default: ''
			},
			list:Array
		},
		setup(props) {
			return {
				value: computed(() => `${props.modelValue}`),
				dataList: computed(() => `${props.list}`),
			};
		},
		// watch: {
		// 	getUrl(val) {
		// 		/* if (val) {
		// 			this.getDataList(val);
		// 		} */
		// 	}
		// },
		created() {
			console.log('getUrl', this.getUrl)
			// if (this.getUrl) {
			// 	this.getDataList(this.getUrl);
			// }
		},
		activated() {
			console.log('activated', this.getUrl)
			// if (this.getUrl) {
			// 	this.getDataList(this.getUrl);
			// }
		},
		methods: {
			// getDeptList(id ? : string) {
			// 	return baseService.get("/sys/dept/list").then((res) => {
			// 		if (res.code !== 0) {
			// 			return this.$message.error(res.msg);
			// 		}
			// 		this.deptList = res.data;
			//  	this.$nextTick(() => {
			// 			// if (id) {
			// 			// 	this.$refs.tree.setCurrentKey(id);
			// 			// 	this.expandedKeys = [id];
			// 			// }
			// 		});
			// 	});
			// },
			getDataList() {
				if(!this.getUrl) return;
				baseService.get(this.getUrl, {
					params: {
						page: 1,
						limit: 9999999999
					}
				}).then((res) => {
					console.log('分类列表', res)
					if (res.code !== 0) {
						this.dataList = [];
						return;
					}
					this.dataList = res.data.list
					this.dataList = [...this.dataList];
					
					console.log('dataList', this.dataList, this.optionLabel)
					// console.log('dataList', this.$refs.renType)
					this.$forceUpdate()
					this.$emit('refreshDataList', this.dataList)
				});
			}
		}
	});
</script>
