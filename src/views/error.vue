<script lang="ts">
	import { IObject } from "@/types/interface";
	import { defineComponent } from "vue";
	import { useRoute, useRouter } from "vue-router";

	interface ITip {
		title : string;
		message : string;
	}

	export default defineComponent({
		setup() {
			const route = useRoute();
			const router = useRouter();
			const { to } = route.query;
			const tips : IObject = {
				404: {
					title: "ui.router.error.404.title",
					message: "ui.router.error.404.des"
				},
				error: {
					title: "ui.router.error.error.title",
					message: "ui.router.error.error.des"
				},
				401: {
					title: "ui.router.error.401.title",
					message: "ui.router.error.401.des"
				}
			};
			const tip : ITip = tips[to?.toString() ?? "error"];
			const onBack = () => {
				router.back();
			};
			const onToHome = () => {
				router.replace("/");
			};
			return { tip, onBack, onToHome };
		}
	});
</script>

<template>
	<div class="rr-error" style="width: 100%;height: 100%;">
		<el-result>
			<template v-slot:icon>
				<el-icon style="font-size: 64px; color: #f5222d">
					<warning />
				</el-icon>
			</template>
			<!-- <template v-slot:title>
				<span style="font-size: 48px; font-weight: 800">{{ $t(tip.title) }}</span>
				<p style="font-size: 36px">{{ $t(tip.message) }}</p>
			</template>
			<template v-slot:subTitle>
				<span style="font-size: 36px">{{ $t(tip.message) }}</span>
			</template> -->
			<template v-slot:title>
				<span style="font-size: 48px; font-weight: 800">{{ $t(tip.title) }}</span>
				<p style="font-size: 36px">{{ $t(tip.message) }}</p>
			</template>
			<template v-slot:extra>
				<el-space :size="0" style="display: flex;justify-content: space-around;align-items: center;">
					<el-button type="info" plain @click="onBack">
						{{ $t("ui.router.error.backBtn") }}
					</el-button>
					<el-button type="primary" @click="onToHome" style="margin-left: 25px;">
						{{ $t("ui.router.error.homeBtn") }}
					</el-button>
				</el-space>
			</template>
		</el-result>
	</div>
</template>