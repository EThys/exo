import Vue from 'vue';
import { mapState, mapGetters } from 'vuex'
import { EventBus } from '../helpers/event-bus';
import axios from 'axios'

const toogleClassGrid = function (dataItem, el) {
  if(dataItem.edited) {
    el.classList.add("table-warning")
  } else{
    el.classList.remove("table-warning")
  }
  if(dataItem.new) {
    el.classList.add("table-success")
  } else{
    el.classList.remove("table-success")
  }
  if(dataItem.deleted) {
    el.classList.add("table-danger")
  } else{
    el.classList.remove("table-danger")
  }
}

const DropDownEmployes = Vue.component('dropdownemployes-component', {
    props: {
        field: String,
        dataItem: Object,
        format: String,
        className: String,
        columnIndex: Number,
        columnsCount: Number,
        rowType: String,
        level: Number,
        expanded: Boolean,
        editor: String
    },
    template: `<td v-if="!dataItem.inEdit" :class="className">{{ dataItem[field] }}</td>
                <td v-else>
                  <select @change="change" v-model="value" class="form-control form-control-sm">
                    <option v-for="employe in employes" :value="employe.EmployeID">
                      {{ employe.Nom }}
                    </option>
                  </select>
                </td>`,
    data() {
      return {
        value: ''
      }
    },
    mounted() {
      this.value = this.dataItem['EmployeFID']
    },
    methods: {
      change(e) {
        this.$nextTick(() => {
          this.$emit('change', e, this.selectedEmploye());
        })
      },
      selectedEmploye: function() {
        let id = this.value
        const data = this.employes.slice()
        const index = data.findIndex(function (d) {
          return d.EmployeID == id
        })
        return {
          value: data[index].Nom,
          foreignKey: 'EmployeFID',
          foreignKeyValue: data[index].EmployeID,
        }
      }
    },
    computed: {
      ...mapState({
        employes: state => state.employes.employes
      })
    }
});

const DropDownTypes = Vue.component('dropdowntypes-component', {
    props: {
        field: String,
        dataItem: Object,
        format: String,
        className: String,
        columnIndex: Number,
        columnsCount: Number,
        rowType: String,
        level: Number,
        expanded: Boolean,
        editor: String
    },
    template: `<td v-if="!dataItem.inEdit" :class="className">{{ dataItem[field] }}</td>
                <td v-else>
                  <select @change="change" v-model="value" class="form-control form-control-sm">
                    <option v-for="type in types" :value="type.AbsenceTypeID">
                      {{ type.AbsenceType }}
                    </option>
                  </select>
                </td>`,
    data() {
      return {
        value: ''
      }
    },
    mounted() {
      this.value = this.dataItem['TypeAbsenceFID']
    },
    methods: {
      change(e) {
        this.$nextTick(() => {
          this.$emit('change', e, this.selectedType());
        })
      },
      selectedType: function() {
        let id = this.value
        const data = this.types.slice()
        const index = data.findIndex(function (d) {
          return d.AbsenceTypeID == id
        })
        return {
          value: data[index].AbsenceType,
          foreignKey: 'TypeAbsenceFID',
          foreignKeyValue: data[index].AbsenceTypeID,
          Transport: data[index].Transport,
          Salaire: data[index].Salaire
        }
      },
      print() {
        print()
      }
    },
    computed: {
      ...mapState({
        types: state => state.types.types
      })
    }
});

const nbDays = Vue.component('nb-days-component', {
    props: {
        field: String,
        dataItem: Object,
        format: String,
        className: String,
        columnIndex: Number,
        columnsCount: Number,
        rowType: String,
        level: Number,
        expanded: Boolean,
        editor: String
    },
    template: `<td v-if="!dataItem.inEdit" :class="className">{{ dataItem[field] }}</td>
                <td v-else>
                  <input @change="change" type="number" min="1" max="6" :value="dataItem[field] ? dataItem[field] : 1" class="form-control form-control-sm">
                </td>`,
    methods: {
      change(e) {
        e.target.value = e.target.value < 1 ? 1 : e.target.value
        e.target.value = e.target.value > 6 ? 6 : e.target.value
        this.$emit('change', e, e.target.value);
      }
    }
});

