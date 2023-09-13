<template>
  <div class="edit-card--file">
  <div class="aui-card-header">
    <el-button @click="goBack()"><el-icon><ArrowLeft /></el-icon>返回</el-button>
    <el-button type="primary" :loading="loading" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
  </div>
  <div class="edit-card__body">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item label="培养方案" prop="caseId">
        <el-input v-model="dataForm.caseId" placeholder="培养方案"></el-input>
      </el-form-item>
      <el-form-item label="课组" prop="groupId">
        <el-input v-model="dataForm.groupId" placeholder="课组"></el-input>
      </el-form-item>
      <el-form-item label="课组名" prop="groupName">
        <el-input v-model="dataForm.groupName" placeholder="课组名"></el-input>
      </el-form-item>
      <el-form-item label="最少修读学分" prop="scoreMin">
        <el-input v-model="dataForm.scoreMin" placeholder="最少修读学分"></el-input>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { findIndex } from "lodash";
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
	const store = useStore();
    return reactive({
		store,
		loading:false,
      visible: false,
      dataForm: {
        id: "",
        caseId: "",
        groupId: "",
        groupName: "",
        scoreMin: "",
        creator: "",
        createDate: "",
        updater: "",
        updateDate: "",
      }
    });
  },
  computed: {
    dataRule() {
      return {
        caseId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
        groupId: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }],
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
activated() {
	this.init();
},
  methods: {
    init() {
	  this.loading = false;
	  let id = this.$route.query.id || '';
	  if(id && id != '0') {
	  	this.dataForm.id = id;
	  }
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        if (this.dataForm.id) {
          this.getInfo();
        }
      });
    },
    // 获取信息
    getInfo() {
      baseService.get("/programme/groupcourse/" + this.dataForm.id).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = res.data;
      });
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
		this.loading = true;
        (!this.dataForm.id ? baseService.post : baseService.put)("/programme/groupcourse", this.dataForm).then((res) => {
          if (res.code !== 0) {
			this.loading = false;
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.loading = false;
              this.goBack()
            }
          });
        });
      });
    },
	goBack() {
		const activeTabName = this.store.state.activeTabName;
		const tabs = this.store.state.tabs;
		let index = findIndex(tabs, (x) => x.value === activeTabName);
		this.store.state.tabs.splice(index, 1);
		this.store.state.activeTabName = this.store.state.tabs[this.store.state.tabs.length - 1].value;
		this.updateClosedTabs([...this.store.state.closedTabs, this.store.state.activeTabName], false);
		this.$router.push(this.store.state.activeTabName);
	},
	updateClosedTabs(closedTabs: any[], isTransform = true) {
		if (isTransform) {
			closedTabs = closedTabs.map((x) => x.value);
		}
		this.store.dispatch({
			type: "updateState",
			payload: {
				closedTabs
			}
		});
	}
  }
});
</script>