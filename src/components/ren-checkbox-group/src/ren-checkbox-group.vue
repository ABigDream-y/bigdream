<template>
	<el-checkbox-group v-model="newValue" @change="updateChange">
		<el-checkbox :label="data.dictValue" v-for="data in dataList" :key="data.dictValue"
			:name="data.dictLabel">{{ data.dictLabel }}</el-checkbox>
	</el-checkbox-group>
</template>
<script lang="ts">
	import { getDictDataList } from "@/utils/utils";
	import { computed, defineComponent } from "vue";
	import { useStore } from "vuex";
	export default defineComponent({
		name: "RenCheckboxGroup",
		props: {
			modelValue: {
				type: String,
				default: ''
			},
			dictType: String,
			size: String
		},
		setup(props) {
			const store = useStore();
			return {
				newValue: [],
				// value: computed(() => `${props.modelValue ? props.modelValue.split(',') : []}`),
				dataList: getDictDataList(store.state.dicts, props.dictType)
			};
		},
		watch: {
			modelValue(val) {
				console.log('val---', val)
				this.newValue = val ? val.split(',') : [];
				this.$forceUpdate()
			}
		},
		activated() {
			console.log('value', this.modelValue);
			this.newValue = this.modelValue ? this.modelValue.split(',') : [];
			console.log('newValue',this.newValue)
			this.$forceUpdate()
		},
		methods: {
			updateChange(val : any) {
				console.log('val', val)
				this.newValue = val;
				let value = (val && val.length != 0) ? val.join(','):"";
				this.$emit('update:modelValue', value);
				this.$forceUpdate()
			}
		}
	});
</script>