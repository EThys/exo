<script>
import { SidebarMenu } from "vue-sidebar-menu";
import { mapState, mapActions, mapGetters } from "vuex";
import Vue from "vue";
import VueSocketIO from "vue-socket.io";
export default {
  components: {
    SidebarMenu
  },
  data() {
    return {
      showTips: false,
      collapsed: true,
      menuConstructor: [
        {
          header: true,
          title: "Main Navigation"
        },
        {
          title: "Transactions",
          icon: "fa fa-money-bill-alt",
          child: [
            {
              href: "/transactions/usd",
              title: "USD"
            },
            {
              href: "/transactions/fc",
              title: "FC"
            }
          ]
        },
        {
          title: "SMS",
          icon: "fa fa-envelope",
          href: "/sms",
          simpleAdmin: true
        },
        {
          title: "Phone Type",
          icon: "fa fa-phone",
          href: "/phone_types",
          superAdmin: true
        },
        {
          href: "/users",
          title: "Utilisateurs",
          icon: "fa fa-user",
          superAdmin: true
        },
        {
          title: "Charger des données",
          icon: "fa fa-download",
          action: "fetch"
        },
        {
          title: "Refresh Application",
          icon: "fa fa-sync-alt",
          action: "refresh"
        },
        {
          title: "Deconnexion",
          icon: "fa fa-sign-out-alt",
          action: "logout"
        },
        {
          title: "Aide",
          icon: "fa fa-question-circle",
          action: "showTips"
        }
      ],
      showConfig: false,
      currencyConfig: "usd",
      port: localStorage.getItem("port")
    };
  },
  created() {
    // if (this.admin > 0) {
    //   Vue.use(
    //     new VueSocketIO({
    //       debug: process.env.NODE_ENV !== "production",
    //       connection: "http://localhost:5500"
        
    //     })
    //   );
    // }
  },
  computed: {
    ...mapState({
      admin: state => state.auth.Admin,
      Company: state => state.auth.Company,
      UserName: state => state.auth.UserName,
      dataStatus: state => state.data.status
    }),
    menu() {
      return this.menuConstructor.filter(item => {
        if (item.superAdmin) {
          return this.isSuperAdmin ? true : false;
        }
        if (item.simpleAdmin) {
          return this.isSuperAdmin || this.isSimpleAdmin ? true : false;
        }
        return true;
      });
    },
    ...mapGetters({
      isSimpleAdmin: "auth/isSimpleAdmin",
      isSuperAdmin: "auth/isSuperAdmin"
    })
  },
  watch: {
    dataStatus(data) {
      if (data === "success") {
      }
      if (data === "error") {
        //
      }
      if (data === "loading") {
        this.$toasted.show("&nbsp; Chargement...", {
          iconPack: "custom-class",
          icon: "fa fa-spinner fa-spin",
          position: "bottom-center"
        });
      }
    }
  },
  mounted() {
    this.menuConstructor[0].title = `${this.Company} (${this.UserName})`;
    this.addKeyHandler();
    this.fetchData();
  },
  sockets: {
    connect: function() {
      console.log("socket connected");

      if (this.port) {
        this.$socket.emit("port", { port: this.port });
      }
    },
    newSms: function(data) {
      let d = data.data;
      window.writeData("sms", {
        ...d,
        read: false,
        database: false
      });

      this.$toasted.info(`New message from ${d.number}`, {
        action: {
          text: "Close",
          onClick: (e, toastObject) => {
            toastObject.goAway(0);
          }
        },
        duration: 5000,
        position: "bottom-center"
      });
    },
    portSet: function(data) {
      if (data.status == "ERROR") {
        this.port = false;
      }
    }
  },
  methods: {
    ...mapActions({
      loadData: "data/loadData"
    }),
    onCollapse(collapsed) {
      this.collapsed = collapsed;
    },
    onItemClick(event, item) {
      switch (item.action) {
        case "logout":
          if (confirm("Voulez-vous vous deconnecter ?")) {
            this.$store.dispatch("auth/logout");
          }
          break;

        case "showTips":
          this.showTips = !this.showTips;
          break;

        case "refresh":
          location.reload();
          break;

        case "fetch":
          this.fetchData();
          break;

        default:
          break;
      }
    },
    addKeyHandler(e) {
      window.addEventListener("keydown", this.keyHandler);
    },
    removeKeyHandler() {
      window.removeEventListener("keydown", this.keyHandler);
    },
    keyHandler(e) {
      /**
            38 — up
            40 — down
            9 — tab
            13 — enter
            */
      const key = e.which || e.keyCode;
      if (key === 81 && e.ctrlKey) {
        this.collapsed = !this.collapsed;
        // this.onCollapse(this.collapsed)
      }
      if (key === 73 && e.ctrlKey) {
        this.showTips = !this.showTips;
      }
    },
    onDragged({
      el,
      deltaX,
      deltaY,
      first,
      last
    }) {
      if (first) {
        this.isDragging = true;
        return;
      }
      if (last) {
        this.isDragging = false;
        return;
      }
      var l = +window.getComputedStyle(el)["left"].slice(0, -2) || 0;
      var t = +window.getComputedStyle(el)["top"].slice(0, -2) || 0;
      el.style.left = l + deltaX + "px";
      el.style.top = t + deltaY + "px";
    },
    onDraggedConfigUssd({
      el,
      deltaX,
      deltaY,
      first,
      last
    }) {
      if (first) {
        this.isDragging = true;
        return;
      }
      if (last) {
        this.isDragging = false;
        return;
      }
      var l = +window.getComputedStyle(el)["left"].slice(0, -2) || 0;
      var t = +window.getComputedStyle(el)["top"].slice(0, -2) || 0;
      el.style.left = l + deltaX + "px";
      el.style.top = t + deltaY + "px";
    },
    fetchData() {
      this.loadData()
        .then(resp => {
          this.$toasted.clear();
        })
        .catch(err => {
          this.errorDisplay(err.response);
        });
    },
    errorDisplay(data) {
      if (!data) {
        this.$toasted.global.my_app_error({
          message: "Erreur réseau, veuillez vérifier votre connexion internet!"
        });
      } else {
        this.$toasted.global.my_app_error({
          message: `${data.data.message} (status: ${data.status})`
        });
      }
    },
    ussdConfig(currency) {
      this.currencyConfig = currency;
      this.showConfig = true;
    }
  },
  destroyed() {
    this.removeKeyHandler();
  }
};
</script>