const DateInputCell = Vue.component('date-input-component', {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td v-if="!dataItem.inEdit" :class="className">{{ dataItem[field] }}</td>
              <td v-else>
              {{ dataItem[field] }}
                <input @change="change" type="date" :value="dataItem[field]"  class="form-control form-control-sm">
              </td>`,
  methods: {
    change(e) {
      this.$emit('change', e, e.target.value);
    }
  }
});

const CommandCell = Vue.component("template-component", {
    props: {
        field: String,
        dataItem: Object,
        format: String,
        className: String,
        columnIndex: Number,
        columnsCount: Number,
        rowType: String,
        level: Number,
        expanded: Boolean,
        editor: String
    },
    template: ` <td>
                    <button
                        @keyup.tab="tab"
                        class="btn btn-danger btn-sm"
                        :class="classObject"
                        @click="removeHandler">
                        <i class="fa fa-trash-alt"></i>
                    </button>
                    </td>`,
    computed: {
      ...mapState({
        absences: state => state.absences.absences,
        currentWeek: state => state.weeks.current,
      }),
      classObject: function () {
        return {
          disabled: this.currentWeek ? this.currentWeek.WeekID != this.dataItem.WeekFID : false,
        }
      }
    },
    watch: { 
      dataItem: {
        handler: function(newVal, oldVal) { // watch it
          toogleClassGrid(this.dataItem, this.$parent.$parent.$el)
        },
        deep: true
      }
    },
    methods: {
      removeHandler: function() {
        this.$emit('remove', this.dataItem);
      },
      tab() {
        EventBus.$emit('tab-pressed', this.dataItem);
      }
    }
});

const HasSignature = Vue.component('has-signature-component', {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td :class="className">
                <span v-if="dataItem[field]" class="badge badge-success">Yes</span>
                <span v-else class="badge badge-danger">No</span>
            </td>`,
});

const Bool = Vue.component('bool-component', {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td :class="className">
                <span v-if="dataItem[field] == 1" class="badge badge-success">Yes</span>
                <span v-else class="badge badge-danger">No</span>
            </td>`,
});

const PaidCommandCell = Vue.component("template-component", {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: ` <td>
                  <button
                      class="btn btn-dark btn-sm"
                      @click="sign">
                      <i class="fa fa-file-signature"></i>
                  </button>
              </td>`,
  watch: { 
    dataItem: {
      handler: function(newVal, oldVal) { // watch it
        toogleClassGrid(this.dataItem, this.$parent.$parent.$el)
      },
      deep: true
    }
  },
  methods: {
    sign () {
      EventBus.$emit('start-sign', this.dataItem);
    }
  }
});

const TransCommandCell = Vue.component("template-component", {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: ` <td>
                  <button
                      class="btn btn-dark btn-sm"
                      @click="sign">
                      <i class="fa fa-file-signature"></i>
                  </button>
              </td>`,
  watch: { 
    dataItem: {
      handler: function(newVal, oldVal) { // watch it
        toogleClassGrid(this.dataItem, this.$parent.$parent.$el)
      },
      deep: true
    }
  },
  methods: {
    sign () {
      EventBus.$emit('start-sign', this.dataItem);
    }
  }
});

const DropDownCompanies = Vue.component('dropdowncompanies-component', {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td v-if="!dataItem.inEdit" :class="className">{{ dataItem[field] }}</td>
              <td v-else>
                <select @change="change" v-model="value" class="form-control form-control-sm">
                  <option v-for="company in companies" :value="company.CompanyID" :selected="!Admin">
                    {{ company.CompanyName }}
                  </option>
                </select>
              </td>`,
  data() {
    return {
      value: ''
    }
  },
  mounted() {
    this.value = this.dataItem['CompanyFID']
  },
  methods: {
    change(e) {
      this.$nextTick(() => {
        this.$emit('change', e, this.selectedCompany());
      })
    },
    selectedCompany: function() {
      let id = this.value
      const data = this.companies.slice()
      const index = data.findIndex(function (d) {
        return d.CompanyID == id
      })
      return {
        value: data[index].CompanyName,
        foreignKey: 'CompanyFID',
        foreignKeyValue: data[index].CompanyID
      }
    }
  },
  computed: {
    ...mapState({
      companies: state => state.companies.companies,
      Admin: state => state.auth.Admin,
    })
  }
});

