<template>
  <div class="h-100">
    <Grid
      :style="{height: '100%'}"
      ref="grid"
      :data-items="getData"
      :resizable="true"
      :reorderable="true"
      @columnreorder="columnReorder"
      :filterable="true"
      :filter="filter"
      @filterchange="filterChange"
      :sortable="true"
      :sort="sort"
      @sortchange="sortChangeHandler"
      :columns="columns"
    >
      <grid-toolbar class="bg-danger">
        <div class="d-flex justify-content-between">
          <div>
            <div class="d-inline-block">
              <div class="input-group input-group-sm">
                <div class="input-group-prepend">
                  <span class="input-group-text">From</span>
                </div>
                <input v-model="from" type="date" class="form-control form-control-sm">
              </div>
            </div>
            <div class="d-inline-block">
              <div class="input-group input-group-sm">
                <div class="input-group-prepend">
                  <span class="input-group-text">To</span>
                </div>
                <input v-model="to" type="date" class="form-control form-control-sm">
              </div>
            </div>

            <button title="Ctrl+M" class="btn btn-dark btn-sm btn-sized" @click.stop="refreshData">
              <i class="fa fa-download"></i> Load
            </button>
            <button
              title="Ctrl+Enter"
              class="btn btn-dark btn-sm btn-sized"
              @click.stop="saveToDB"
            >
              <i class="fa fa-save"></i>
              Backup to DB
              <span class="badge badge-secondary">{{ waitingForSave }}</span>
            </button>
          </div>
          <div>
            <user-details name="User" :value="UserName"></user-details>
            <user-details name="Branch" :value="Company"></user-details>
          </div>
        </div>
      </grid-toolbar>
    </Grid>
    <loading v-if="loading"></loading>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import {
  filterBy,
  CompositeFilterDescriptor,
  orderBy
} from "@progress/kendo-data-query";
import { EventBus } from "../helpers/event-bus";
import PreventWindowClose from "../helpers/preventWindowClose";
import {
  ussdResponseCell,
  HasSignature
} from "../components/foreign-components.js";

export default {
  data: function() {
    return {
      loading: false,
      items: [],
      columns: [
        {
          field: "id",
          filterable: false,
          editable: false,
          title: "#",
          width: "80px"
        },
        { field: "number", width: "150px", title: "Sent From", editable: false },
        { field: "text", title: "Message", cell: ussdResponseCell },
        { field: "time", width: "300px", title: "Time" },
        { field: "database", title: "Database", cell: HasSignature, width: "100px", filterable: false }
      ],
      filter: null,
      sort: [],
      from: new Date().toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0]
    };
  },
  mounted() {
    this.loadItems(true);
    this.addKeyHandler();
  },
  computed: {
    getData() {
      return orderBy(filterBy(this.items, this.filter), this.sort);
    },
    ...mapState({
      UserName: state => state.auth.UserName,
      Company: state => state.auth.Company,
      sms: state => state.sms.sms
    }),
    waitingForSave() {
      let count = 0;
      this.items.forEach(item => {
        if (!item.database) count++;
      });
      PreventWindowClose(count);
      return count;
    }
  },
  methods: {
    ...mapActions({
      getSms: "sms/loadData",
      saveSms: "sms/saveData"
    }),
    refreshData() {
      this.loadItems();
    },
    loadItemsFromState() {
      this.items = this.sms.map(item => item);
      this.loading = false;
    },
    loadItems(offline = false) {
      this.loading = true;
      if (offline) {
        this.loadItemsFromState();
      } else {
        this.getSms({
          from: this.from,
          to: this.to
        })
          .then(resp => {
            this.loadItemsFromState();
          })
          .catch(err => {
            this.$toasted.global.my_app_error({
              message: "Erreur!!!"
            });
            this.loading = false;
          });
      }
    },
    saveToDB() {
      this.loading = true;
      this.saveSms().then(resp => {
        this.refreshData()
        this.loading = false;
      })
      .catch(err => {
        console.log(err)
        this.loading = false;
      })
    },
    filterChange: function(ev) {
      //   let filters = ev.filter.filters.map(d => {
      //     if (d.field === "time") {
      //       return {
      //         ...d,
      //         value: new Date(d.value).toISOString().split("T")[0]
      //       };
      //     } else {
      //       return d;
      //     }
      //   });

      //   ev.filter.filters = filters;
      this.filter = ev.filter;
    },
    columnReorder: function(options) {
      this.columns = options.columns;
    },
    sortChangeHandler: function(e) {
      this.sort = e.sort;
    },
    addKeyHandler(e) {
      window.addEventListener("keydown", this.keyHandler);
    },
    removeKeyHandler() {
      window.removeEventListener("keydown", this.keyHandler);
    },
    keyHandler(e) {
      const key = e.which || e.keyCode;
      if (key === 13 && e.ctrlKey) this.saveToDB();
      if (key === 77 && e.ctrlKey) this.refreshData();
    }
  },
  beforeDestroy() {
    this.removeKeyHandler();
  },
  beforeRouteLeave(to, from, next) {
    if(this.waitingForSave) {
      let message = {
        title: 'Do you want to leave ?',
        body: 'You have to backup sms before leaving!!!'
      };
      let options = {
          okText: 'Save changes',
          cancelText: 'Leave',
      };
      const vm = this
      this.$dialog
        .confirm(message, options)
        .then(function() {
          console.log('ok')
          vm.saveToDB()
        })
        .catch(function() {
          console.log('cancel')
          next();
        });
    } else {
      next();
    }
  }
};
</script>

<style>
</style>
