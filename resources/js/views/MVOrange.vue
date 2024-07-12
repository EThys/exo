<template>
  <div class="h-100">
    <Grid
      :style="{height: '100%'}"
      ref="grid"
      :data-items="getData"
      :edit-field="'inEdit'"
      @rowclick="rowClick"
      @itemchange="itemChange"
      @remove="remove"
      :resizable="true"
      :reorderable="true"
      @columnreorder="columnReorder"
      :filterable="enableFilter"
      :filter="filter"
      @filterchange="filterChange"
      :sortable="true"
      :sort="sort"
      @sortchange="sortChangeHandler"
      :columns="columns"
      :selected-field="selectedField"
      @selectionchange="onSelectionChange"
      @headerselectionchange="onHeaderSelectionChange"
    >
      <grid-toolbar :class="toolbarBg">
        <div>
          <div @click="closeEdit" class="d-flex justify-content-between">
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
            </div>
            <div>
              <user-details name="User" :value="UserName"></user-details>
              <user-details name="Branch" :value="Company"></user-details>
            </div>
          </div>

          <div @click="closeEdit" class="d-flex justify-content-between">
            <div>
              <button title="Ctrl+Space" class="btn btn-dark btn-sm btn-sized" @click.stop="addRecord">
                <i class="fa fa-user-plus"></i> Ajouter
              </button>
              <button title="Ctrl+Enter" class="btn btn-dark btn-sm btn-sized" @click.stop="saveChanges">
                <i class="fa fa-save"></i>
                Save
                <span class="badge badge-secondary">{{ waitingForSave }}</span>
              </button>
              <button title="Ctrl+B" class="btn btn-dark btn-sm btn-sized" @click.stop="cancelChanges">
                <i class="fa fa-undo"></i> Annuler
              </button>
              <button title="Filter" class="btn btn-dark btn-sm btn-sized" @click.stop="enableFilter = !enableFilter">
                <i class="fa fa-filter"></i> Filter
              </button>
              <button
                @click.stop="sendBatch"
                class="btn btn-info btn-sm"
                v-if="selectedCount > 0"
              >Send to {{ selectedCount }} Seleted</button>
            </div>
            <div>
              <button @click.stop="exportExcel" class="btn btn-dark btn-sm btn-sized">
                <i class="fa fa-file-excel"></i> Excel
              </button>
              <div class="d-inline-block">
                <div class="input-group input-group-sm mb-3">
                  <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">Total</span>
                  </div>
                  <input type="text" class="form-control" disabled :value="new Intl.NumberFormat('en-US').format(total)" style="width:130px;">
                  <!-- <div class="input-group-append">
                    <span class="input-group-text">{{ $route.params.currency.toUpperCase() }}</span>
                  </div> -->
                </div>
              </div>
              <!-- <downloadExcel
                class="d-inline-block"
                :data="mvOranges"
                :fields="json_fields"
                name="mvOranges.xls"
              >
                <button class="btn btn-dark btn-sm">
                  <i class="fa fa-file-excel"></i> Excel 2003
                </button>
              </downloadExcel>-->
            </div>
          </div>
        </div>
      </grid-toolbar>
      <template v-slot:myNumberCell="{ props }">
      <NumberCell
        :data-item="props.dataItem"
        :field="props.field"
        @amountClick="amountClick"
      />
    </template>
    </Grid>
    <loading v-if="loading"></loading>
    <div class="sending p-3 card bg-success text-white" v-if="waitingForResponse != null" >
      <span>
        <i class="fa fa-spinner fa-spin"></i>
        <span v-if="verifying">Verifying</span> 
        <span v-else>Sending</span> 
        {{ waitingForResponse.MVAmount }} {{ waitingForResponse.MVCurrency }} to {{ waitingForResponse.MVNumber }}
      </span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mvOrangeObjectIsEqual } from "../helpers/object-equal";
import {
  DropDownCompanies,
  OrangeCommandCell,
  ussdResponseCell,
  NumberCell,
  MvPhoneCell,
  BooleanCell,
  PhoneTypeCell,

} from "../components/foreign-components.js";
import { mapState, mapActions } from "vuex";
import { saveExcel } from "@progress/kendo-vue-excel-export";
import {
  filterBy,
  orderBy
} from "@progress/kendo-data-query";
import { EventBus } from "../helpers/event-bus";
import PreventWindowClose from "../helpers/preventWindowClose";
import axios from 'axios'
import { mvOrange } from '../api'
import checkNumber from '../helpers/checkNumber'

