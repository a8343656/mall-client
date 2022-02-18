<template lang="pug">

  div(class="mainwindow")

    div(class="description-div")
      el-descriptions(title="會員資料", :column="1" , label-class-name ="description-label", contentClassName="my-content" border)
          el-descriptions-item(label="姓名") {{userData.name}}
          el-descriptions-item(label="地址", ) {{userData.address}}
          el-descriptions-item(label="電話", ) {{userData.phone}}
          el-descriptions-item(label="帳號狀態", ) {{userData.isShopable?'正常':'無法購物'}}
    el-button(class="change-data-button" type="primary" @click="openChangeUserDataWindow") 更改資料
    el-button(class="change-data-button" type="primary" @click="openChangePwsWindow") 變更密碼


    el-dialog(:visible.sync="changePwsWindowVisiable", title="變更密碼", width="550px")
      el-form(:model="changePwsState", ref="changePwsRef", :rules="changePwsRules", label-position="top", label-width="90px")
        div
          h3 需含一個大寫、一個小寫、一個數字、一個特殊字元
          el-form-item(label="輸入新密碼", prop="newPws")
            el-input(class="input" v-model="changePwsState.newPws" show-password)

          el-form-item(label="再次輸入新密碼", prop="confirmPws")
            el-input(class="input" v-model="changePwsState.confirmPws" show-password)
      span(slot="footer" class="dialog-footer")
        el-button(type="primary", @click="changePwsOk()" :loading="saveBtnLoading") 保存
        el-button(@click="changePwsCancel()") 取消


    el-dialog(:visible.sync="changeUserDataVisiable", title="更改會員資料", width="550px")
      el-form(:model="userData", ref="changeUserDataRef", :rules="changeUserDataRules", label-position="top", label-width="90px")
        div(class="input")
          el-form-item(label="姓名", prop="name")
            el-input( class="input", v-model="userData.name")
          el-form-item(label="地址", prop="address")
            el-input(class="input", v-model="userData.address")
          el-form-item(label="電話", prop="phone")
            el-input(class="input", v-model="userData.phone")

      span(slot="footer" class="dialog-footer")
        el-button(type="primary", @click="changeUserDataOk()" :loading="saveBtnLoading") 保存
        el-button(@click="changeUserDataCancel()") 取消

</template>
<script>
import ElementUI from 'element-ui';
import userApi from '@/api/user';

export default {
  data() {
    const PwsValidator = (rule, value, callback) => {
      const pwsStrong = this.checkPwsStrong(value);

      if (value === '') {
        callback(new Error('請輸入新密碼'));
      } else if (pwsStrong < 4) {
        callback(new Error('密碼複雜度不足'));
      } else {
        callback();
      }
    };
    const confrimPwsValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('請輸入新密碼'));
      } else if (value !== this.changePwsState.newPws) {
        callback(new Error('兩次密碼不同'));
      } else {
        callback();
      }
    };
    const changePwsRules = {
      newPws: [{ required: true, whitespace: true, validator: PwsValidator }],
      confirmPws: [{ required: true, validator: confrimPwsValidator }],
    };
    const changeUserDataRules = {
      name: [{ required: true, whitespace: true, message: '姓名不得為空' }],
      address: [{ required: true, whitespace: true, message: '地址不得為空' }],
      phone: [{ required: true, whitespace: true, message: '電話不得為空' }],
    };
    return {
      userData: {
        name: '',
        address: '',
        phone: '',
        status: '',
      },
      changePwsWindowVisiable: false,
      changePwsRules,
      changePwsState: {
        confirmPws: '',
        newPws: '',
      },
      changeUserDataVisiable: false,
      changeUserDataRules,
      saveBtnLoading: false,
    };
  },
  created() {
    this.getUserData();
  },
  methods: {
    setLoading(status) {
      this.$store.dispatch('setLoading', status);
    },
    getUserData() {
      this.setLoading(true);
      const sendData = {
        id: sessionStorage.getItem('userId'),
      };
      userApi.getMemberData(sendData).then((res) => {
        const apiRes = res.data;

        if (apiRes.success) {
          const apiData = apiRes.data;
          this.userData = apiData[0];
        }
        setTimeout(() => {
          this.setLoading(false);
        }, 500);
      });
    },
    checkPwsStrong(pws) {
      let strongValue = 0;

      if (/\d/.test(pws)) strongValue += 1;
      if (/[a-z]/.test(pws)) strongValue += 1;
      if (/[A-Z]/.test(pws)) strongValue += 1;
      if (/[+*?^${}()|/@!%*&]/.test(pws)) strongValue += 1;

      return strongValue;
    },
    openChangePwsWindow() {
      this.changePwsWindowVisiable = true;
      this.$nextTick(() => {
        this.$refs.changePwsRef.resetFields();
      });
    },
    changePwsOk() {
      const sendData = {
        id: sessionStorage.getItem('userId'),
        password: this.changePwsState.newPws,
      };
      this.$refs.changePwsRef.validate(valid => {
        if (valid) {
          this.saveBtnLoading = true;
          userApi.changePassword(sendData).then((res) => {
            this.saveBtnLoading = false;
            const apiRes = res.data;

            if (apiRes.success) {
              this.$refs.changePwsRef.resetFields();
              this.changePwsWindowVisiable = false;
              this.getUserData();
              ElementUI.Notification.success({
                message: '修改成功',
              });
            }
          });
        }
      });
    },
    changePwsCancel() {
      this.$refs.changePwsRef.resetFields();
      this.changePwsWindowVisiable = false;
      this.getUserData();
    },

    openChangeUserDataWindow() {
      this.changeUserDataVisiable = true;
    },
    changeUserDataOk() {
      const sendData = {
        id: sessionStorage.getItem('userId'),
        name: this.userData.name,
        address: this.userData.address,
        phone: this.userData.phone,
      };

      this.$refs.changeUserDataRef.validate(valid => {
        if (valid) {
          this.saveBtnLoading = true;
          userApi.changeUserData(sendData).then((res) => {
            this.saveBtnLoading = false;
            const apiRes = res.data;

            if (apiRes.success) {
              this.changeUserDataVisiable = false;
              this.getUserData();
              ElementUI.Notification.success({
                message: '修改成功',
              });
            }
          });
        }
      });
    },
    changeUserDataCancel() {
      this.$refs.changeUserDataRef.resetFields();
      this.changeUserDataVisiable = false;
      this.getUserData();
    },
  },

};
</script>

<style lang="scss">
.mainwindow {
  height: '100vh';
  width: '100vh'
}
.context {
  margin: 0px auto;
}
.change-data-button {
  margin: 30px 0px 0px 0px
}
.input {
  width: 300px;
}
.description-div {
  width: 500px;
  ::v-deep .description-label {
    width: 10px;
  }
}

</style>
