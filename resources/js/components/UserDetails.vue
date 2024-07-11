<template>
    <div class="d-inline-block">
        <div class="input-group input-group-sm mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">{{ name }}</span>
            </div>
            <input type="text" class="form-control" disabled :value="value" style="width:109px;">
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    props: ['name', 'value']
}
</script>
