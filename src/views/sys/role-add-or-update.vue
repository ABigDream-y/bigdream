<template>
  <el-dialog v-model="visible" :title="!dataForm.id ? $t('add') : $t('update')" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" @keyup.enter="dataFormSubmitHandle()" label-width="120px">
      <el-form-item prop="name" :label="$t('role.name')">
        <el-input v-model="dataForm.name" :placeholder="$t('role.name')"></el-input>
      </el-form-item>
      <el-form-item prop="remark" :label="$t('role.remark')">
        <el-input v-model="dataForm.remark" :placeholder="$t('role.remark')"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item prop="" label="">
            <el-checkbox size="small" v-model="caseCheckAll" @change="handleCheckAllChange">全选</el-checkbox>
          </el-form-item>
          <el-form-item size="small" :label="$t('role.menuList')">
            <el-tree :data="menuList" :props="{ label: 'name', children: 'children' }" node-key="id" @check-change="handleCheckChange" ref="menuListTree" accordion show-checkbox> </el-tree>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item size="small" :label="$t('role.deptList')">
            <el-tree :data="deptList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="deptListTree" accordion show-checkbox> </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">{{ $t("confirm") }}</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import baseService from "@/service/baseService";
import { IObject } from "@/types/interface";
import { useDebounce } from "@/utils/utils";
export default defineComponent({
  setup() {
    return reactive({
      visible: false,
      menuList: [],
      deptList: [],
      dataForm: {
        id: "",
        name: "",
        menuIdList: [] as IObject[],
        deptIdList: [],
        remark: ""
      },
      caseCheckAll: false,
      menuListAllId: []
    });
  },
  computed: {
    dataRule() {
      return {
        name: [{ required: true, message: this.$t("validate.required"), trigger: "blur" }]
      };
    }
  },
  created() {
    this.dataFormSubmitHandle = useDebounce(this.dataFormSubmitHandle);
  },
  methods: {
    init() {
      this.visible = true;
      this.caseCheckAll = false;
      this.$nextTick(() => {
        this.$refs["dataFormRef"].resetFields();
        this.$refs.menuListTree.setCheckedKeys([]);
        this.$refs.deptListTree.setCheckedKeys([]);
        Promise.all([this.getMenuList(), this.getDeptList()]).then(() => {
          if (this.dataForm.id) {
            this.getInfo();
          }
        });
      });
    },
    // 获取菜单列表
    getMenuList() {
      return baseService.get("/sys/menu/select").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.menuList = res.data;
      });
    },
    // 获取部门列表
    getDeptList() {
      return baseService.get("/sys/dept/list").then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.deptList = res.data;
      });
    },
    // 获取信息
    getInfo() {
      baseService.get(`/sys/role/${this.dataForm.id}`).then((res) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg);
        }
        this.dataForm = {
          ...this.dataForm,
          ...res.data
        };

        this.dataForm.menuIdList.forEach((item: IObject) => this.$refs.menuListTree.setChecked(item, true));
        this.$refs.deptListTree.setCheckedKeys(this.dataForm.deptIdList);

        let menuListId = this.mapMenuList(this.menuList);
        let menuIdList = [...this.$refs.menuListTree.getCheckedKeys()];
        this.caseCheckAll = menuListId.every((val) => menuIdList.includes(val));
      });
    },
    // 全选
    handleCheckAllChange() {
      if (this.caseCheckAll) {
        // 全选
        console.log(this.caseCheckAll);
        let menuListId = this.mapMenuList(this.menuList);
        this.$nextTick(() => {
          this.$refs.menuListTree.setCheckedKeys(menuListId);
        });
      } else {
        // 取消全选
        this.$refs.menuListTree.setCheckedKeys([]);
      }
    },
    // 遍历
    mapMenuList(arr: any) {
      let menuListId = [];
      arr.map((item) => {
        menuListId.push(item.id);
        // if (item.children) this.mapMenuList(item.children);
      });
      return menuListId;
    },
    handleCheckChange(data: any, checked: boolean) {
      if (!checked) {
        this.caseCheckAll = false;
      } else {
        let menuIdList = [...this.$refs.menuListTree.getCheckedKeys()];
        let menuListId = this.mapMenuList(this.menuList);
        this.caseCheckAll = menuListId.every((val) => menuIdList.includes(val));
      }
    },
    // 表单提交
    dataFormSubmitHandle() {
      this.$refs["dataFormRef"].validate((valid: boolean) => {
        if (!valid) {
          return false;
        }
        this.dataForm.menuIdList = [...this.$refs.menuListTree.getHalfCheckedKeys(), ...this.$refs.menuListTree.getCheckedKeys()];
        this.dataForm.deptIdList = this.$refs.deptListTree.getCheckedKeys();
        (!this.dataForm.id ? baseService.post : baseService.put)("/sys/role", this.dataForm).then((res) => {
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
