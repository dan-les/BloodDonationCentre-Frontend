<template>
  <div>
    <div>
      <b-form-input
          v-model='filterCriteria'
          :placeholder='placeholder'
          class='search-input'
          type='search'
          v-on:click='toggleDropDown()'
          v-on:keyup.enter='selectItem()'>
      </b-form-input>
    </div>
    <div style="margin-top: 1rem">
      <b-collapse id='drop-down'>
        <b-table
            ref='collapsibleTable'
            v-model='filteredRows'
            :fields='fields'
            :filter='filterCriteria'
            :items='items'
            :sort-by.sync='sortBy'
            no-border-collapse
            responsive='sm'
            select-mode='single'
            selectable
            sticky-header='200px'
            thead-class='d-none'
            @row-selected='rowSelected'>
        </b-table>
      </b-collapse>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      filterCriteria: '',
      filteredRows: []
    }
  },
  methods: {
    toggleDropDown() {
      this.$root.$emit('bv::toggle::collapse', 'drop-down')
    },
    selectItem() {
      if (this.filteredRows.length === 1) {
        this.$refs.collapsibleTable.selectRow(0)
      }
    },
    rowSelected(rowArray) {
      if (rowArray.length === 1) {
        this.$emit('item-selected', rowArray[0])
        this.filterCriteria = rowArray[0].name
        this.toggleDropDown()
      }
    }
  },
  props: {
    fields: {
      required: true,
      type: Array
    },
    items: {
      required: true,
      type: Array
    },
    placeholder: {
      required: false,
      default: 'Select'
    },
    sortBy: {
      required: true,
      type: String
    }
  }
}
</script>