const CompaniesCommandCell = Vue.component("companiescommandcell-component", {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: ` <td>
                  <button
                      @keyup.tab="tab"
                      class="btn btn-danger btn-sm"
                      @click="removeHandler">
                      <i class="fa fa-trash-alt"></i>
                  </button>
                  </td>`,
  watch: { 
    dataItem: {
      handler: function(newVal, oldVal) { // watch it
        toogleClassGrid(this.dataItem, this.$parent.$parent.$el)
      },
      deep: true
    }
  },
  methods: {
    removeHandler: function() {
      this.$emit('remove', this.dataItem);
    },
    tab() {
      // console.log(this.$parent.$parent)
      EventBus.$emit('tab-pressed', this.dataItem);
    }
  }
});

const OrangeCommandCell = Vue.component("orange-component", {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: ` <td>
                  <button
                    v-if="isSimpleAdmin"
                      class="btn btn-success btn-sm"
                      @click="ussdHandler"
					  :disabled="dataItem['Sent'] == 1">
                      <i v-if="ussdLoading" class="fa fa-spinner fa-spin"></i>
                      <i v-if="!ussdLoading" class="fa fa-phone-square"></i>
					  
                  </button>
                  <button
						:disabled="dataItem['Sent'] == 1"
                      @keyup.tab="tab"
                      class="btn btn-danger btn-sm"
                      @click="removeHandler">
                      <i class="fa fa-trash-alt"></i>
                  </button>
                  </td>`,
  watch: { 
    dataItem: {
      handler: function(newVal, oldVal) { // watch it
        toogleClassGrid(this.dataItem, this.$parent.$parent.$el)
      },
      deep: true
    }
  },
  data() {
    return {
      ussdLoading: false
    }
  },
  computed: {
    ...mapGetters({
      isSimpleAdmin: 'auth/isSimpleAdmin'
    })
  },
  methods: {
    removeHandler: function() {
      this.$emit('remove', this.dataItem);
    },
    ussdHandler: function() {
      // this.ussdLoading = true
      EventBus.$emit('ussd', this.dataItem);
    },
    tab() {
      EventBus.$emit('tab-pressed', this.dataItem);
    }
  }
});

const ussdResponseCell = Vue.component("ussd-response-cell-component", {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td :class="className" @click="showValue">{{ dataItem[field] }}</td>`,
            methods: {
              showValue() {
                this.$dialog.alert(this.dataItem[this.field], {backdropClose: true})
              }
            },
});

const MvTypeCell = Vue.component("mv-type-cell-component", {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td :class="className" >{{ dataItem[field] }}</td>`
            
});

