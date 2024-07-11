<template>
    <div class="card text-white bg-secondary mb-3 w-100 h-100">
        <div class="card-header"><i class="fa fa-cogs"></i> Configuration {{ currency.toUpperCase() }}</div>
        <div class="card-body">
            <a class="text-warning" href="http://localhost:5500" target="_blank">check ussd server</a>
            <table class="table table-striped table-borderless table-sm text-white">
                <tbody>
                    <tr>
                        <td>COM</td>
                        <td colspan="2"><input v-model="port" class="form-control form-control-sm" type="text"></td>
                    </tr>
                    <tr v-for="(cmd, i) in cmds" :key="i">
                        <td>CMD #{{ i }}</td>
                        <td>{{ cmd }}</td>
                        <td><button @click="removeCmd(i)" class="btn btn-sm btn-danger">X</button></td>
                    </tr>
                    <tr>
                        <td colspan="3"><input @change="addCmd" class="form-control form-control-sm" type="text" placeholder="Press Enter to add a command"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    props: ['currency'],
    data() {
        return {
            port: '',
            cmds: [],
        }
    },
    mounted() {
        this.fetch()
    },
    watch: {
        currency() {
            this.fetch()
        },
        port: function(val) {
            localStorage.setItem('port', val);
        },
        cmds: function(val) {
            localStorage.setItem(this.currency + '-cmds', JSON.stringify(val));
        }
    },
    methods: {
        fetch() {
            this.port = localStorage.getItem('port') ? localStorage.getItem('port') : '';
            this.cmds = localStorage.getItem(this.currency + '-cmds') ? JSON.parse(localStorage.getItem(this.currency + '-cmds')) : [];
        },
        removeCmd(i) {
            this.cmds.splice(i, 1)
        },
        addCmd(e) {
            this.cmds.push(e.target.value)
            e.target.value = ''
        }
    }
}
</script>

<style>

</style>
