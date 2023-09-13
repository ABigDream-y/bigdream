<template>
	<el-select v-model="value" :filterable="filterable" :disabled="disabled" :size="size" @change="$emit('update:modelValue', $event)" :placeholder="placeholder" clearable>
		<el-option :label="data[dataLabel]" v-for="(data,index) in dataList" :key="index" :value="data[dataValue]">
			<span v-if="dataType == 'reserve'">{{data.startDate}} ~ {{data.endDate}}</span>
			<span v-else>{{ data[dataLabel] }}</span>
		</el-option>
	</el-select>
</template>
<script lang="ts">
	import baseService from "@/service/baseService";
	import { IObject } from '@/types/interface';
	import { reactive, computed, defineComponent, toRefs } from "vue";
	export default defineComponent({
		name: "RenSelectData",
		props: {
			dataUrl: String,
			dataType: String,
			modelValue: [Number, String],
			dictType: String,
			placeholder: String,
			selectLabel: String,
			selectValue: String,
			limit: {
				type: Number,
				default: 999999
			},
			order: String,
			orderField: String,
			dataForm:{
				type:Object,
				default:()=>{}
			},
			filterable:{
				type:Boolean,
				default:true
			},
			size:{
				type:String,
				default:"default"
			},
			disabled:{
				type:Boolean,
				default:false
			}
		},
		setup(props) {
			const state = reactive({
				pageLoading: true,
				value: "",
				dataList: [] as IObject[],
				dataValue: computed(() => `${props.selectValue}` || ""),
				dataLabel: computed(() => `${props.selectLabel}` || ""),
			})

			return { ...toRefs(state) };
		},
		watch: {
			dataList(val : string) {
				console.log('watch---dataUrl', val)

			},
			modelValue(val) {
				this.value = val ? val : ""
			},
			dataUrl(val : string) {
				if (val) {
					this.getDataList();
				}
			}
		},
		created() {
			if (this.modelValue) {
				this.value = this.modelValue;
			}
			console.log('created---dataUrl', this.dataUrl)
			if (this.dataUrl) {
				this.getDataList();
			}
		},
		// activated() {
		// 	console.log('activated---dataUrl', this.dataUrl)
		// 	if (this.dataUrl) {
		// 		this.getDataList();
		// 	}
		// },
		methods: {
			getDataList(dataUrl ?: string) {
				console.log('dataUrl---getDataList', dataUrl)
				if (!this.dataUrl) return;
				baseService.get(this.dataUrl, {
					page: 1,
					limit: this.limit,
					order: this.order || "",
					orderField: this.orderField || "",
					...this.dataForm
				}).then((res : IObject) => {
					console.log('地点------', res)
					if (res.code !== 0) {
						return;
						// return reject(new Error(res.msg));
					}

					this.dataList = res.data.list;
					console.log('地点-----dataList-', this.dataList)
					this.pageLoading = false
					// this.$forceUpdate();
				});
			},
			// getDataList(): Promise<any> {
			// 	return new Promise((resolve, reject) => {
			// 		baseService.get(this.dataUrl, {
			// 			page: 1,
			// 			limit: 999999
			// 		}).then((res : IObject) => {
			// 			console.log('地点------', res)
			// 			if (res.code !== 0) {
			// 				return reject(new Error(res.msg));
			// 			}
			// 			resolve(res.data.list);
			// 			// this.dataList = res.data.list;
			// 			// this.$forceUpdate();
			// 		});
			// 	});
			// },
		}
	});
</script>