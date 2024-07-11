<template>
    <div class="h-100">
        <Grid :style="{height: '100%'}"
            ref="grid"
            :data-items="getData"
            :edit-field="'inEdit'"
            @rowclick="rowClick"
            @itemchange="itemChange"
            @remove="remove"
            :resizable="true"
            :reorderable="true"
            @columnreorder="columnReorder"
            :filterable="true"
            :filter="filter"
            @filterchange="filterChange"
            :sortable="true"
            :sort= "sort"
            @sortchange="sortChangeHandler"
            :columns="columns">
            <grid-toolbar class="bg-danger">
                <div @click="closeEdit" class="d-flex justify-content-between">
                    <div>
                        <button title="Ctrl+Space" class="btn btn-dark btn-sm btn-sized" @click='addRecord' >
                            <i class="fa fa-user-plus"></i> Ajouter
                        </button>
                        <button title="Ctrl+Enter"
                                class="btn btn-dark btn-sm btn-sized"
                                @click="saveChanges">
                            <i class="fa fa-save"></i> 
                            Save 
                            <span class="badge badge-secondary">{{ waitingForSave }}</span>
                        </button>
                        <button title="Refresh" class="btn btn-dark btn-sm btn-sized" @click='refreshData' >
                            <i class="fa fa-download"></i> Load
                        </button>
                    </div>
                    
                    <div>
                        <button title="Cancel Changes"
                                class="btn btn-dark btn-sm btn-sized"
                                @click="cancelChanges">
                            <i class="fa fa-undo"></i> Annuler
                        </button>
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
import PreventWindowClose from '../helpers/preventWindowClose'
import { mapState, mapActions } from 'vuex'
import { filterBy, CompositeFilterDescriptor, orderBy } from '@progress/kendo-data-query';
import { typeObjectIsEqual } from '../helpers/object-equal'
import {
  DropDownCompanies,
  CompaniesCommandCell,
  PhoneTypeCell
} from '../components/foreign-components.js'
import { EventBus } from '../helpers/event-bus';
import checkNumber from '../helpers/checkNumber'