const NumberCell = Vue.component("my-number-cell-component", {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td v-if="!dataItem.inEdit"  class="" > {{ this.formatNumber }}<span @click="copy" class="float-right " ><i class="fa fa-copy" /></span> </td>
                
              <td v-else>
                <input @change="change"  type="number" class="k-textbox" :value="dataItem[field] ? dataItem[field] : 0" style="width:100%;height:100%;"/>
              </td>`,
  computed: {
    formatNumber() {
      return new Intl.NumberFormat('en-US').format(this.dataItem[this.field])
    }
  },
  methods: {
    change(e) {
      this.$emit('change', e, e.target.value);
    },
    copy() {
      this.$toasted.success("Amount copied", {

        duration: 500,
        position: "bottom-center"
      })
        navigator.clipboard.writeText(this.dataItem[this.field])
        
    },
    amountClick(e) {
        if(!this.dataItem.inEdit){
          navigator.clipboard.writeText(this.dataItem.MVAmount)
        }
        
    }

  }
});

const MvPhoneCell = Vue.component("my-number-cell-component", {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td v-if="!dataItem.inEdit" > 
                {{dataItem[field]}} 
                <span @click="copy" class="float-right"  ><i class="fa fa-copy" /></span>
              </td>
              <td v-else>
                <input @change="change"  type="text" class="k-textbox" :value="dataItem[field]" style="width:100%;height:100%;"/>
              </td>`,
  computed: {
    formatNumber() {
      return new Intl.NumberFormat('en-US').format(this.dataItem[this.field])
    }
  },
  methods: {
    change(e) {
      
      this.$emit('change', e, e.target.value);

    },
    copy() {
      this.$toasted.success("Number copied", {

        duration: 500,
        position: "bottom-center"
      })
        navigator.clipboard.writeText(this.dataItem[this.field])
        
    },
    clickCell(e) {
      this.$emit('clickCellPhone', e, e.target.value);

    }

  }
});
const PhoneCell = Vue.component("my-number-cell-component", {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td v-if="!dataItem.inEdit" > 
                {{dataItem[field]}}
              </td>
              
              <td v-else>
                <input @change="change"  type="text" class="k-textbox" :value="dataItem[field]" style="width:100%;height:100%;"/>
              </td>`,
  computed: {
    formatNumber() {
      return new Intl.NumberFormat('en-US').format(this.dataItem[this.field])
    }
  },
  methods: {
    change(e) {
      this.$emit('change', e, e.target.value);
    },
    copy() {
      this.$toasted.success("Number copied", {

        duration: 500,
        position: "bottom-center"
      })
        navigator.clipboard.writeText(this.dataItem[this.field])
        
    },
    clickCell(e) {
      this.$emit('clickCellPhone', e, e.target.value);

    }

  }
});
const BooleanCell = Vue.component('my-boolean-component', {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: `<td v-if="isSimpleAdmin && dataItem.inEdit">
				<select @change="change" v-model="value" class="form-control form-control-sm">
                  <option :value="0">false</option>
				  <option :value="1">true</option>
                </select>
			</td>
			<td v-else :class="className">
                <span v-if="dataItem[field] == 1" class="badge badge-success" v-on:dblclick="setFalse">Yes</span>
                <span v-else class="badge badge-danger">No</span>
            </td>`,
	data() {
		return {
			value: 0,
		}
	},
	computed: {
		...mapGetters({
		  isSimpleAdmin: 'auth/isSimpleAdmin'
		})
	  },
	mounted() {
		this.value = this.dataItem[this.field]
	},
	methods: {
		change(e) {
		  this.$emit('change', e, this.value);
    },
    setFalse() {
      if(this.isSimpleAdmin) {
        EventBus.$emit('set-false', this.dataItem);
      }
    }
  }
});

const PhoneTypeCell = Vue.component('my-phone-type-component', {
  props: {
      field: String,
      dataItem: Object,
      format: String,
      className: String,
      columnIndex: Number,
      columnsCount: Number,
      rowType: String,
      level: Number,
      expanded: Boolean,
      editor: String
  },
  template: 
      `<td v-if="isSimpleAdmin && dataItem.inEdit">
      <select @change="change" v-model="dataItem[field]" class="form-control form-control-sm">
      <option value="Agent">Agent</option>
      <option value="Dealer">Dealer</option>
    </select>
			</td>
			<td v-else :class="className">
                <span >{{ dataItem[field]}}</span>
            </td>`,
	data() {
		return {
			value: 0,
		}
	},
	computed: {
		...mapGetters({
		  isSimpleAdmin: 'auth/isSimpleAdmin'
		})
	  },
	mounted() {
		this.value = this.dataItem[this.field]
	},
	methods: {
		change(e) {
		  this.$emit('change', e, this.dataItem[this.field]);
    },
    setFalse() {
      if(this.isSimpleAdmin) {
        EventBus.$emit('set-false', this.dataItem);
      }
    }
  }
});

export { 
    DropDownEmployes,
    DropDownTypes,
    CommandCell,
    HasSignature,
    PaidCommandCell,
    TransCommandCell,
    nbDays,
    Bool,
    DropDownCompanies,
    CompaniesCommandCell,
    OrangeCommandCell,
    ussdResponseCell,
    NumberCell,
    PhoneCell,
	BooleanCell,
	PhoneTypeCell,
  MvPhoneCell,
  MvTypeCell,
  DateInputCell
}