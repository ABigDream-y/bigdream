<template>
	<el-select :size="size ? size:'default'" v-model="value" :filterable="filterable" :disabled="disabled" @change="$emit('update:modelValue', $event)" :placeholder="placeholder" clearable>
		<el-option :label="data.dictLabel" v-for="data in dataList" :key="data.dictValue" :value="data.dictValue">
			{{ data.dictLabel }}</el-option>
	</el-select>
</template>
<script lang="ts">
	import {
		computed,
		defineComponent
	} from "vue";
	import {
		getDictDataList
	} from "@/utils/utils";
	import {
		useStore
	} from "vuex";
	export default defineComponent({
		name: "RenSelect",
		props: {
			modelValue: [Number, String],
			dictType: String,
			placeholder: String,
			filterable:{
				type:Boolean,
				default:false
			},
			disabled:{
				type:Boolean,
				default:false
			},
			size:String
		},
		setup(props) {
			const store = useStore();
			return {
				value: computed(() => `${props.modelValue}`),
				dataList: getDictDataList(store.state.dicts, props.dictType)
			};
		}
	});
</script>
