<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" :label="$t('dept.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('dept.name')"></el-input>
      </el-form-item>
      <el-form-item prop="number" label="代码">
        <el-input v-model.number="dataForm.number" placeholder="代码"></el-input>
        <p style="margin-top: 5px; margin-bottom: 0">注意：除第一级外，代码必须以上级代码为前缀</p>
      </el-form-item>
      <el-form-item prop="pnumber" label="上级代码" v-if="dataForm.pid != '0'">
        <el-input readonly v-model.number="dataForm.pnumber" placeholder="上级学院代码"></el-input>
      </el-form-item>
      <el-form-item prop="parentName" label="上一级" class="dept-list">
        <el-popover v-model:visible="deptListVisible" :width="400" ref="deptListPopover" placement="bottom-start" trigger="click" popper-class="popover-pop">
          <template v-slot:reference>
            <el-input v-model="dataForm.parentName" :readonly="true" :placeholder="$t('dept.parentName')" @click="deptListVisible = true">
              <template v-slot:suffix>
                <el-icon v-if="user.superAdmin === 1 && dataForm.pid !== '0'" @click.stop="deptListTreeSetDefaultHandle()" class="el-input__icon">
                  <circle-close />
                </el-icon>
              </template>
            </el-input>
          </template>
          <div class="popover-pop-body">
            <el-tree :data="deptList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="deptListTree" :highlight-current="true" :expand-on-click-node="false" accordion @current-change="deptListTreeCurrentChangeHandle"> </el-tree>
          </div>
          <el-row justify="end">
            <el-button size="small" type="text" @click="deptListVisible = false" style="margin-right: 15px"> {{ $t("close") }}</el-button>
          </el-row>
        </el-popover>
      </el-form-item>
      <el-form-item prop="sort" :label="$t('dept.sort')">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" :label="$t('dept.sort')"> </el-input-number>
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
import { useStore } from "vuex";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    const store = useStore();
    const state = reactive({
      visible: false,
      deptList: [],
      deptListVisible: false,
      dataForm: {
        id: "",
        name: "",
        number: "",
        pnumber: "",
        pid: "",
        parentName: "",
        sort: 0
      }
    });
    return {
      user: store.state.user,
      ...toRefs(state)
    };
  },
  computed: {
    dataRule() {
      return {
        name: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        number: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "blur"
          }
        ],
        parentName: [
          {
            required: true,
            message: this.$t("validate.required"),
            trigger: "change"
          }
        ]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        this.getDeptList().then(() => {
          if (this.dataForm.id) {
            this.getInfo();
          } else if (this.$store.state.user.superAdmin === 1 || this.$store.state.user.superTenant === 1) {
            this.deptListTreeSetDefaultHandle();
          }
        });
      });
    },
    // 获取部门列表
    getDeptList() {
      return baseService.get("/manage/institute/list").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.deptList = res.data;
      });
    },
    // 获取信息
    getInfo() {
      baseService.get(`/manage/institute/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };
        if (this.dataForm.pid === "0") {
          return this.deptListTreeSetDefaultHandle();
        }
        this.$refs.deptListTree.setCurrentKey(this.dataForm.pid);
      });
    },
    // 上级部门树, 设置默认值
    deptListTreeSetDefaultHandle() {
      this.dataForm.pid = "0";
      this.dataForm.parentName = "第一级";
      this.dataForm.pnumber = "0";
    },
    // 上级部门树, 选中
    deptListTreeCurrentChangeHandle(data: IObject) {
      this.dataForm.pid = data.id;
      this.dataForm.parentName = data.name;
      this.dataForm.pnumber = data.number;
      this.deptListVisible = false;
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        if (this.dataForm.pid != 0) {
          let number = this.dataForm.number.toString();
          let pNumber = this.dataForm.pnumber.toString();
          let checkNum = number.substr(0, pNumber.length);
          console.log("checkNum", checkNum);
          if (number == pNumber) {
            return this.$message.error("代码不能与上级一样，请重新填写!");
          }
          if (checkNum != pNumber) {
            return this.$message.error("代码必须以上级代码为前缀，请重新填写!");
          }
        }

        (!this.dataForm.id ? baseService.post : baseService.put)("/manage/institute", this.dataForm).then((res) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg);
          }
          this.$message({
            message: this.$t("prompt.success"),
            type: "success",
            duration: 500,
            onClose: () => {
              this.visible = false;
              this.$emit("refreshDataList");
            }
          });
        });
      });
    }
  }
});
</script>

<style lang="less">
.mod-sys__dept {
  .dept-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
}
</style>