export default {
  components : {
    NumberCell
  },
  data: function() {

    return {
      selectedField: "selected",
      loading: false,
      verifying: true,
      items: [],
      editID: null,
      staticColumns: [
        // { field: 'TransactionID', filterable:false, editable: false, title: '#', width:'100px', locked: true},
        { field: "Company", title: "From Branch", cell: DropDownCompanies },
        { field: "MVNumber", title: "Phone Number", cell: MvPhoneCell  },
        { field: "MVAmount", title: "Amount", cell: NumberCell },
  
        { field: "Type", title: "Type", cell : PhoneTypeCell},

        {
          field: "MVCurrency",
          title: "Currency",
          editable: false,
          filterable: false,
          width: "90px"
        },
        { field: "MVNotes", title: "Notes" },
        {
          field: "USSDResponse",
          title: "Response",
          cell: ussdResponseCell
        },
        {
          field: "MVDate",
          filter: "date",
          editor: "date",
          title: "Date",
          format: "{0:d}",
          width: "230px"
        }, 
      
        // {
        //   field: "CreatedDate",
        //   filter: "date",
        //   editor: "date",
        //   title: "Created",
        //   format: "{0:d}",
        //   width: "230px",
        //   editable: false,
        // }, 
        {
          field: "Sent",
          title: "Sent",
          cell: BooleanCell,
          width: "100px",
        },
        {
          title: "Delete",
          filterable: false,
          cell: OrangeCommandCell,
          width: "100px"
        }
      ],
      filter: {
        logic: "and",
        filters: []
      },
      enableFilter: false,
      sort: [
          // { field: 'CreatedDate', dir: 'desc' }
      ],
      json_fields: {
        Company: "Company",
        MVNumber: "MVNumber",
        MVAmount: "MVAmount",
        MVCurrency: "MVCurrency",
        MVNotes: "MVNotes",
        MVDate: "MVDate"
      },
      connected: false,
      from: new Date().toISOString().split("T")[0],
      to: new Date().toISOString().split("T")[0],
      toolbarBg: "bg-danger",
      waitingForResponse: null,
      selectedCount: 0,
      isBatch: false,
      provider: window.myprovider
    };
  },
  mounted() {
    console.log(this.provider)
    this.loadItems(true);
    EventBus.$on("tab-pressed", this.nextRow);
    EventBus.$on("set-false", this.setSentFalse);
    EventBus.$on("ussd", this.ussdHandler);
    this.addKeyHandler();
  },
  computed: {
    areAllSelected() {
      return this.items.findIndex(item => item.selected === false) === -1;
    },
    columns() {
      return [
        {
          field: "selected",
          width: "50px",
          filterable: false,
          headerSelectionValue: this.areAllSelected
        },
        ...this.staticColumns
      ];
    },
    mvOrangeList() {
      return this.items.map(item =>

        
        Object.assign(
          { inEdit: item.TransactionID === this.editID },
           item)
      );
    },
    getData() {
      return orderBy(filterBy(this.mvOrangeList, this.filter), this.sort);
    },
    total() {
      let name = this.$route.params.currency + "Total";
      return this[name];
    },
    ...mapState({
      fc: state => state.mvOrange.fc,
      usd: state => state.mvOrange.usd,
      fcTotal: state => state.mvOrange.fcTotal,
      usdTotal: state => state.mvOrange.usdTotal,
      UserName: state => state.auth.UserName,
      Company: state => state.auth.Company,
      UserID: state => state.auth.UserID,
      currencies: state => state.currencies.currencies,
      selectedCurrency: state => state.currencies.selected
    }),
    waitingForSave() {
      let count = 0;
      this.items.forEach(item => {
        if (item.edited || item.deleted || item.new) count++;
      });
      PreventWindowClose(count);
      return count;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.changeToolBarBg(to.params.currency);
      if (vm.selectedCurrency !== null) {
        // select currency will entering the route
        let currency = vm.currencies.find(
          currency =>
            currency.Currency.toUpperCase() === to.params.currency.toUpperCase()
        );
        vm.selectCurrency(currency);
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (this.selectedCurrency !== null) {
      // select currency will changing params
      let currency = this.currencies.find(
        currency =>
          currency.Currency.toUpperCase() === to.params.currency.toUpperCase()
      );
      this.selectCurrency(currency);
    }
    next();
  },
  watch: {
    $route(to, from) {
      this.changeToolBarBg(to.params.currency);
      this.loadItems(true);
    },
    items(d) {
      this.selectedCount = 0;
      d.forEach(i => {
        if (i.selected && i.Sent == 0) this.selectedCount++;
      });
    }
  },
  methods: {
    onHeaderSelectionChange(event) {
      let checked = event.event.target.checked;
      const data = this.items.slice();
      data.map(item => {
        return { ...item, selected: checked };
      });
      this.items = data;
      Vue.set(
        this,
        "items",
        this.items.map(item => {
          return { ...item, selected: checked };
        })
      );
    },
    onSelectionChange(event) {
      const data = this.items.slice();
      const index = data.findIndex(
        d => d.TransactionID === event.dataItem.TransactionID
      );
      data[index] = {
        ...data[index],
        selected: !event.dataItem[this.selectedField]
      };
      this.items = data;
      Vue.set(
        event.dataItem,
        this.selectedField,
        !event.dataItem[this.selectedField]
      );
    },
    createRandomData(count) {
      return;
    },
    ...mapActions({
      getMvOranges: "mvOrange/getMvOranges",
      selectCurrency: "currencies/selectCurrency"
    }),
    refreshData() {
      let currency = this.currencies.find(
        currency =>
          currency.Currency.toUpperCase() ===
          this.$route.params.currency.toUpperCase()
      );
      this.selectCurrency(currency);

      if(this.waitingForSave) {
        let message = {
          title: 'Do you want to Load Data without saving changes ?',
          body: 'You have to save changes before loading data'
        };
        let options = {
            okText: 'Save changes',
            cancelText: 'Load',
        };
        const vm = this
        this.$dialog
          .confirm(message, options)
          .then(function() {
            console.log('ok')
            vm.saveChanges()
          })
          .catch(function() {
            console.log('cancel')
            vm.loadItems();
          });
      } else {
        this.loadItems();
      }
    },
    loadItemsFromState() {
      this.items = this[this.$route.params.currency].map(item =>
        Object.assign(
          { new: false, edited: false, deleted: false, selected: false },
          item
        )
      );
      this.loading = false;
      this.editID = null;
    },
    loadItems(offline = false) {
      this.loading = true;
      if (offline) {
        this.loadItemsFromState();
      } else {
        this.getMvOranges({
          currency: this.selectedCurrency,
          from: this.from,
          to: this.to
        })
          .then(resp => {
            this.loadItemsFromState();
          })
          .catch(err => {
            let data = err.response;
            if (!data) {
              this.$toasted.global.my_app_error({
                message:
                  "Erreur réseau, veuillez vérifier votre connexion internet!"
              });
            } else {
              this.$toasted.global.my_app_error({
                message: `${data.data.message} (status: ${data.status})`
              });
            }
            this.loading = false;
          });
      }
    },
    itemChange: function(e) {
      let date = ["MVDate"];
      let foreignKeys = ["Company"];
      let field = e.field;
      let value = e.value;
       if (date.includes(field)) {
        value = value.toISOString().split("T")[0];
      }
      const data = this.items.slice();
      const index = data.findIndex(d => d.TransactionID === e.dataItem.TransactionID);
      if (foreignKeys.includes(field)) {
        let foreignKey = value.foreignKey;
        let foreignKeyValue = value.foreignKeyValue;
        let givenvalue = value.value;
        data[index] = {
          ...data[index],
          [field]: givenvalue,
          [foreignKey]: foreignKeyValue
        };
      } else {
        data[index] = { ...data[index], [field]: value };
      }

      const data2 = this[this.$route.params.currency].slice();
      const index2 = data2.findIndex(
        d => d.TransactionID === e.dataItem.TransactionID
      );

      if (!data[index].new) {
        if (mvOrangeObjectIsEqual(data[index], data2[index2])) {
          data[index].edited = false;
        } else {
          data[index].edited = true;
        }
      }

      this.items = data;
      if(e.field == "MVNumber"){
          axios.get('/api/v1/phone_types/'+e.value).then(
          resp => {
            let newData = this.items.map(d => {
              if(d.TransactionID === e.dataItem.TransactionID){
                d.Type = Object.keys(resp.data).length > 0 ? resp.data.Type : ''
              }
              return d;
            })
            this.items = newData
          }
        )
      }

      this.$set(e.dataItem, field, value);
    },
    rowClick: function(e) {
      if (this.editID) {
        const data = this.items.slice();
        const item = data.find(d => d.TransactionID == this.editID);
        if (!this.validateRow(item)) {
          this.alert();
          return;
        }
      }
      if (!e.dataItem.deleted && e.dataItem.Sent == 0) {
        this.editID = e.dataItem.TransactionID;
        this.$set(e.dataItem, "inEdit", true);
        // this.$nextTick(() => {
        //   e.event.path[1].firstChild.firstChild.focus();
        // });
      }
      // else{
      //   console.log(e)

      //   navigator.clipboard.writeText('Text to be copied')
      // }
    },
    
    amountClick: function (e, dataItem) {
      // conole.log(e)
    },
    closeEdit(e) {
      if (this.editID) {
        const data = this.items.slice();
        const item = data.find(d => d.TransactionID == this.editID);
        if (!this.validateRow(item)) {
          this.alert();
          return;
        }
      }
      if (e.target === e.currentTarget) {
        this.editID = null;
      }
    },
    nextRow(e) {
      const data = this.items.slice();
      if (this.editID) {
        const item = data.find(d => d.TransactionID == this.editID);
        if (!this.validateRow(item)) {
          this.alert();
          return;
        }
      }

      let index = data.findIndex(ab => {
        return ab.TransactionID == e.TransactionID;
      });
      this.editID = null;
      index++;
      if (data.length === index) {
        //   this.addRecord()
      } else {
        this.$nextTick(() => {
          if (!data[index].deleted && data[index].Sent == 0) {
            this.editID = data[index].TransactionID;
          }
        });
      }
    },
    getUniqueId() {
      var timestamp = +new Date
      timestamp = String(this.UserID) + String(timestamp)
      return Number(timestamp) 
    },
    addRecord(e) {
      let currency = this.currencies.find(
        currency =>
          currency.Currency.toUpperCase() ===
          this.$route.params.currency.toUpperCase()
      );
      
      this.selectCurrency(currency);
      if (this.selectedCurrency === null) {
        alert("Loading state! retry later!");
        return;
      }

      const newRecord = {
        TransactionID: this.getUniqueId(),
        new: true,
        MVDate: new Date().toISOString().split("T")[0],
        MVCurrency: this.selectedCurrency.Currency,
        Sent: 0
      };
      const data = this.items.slice();
      if (this.validateRow(data[0])) {
        data.unshift(newRecord);
        this.items = data;
        this.editID = newRecord.TransactionID;
        // console.log(this.$refs.grid.$el.lastElementChild)
        this.$nextTick(() => {
          // let nodelist = document.querySelectorAll(".k-master-row")
          document.querySelector("select.form-control.form-control-sm").focus();
        });
      } else {
        this.alert();
      }
    },
    remove(e) {
      if (confirm("Voulez-vous supprimer cette entrée ?")) {
        // e.dataItem.inEdit = undefined;
        let data = this.items.slice();
        const index = data.findIndex(
          d => d.TransactionID === e.dataItem.TransactionID
        );

        if (data[index].new) {
          // if new remove
          data.splice(index, 1);
        } else {
          // set deleted
          data[index].deleted = true;
        }

        this.items = data;
      }
    },
    saveChanges() {
      if (this.editID) {
        const data = this.items.slice();
        const item = data.find(d => d.TransactionID == this.editID);
        if (!this.validateRow(item)) {
          this.alert();
          return;
        }
      }
      const vm = this;
      this.editID = null;
      let batch = {
        destroy: this.items.filter(item => item.deleted),
        update: this.items.filter(item => item.edited),
        store: this.items.filter(item => item.new)
      };

      function delay(item) {
        let action = "mvOrange/" + item;
        return new Promise((resolve, reject) => {
          if (!batch[item].length) {
            // if there is nothing pass
            resolve();
            return;
          }
          vm.$store.dispatch(action, batch[item]).then(response => {
            // handle success and continue
            if (item == "store") console.log("end store ", response);
            if (item == "update") console.log("end update ", response);
            if (item == "destroy") console.log("end destroy ", response);

            resolve();
          });
        });
      }

      async function delayedLog(item) {
        await delay(item);
      }

      async function startBatchProcess(array) {
        for (const item of array) {
          await delayedLog(item);
        }
        vm.loadItems();
        vm.editID = null;
        vm.loading = false;
        console.log("Done! 11");
      }

      if (this.selectedCurrency !== null) {
        this.loading = true;
        startBatchProcess(["store", "update", "destroy"]);
      }
    },
    cancelChanges() {
      if (confirm("Voulez-vous annuler les modifications?")) {
        this.items = this[this.$route.params.currency].map(item =>
          Object.assign({ new: false, edited: false, deleted: false }, item)
        );
        this.editID = null;
      }
    },
    dataForExport() {
      return new Promise(resolve => {
        let data = this[this.$route.params.currency].map(mvorange => {
          return {
            ...mvorange
          };
        });
        resolve(data);
      });
    },
    exportExcel() {
      let columns = [
        // { field: 'TransactionID'},
        { field: "Company", title: "Company" },
        { field: "MVNumber", title: "MVNumber" },
        { field: "MVAmount", title: "MVAmount" },
        { field: "MVCurrency", title: "MVCurrency" },
        { field: "MVNotes", title: "MVNotes" },
        { field: "MVDate", title: "MVDate" }
      ];
      this.dataForExport().then(data => {
        saveExcel({ data: data, fileName: "AirtelMoney", columns: columns });
      });
    },
    filterChange: function(ev) {
      
      if(ev.filter) {
        let filters = ev.filter.filters.map(d => {
          if(d.field === 'MVDate') {
            return {
              ...d,
              value: new Date(d.value).toISOString().split("T")[0]
            }
          } else {
            return d
          }
        })
  
        ev.filter.filters = filters
      }
      this.filter = ev.filter;
    },
    columnReorder: function(options) {
      this.columns = options.columns;
    },
    sortChangeHandler: function(e) {
      this.sort = e.sort;
    },
    validateRow(data) {
      if (data != undefined) {
        if (data.MVNumber) {
          if (data.MVNumber.length < 9 || data.MVNumber.length > 10) {
            this.$toasted.info("This is an invalid number", {
              action: {
                text: "Fermer",
                onClick: (e, toastObject) => {
                  toastObject.goAway(0);
                }
              },
              duration: 5000,
              position: "bottom-center"
            });
            return false;
          }
          if (!checkNumber[this.provider](data.MVNumber)) {
            this.$toasted.info(`This is an invalid ${this.provider} number beginning without 0`, {
              action: {
                text: "Fermer",
                onClick: (e, toastObject) => {
                  toastObject.goAway(0);
                }
              },
              duration: 5000,
              position: "bottom-center"
            });
            return false;
          }
        }

        return (
          !!data.CompanyFID &&
          !!data.MVNumber &&
          !!data.MVAmount &&
          !!data.MVDate 
        );
      } else {
        return true;
      }
    },
    addKeyHandler(e) {
      window.addEventListener("keydown", this.keyHandler);
    },
    removeKeyHandler() {
      window.removeEventListener("keydown", this.keyHandler);
    },
    keyHandler(e) {
      const key = e.which || e.keyCode;
      if (key === 13 && e.ctrlKey) this.saveChanges()
      if (key === 32 && e.ctrlKey) this.addRecord()
      if(key === 77 && e.ctrlKey) this.refreshData()
      if(key === 66 && e.ctrlKey) this.cancelChanges()
    },
    alert() {
      this.$toasted.info(
        "Veuillez remplir les champs obligatoires!!! ( Branch, Number, Amount, Date )",
        {
          action: {
            text: "Fermer",
            onClick: (e, toastObject) => {
              toastObject.goAway(0);
            }
          },
          duration: 5000,
          position: "bottom-center"
        }
      );
    },
    sendBatch() {
      let selected = this.items.find(item => item.selected && item.Sent == 0);
      if (selected) this.ussdHandler(selected, true);
    },
    ussdHandler(e, batch = false) {
      if(e.TransactionID > 2147483647) {
        // 2147483647 is the max integer for sql server. if the ID is greather than that it means we are having the fake Id
        alert("Please save new records to the database before sending money")
        return
      }
      this.isBatch = batch;
      this.verifying = true
      this.waitingForResponse = e;
      axios.get(mvOrange + '/check/' + e.TransactionID)
        .then((resp) => {
          this.verifying = false
          let number = e.MVNumber;
          let amount = e.MVAmount;

          let port = localStorage.getItem("port");
          let cmds = JSON.parse(localStorage.getItem(this.$route.params.currency + "-cmds")).slice();

          if (port && cmds && cmds.length > 0) {
            if (
              confirm(
                `Do you want to send ${amount} ${this.$route.params.currency.toUpperCase()} to ${number} ?`
              )
            ) {
              
              let commands = [];
              for (let i = 0; i < cmds.length; i++) {
                commands.push(
                  cmds[i].replace("NUMBER", number).replace("AMOUNT", amount)
                );
              }

              let form = new FormData();
              form.append('data', JSON.stringify(commands));
              form.append('port', port);

              const config = {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json'
                }
              }

              axios.post('http://localhost:5500/api', form, config)
                .then((resp) => {
                  this.ussdResponse(resp.data)
                })
                .catch((err) => {
                  this.waitingForResponse = null
                  if (!err.response) {
                    this.$toasted.global.my_app_error({
                      message:
                        "Erreur!, veuillez vérifier votre serveur USSD!"
                    });
                  } else {
                    let data = err.response.data;
                    if(data.data.message) {
                      this.$toasted.global.my_app_error({
                        message: data.data.message
                      });
                    } else {
                      this.$toasted.global.my_app_error({
                        message: data
                      });
                    }
                  }
                })
            } else {
              this.waitingForResponse = null
            }
          } else {
            this.waitingForResponse = null
            this.$toasted.info("Please set the USSD config", {
              action: {
                text: "Fermer",
                onClick: (e, toastObject) => {
                  toastObject.goAway(0);
                }
              },
              duration: 5000,
              position: "bottom-center"
            });
          }
        })
        .catch((err) => {
          this.verifying = true
          this.waitingForResponse = null
          if (!err.response) {
            this.$toasted.global.my_app_error({
              message:
                "Erreur!, veuillez vérifier reseau!"
            });
          } else {
            console.log(err.response)
            let data = err.response.data;
            if(data.message) {
              this.$toasted.global.my_app_error({
                message: data.message
              });
            } else {
              this.$toasted.global.my_app_error({
                message: data
              });
            }
          }
        })
    },
    ussdResponse: function(data) {
      let resp = data.data.message;
      if (this.waitingForResponse) {
        const data = this.items.slice();
        const index = data.findIndex(
          d => d.TransactionID === this.waitingForResponse.TransactionID
        );

        data[index] = { 
          ...data[index], 
          USSDResponse: resp,
          Sent: resp.startsWith('Transaction reussie.') ? 1 : 0
        };
        
        const data2 = this[this.$route.params.currency].slice();
        const index2 = data2.findIndex(
          d => d.TransactionID === this.waitingForResponse.TransactionID
        );

        if (this.isBatch) data[index].selected = false;

        if (!data[index].new) {
          if (mvOrangeObjectIsEqual(data[index], data2[index2])) {
            data[index].edited = false;
          } else {
            data[index].edited = true;
          }
        }

        this.items = data;
        this.$set(this.waitingForResponse, "USSDResponse", resp);
        this.waitingForResponse = null
        if (this.isBatch && this.selectedCount > 0) {
          setTimeout(() => {
            this.sendBatch();
          }, 300);
        }
      }
    },
    changeToolBarBg(currency) {
      if (currency == "usd") this.toolbarBg = "bg-success";
      if (currency == "fc") this.toolbarBg = "bg-info";
    },
    setSentFalse(e) {
      const data = this.items.slice();
      const index = data.findIndex(
        d => d.TransactionID === e.TransactionID
      );

      data[index] = { 
        ...data[index],
        Sent: 0
      };
      
      const data2 = this[this.$route.params.currency].slice();
      const index2 = data2.findIndex(
        d => d.TransactionID === e.TransactionID
      );

      if (!data[index].new) {
        if (mvOrangeObjectIsEqual(data[index], data2[index2])) {
          data[index].edited = false;
        } else {
          data[index].edited = true;
        }
      }

      this.items = data;
      this.$set(e, "Sent", 0);
    }
  },
  beforeDestroy() {
    EventBus.$off("tab-pressed", this.nextRow);
    EventBus.$off("set-false", this.setSentFalse);
    EventBus.$off("ussd", this.ussdHandler);
    this.removeKeyHandler();
  },
  beforeRouteLeave(to, from, next) {
    if(this.waitingForSave) {
      let message = {
        title: 'Do you want to leave ?',
        body: 'You have to save changes before leaving!!!'
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
          vm.saveChanges()
        })
        .catch(function() {
          console.log('cancel')
          next();
        });
    } else {
      next();
    }
    // if (this.waitingForSave) {
    //   if (confirm("Voulez-vous partir sans enregistrer ?")) {
    //     next();
    //   } else {
    //     next(false);
    //   }
    // } else {
    //   next();
    // }
  }
};
</script>

<style lang="scss" scoped>
  .sending {
        position: absolute;
        left: 60px;
        bottom: 10px;
        z-index: 9999;
    }
</style>