<template>
  <div class="my-layout" :class="{menuclosed: collapsed}" >
    <sidebar-menu
      :menu="menu"
      :collapsed="collapsed"
      @collapse="onCollapse"
      @itemClick="onItemClick"
      width="300px"
    />
    <div class="tips" v-dragged="onDragged" v-if="showTips">
      <div class="card bg-danger mb-3 w-100 h-100" style="max-width: 18rem;">
        <div class="card-header text-white">
          <i class="fa fa-question-circle"></i> Aide (App Version 1.0)
        </div>
        <div class="card-body">
          <table class="table table-striped table-borderless table-hover table-sm text-white">
            <tbody>
              <tr>
                <td>Save</td>
                <td>Ctrl + Enter</td>
              </tr>
              <tr>
                <td>Ajouter</td>
                <td>Ctrl + Space</td>
              </tr>
              <tr>
                <td>Menu</td>
                <td>Ctrl + Q</td>
              </tr>
              <tr>
                <td>Aide</td>
                <td>Ctrl + I</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer text-right">
          <button @click="showTips = false" class="btn btn-default btn-sm text-light">Fermer</button>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <!-- <div class="config" v-dragged="onDraggedConfigUssd" v-if="showConfig">
      <ussd-config :currency="currencyConfig"></ussd-config>
      <div class="text-right">
        <button @click="showConfig = false" class="btn btn-sm btn-warning mr-3">Fermer</button>
      </div>
    </div> -->

    <!-- <div
      class="port-warning p-3 card bg-danger text-white"
      v-if="!port && isSimpleAdmin"
    >Port is not set or Invalid, please set the port and refresh the app </div> -->
  </div>
</template>

<style scoped>
.my-layout {
  width: 100%;
  height: 100%;
  padding-left: 300px;
  transition: padding 0.3s ease;
}
.menuclosed {
  padding-left: 50px;
}

.v-sidebar-menu {
  z-index: 1;
}

.tips {
  width: 300px;
  height: 300px;
  left: 50%;
  top: 50%;
  margin-left: -150px;
  margin-top: -150px;
  position: absolute;
  z-index: 2;
}

.config {
  width: 400px;
  min-height: 300px;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -150px;
  position: absolute;
  z-index: 2;
}

.port-warning {
  position: absolute;
  right: 30px;
  bottom: 10px;
  z-index: 9999;
}
</style>