export default {
    data() {
        return {
            loading: false,
            items: [],
            editID: null,
            columns: [
                // { field: 'PhoneTypeID', filterable:false, editable: false, title: '#', width:'100px', locked: true},
                { field: 'PhoneNumber', title: 'Phone Number', filterable:true},
                { field: 'Type', title: 'Type', cell:PhoneTypeCell},
                { field: 'Note', title: 'Note'},
                { title: 'Del', filterable:false, cell: CompaniesCommandCell, width:'60px', locked: true}
            ],
            filter: {
                logic: "and",
                filters: []
            },
            sort: [],
            nextId: 1000000,
            provider: window.myprovider
        }
    },
    mounted() {
        this.loadItems(true)
        this.addKeyHandler()
    },
    computed: {
        usersList() {
            return this.items.map((item) => Object.assign({ inEdit: item.PhoneTypeID === this.editID}, item));
        },
        getData() {
            return orderBy(filterBy(this.usersList, this.filter), this.sort);
        },
        ...mapState({
            users: state => state.phone_types.phone_types,
            UserName: state => state.auth.UserName,
            Company: state => state.auth.Company,
        }),
        waitingForSave() {
            let count = 0
            this.items.forEach(item => {
                if(item.edited || item.deleted || item.new) count++
            })
            PreventWindowClose(count)
            return count
        }
    },
    methods: {
        ...mapActions({
            getUsers: 'phone_types/getUsers',
        }),
        refreshData () {
            this.loadItems()
        },
        loadItemsFromState() {
            this.items = this.users.map(item => Object.assign({new: false, edited: false, deleted: false}, item))
            this.loading = false
            this.editID = null;
        },
        loadItems (offline = false) {
            this.loading = true
            if(offline) {
                this.loadItemsFromState()
            } else {
                this.getUsers()
                    .then(resp => {

                        this.loadItemsFromState()
                    })
                    .catch(err => {
                        let data = err.response
                        if (!data) {
                            this.$toasted.global.my_app_error({
                                message: 'Erreur réseau, veuillez vérifier votre connexion internet!'
                            });
                        } else {
                            this.$toasted.global.my_app_error({
                                message: `${data.data.message} (status: ${data.status})`
                            });
                        }
                        this.loading = false
                    })
            }
        },
        itemChange: function (e) {
            let foreignKeys = ['Company']
            let field = e.field
            let value = e.value
            const data = this.items.slice();
            const index = data.findIndex(d => d.PhoneTypeID === e.dataItem.PhoneTypeID);
            if (foreignKeys.includes(field)) {
                let foreignKey = value.foreignKey
                let foreignKeyValue = value.foreignKeyValue
                let givenvalue = value.value
                data[index] = { 
                    ...data[index], 
                    [field]: givenvalue,
                    [foreignKey]: foreignKeyValue
                };
            } else {
                data[index] = { ...data[index], [field]: value };
            }

            const data2 = this.users.slice()
            const index2 = data2.findIndex(d => d.PhoneTypeID === e.dataItem.PhoneTypeID)

            if(!data[index].new) {
                if(typeObjectIsEqual(data[index], data2[index2])) {
                    data[index].edited = false
                } else {
                    data[index].edited = true
                }
            }

            this.items = data;
            console.log(data)
            this.$set(e.dataItem, field, value);
        },
        rowClick: function (e) {
            if (this.editID) {
                const data = this.items.slice();
                const item = data.find(d => d.PhoneTypeID == this.editID)
                if(!this.validateRow(item)) {
                    this.alert()
                    return
                }
            }

            if(!e.dataItem.deleted) {
                this.editID = e.dataItem.PhoneTypeID;
                this.$set(e.dataItem, 'inEdit', true);
                this.$nextTick(() => {
                    // e.event.path[1].firstChild.firstChild.focus()
                })
            }
        },
        closeEdit(e) {
            // if (this.editID) {
            //   const data = this.items.slice();
            //   const item = data.find(d => d.PhoneTypeID == this.editID)
            //   if(!this.validateRow(item)) {
            //     this.alert()
            //     return
            //   }
            // }
            if (e.target === e.currentTarget) {
                this.editID = null;
            }
        },
        nextRow(e) {
            const data = this.items.slice();
            if (this.editID) {
                const item = data.find(d => d.PhoneTypeID == this.editID)
                if(!this.validateRow(item)) {
                    this.alert()
                    return
                }
            }

            let index = data.findIndex(ab => {
                return ab.PhoneTypeID == e.PhoneTypeID
            })
            this.editID = null
            index++
            if(data.length === index) {
            //   this.addRecord()
            } else {
                this.$nextTick(() => {
                    if(!data[index].deleted && (data[index].new || data[index].WeekFID == this.currentWeek.WeekID)) {
                        this.editID = data[index].PhoneTypeID
                    }
                })
            }
        },
        addRecord(e) {
            this.nextId++
            const newRecord = { 
                PhoneTypeID: this.nextId,
                new: true
            };
            const data = this.items.slice();
            if(this.validateRow(data[0])) {
                data.unshift(newRecord);
                this.items = data;
                this.editID = newRecord.PhoneTypeID;
                this.$nextTick(() => {
                    document.querySelector("tr.k-master-row").firstChild.firstChild.focus()
                });
            } else {
                this.alert()
            }
        },
        remove(e) {
            if (confirm("Voulez-vous supprimer cette entrée ?")) {
                // e.dataItem.inEdit = undefined;
                let data = this.items.slice();
                const index = data.findIndex(d => d.PhoneTypeID === e.dataItem.PhoneTypeID);
                
                if(data[index].new) {
                    // if new remove
                    data.splice(index, 1)
                } else {
                    // set deleted
                    data[index].deleted = true
                }
                
                this.items = data
            }
        },
        saveChanges() {
            if (this.editID) {
                const data = this.items.slice();
                const item = data.find(d => d.PhoneTypeID == this.editID)
                if(!this.validateRow(item)) {
                    this.alert()
                    return
                }
            }
            const vm = this
            this.editID = null
            this.loading = true
            let batch = {
                destroy: this.items.filter(item => item.deleted),
                update: this.items.filter(item => item.edited),
                store: this.items.filter(item => item.new)
            }
            
            function delay(item) {
                let action = 'phone_types/' + item
                return new Promise((resolve, reject) => {
                if(!batch[item].length) {
                    // if there is nothing pass
                    resolve()
                    return
                }
                vm.$store.dispatch(action, batch[item])
                    .then(response => {
                        // handle success and continue
                        if (item == 'store') console.log('end store ', response)
                        if (item == 'update') console.log('end update ', response)
                        if (item == 'destroy') console.log('end destroy ', response)
                        
                        resolve()
                    })
                })
            }

            async function delayedLog (item) {
                await delay(item);
            }

            async function startBatchProcess (array) {
                for (const item of array) {
                    await delayedLog(item);
                }
                vm.loadItems()
                vm.editID = null;
                vm.loading = false
                console.log('Done! 11');
            }

            startBatchProcess(['store', 'update', 'destroy'])
        },
        cancelChanges() {
            if (confirm("Voulez-vous annuler les modifications?")) {
                this.items = this.users.map(item => Object.assign({new: false, edited: false, deleted: false}, item))
                this.editID = null;
            }
        },
        filterChange: function(ev) {
            this.filter = ev.filter;
        },
        columnReorder: function(options) {
            this.columns = options.columns;
        },
        sortChangeHandler: function(e) {
            this.sort = e.sort;
        },
        validateRow(data) {
            if(data != undefined) {
              if (data.PhoneNumber) {
                  if (data.PhoneNumber.length < 9 || data.PhoneNumber.length > 10) {
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
                  if (!checkNumber[this.provider](data.PhoneNumber)) {
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
                let cond = !!data.PhoneNumber &&
                    !!data.Type 
              
                return cond
            } else {
                return true
            }
        },
        addKeyHandler(e) {
            window.addEventListener('keydown', this.keyHandler);
        },
        removeKeyHandler() {
            window.removeEventListener('keydown', this.keyHandler);
        },
        keyHandler(e) {
            const key = e.which || e.keyCode;
            if (key === 13 && e.ctrlKey) {
                this.saveChanges()
            }
            if (key === 32 && e.ctrlKey) {
                this.addRecord()
            }
        },
        alert() {
            this.$toasted.info('Veuillez remplir les champs obligatoires!!! ( PhoneNumber, Type)', {
                action : {
                text : 'Fermer',
                onClick : (e, toastObject) => {
                    toastObject.goAway(0);
                }
                },
                duration: 5000,
                position: 'bottom-center'
            })
        },
    },
    beforeDestroy() {
        EventBus.$off('tab-pressed', this.nextRow);
        this.removeKeyHandler()
    },
    beforeRouteLeave (to, from, next) {
        if(this.waitingForSave) {
            if(confirm("Voulez-vous partir sans enregistrer ?")) {
                next()
            } else {
                next(false)
            }
        } else{
            next()
        }
    }
}
</script>

<style>

</style>
